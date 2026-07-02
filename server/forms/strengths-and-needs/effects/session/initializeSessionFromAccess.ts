import { InternalServerError } from 'http-errors'
import { IdentifierType } from '../../../../interfaces/aap-api/identifier'
import { StrengthsAndNeedsContext } from '../types'
import { Section, SectionStatus } from '../../versions/v1.0/constants/section'

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

  Object.values(Section).forEach(section => {
    const status = context.getData(section.statusKey) ?? SectionStatus.incomplete

    if (status === SectionStatus.incomplete) {
      context.setData(section.statusKey, status)
    }
  })

  session.sessionDetails = {
    accessType: accessDetails.accessType,
    planAccessMode: accessDetails.planAccessMode,
    oasysRedirectUrl: accessDetails.oasysRedirectUrl,
    assessmentIdentifier,
    assessmentVersion: handoverContext?.assessmentContext?.assessmentVersion,
  }
}
