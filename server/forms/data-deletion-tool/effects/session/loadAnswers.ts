import { DataDeletionToolContext, DataDeletionToolEffectsDeps } from '../types'

/**
 * Load answers from session
 */
export const loadAnswers = (deps: DataDeletionToolEffectsDeps) => async (context: DataDeletionToolContext) => {
  const session = context.getSession()
  const answers = session.answers ?? {}
  Object.entries(answers).forEach(([key, value]) => {
    context.setAnswer(key, value)
  })
}
