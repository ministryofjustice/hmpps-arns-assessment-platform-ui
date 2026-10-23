import { InternalServerError } from 'http-errors'
import { IdentifierType } from '../../../../interfaces/aap-api/identifier'
import { StrengthsAndNeedsContext, StrengthsAndNeedsSession } from '../types'
import { Section, SectionComplete } from '../../versions/v1.0/constants/section'

const SAN_ASSESSMENT_TYPE = 'SAN_SP'

export const initializeSessionFromAccess = () => (context: StrengthsAndNeedsContext) => {
  const session: StrengthsAndNeedsSession = context.getSession()

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
    const status = context.getData(section.statusKey) ?? SectionComplete.no

    if (status === SectionComplete.no) {
      context.setData(section.statusKey, status)
    }
  })

  // This effect runs on every access to the SAN journey (not just the initial handover),
  // so it must not clobber an assessment version that was previously selected via the
  // previous-versions page and persisted onto the session by `loadAssessment`. Only fall
  // back to the session's existing value when the handover context doesn't carry one.
  const assessmentVersion =
    handoverContext?.assessmentContext?.assessmentVersion ?? session.sessionDetails?.assessmentVersion

  context.setData('assessmentVersion', assessmentVersion)

  session.sessionDetails = {
    accessType: accessDetails.accessType,
    accessMode: accessDetails.accessMode,
    planAccessMode: accessDetails.planAccessMode,
    oasysRedirectUrl: accessDetails.oasysRedirectUrl,
    assessmentIdentifier,
    assessmentVersion,
  }
}
