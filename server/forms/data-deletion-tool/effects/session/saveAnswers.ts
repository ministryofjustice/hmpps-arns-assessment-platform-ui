import { DataDeletionToolContext, DataDeletionToolEffectsDeps } from '../types'

/**
 * Save answers to session
 */
export const saveAnswers = (_deps: DataDeletionToolEffectsDeps) => async (context: DataDeletionToolContext) => {
  const session = context.getSession()
  session.answers = {
    ...session.answers,
    ...context.getAllAnswers(),
  }
}
