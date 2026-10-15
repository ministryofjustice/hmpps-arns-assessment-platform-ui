import { access, EffectRegistry, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { ForgeTestHarness, TestResult } from '@ministryofjustice/hmpps-forge/core/testing'
import { govukComponents } from '@ministryofjustice/hmpps-forge/govuk-components'
import { sanEffects } from '../../effects'
import { sanGeneratorRegistry } from '../../generators'
import { sanTransformers } from '../../transformers'
import { sanConditions } from '../../conditions'
import {
  StrengthsAndNeedsContext,
  StrengthsAndNeedsEffectsDeps,
  StrengthsAndNeedsSessionDetails,
} from '../../effects/types'
import { Step } from './journeys/alcohol-use/constants/step'
import { basePath, formVersion } from './constants/formVersion'
import { autosaveAction } from './autosave'
import { CaseDetails } from '../../../../interfaces/delius-api/caseDetails'
import { AssessmentVersionQueryResult } from '../../../../interfaces/aap-api/queryResult'
import { alcoholUseDetailsStep } from './journeys/alcohol-use/steps/alcohol-use-details/step'

const assessmentUuid = 'e8f1a0a4-0000-4000-8000-000000000001'
const user = { username: 'test.user', displayName: 'Test User' }

const post = async (body: Record<string, unknown>) => {
  const deps = {
    api: { executeCommand: jest.fn().mockResolvedValue(undefined) },
    auditService: { send: jest.fn() },
  } as unknown as StrengthsAndNeedsEffectsDeps

  const testEffects = new EffectRegistry<StrengthsAndNeedsEffectsDeps>()
  const seed = testEffects.register('Seed', () => async (context: StrengthsAndNeedsContext) => {
    context.setData('assessmentUuid', assessmentUuid)
    context.setData('sessionDetails', { accessMode: 'READ_WRITE' } as unknown as StrengthsAndNeedsSessionDetails)
    context.setData('caseData', { name: { forename: 'Sam' } } as unknown as CaseDetails)
    context.setData('assessment', { formVersion } as unknown as AssessmentVersionQueryResult)
  })

  const client = new ForgeTestHarness()
    .registerGlobalComponents(govukComponents)
    .registerGlobalFunctions([testEffects, sanEffects, sanGeneratorRegistry, sanTransformers, sanConditions], deps)
    .registerPackage({
      journey: journey({
        code: 'strengths-and-needs-v2',
        title: 'Strengths and needs',
        path: basePath,
        onAccess: [access({ effects: [seed()] })],
        steps: [alcoholUseDetailsStep],
      }),
      forgePackage: true,
    })
    .createClient()

  const result: TestResult = await client.post(`${basePath}/${Step.alcohol_use_details.path}`, {
    body,
    state: { user },
    params: { mode: 'edit' },
    session: {},
    headers: { 'accept-language': 'en-gb' },
  })

  return result
}

describe('autosave submit hook', () => {
  it('accepts a part filled page without validating or redirecting', async () => {
    const result = await post({
      action: autosaveAction,
      alcohol_current_issues: '',
      alcohol_evidence_of_excess_drinking: '',
      alcohol_past_issues: '',
      alcohol_stopped_or_reduced: '',
      alcohol_use_changes: '',
    })

    expect(result.type).toBe('render')
    if (result.type === 'render') {
      expect(result.getValidationErrorsByFieldCode('alcohol_current_issues')).toHaveLength(0)
      expect(result.getValidationErrorsByFieldCode('alcohol_evidence_of_excess_drinking')).toHaveLength(0)
      expect(result.getValidationErrorsByFieldCode('alcohol_past_issues')).toHaveLength(0)
      expect(result.getValidationErrorsByFieldCode('alcohol_stopped_or_reduced')).toHaveLength(0)
      expect(result.getValidationErrorsByFieldCode('alcohol_use_changes')).toHaveLength(0)
    }
  })

  it('leaves the save action to redirect as before', async () => {
    const result = await post({
      action: 'save',
      alcohol_current_issues: 'SIGNIFICANT',
      alcohol_evidence_of_excess_drinking: 'NO_EVIDENCE',
      alcohol_past_issues: 'YES',
      alcohol_past_issues_yes_details: 'Details',
      alcohol_stopped_or_reduced: 'YES',
      alcohol_stopped_or_reduced_yes_details: 'Details',
      alcohol_use_changes: 'MADE_CHANGES',
      alcohol_use_changes_made_changes_details: 'Details',
    })

    expect(result.type).toBe('redirect')
  })
})
