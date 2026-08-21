import { InternalServerError } from 'http-errors'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { buildAnswerDelta } from './answerDelta'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { Question } from '../../versions/v1.0/journeys/accommodation/constants/question'

/**
 * Sanitize a date string from the API. Returns undefined for invalid values
 * (e.g. the literal string "null") so downstream code and transformers
 * receive either a valid ISO date or undefined — never a garbage string.
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

export const saveCurrentAccommodationStepAnswers =
  (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')

    const TEMPORARY_DATE_QUESTIONS = [
      Question.approved_premises_end_date,
      Question.short_term_accommodation_end_date,
      Question.cas2_end_date,
      Question.cas3_end_date,
      Question.immigration_accommodation_end_date,
    ] as const

    for (const question of TEMPORARY_DATE_QUESTIONS) {
      const rawDate = context.getAnswer(question)
      if (rawDate !== null) {
        context.setAnswer(question, sanitizeDateValue(rawDate as string))
      }
    }

    if (!user) {
      throw new InternalServerError('User is required to save strengths and needs answers')
    }

    if (!assessmentUuid) {
      throw new InternalServerError('Assessment UUID is required to save strengths and needs answers')
    }

    const delta = buildAnswerDelta(context.getAllAnswerHistories())

    if (!Object.keys(delta.added).length && !delta.removed.length) {
      return
    }

    await deps.api.executeCommand({
      type: 'UpdateAssessmentAnswersCommand',
      assessmentUuid,
      user,
      added: wrapAll(delta.added),
      removed: delta.removed,
    })
  }
