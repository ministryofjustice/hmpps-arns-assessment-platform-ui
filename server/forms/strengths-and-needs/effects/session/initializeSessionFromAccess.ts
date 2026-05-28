import { InternalServerError } from 'http-errors'
import { IdentifierType } from '../../../../interfaces/aap-api/identifier'
import { StrengthsAndNeedsContext } from '../types'

const SAN_ASSESSMENT_TYPE = 'SAN_SP'

export const initializeSessionFromAccess = () => (context: StrengthsAndNeedsContext) => {
  const session = context.getSession()
  console.log('MGEO session:', session)

  if (!session.accessDetails) {
    throw new InternalServerError('Access details not found - ensure access ran first')
  }

  if (!session.caseDetails) {
    throw new InternalServerError('Case details not found - ensure access ran first')
  }

  const { accessDetails, caseDetails, handoverContext, assessmentProgress = {} } = session
  console.log('MGEO handover:', handoverContext)
  const assessmentId = handoverContext?.assessmentContext?.assessmentId

  console.log('MGEO assessmentId: ', assessmentId)
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

  session.assessmentProgress = {
    employmentEducationComplete: assessmentProgress?.employmentEducationComplete || false
  }


  session.sessionDetails = {
    accessType: accessDetails.accessType,
    planAccessMode: accessDetails.planAccessMode,
    oasysRedirectUrl: accessDetails.oasysRedirectUrl,
    assessmentIdentifier,
    assessmentVersion: handoverContext?.assessmentContext?.assessmentVersion,
  }

  context.setData('employment_education_section_complete', assessmentProgress.employmentEducationComplete === true ? 'COMPLETE' : 'INCOMPLETE')
}
