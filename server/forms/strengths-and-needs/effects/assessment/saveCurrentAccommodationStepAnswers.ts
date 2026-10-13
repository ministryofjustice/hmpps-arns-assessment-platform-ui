import {InternalServerError} from 'http-errors'
import {wrapAll} from '../../../../data/aap-api/wrappers'
import {buildAnswerDelta, buildChangedAnswerCodes} from './answerDelta'
import {StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps} from '../types'
import {Question} from '../../versions/v1.0/journeys/accommodation/constants/question'
import {sendFormAuditEvent} from '../../../shared'
import {SAN_AUDIT_FORM, SanAuditEvent} from '../../auditEvents'
import {UpdateOasysDataMappingHook} from './updateOasysDataMappingHook'
import {restoreSuppressedAnswers} from './restoreSuppressedAnswers'

/**
 * Clean up a date string coming back from the API. Returns undefined for
 * anything that is not a real date — including the literal strings "null" and
 * "undefined" — so the rest of the code only ever sees a valid date or nothing.
 */
export const sanitizeDateValue = (value: string | undefined): string | undefined => {
  if (!value || value === 'null' || value === 'undefined') {
    return undefined
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return undefined
  }

  return value
}

// TODO: replace this with saveCurrentStepAnswers
export const saveCurrentAccommodationStepAnswers =
  (deps: StrengthsAndNeedsEffectsDeps) =>
  async (context: StrengthsAndNeedsContext, clearFields = true, isAutosaved = false) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    const clearRemovals = clearFields && !isAutosaved

    const TEMPORARY_DATE_QUESTIONS = [
      Question.approved_premises_end_date,
      Question.short_term_accommodation_end_date,
      Question.cas2_end_date,
      Question.cas3_end_date,
      Question.immigration_accommodation_end_date,
    ] as const

    if (clearRemovals) {
      for (const question of TEMPORARY_DATE_QUESTIONS) {
        const rawDate = context.getAnswer(question)
        // An absent date has nothing to sanitize — writing undefined back would
        // only stamp a mutation that hides the stored value from the restore below.
        if (rawDate !== undefined && rawDate !== null) {
          context.setAnswer(question, sanitizeDateValue(rawDate as string))
        }
      }
    }

    if (!user) {
      throw new InternalServerError('User is required to save strengths and needs answers')
    }

    if (!assessmentUuid) {
      throw new InternalServerError('Assessment UUID is required to save strengths and needs answers')
    }

    const histories = context.getAllAnswerHistories()
    const delta = buildAnswerDelta(histories)

    if (!Object.keys(delta.added).length && !delta.removed.length) {
      return
    }
    const removed = [...new Set([...delta.removed])]

    await deps.api.executeCommand({
      type: 'UpdateAssessmentAnswersCommand',
      assessmentUuid,
      user,
      added: wrapAll(delta.added),
      removed: clearFields && !isAutosaved ? removed : [],
      hooks: [new UpdateOasysDataMappingHook(context.getData('assessment'))],
      autosaved: isAutosaved,
    })

    if (!clearRemovals) {
      restoreSuppressedAnswers(context, histories, removed)
    }

    const fieldsToChange = [...new Set([...buildChangedAnswerCodes(histories)])]
    const changedFields =
      !clearFields && isAutosaved ? fieldsToChange.filter(field => !removed.includes(field)) : fieldsToChange

    if (changedFields.length) {
      /* Field codes only, answers do not belong in the audit log. */
      await sendFormAuditEvent(deps.auditService, context, SAN_AUDIT_FORM, SanAuditEvent.EDIT_ANSWERS, {
        changedFields,
      })
    }
  }
