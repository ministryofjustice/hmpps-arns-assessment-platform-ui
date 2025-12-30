import { BadRequest, InternalServerError } from 'http-errors'
import { SentencePlanContext } from './types'
import { SentencePlanEffectsDeps } from './index'

/**
 * Load or create a sentence plan for the MPOP path (CRN-based)
 *
 * Queries for existing assessment by CRN. If not found, creates a new
 * assessment with the CRN identifier attached.
 *
 * Requires :crn route parameter.
 */
export const loadOrCreatePlanByCrn = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const crn = context.getRequestParam('crn')
  const user = context.getState('user')

  if (user) {
    context.setData('user', user)
  }

  if (!user) {
    throw new InternalServerError('User is required to load or create a sentence plan')
  }

  if (!crn) {
    throw new BadRequest('CRN is required to load or create a sentence plan')
  }

  // Try to load existing assessment by CRN
  try {
    const assessment = await deps.api.executeQuery({
      type: 'AssessmentVersionQuery',
      user,
      assessmentIdentifier: {
        type: 'EXTERNAL',
        identifier: crn,
        identifierType: 'CRN',
        assessmentType: 'SENTENCE_PLAN',
      },
    })

    context.setData('assessment', assessment)
    context.setData('assessmentUuid', assessment.assessmentUuid)

    const session = context.getSession()
    session.assessmentUuid = assessment.assessmentUuid

    return
  } catch (error: any) {
    // If the query failed because no assessment exists, create one
    if (error?.responseStatus !== 404 && error?.status !== 404) {
      throw error
    }
  }

  // TODO: Everything below is just placeholder, not sure how we want to do this in PROD.
  // No existing assessment - create with CRN identifier
  const result = await deps.api.executeCommand({
    type: 'CreateAssessmentCommand',
    assessmentType: 'SENTENCE_PLAN',
    formVersion: '1.0',
    identifiers: { CRN: crn },
    properties: {
      AGREEMENT_STATUS: { type: 'Single', value: 'DRAFT' },
    },
    user,
  })

  context.setData('assessment', result)
  context.setData('assessmentUuid', result.assessmentUuid)

  const session = context.getSession()
  session.assessmentUuid = result.assessmentUuid
}
