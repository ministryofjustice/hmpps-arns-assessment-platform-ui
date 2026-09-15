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
import { alcoholUseStep } from './journeys/alcohol-use/steps/alcohol-use/step'
import { Step } from './journeys/alcohol-use/constants/step'
import { basePath, formVersion } from './constants/formVersion'
import { autosaveAction } from './autosave'
import { CaseDetails } from '../../../../interfaces/delius-api/caseDetails'
import { AssessmentVersionQueryResult } from '../../../../interfaces/aap-api/queryResult'

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
        code: 'strengths-and-needs-v1',
        title: 'Strengths and needs',
        path: basePath,
        onAccess: [access({ effects: [seed()] })],
        steps: [alcoholUseStep],
      }),
      forgePackage: true,
    })
    .createClient()

  const result: TestResult = await client.post(`${basePath}/${Step.alcohol_use.path}`, {
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
    const result = await post({ action: autosaveAction, alcohol_use: '' })

    expect(result.type).toBe('render')
    if (result.type === 'render') {
      expect(result.getValidationErrorsByFieldCode('alcohol_use')).toHaveLength(0)
    }
  })

  it('leaves the save action to redirect as before', async () => {
    const result = await post({ action: 'save', alcohol_use: 'YES' })

    expect(result.type).toBe('redirect')
  })
})
