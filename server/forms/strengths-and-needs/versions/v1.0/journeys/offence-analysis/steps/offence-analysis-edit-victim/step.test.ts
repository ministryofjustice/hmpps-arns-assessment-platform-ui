import { access, EffectRegistry, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { ForgeTestHarness } from '@ministryofjustice/hmpps-forge/core/testing'
import { govukComponents } from '@ministryofjustice/hmpps-forge/govuk-components'
import { sanEffects } from '../../../../../../effects'
import { sanGeneratorRegistry } from '../../../../../../generators'
import { sanTransformers } from '../../../../../../transformers'
import { sanConditions } from '../../../../../../conditions'
import { modalComponent } from '../../../../../../components/modal/modalComponent'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../../../../../../effects/types'
import { AssessmentVersionQueryResult } from '../../../../../../../../interfaces/aap-api/queryResult'
import { formVersion } from '../../../../constants/formVersion'
import { isUserSubmittedCode, IsUserSubmitted } from '../../../../constants/userSubmitted'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { Step } from '../../constants/step'
import { victimsCollection } from '../../constants/collections'
import { offenceAnalysisJourney } from '../../index'

const sectionPath = '/v1.0/edit/offence-analysis'

const savedVictim = {
  [Question.offence_analysis_victim_relationship]: Option.stranger,
  [Question.offence_analysis_victim_age]: Option.age_5_to_11_years,
  [Question.offence_analysis_victim_sex]: Option.male,
  [Question.offence_analysis_victim_race]: Option.white_english_welsh_scottish_northern_irish_or_british,
}

/**
 * A person victim has been added, but the victim summary has not been submitted yet, so the
 * reachability walk stops at the summary. The create and edit steps share the victim field codes.
 */
const setUp = () => {
  const assessmentUuid = 'e8f1a0a4-0000-4000-8000-000000000001'
  const assessment: AssessmentVersionQueryResult = {
    type: 'AssessmentVersionQueryResult',
    assessmentUuid,
    aggregateUuid: 'e8f1a0a4-0000-4000-8000-000000000002',
    assessmentType: 'SAN_SP',
    formVersion,
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-01T10:00:00Z',
    answers: {},
    properties: {},
    collections: [
      {
        uuid: 'e8f1a0a4-0000-4000-8000-000000000003',
        createdAt: '2026-10-01T10:00:00Z',
        updatedAt: '2026-10-01T10:00:00Z',
        name: victimsCollection.name,
        items: [
          {
            uuid: 'e8f1a0a4-0000-4000-8000-000000000004',
            answers: Object.fromEntries(
              Object.entries(savedVictim).map(([code, value]) => [code, { type: 'Single', value }]),
            ),
            properties: {},
          },
        ],
      },
    ],
    collaborators: [],
    identifiers: { CRN: 'X123456' },
    flags: [],
  }
  const executeCommand = jest.fn().mockResolvedValue({})
  const deps = {
    api: { executeCommand, executeCommands: jest.fn().mockResolvedValue([]) },
    auditService: { send: jest.fn() },
  } as unknown as StrengthsAndNeedsEffectsDeps
  const testEffects = new EffectRegistry<StrengthsAndNeedsEffectsDeps>()
  const seed = testEffects.register('Seed', () => async (context: StrengthsAndNeedsContext) => {
    context.setData('assessmentUuid', assessmentUuid)
    context.setData('assessment', assessment)
    context.setData(isUserSubmittedCode(Step.offence_analysis.code), IsUserSubmitted.true)
    context.setAnswer(Question.offence_analysis_who_was_the_victim, [Option.one_or_more_person])
  })
  const client = new ForgeTestHarness()
    .registerGlobalComponents(govukComponents)
    .registerGlobalComponents([modalComponent])
    .registerGlobalFunctions([testEffects, sanEffects, sanGeneratorRegistry, sanTransformers, sanConditions], deps)
    .registerPackage({
      journey: journey({
        code: 'strengths-and-needs-v1',
        title: 'Strengths and needs',
        path: '/v1.0/:mode',
        onAccess: [access({ effects: [seed()] })],
        children: [offenceAnalysisJourney],
      }),
      forgePackage: true,
    })
    .createClient()
  const options = {
    state: { user: { id: 'test.user', name: 'Test User', authSource: 'HMPPS_AUTH', token: 'test-token' } },
    session: {},
    headers: { 'accept-language': 'en-gb' },
  }

  return { client, options, executeCommand }
}

describe('offence analysis victims', () => {
  it('shows the saved answers when changing a victim', async () => {
    const { client, options } = setUp()

    const result = await client.get(`${sectionPath}/offence-analysis-victim/edit/0`, options)

    expect(result.type).toBe('render')
    const fields = result.type === 'render' ? result.context.blocks : []
    const values = Object.fromEntries(
      fields
        .filter(block => block.blockType === 'BlockType.field')
        .map(block => [block.properties.code, block.properties.value]),
    )
    expect(values).toEqual(savedVictim)
  })

  it('saves a changed victim and returns to the victim summary', async () => {
    const { client, options, executeCommand } = setUp()

    const result = await client.post(`${sectionPath}/offence-analysis-victim/edit/0`, {
      ...options,
      body: { action: 'save', ...savedVictim, [Question.offence_analysis_victim_sex]: Option.female },
    })

    expect(result).toMatchObject({ type: 'redirect', url: `${sectionPath}/offence-analysis-victim-summary` })
    expect(executeCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'UpdateCollectionItemAnswersCommand',
        added: expect.objectContaining({
          [Question.offence_analysis_victim_sex]: { type: 'Single', value: Option.female },
        }),
      }),
    )
  })

  it('adds another victim before the victim summary has been submitted', async () => {
    const { client, options, executeCommand } = setUp()

    const result = await client.post(`${sectionPath}/offence-analysis-victim/create`, {
      ...options,
      body: { action: 'save', ...savedVictim },
    })

    expect(result).toMatchObject({ type: 'redirect', url: `${sectionPath}/offence-analysis-victim-summary` })
    expect(executeCommand).toHaveBeenCalledWith(expect.objectContaining({ type: 'AddCollectionItemCommand' }))
  })
})
