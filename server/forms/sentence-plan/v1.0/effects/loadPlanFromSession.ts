import { EffectFunction } from './index'

/**
 * Load a sentence plan using the assessmentUuid stored in session
 *
 * If no assessmentUuid exists in session, does nothing (lenient).
 * Entry point steps (mpop-access, oasys-access) are responsible for
 * setting up the session before redirecting.
 */
export const loadPlanFromSession: EffectFunction = deps => async context => {
  const session = context.getSession()
  const assessmentUuid = session?.assessmentUuid
  const user = context.getState('user')

  if (!user || !assessmentUuid) {
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
