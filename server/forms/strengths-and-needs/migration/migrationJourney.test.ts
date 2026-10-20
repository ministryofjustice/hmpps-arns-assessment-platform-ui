import { journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  expectRedirectOutcome,
  expectRenderOutcome,
  ForgeTestClient,
  ForgeTestHarness,
} from '@ministryofjustice/hmpps-forge/core/testing'
import { govukComponents } from '@ministryofjustice/hmpps-forge/govuk-components'
import { sanEffects } from '../effects'
import { sanGeneratorRegistry } from '../generators'
import { sanTransformers } from '../transformers'
import { sanConditions } from '../conditions'
import { StrengthsAndNeedsEffectsDeps, StrengthsAndNeedsSession } from '../effects/types'
import { formRootPath } from '../versions/v1.0/constants/formVersion'
import { formConfigsByVersion } from '../constants/formConfigRegistry'
import { migrationJourney } from '.'
import { migrationPath } from './sanMigration'

const assessmentUuid = 'e8f1a0a4-0000-4000-8000-000000000001'
const user = { id: 'test.user', name: 'Test User', authSource: 'HMPPS_AUTH', token: 'test-token' }
const v1ToV2Path = `${migrationPath}/v1.0-to-v2.0`
const latestEntryUrl = `/strengths-and-needs/v2.0/edit/${assessmentUuid}/accommodation/accommodation-status`

const editingSession = (overrides: Partial<StrengthsAndNeedsSession> = {}) => ({
  mode: 'edit',
  privacyAccepted: true,
  accessDetails: { accessType: 'OASYS', accessMode: 'READ_WRITE', planAccessMode: 'READ_WRITE' },
  caseDetails: { crn: 'X123456' },
  handoverContext: { assessmentContext: { assessmentId: assessmentUuid } },
  ...overrides,
})

describe('migrationJourney', () => {
  let api: jest.Mocked<Pick<StrengthsAndNeedsEffectsDeps['api'], 'executeQuery' | 'executeCommands'>>
  let client: ForgeTestClient

  const assessmentAt = (formVersion: string) =>
    api.executeQuery.mockResolvedValue({
      type: 'AssessmentVersionQueryResult',
      assessmentUuid,
      formVersion,
      answers: { current_accommodation: { type: 'Single', value: 'SETTLED' } },
      properties: { accommodation_section_complete: { type: 'Single', value: 'YES' } },
      collections: [],
    } as never)

  beforeEach(() => {
    api = { executeQuery: jest.fn(), executeCommands: jest.fn() }
    assessmentAt('')

    const deps = { api, auditService: { send: jest.fn() } } as unknown as StrengthsAndNeedsEffectsDeps

    client = new ForgeTestHarness()
      .registerGlobalComponents(govukComponents)
      .registerGlobalFunctions([sanEffects, sanGeneratorRegistry, sanTransformers, sanConditions], deps)
      .registerPackage({
        journey: journey({
          code: 'strengths-and-needs',
          title: 'Strengths and needs',
          path: formRootPath,
          children: [migrationJourney],
        }),
        forgePackage: true,
      })
      .createClient()
  })

  it('should send the practitioner back into the form when the assessment is on the latest version', async () => {
    // Arrange
    assessmentAt('v2.0')

    // Act
    const result = await client.get(migrationPath, { session: editingSession(), state: { user } })

    // Assert
    expectRedirectOutcome(result)
    expect(result.url).toBe(latestEntryUrl)
    expect(api.executeCommands).not.toHaveBeenCalled()
  })

  it('should send the practitioner to the next migration page when the assessment is on an older version', async () => {
    // Act
    const result = await client.get(migrationPath, { session: editingSession(), state: { user } })

    // Assert
    expectRedirectOutcome(result)
    expect(result.url).toBe(v1ToV2Path)
    expect(api.executeCommands).not.toHaveBeenCalled()
  })

  it('should show the migration page without saving when it is the next migration due', async () => {
    // Act
    const result = await client.get(v1ToV2Path, { session: editingSession(), state: { user } })

    // Assert
    expectRenderOutcome(result)
    expect(result.getBlocksByVariant('govukTextarea')).toHaveLength(1)
    expect(api.executeCommands).not.toHaveBeenCalled()
  })

  it('should send the practitioner back to the index when the migration page is not the next migration due', async () => {
    // Arrange
    assessmentAt('v2.0')

    // Act
    const result = await client.get(v1ToV2Path, { session: editingSession(), state: { user } })

    // Assert
    expectRedirectOutcome(result)
    expect(result.url).toBe(migrationPath)
  })

  it('should save the migration with its new version and go back to the index when the page is submitted', async () => {
    // Arrange
    const hook = expect.objectContaining({ type: 'UpdateOasysDataMapping', formConfig: formConfigsByVersion['v2.0'] })

    // Act
    const result = await client.post(v1ToV2Path, {
      session: editingSession(),
      state: { user },
      body: { action: 'continue', poc_migration_note: 'Moved house' },
    })

    // Assert
    expectRedirectOutcome(result)
    expect(result.url).toBe(migrationPath)
    expect(api.executeCommands).toHaveBeenCalledWith(
      { type: 'UpdateFormVersionCommand', assessmentUuid, user, version: 'v2.0' },
      {
        type: 'UpdateAssessmentAnswersCommand',
        assessmentUuid,
        user,
        added: { poc_migration_note: { type: 'Single', value: 'Moved house' } },
        removed: [],
        hooks: [hook],
      },
      {
        type: 'UpdateAssessmentPropertiesCommand',
        assessmentUuid,
        user,
        added: { accommodation_section_complete: { type: 'Single', value: 'NO' } },
        removed: [],
        hooks: [hook],
      },
    )
  })

  it('should not save when the migration page is submitted without an answer', async () => {
    // Act
    const result = await client.post(v1ToV2Path, {
      session: editingSession(),
      state: { user },
      body: { action: 'continue', poc_migration_note: '' },
    })

    // Assert
    expectRenderOutcome(result)
    expect(api.executeCommands).not.toHaveBeenCalled()
  })

  it.each([
    { context: 'viewing a historic version', session: editingSession({ mode: 'view-historic' }) },
    {
      context: 'access is read only',
      session: editingSession({
        accessDetails: { accessType: 'OASYS', accessMode: 'READ_ONLY', planAccessMode: 'READ_ONLY' },
      }),
    },
    { context: 'privacy has not been accepted', session: editingSession({ privacyAccepted: false }) },
  ])('should send the practitioner back to the form root when $context', async ({ session }) => {
    // Act
    const result = await client.get(migrationPath, { session, state: { user } })

    // Assert
    expectRedirectOutcome(result)
    expect(result.url).toBe(formRootPath)
    expect(api.executeQuery).not.toHaveBeenCalled()
  })
})
