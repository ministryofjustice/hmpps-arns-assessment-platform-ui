import { InternalServerError } from 'http-errors'
import { IdentifierType } from '../../../../interfaces/aap-api/identifier'
import { StrengthsAndNeedsContext } from '../types'

const SAN_ASSESSMENT_TYPE = 'SAN_SP'

export const initializeSessionFromAccess = () => (context: StrengthsAndNeedsContext) => {
  const session = context.getSession()

  if (!session.accessDetails) {
    throw new InternalServerError('Access details not found - ensure access ran first')
  }

  if (!session.caseDetails) {
    throw new InternalServerError('Case details not found - ensure access ran first')
  }

  const { accessDetails, caseDetails, handoverContext } = session
  const assessmentId = handoverContext?.assessmentContext?.assessmentId

  let assessmentIdentifier

  if (accessDetails.accessType === 'OASYS' && assessmentId) {
    assessmentIdentifier = {
      type: 'UUID' as const,
      uuid: assessmentId,
    }
  } else if (caseDetails.crn) {
    assessmentIdentifier = {
      type: 'EXTERNAL' as const,
      identifier: caseDetails.crn,
      identifierType: IdentifierType.CRN,
      assessmentType: SAN_ASSESSMENT_TYPE,
    }
  } else {
    throw new InternalServerError('Cannot determine assessment identifier - no assessmentId or CRN available')
  }

  session.sessionDetails = {
    accessType: accessDetails.accessType,
    planAccessMode: accessDetails.planAccessMode,
    oasysRedirectUrl: accessDetails.oasysRedirectUrl,
    assessmentIdentifier,
    assessmentVersion: handoverContext?.assessmentContext?.assessmentVersion,
  }

  context.setData('sessionDetails', session.sessionDetails)
}
