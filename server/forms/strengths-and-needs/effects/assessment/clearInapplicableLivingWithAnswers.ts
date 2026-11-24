import { Option } from '../../versions/v1.0/journeys/accommodation/constants/option'
import { Question } from '../../versions/v1.0/journeys/accommodation/constants/question'
import { SanAuditEvent } from '../../auditEvents'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { queueCommand } from './pendingCommands'

const livingWithQuestions = [
  Question.living_with,
  Question.living_with_partner_details,
  Question.living_with_other_details,
]

/**
 * Manually removes 'who they live with' when accommodation on the
 * status page doesn't ask it (Because Forge only clears answers on the page
 * being saved, and these are on the details page).
 *
 * This can all be deleted once a fix is in Forge for clearing down only the specific
 * answers which are unreachable (instead of whole pages)
 */
export const clearInapplicableLivingWithAnswers =
  (_deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    const current = context.getAnswer(Question.current_accommodation)
    const temporaryType = context.getAnswer(Question.type_of_temporary_accommodation)
    const livingWithApplies =
      current === Option.settled ||
      (current === Option.temporary && (temporaryType === Option.immigration || temporaryType === Option.short_term))

    if (livingWithApplies) {
      return
    }

    const removed = livingWithQuestions.filter(code => context.getAnswer(code) !== undefined)

    if (!removed.length) {
      return
    }

    for (const code of removed) {
      context.clearAnswer(code)
    }

    queueCommand(context, {
      command: {
        type: 'UpdateAssessmentAnswersCommand',
        assessmentUuid,
        user,
        added: {},
        removed,
      },
      mapToOasys: true,
      audit: { action: SanAuditEvent.EDIT_ANSWERS, details: { changedFields: removed } },
    })
  }
