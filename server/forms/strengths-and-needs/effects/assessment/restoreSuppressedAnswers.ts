import { AnswerHistory, storedAnswerOf } from './answerDelta'
import { StrengthsAndNeedsContext } from '../types'

/** The ways forge empties an answer by itself, without the practitioner doing it. */
const SYSTEM_CLEARING_SOURCES = ['dependentWhen', 'cleardown']

const lastMutationOf = (history: AnswerHistory) => history.mutations[history.mutations.length - 1]

/**
 * Did forge empty this answer, or did the practitioner?
 *
 * If they cleared the box themselves the last change came from `post`, and we
 * must leave it empty. If forge did it the last change came from
 * `dependentWhen` or `cleardown`, and we can safely put the value back.
 */
const wasClearedByRuntime = (history: AnswerHistory): boolean => {
  const mutation = lastMutationOf(history)

  return mutation?.value === undefined && SYSTEM_CLEARING_SOURCES.includes(mutation.source)
}

/** What the browser actually sent for this field on this submission. */
const submittedValueOf = (history: AnswerHistory): unknown => {
  const posted = history.mutations.filter(mutation => mutation.source === 'post')

  return posted[posted.length - 1]?.value
}

/**
 * Puts back answers that a save chose not to delete.
 *
 * The moment a question's parent option stops applying, `dependentWhen` empties
 * that answer in memory — before any of our save code runs. On a save that is
 * meant to keep the stored value, the page would then render a blank field, and
 * the next submission would post that blank back as a genuine change.
 *
 * We prefer the value the browser just sent over the one in the record, because
 * that is what the page re-renders from after a POST. A date field, for
 * instance, renders from the day/month/year boxes the browser sent, not from
 * the ISO string we have stored. The stored value is the fallback, and the only
 * option for answers that were not on this page.
 */
export const restoreSuppressedAnswers = (
  context: StrengthsAndNeedsContext,
  histories: Record<string, AnswerHistory>,
  codes: readonly string[],
): void => {
  codes.forEach(code => {
    const history = histories[code]

    if (history === undefined || !wasClearedByRuntime(history)) {
      return
    }

    const restored = submittedValueOf(history) ?? storedAnswerOf(history)

    if (restored !== undefined) {
      context.setAnswer(code, restored)
    }
  })
}
