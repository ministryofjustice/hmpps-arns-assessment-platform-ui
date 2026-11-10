import { SentencePlanContext } from '../types'

/**
 * Discard the step edit session for the active goal
 *
 * Throws away unsaved step changes (added, removed or edited rows) so the next
 * initializeStepEditSession starts again from the steps saved in the API.
 */
export const discardStepEditSession = () => async (context: SentencePlanContext) => {
  const session = context.getSession()
  const activeGoalUuid = context.getData('activeGoalUuid')

  if (!session?.stepChanges || !activeGoalUuid) {
    return
  }

  delete session.stepChanges[activeGoalUuid]
}
