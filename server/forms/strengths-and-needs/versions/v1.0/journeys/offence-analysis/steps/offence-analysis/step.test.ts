import { access, EffectRegistry, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { ForgeTestHarness } from '@ministryofjustice/hmpps-forge/core/testing'
import { govukComponents } from '@ministryofjustice/hmpps-forge/govuk-components'
import { sanEffects } from '../../../../../../effects'
import { sanGeneratorRegistry } from '../../../../../../generators'
import { sanTransformers } from '../../../../../../transformers'
import { sanConditions } from '../../../../../../conditions'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../../../../../../effects/types'
import { AssessmentVersionQueryResult } from '../../../../../../../../interfaces/aap-api/queryResult'
import { basePath, formVersion } from '../../../../constants/formVersion'
import { CommonOption } from '../../../../constants/commonOption'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { Step } from '../../constants/step'
import { offenceAnalysisStep } from './step'
import { offenceAnalysisInvolvedPartiesStep } from '../offence-analysis-involved-parties/step'

describe('offence analysis submission', () => {
  it('redirects an Other-only save to involved parties before any victim collection has been created', async () => {
    const assessmentUuid = 'e8f1a0a4-0000-4000-8000-000000000001'
    const user = { id: 'test.user', name: 'Test User', authSource: 'HMPPS_AUTH', token: 'test-token' }
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
      collections: [],
      collaborators: [],
      identifiers: { CRN: 'X123456' },
      flags: [],
    }
    const executeCommand = jest.fn().mockResolvedValue(undefined)
    const deps = {
      api: { executeCommand },
      auditService: { send: jest.fn() },
    } as unknown as StrengthsAndNeedsEffectsDeps
    const testEffects = new EffectRegistry<StrengthsAndNeedsEffectsDeps>()
    const seed = testEffects.register('Seed', () => async (context: StrengthsAndNeedsContext) => {
      context.setData('assessmentUuid', assessmentUuid)
      context.setData('assessment', assessment)
    })
    const client = new ForgeTestHarness()
      .registerGlobalComponents(govukComponents)
      .registerGlobalFunctions([testEffects, sanEffects, sanGeneratorRegistry, sanTransformers, sanConditions], deps)
      .registerPackage({
        journey: journey({
          code: 'strengths-and-needs-v1',
          title: 'Strengths and needs',
          path: basePath,
          onAccess: [access({ effects: [seed()] })],
          steps: [offenceAnalysisStep, offenceAnalysisInvolvedPartiesStep],
        }),
        forgePackage: true,
      })
      .createClient()

    const result = await client.post(`${basePath}/${Step.offence_analysis.path}`, {
      body: {
        action: 'save',
        [Question.offence_analysis_description_of_offence]: 'Damage to a shop window.',
        [Question.offence_analysis_elements]: [Option.physical_damage_to_property],
        [Question.offence_analysis_reason]: 'An argument with the business owner escalated.',
        [Question.offence_analysis_motivations]: [Option.emotional_state],
        [Question.offence_analysis_who_was_the_victim]: [CommonOption.other],
        [Question.offence_analysis_who_was_the_victim_other_details]: 'A local business.',
      },
      state: { user },
      params: { mode: 'edit' },
      session: {},
      headers: { 'accept-language': 'en-gb' },
    })

    expect(result).toMatchObject({
      type: 'redirect',
      url: `${basePath}/${Step.offence_analysis_involved_parties.path}`,
    })
    expect(executeCommand).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'UpdateAssessmentAnswersCommand', assessmentUuid, user }),
    )
    expect(executeCommand).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'CreateCollectionCommand' }))
    expect(executeCommand).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'RemoveCollectionItemCommand' }))
  })
})
