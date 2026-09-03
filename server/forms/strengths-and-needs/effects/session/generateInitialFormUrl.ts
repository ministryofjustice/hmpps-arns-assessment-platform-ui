import { InternalServerError } from 'http-errors'
import { StrengthsAndNeedsContext } from '../types'

/**
 * Generates the initial redirect URL for the SAN form, including mode and UUID.
 * In edit mode, uses the assessmentUuid from handover context.
 * This effect is used by versionRedirectStep to redirect to the correct URL.
 */
export const generateInitialFormUrl = () => (context: StrengthsAndNeedsContext) => {
  const session = context.getSession()
  const handoverContext = session.handoverContext

  if (!handoverContext?.assessmentContext?.assessmentId) {
    throw new InternalServerError('Assessment ID is required in handover context')
  }

  const assessmentUuid = handoverContext.assessmentContext.assessmentId
  const mode = 'edit'

  // Store the generated URL on context so it can be used by the redirect
  context.setData('initialFormUrl', `/strengths-and-needs/v1.0/${mode}/${assessmentUuid}/accommodation/current-accommodation?resume=true`)
}
