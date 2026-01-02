import { InternalServerError } from 'http-errors'
import { SentencePlanEffectsDeps } from './index'
import { SentencePlanContext } from './types'

/**
 * Load a sentence plan using the assessmentUuid stored in session
 *
 * If no assessmentUuid exists in session, does nothing (lenient).
 * Entry point steps (mpop-access, oasys-access) are responsible for
 * setting up the session before redirecting.
 */
export const loadPlanFromSession = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const session = context.getSession()
  const assessmentUuid = session.assessmentUuid
  const user = context.getState('user')

  if (!user) {
    throw InternalServerError('A user was not found for this session.')
  }

  if (!assessmentUuid) {
    // TODO: I need to add a way to make it so you can check the current request URL in an effect
    //  that way, we could throw here if a person is trying to access anything BUT /oasys or /crn/:crn
    //  Just return early for now so they can continue on
    return
  }

  const assessment = await deps.api.executeQuery({
    type: 'AssessmentVersionQuery',
    user,
    assessmentIdentifier: {
      type: 'UUID',
      uuid: assessmentUuid,
    },
  })

  context.setData('assessment', assessment)
  context.setData('assessmentUuid', assessment.assessmentUuid)
}
