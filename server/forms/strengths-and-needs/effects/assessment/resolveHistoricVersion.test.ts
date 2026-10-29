import { createTestEffectContext } from '@ministryofjustice/hmpps-forge/core/testing'
import { NotFound } from 'http-errors'
import { resolveHistoricVersion } from './resolveHistoricVersion'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps, StrengthsAndNeedsSanSession } from '../types'
import { VersionDetails } from '../../../../interfaces/coordinator-api/previousVersions'

const assessmentUuid = 'e8f1a0a4-0000-4000-8000-000000000001'
const versionUuid = 'e8f1a0a4-0000-4000-8000-000000000002'
const otherAssessmentUuid = 'e8f1a0a4-0000-4000-8000-000000000003'

const sanVersion: VersionDetails = {
  uuid: versionUuid,
  version: 1,
  createdAt: '2026-10-21T11:17:11.748806',
  updatedAt: '2026-10-21T12:16:06.187806',
  status: 'UNSIGNED',
  planAgreementStatus: null,
  entityType: 'AAP_SAN',
}

const contextFor = (san: StrengthsAndNeedsSanSession, params: Record<string, string>) => {
  const context = createTestEffectContext({
    session: { san },
    state: { user: { username: 'test.user' } },
  }) as unknown as StrengthsAndNeedsContext
  jest.spyOn(context, 'getRequestParam').mockImplementation(key => params[key])

  return context
}

const params = { mode: 'view', assessmentUuid, versionUuid }

describe('resolveHistoricVersion', () => {
  const getVersionsByEntityId = jest.fn()
  const executeQuery = jest.fn()
  const deps = {
    api: { executeQuery },
    coordinatorApi: { getVersionsByEntityId },
  } as unknown as StrengthsAndNeedsEffectsDeps

  beforeEach(() => {
    executeQuery.mockReset()
    getVersionsByEntityId.mockReset().mockResolvedValue({
      allVersions: {},
      countersignedVersions: {},
      unaggregatedVersions: [sanVersion],
    })
  })

  it('sets the version in the URL and its date, from the cached versions', async () => {
    const context = contextFor({ assessmentUuid, unaggregatedVersions: [sanVersion] }, params)

    await resolveHistoricVersion(deps)(context)

    expect(context.getData('historicVersion')).toBe(sanVersion)
    // updatedAt is UTC, whatever the server's time zone
    expect(context.getData('previousVersionDate')).toBe(Date.UTC(2026, 9, 21, 12, 16, 6, 187))
    expect(getVersionsByEntityId).not.toHaveBeenCalled()
  })

  it('fetches the versions of the assessment when they are not cached', async () => {
    const context = contextFor({ assessmentUuid }, params)

    await resolveHistoricVersion(deps)(context)

    expect(getVersionsByEntityId).toHaveBeenCalledWith(assessmentUuid)
    expect(context.getData('historicVersion')).toBe(sanVersion)
  })

  it('loads the assessment for this access when the session does not know it yet', async () => {
    executeQuery.mockResolvedValue({ assessmentUuid })
    const assessmentIdentifier = { type: 'EXTERNAL', identifier: 'X123456' }
    const context = contextFor({ sessionDetails: { assessmentIdentifier } as never }, params)

    await resolveHistoricVersion(deps)(context)

    expect(executeQuery).toHaveBeenCalledWith(expect.objectContaining({ assessmentIdentifier }))
    expect(context.getSession().san.assessmentUuid).toBe(assessmentUuid)
    expect(context.getData('historicVersion')).toBe(sanVersion)
  })

  it('does not look up versions of another assessment', async () => {
    const context = contextFor({ assessmentUuid }, { ...params, assessmentUuid: otherAssessmentUuid })

    await resolveHistoricVersion(deps)(context)

    expect(getVersionsByEntityId).not.toHaveBeenCalled()
    expect(context.getData('historicVersion')).toBeUndefined()
  })

  it.each([
    { description: 'another assessment', versions: [] },
    { description: 'a plan', versions: [{ ...sanVersion, entityType: 'AAP_PLAN' as const }] },
  ])('throws NotFound for a version of $description', async ({ versions }) => {
    getVersionsByEntityId.mockResolvedValue({
      allVersions: {},
      countersignedVersions: {},
      unaggregatedVersions: versions,
    })

    await expect(
      resolveHistoricVersion(deps)(contextFor({ assessmentUuid, unaggregatedVersions: versions }, params)),
    ).rejects.toThrow(NotFound)
  })
})
