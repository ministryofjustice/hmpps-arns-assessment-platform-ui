import { InternalServerError } from 'http-errors'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { buildAnswerDelta, buildChangedAnswerCodes } from './answerDelta'
import { SanAuditEvent } from '../../auditEvents'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { queueCommand } from './pendingCommands'
import { restoreSuppressedAnswers } from './restoreSuppressedAnswers'

export const saveCurrentStepAnswers =
  (_deps: StrengthsAndNeedsEffectsDeps) =>
  async (context: StrengthsAndNeedsContext, clearFields = true, isAutosaved = false) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    if (!user) {
      throw new InternalServerError('User is required to save strengths and needs answers')
    }

    if (!assessmentUuid) {
      throw new InternalServerError('Assessment UUID is required to save strengths and needs answers')
    }

    // Answers only leave the record on a real, successful save. A failed save
    // and an autosave both keep what is stored, and put back anything forge
    // emptied along the way so the page still shows it.
    const clearRemovals = clearFields && !isAutosaved

    const fieldsToClear = context.getFieldsToClear()

    if (clearRemovals) {
      for (const field of fieldsToClear) {
        context.clearAnswer(field)
      }
    }

    const histories = context.getAllAnswerHistories()
    const delta = buildAnswerDelta(histories)

    if (!Object.keys(delta.added).length && !delta.removed.length) {
      return
    }
    const removed = [...new Set([...delta.removed, ...fieldsToClear])]

    const command = {
      type: 'UpdateAssessmentAnswersCommand' as const,
      assessmentUuid,
      user,
      added: wrapAll(delta.added),
      removed: clearRemovals ? removed : [],
      autosaved: isAutosaved,
    }

    if (!clearRemovals) {
      restoreSuppressedAnswers(context, histories, removed)
    }

    const fieldsToChange = [...new Set([...buildChangedAnswerCodes(histories), ...fieldsToClear])]
    const changedFields = clearRemovals ? fieldsToChange : fieldsToChange.filter(field => !removed.includes(field))

    queueCommand(context, {
      command,
      mapToOasys: true,
      /* Field codes only, answers do not belong in the audit log. */
      audit: changedFields.length ? { action: SanAuditEvent.EDIT_ANSWERS, details: { changedFields } } : undefined,
    })
  }
