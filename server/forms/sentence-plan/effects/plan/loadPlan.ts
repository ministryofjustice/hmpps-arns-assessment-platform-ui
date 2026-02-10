import { InternalServerError, NotFound } from 'http-errors'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { User } from '../../../../interfaces/user'
import { AssessmentIdentifiers } from '../../../../interfaces/aap-api/identifier'
import { AssessmentVersionQueryResult } from '../../../../interfaces/aap-api/queryResult'

/**
 * Load a sentence plan using the identifier from session details.
 *
 * Supports both UUID identifiers (OASys flow) and external identifiers (MPOP flow).
 * Must be called after session details have been set with a planIdentifier.
 */
export const loadPlan = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const user = context.getState('user')
  const session = context.getSession()
  const sessionDetails = session.sessionDetails

  if (!user) {
    throw new InternalServerError('User is required to load a sentence plan')
  }

  if (!sessionDetails?.planIdentifier) {
    throw new InternalServerError('Plan identifier is required in session details')
  }

  const assessment = await assessmentVersionQuery(deps, user, sessionDetails.planIdentifier)

  if (!assessment) {
    throw new NotFound('Sentence plan not found')
  }

  context.setData('assessment', assessment)
  context.setData('assessmentUuid', assessment.assessmentUuid)
  context.setData('sessionDetails', sessionDetails)

  if (session.caseDetails) {
    context.setData('caseData', session.caseDetails)
  }
}

export const assessmentVersionQuery = async (deps: SentencePlanEffectsDeps, user: User, planIdentifier: AssessmentIdentifiers): Promise<AssessmentVersionQueryResult> => {
  return await deps.api.executeQuery({
    type: 'AssessmentVersionQuery',
    user,
    assessmentIdentifier: planIdentifier,
  })
}
