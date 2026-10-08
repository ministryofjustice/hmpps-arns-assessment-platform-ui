import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { UpdateOasysDataMappingHook } from './updateOasysDataMappingHook'
import { IsUserSubmitted, isUserSubmittedCode } from '../../versions/v1.0/constants/userSubmitted'

export const setUserSubmitted =
  (deps: StrengthsAndNeedsEffectsDeps) =>
  async (context: StrengthsAndNeedsContext, stepCode: string, isUserSubmitted = IsUserSubmitted.true) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    context.setData(isUserSubmittedCode(stepCode), isUserSubmitted)

    await deps.api.executeCommand({
      type: 'UpdateAssessmentPropertiesCommand',
      assessmentUuid,
      user,
      added: wrapAll({ [isUserSubmittedCode(stepCode)]: isUserSubmitted }),
      removed: [],
      hooks: [new UpdateOasysDataMappingHook(context.getData('assessment'))],
    })
  }
