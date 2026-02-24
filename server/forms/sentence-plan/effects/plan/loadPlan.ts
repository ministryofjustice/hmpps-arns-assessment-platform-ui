import { InternalServerError, NotFound } from 'http-errors'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

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

  context.setData('assessment', assessment)
  context.setData('assessmentUuid', assessment.assessmentUuid)
  context.setData('sessionDetails', sessionDetails)

  if (session.caseDetails) {
    context.setData('caseData', session.caseDetails)
  }

  const forename = session.handoverContext?.subject?.givenName
  const existingForename = assessment.properties?.SUBJECT_FORENAME

  if (forename && existingForename != forename) {
    await deps.api.executeCommand({
      type: 'UpdateAssessmentPropertiesCommand',
      assessmentUuid: assessment.assessmentUuid,
      user,
      added: {
        SUBJECT_FORENAME: { type: 'Single', value: forename },
      },
      removed: [],
    })
  }
}
