import { InternalServerError } from 'http-errors'
import logger from '../../../../../logger'
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

  // The `createdAt` (UTC epoch millis) of the version OASys asked for. Only the handover decides
  // this: previous versions picked in SAN are carried in the URL (view-historic/<versionUuid>).
  const assessmentVersion = handoverContext?.assessmentContext?.assessmentVersion

  // A requested version is always shown read-only, even if OASys (unexpectedly) granted READ_WRITE.
  const accessMode = assessmentVersion ? 'READ_ONLY' : accessDetails.accessMode

  if (accessMode !== accessDetails.accessMode) {
    logger.warn(
      `Handover requested assessment version ${assessmentVersion} with ${accessDetails.accessMode} access, using READ_ONLY`,
    )
  }

  context.setData('assessmentVersion', assessmentVersion)

  session.sessionDetails = {
    accessType: accessDetails.accessType,
    accessMode,
    planAccessMode: accessDetails.planAccessMode,
    oasysRedirectUrl: accessDetails.oasysRedirectUrl,
    assessmentIdentifier,
    assessmentVersion,
  }
}
