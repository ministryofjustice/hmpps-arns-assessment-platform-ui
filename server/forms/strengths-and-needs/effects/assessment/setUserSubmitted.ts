import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { UpdateOasysDataMappingHook } from './updateOasysDataMappingHook'

export const setUserSubmitted =
  (deps: StrengthsAndNeedsEffectsDeps) =>
  async (context: StrengthsAndNeedsContext, stepCode: string, isUserSubmitted = 'TRUE') => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    context.setData(stepCode, isUserSubmitted)

    await deps.api.executeCommand({
      type: 'UpdateAssessmentPropertiesCommand',
      assessmentUuid,
      user,
      added: wrapAll({ [stepCode]: isUserSubmitted }),
      removed: [],
      hooks: [new UpdateOasysDataMappingHook(context.getData('assessment'))],
    })
  }
