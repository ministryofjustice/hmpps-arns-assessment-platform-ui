import { InternalServerError } from 'http-errors'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { buildAnswerDelta, buildChangedAnswerCodes } from './answerDelta'
import { sendFormAuditEvent } from '../../../shared'
import { SAN_AUDIT_FORM, SanAuditEvent } from '../../auditEvents'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { UpdateOasysDataMappingHook } from './updateOasysDataMappingHook'
import { restoreSuppressedAnswers } from './restoreSuppressedAnswers'
import { dependenciesForTouchedAnswers, inapplicableAnswerCodes } from './answerDependency'
import { strengthsAndNeedsAnswerDependencies } from '../../versions/v1.0/answerDependencies'

export const saveCurrentStepAnswers =
  (deps: StrengthsAndNeedsEffectsDeps) =>
  async (context: StrengthsAndNeedsContext, clearFields = true, isAutosaved = false) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    if (!user) {
      throw new InternalServerError('User is required to save strengths and needs answers')
    }

    if (!assessmentUuid) {
      throw new InternalServerError('Assessment UUID is required to save strengths and needs answers')
    }

    const fieldsToClear = context.getFieldsToClear()

    // Only forget the answer here if we are about to delete it for real.
    // Otherwise it gets put back below, so the page still shows it.
    if (clearFields || isAutosaved) {
      for (const field of fieldsToClear) {
        context.clearAnswer(field)
      }
    }

    const histories = context.getAllAnswerHistories()
    const delta = buildAnswerDelta(histories)

    const touched = [...Object.keys(delta.added), ...delta.removed, ...fieldsToClear]
    const inapplicable =
      clearFields && !isAutosaved
        ? inapplicableAnswerCodes(
            dependenciesForTouchedAnswers(strengthsAndNeedsAnswerDependencies, touched),
            code => histories[code]?.current,
          )
        : []

    if (!Object.keys(delta.added).length && !delta.removed.length && !inapplicable.length) {
      return
    }

    inapplicable.forEach(code => context.clearAnswer(code))
    const removed = [...new Set([...delta.removed, ...fieldsToClear, ...inapplicable])]

    await deps.api.executeCommand({
      type: 'UpdateAssessmentAnswersCommand',
      assessmentUuid,
      user,
      added: wrapAll(delta.added),
      removed: clearFields ? removed : [],
      hooks: [new UpdateOasysDataMappingHook(context.getData('assessment'))],
      autosaved: isAutosaved,
    })

    if (!clearFields || isAutosaved) {
      restoreSuppressedAnswers(context, histories, removed)
    }

    const fieldsToChange = [...new Set([...buildChangedAnswerCodes(histories), ...fieldsToClear, ...inapplicable])]
    const changedFields =
      !clearFields || isAutosaved ? fieldsToChange.filter(field => !removed.includes(field)) : fieldsToChange

    if (changedFields.length) {
      /* Field codes only, answers do not belong in the audit log. */
      await sendFormAuditEvent(deps.auditService, context, SAN_AUDIT_FORM, SanAuditEvent.EDIT_ANSWERS, {
        changedFields,
      })
    }
  }
