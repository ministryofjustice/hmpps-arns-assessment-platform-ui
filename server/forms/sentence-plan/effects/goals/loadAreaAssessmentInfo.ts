import logger from '../../../../../logger'
import { transformAssessmentData } from '../../../../utils/assessmentUtils'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { canAccessSanInfo } from '../helpers'
import { resolveCriminogenicNeedsData } from './criminogenicNeeds'

export const loadAreaAssessmentInfo = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  if (!canAccessSanInfo(context)) {
    context.setData('currentAreaAssessment', null)
    context.setData('currentAreaAssessmentStatus', 'unavailable')
    return
  }

  const assessmentUuid = context.getData('assessmentUuid')
  const currentAreaOfNeed = context.getData('currentAreaOfNeed')
  const session = context.getSession()
  const crn = session.caseDetails?.crn
  const isMpop = session.sessionDetails?.accessType === 'HMPPS_AUTH'

  if (!assessmentUuid || !currentAreaOfNeed) {
    logger.error(
      {
        assessmentUuid,
        crn,
        hasAssessmentUuid: !!assessmentUuid,
        hasCurrentAreaOfNeed: !!currentAreaOfNeed,
      },
      'Cannot load area assessment info: missing assessmentUuid or currentAreaOfNeed',
    )
    context.setData('currentAreaAssessment', null)
    context.setData('currentAreaAssessmentStatus', 'error')
    return
  }

  // OASys users' needs come from the ARNS integration endpoint keyed by the handover CRN; the
  // ~10% with no CRN get no assessment info (the eligibility guard hides the expander for them).
  if (!isMpop && !crn) {
    context.setData('currentAreaAssessment', null)
    context.setData('currentAreaAssessmentStatus', 'unavailable')
    return
  }

  try {
    const entityAssessment = await deps.coordinatorApi.getEntityAssessment(assessmentUuid)
    const sanAssessmentData = entityAssessment.sanAssessmentData

    const criminogenicNeedsData = await resolveCriminogenicNeedsData(deps, context, crn)
    if (!criminogenicNeedsData) {
      logger.error(
        { assessmentUuid, crn, areaOfNeed: currentAreaOfNeed.slug },
        'Cannot load area assessment info: ARNS API returned no needs data',
      )
      context.setData('currentAreaAssessment', null)
      context.setData('currentAreaAssessmentStatus', 'error')
      return
    }

    const areas = transformAssessmentData(sanAssessmentData, criminogenicNeedsData)

    // goalRoute now matches slug directly in the unified areasOfNeed config
    const currentAreaAssessment = areas.find(area => area.goalRoute === currentAreaOfNeed.slug)

    context.setData('currentAreaAssessment', currentAreaAssessment)
    context.setData('currentAreaAssessmentStatus', 'success')
  } catch (error) {
    logger.error(
      {
        err: error,
        assessmentUuid,
        crn,
        areaOfNeed: currentAreaOfNeed.slug,
      },
      'Failed to load area assessment info',
    )
    context.setData('currentAreaAssessment', null)
    context.setData('currentAreaAssessmentStatus', 'error')
  }
}
