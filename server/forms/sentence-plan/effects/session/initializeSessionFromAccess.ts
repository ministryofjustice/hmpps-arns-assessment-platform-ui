import { InternalServerError } from 'http-errors'
import { SentencePlanContext } from '../types'
import { IdentifierType } from '../../../../interfaces/aap-api/identifier'

/**
 * Initialize sentence plan session from access form data.
 *
 * Converts the generic accessDetails (set by access form) into
 * sentence plan specific sessionDetails with planIdentifier.
 *
 * This effect should run at the start of the plan overview step
 * to bridge the access form setup with sentence plan requirements.
 *
 * For handover access: uses planId from handover context if available
 * For CRN access: uses CRN as external identifier
 */
export const initializeSessionFromAccess = () => (context: SentencePlanContext) => {
  const session = context.getSession()

  // Check we have the required access data from the access form
  if (!session.accessDetails) {
    throw new InternalServerError('Access details not found - ensure access ran first')
  }

  if (!session.caseDetails) {
    throw new InternalServerError('Case details not found - ensure access ran first')
  }

  const { accessDetails, caseDetails, handoverContext } = session

  // Build plan identifier based on access type
  let planIdentifier

  if (accessDetails.accessType === 'OASYS' && handoverContext?.sentencePlanContext?.planId) {
    // Handover
    planIdentifier = {
      type: 'UUID' as const,
      uuid: handoverContext.sentencePlanContext.planId,
    }
  } else if (caseDetails.crn) {
    // CRN-based access
    planIdentifier = {
      type: 'EXTERNAL' as const,
      identifier: caseDetails.crn,
      identifierType: IdentifierType.CRN,
      assessmentType: 'SENTENCE_PLAN',
    }
  } else {
    throw new InternalServerError('Cannot determine plan identifier - no planId or CRN available')
  }

  // Convert accessDetails to sessionDetails with planIdentifier
  session.sessionDetails = {
    accessType: accessDetails.accessType,
    accessMode: accessDetails.accessMode,
    oasysRedirectUrl: accessDetails.oasysRedirectUrl,
    planIdentifier,
  }
}
