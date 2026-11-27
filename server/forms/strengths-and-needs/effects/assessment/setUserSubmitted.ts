import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { queueCommand } from './pendingCommands'
import { IsUserSubmitted, isUserSubmittedCode } from '../../versions/v1.0/constants/userSubmitted'

export const setUserSubmitted =
  (_deps: StrengthsAndNeedsEffectsDeps) =>
  async (context: StrengthsAndNeedsContext, stepCode: string, isUserSubmitted = IsUserSubmitted.true) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    context.setData(isUserSubmittedCode(stepCode), isUserSubmitted)

    queueCommand(context, {
      command: {
        type: 'UpdateAssessmentPropertiesCommand',
        assessmentUuid,
        user,
        added: wrapAll({ [isUserSubmittedCode(stepCode)]: isUserSubmitted }),
        removed: [],
      },
      mapToOasys: true,
    })
  }
