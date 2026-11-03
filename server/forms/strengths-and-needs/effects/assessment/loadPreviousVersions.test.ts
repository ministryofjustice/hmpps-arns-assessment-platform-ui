import { Settings } from 'luxon'
import { buildPreviousVersions, findAssessmentVersion, findVersionCreatedAt } from './loadPreviousVersions'
import { StrengthsAndNeedsEffectsDeps, StrengthsAndNeedsSession } from '../types'
import { VersionDetails } from '../../../../interfaces/coordinator-api/previousVersions'

// 2026-10-21T11:17:11.748Z, as OASys sends it: createdAt.toInstant(ZoneOffset.UTC).toEpochMilli()
const createdAtMillis = 1792581431748

const version = (overrides: Partial<VersionDetails>): VersionDetails => ({
  uuid: 'e8f1a0a4-0000-4000-8000-000000000001',
  version: 1,
  createdAt: '2026-10-21T11:17:11.748806',
  updatedAt: '2026-10-21T12:16:06.187806',
  status: 'UNSIGNED',
  planAgreementStatus: null,
  entityType: 'AAP_SAN',
  ...overrides,
})

describe('findVersionCreatedAt', () => {
  const defaultZone = Settings.defaultZone

  beforeAll(() => {
    // Production runs with TZ=Europe/London; October 2026 is still BST (UTC+1)
    Settings.defaultZone = 'Europe/London'
  })

  afterAll(() => {
    Settings.defaultZone = defaultZone
  })

  it.each([
    { description: 'without an offset, as UTC', createdAt: '2026-10-21T11:17:11.748806' },
    { description: 'with a Z offset', createdAt: '2026-10-21T11:17:11.748806Z' },
    { description: 'with an explicit offset', createdAt: '2026-10-21T12:17:11.748806+01:00' },
    { description: 'truncating sub-millisecond digits', createdAt: '2026-10-21T11:17:11.748999' },
  ])('matches a createdAt $description', ({ createdAt }) => {
    const match = version({ createdAt })

    expect(findVersionCreatedAt([match], createdAtMillis)).toBe(match)
  })

  it('does not match on updatedAt', () => {
    const versions = [version({ createdAt: '2026-10-21T10:00:00.000000', updatedAt: '2026-10-21T11:17:11.748806' })]

    expect(findVersionCreatedAt(versions, createdAtMillis)).toBeUndefined()
  })

  it('ignores plan versions created at the same time', () => {
    const plan = version({ uuid: 'plan', entityType: 'AAP_PLAN' })
    const assessment = version({ uuid: 'assessment' })

    expect(findVersionCreatedAt([plan, assessment], createdAtMillis)).toBe(assessment)
  })

  it('returns undefined when no version was created at the timestamp', () => {
    expect(findVersionCreatedAt([version({ createdAt: '2026-10-21T11:17:11.749' })], createdAtMillis)).toBeUndefined()
  })
})

describe('findAssessmentVersion', () => {
  const assessmentUuid = 'e8f1a0a4-0000-4000-8000-000000000000'
  const cached = version({ uuid: 'cached' })
  const created = version({ uuid: 'created' })
  const byUuid = (uuid: string) => (versions: VersionDetails[]) => versions.find(it => it.uuid === uuid)

  const getVersionsByEntityId = jest.fn()
  const deps = { coordinatorApi: { getVersionsByEntityId } } as unknown as StrengthsAndNeedsEffectsDeps

  beforeEach(() => {
    getVersionsByEntityId.mockReset().mockResolvedValue({
      allVersions: {},
      countersignedVersions: {},
      unaggregatedVersions: [cached, created],
    })
  })

  it('uses the cached versions when they have the version', async () => {
    const session: StrengthsAndNeedsSession = { san: { assessmentUuid, unaggregatedVersions: [cached] } }

    await expect(findAssessmentVersion(deps, session, byUuid('cached'))).resolves.toBe(cached)
    expect(getVersionsByEntityId).not.toHaveBeenCalled()
  })

  it.each([
    { description: 'nothing is cached', unaggregatedVersions: undefined },
    { description: 'the cache predates the version', unaggregatedVersions: [cached] },
  ])('fetches and caches the versions when $description', async ({ unaggregatedVersions }) => {
    const session: StrengthsAndNeedsSession = { san: { assessmentUuid, unaggregatedVersions } }

    await expect(findAssessmentVersion(deps, session, byUuid('created'))).resolves.toBe(created)
    expect(getVersionsByEntityId).toHaveBeenCalledWith(assessmentUuid)
    expect(session.san.unaggregatedVersions).toEqual([cached, created])
  })

  it('returns undefined when the assessment has no such version', async () => {
    const session: StrengthsAndNeedsSession = { san: { assessmentUuid, unaggregatedVersions: [cached] } }

    await expect(findAssessmentVersion(deps, session, byUuid('unknown'))).resolves.toBeUndefined()
    expect(getVersionsByEntityId).toHaveBeenCalledTimes(1)
  })
})

describe('buildPreviousVersions', () => {
  const defaultZone = Settings.defaultZone

  beforeAll(() => {
    // Production runs with TZ=Europe/London; October 2026 is still BST (UTC+1)
    Settings.defaultZone = 'Europe/London'
  })

  afterAll(() => {
    Settings.defaultZone = defaultZone
  })

  it('reads coordinator timestamps as UTC', () => {
    const [previousVersion] = buildPreviousVersions({
      '2026-10-21T12:16:06.187806': {
        description: 'Assessment and plan updated',
        assessmentVersion: version({ updatedAt: '2026-10-21T12:16:06.187806' }),
        planVersion: version({ entityType: 'AAP_PLAN', updatedAt: '2026-10-21T12:20:00.000000' }),
      },
    })

    expect(previousVersion).toMatchObject({
      date: Date.UTC(2026, 9, 21, 12, 16, 6, 187),
      assessmentUpdatedDate: Date.UTC(2026, 9, 21, 12, 16, 6, 187),
      planUpdatedDate: Date.UTC(2026, 9, 21, 12, 20),
      // Sentence Plan loads the plan at this instant
      planVersionId: Date.UTC(2026, 9, 21, 12, 20).toString(),
    })
  })
})
