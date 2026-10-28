import { createTestEffectContext } from '@ministryofjustice/hmpps-forge/core/testing'
import { NotFound } from 'http-errors'
import { extractModeAndVersionUuidFromHandoverContext } from './extractModeAndVersionUuidFromHandoverContext'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { VersionDetails } from '../../../../interfaces/coordinator-api/previousVersions'

const assessmentUuid = 'e8f1a0a4-0000-4000-8000-000000000001'
const versionUuid = 'e8f1a0a4-0000-4000-8000-000000000002'
// 2026-10-21T11:17:11.748Z
const createdAtMillis = 1792581431748

const sanVersion: VersionDetails = {
  uuid: versionUuid,
  version: 1,
  createdAt: '2026-10-21T11:17:11.748806',
  updatedAt: '2026-10-21T12:16:06.187806',
  status: 'UNSIGNED',
  planAgreementStatus: null,
  entityType: 'AAP_SAN',
}

const contextFor = (sessionDetails: Record<string, unknown>, unaggregatedVersions?: VersionDetails[]) => {
  const context = createTestEffectContext({
    data: { assessmentUuid },
    session: { sessionDetails, assessmentUuid, unaggregatedVersions },
  }) as unknown as StrengthsAndNeedsContext

  return { context, session: context.getSession() }
}

describe('extractModeAndVersionUuidFromHandoverContext', () => {
  const getVersionsByEntityId = jest.fn()
  const deps = { coordinatorApi: { getVersionsByEntityId } } as unknown as StrengthsAndNeedsEffectsDeps

  beforeEach(() => {
    getVersionsByEntityId.mockReset().mockResolvedValue({
      allVersions: {},
      countersignedVersions: {},
      unaggregatedVersions: [sanVersion],
    })
  })

  it.each([
    { accessMode: 'READ_WRITE', mode: 'edit' },
    { accessMode: 'READ_ONLY', mode: 'view' },
  ])('uses $mode for the current assessment with $accessMode access', async ({ accessMode, mode }) => {
    const { context, session } = contextFor({ accessMode })

    await extractModeAndVersionUuidFromHandoverContext(deps)(context)

    expect(session.mode).toBe(mode)
    expect(session.uuid).toBe(assessmentUuid)
    expect(getVersionsByEntityId).not.toHaveBeenCalled()
  })

  it('uses view-historic for the version created at the handover timestamp', async () => {
    const { context, session } = contextFor({ accessMode: 'READ_ONLY', assessmentVersion: createdAtMillis })

    await extractModeAndVersionUuidFromHandoverContext(deps)(context)

    expect(session.mode).toBe('view-historic')
    expect(session.uuid).toBe(versionUuid)
    expect(getVersionsByEntityId).toHaveBeenCalledWith(assessmentUuid)
  })

  it('refreshes cached versions that predate the requested version', async () => {
    const { context, session } = contextFor({ accessMode: 'READ_ONLY', assessmentVersion: createdAtMillis }, [])

    await extractModeAndVersionUuidFromHandoverContext(deps)(context)

    expect(getVersionsByEntityId).toHaveBeenCalledTimes(1)
    expect(session.uuid).toBe(versionUuid)
  })

  it('throws NotFound when no version was created at the handover timestamp', async () => {
    const { context } = contextFor({ accessMode: 'READ_ONLY', assessmentVersion: createdAtMillis + 1 })

    await expect(extractModeAndVersionUuidFromHandoverContext(deps)(context)).rejects.toThrow(NotFound)
  })
})
