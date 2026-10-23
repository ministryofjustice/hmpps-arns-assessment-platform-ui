import { InternalServerError, NotFound } from 'http-errors'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

/**
 * Soft-deleting an OASys assessment marks its Coordinator association as deleted. A CRN lookup goes straight to the
 * AAP API and would otherwise still find it, so check the plan has at least one live association remaining.
 */
const ensurePlanHasLiveOasysAssociation = async (deps: SentencePlanEffectsDeps, planUuid: string) => {
  await deps.coordinatorApi.getVersionsByEntityId(planUuid).catch(error => {
    if (error?.responseStatus === 404) {
      throw new NotFound('Sentence plan not found')
    }

    throw error
  })
}

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

  const assessment = await deps.api.executeQuery({
    type: 'AssessmentVersionQuery',
    user,
    assessmentIdentifier: sessionDetails.planIdentifier,
  })

  if (!assessment) {
    throw new NotFound('Sentence plan not found')
  }

  if (sessionDetails.planIdentifier.type === 'EXTERNAL') {
    await ensurePlanHasLiveOasysAssociation(deps, assessment.assessmentUuid)
  }

  context.setData('assessment', assessment)
  context.setData('assessmentUuid', assessment.assessmentUuid)
  context.setData('sessionDetails', sessionDetails)

  if (session.caseDetails) {
    context.setData('caseData', session.caseDetails)
  }
}
