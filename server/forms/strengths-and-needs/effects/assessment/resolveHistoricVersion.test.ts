import { createTestEffectContext } from '@ministryofjustice/hmpps-forge/core/testing'
import { NotFound } from 'http-errors'
import { resolveHistoricVersion } from './resolveHistoricVersion'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { VersionDetails } from '../../../../interfaces/coordinator-api/previousVersions'

const assessmentUuid = 'e8f1a0a4-0000-4000-8000-000000000001'
const versionUuid = 'e8f1a0a4-0000-4000-8000-000000000002'

const sanVersion: VersionDetails = {
  uuid: versionUuid,
  version: 1,
  createdAt: '2026-10-21T11:17:11.748806',
  updatedAt: '2026-10-21T12:16:06.187806',
  status: 'UNSIGNED',
  planAgreementStatus: null,
  entityType: 'AAP_SAN',
}

const contextFor = (uuid: string, unaggregatedVersions?: VersionDetails[]) => {
  const context = createTestEffectContext({
    session: { san: { assessmentUuid, unaggregatedVersions } },
  }) as unknown as StrengthsAndNeedsContext
  jest.spyOn(context, 'getRequestParam').mockImplementation(key => (key === 'uuid' ? uuid : 'view-historic'))

  return context
}

describe('resolveHistoricVersion', () => {
  const getVersionsByEntityId = jest.fn()
  const deps = { coordinatorApi: { getVersionsByEntityId } } as unknown as StrengthsAndNeedsEffectsDeps

  beforeEach(() => {
    getVersionsByEntityId.mockReset().mockResolvedValue({
      allVersions: {},
      countersignedVersions: {},
      unaggregatedVersions: [sanVersion],
    })
  })

  it('sets the version in the URL and its date, from the cached versions', async () => {
    const context = contextFor(versionUuid, [sanVersion])

    await resolveHistoricVersion(deps)(context)

    expect(context.getData('historicVersion')).toBe(sanVersion)
    // updatedAt is UTC, whatever the server's time zone
    expect(context.getData('previousVersionDate')).toBe(Date.UTC(2026, 9, 21, 12, 16, 6, 187))
    expect(getVersionsByEntityId).not.toHaveBeenCalled()
  })

  it('fetches the versions of the session assessment when they are not cached', async () => {
    const context = contextFor(versionUuid)

    await resolveHistoricVersion(deps)(context)

    expect(getVersionsByEntityId).toHaveBeenCalledWith(assessmentUuid)
    expect(context.getData('historicVersion')).toBe(sanVersion)
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

    await expect(resolveHistoricVersion(deps)(contextFor(versionUuid, versions))).rejects.toThrow(NotFound)
  })
})
