import { InternalServerError } from 'http-errors'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { buildAnswerDelta, buildChangedAnswerCodes } from './answerDelta'
import { sendFormAuditEvent } from '../../../shared'
import { SAN_AUDIT_FORM, SanAuditEvent } from '../../auditEvents'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { UpdateOasysDataMappingHook } from './updateOasysDataMappingHook'

export const saveAndClearStaleAnswers =
  (deps: StrengthsAndNeedsEffectsDeps) =>
  async (context: StrengthsAndNeedsContext, isAutosaved = false) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    if (!user) {
      throw new InternalServerError('User is required to save strengths and needs answers')
    }

    if (!assessmentUuid) {
      throw new InternalServerError('Assessment UUID is required to save strengths and needs answers')
    }

    const fieldsToClear = context.getFieldsToClear()

    for (const field of fieldsToClear) {
      context.clearAnswer(field)
    }

    const histories = context.getAllAnswerHistories()
    const delta = buildAnswerDelta(histories)

    if (!Object.keys(delta.added).length && !delta.removed.length) {
      return
    }
    delta.removed.push(...fieldsToClear)

    await deps.api.executeCommand({
      type: 'UpdateAssessmentAnswersCommand',
      assessmentUuid,
      user,
      added: wrapAll(delta.added),
      removed: isAutosaved ? [] : delta.removed,
      hooks: [new UpdateOasysDataMappingHook(context.getData('assessment'))],
      autosaved: isAutosaved,
    })

    const fieldsToChange = [...new Set([...buildChangedAnswerCodes(histories), ...fieldsToClear])]
    const changedFields = isAutosaved ? fieldsToChange.filter(field => !delta.removed.includes(field)) : fieldsToChange

    if (changedFields.length) {
      /* Field codes only, answers do not belong in the audit log. */
      await sendFormAuditEvent(deps.auditService, context, SAN_AUDIT_FORM, SanAuditEvent.EDIT_ANSWERS, {
        changedFields,
      })
    }
  }
