import { DataDeletionToolContext, DataDeletionToolEffectsDeps } from './types'

/**
 * Load answers from session
 */
export const loadAnswers = (deps: DataDeletionToolEffectsDeps) => async (context: DataDeletionToolContext) => {
  const answers = context.getSession().answers ?? {}
  Object.entries(answers).forEach(([key, value]) => {
    context.setAnswer(key, value)
  })
}
