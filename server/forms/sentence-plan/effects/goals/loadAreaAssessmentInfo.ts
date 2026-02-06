import logger from '../../../../../logger'
import { transformAssessmentData } from '../../../../utils/assessmentUtils'
import { mapHandoverToCriminogenicNeeds } from '../../../../utils/handoverApiMapper'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

export const loadAreaAssessmentInfo = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const assessmentUuid = context.getData('assessmentUuid')
  const currentAreaOfNeed = context.getData('currentAreaOfNeed')
  const session = context.getSession()
  const handoverCriminogenicNeeds = session.handoverContext?.criminogenicNeedsData

  if (!assessmentUuid || !currentAreaOfNeed) {
    logger.error('Cannot load area assessment info: missing assessmentUuid or currentAreaOfNeed', {
      hasAssessmentUuid: !!assessmentUuid,
      hasCurrentAreaOfNeed: !!currentAreaOfNeed,
    })
    context.setData('currentAreaAssessment', null)
    context.setData('currentAreaAssessmentStatus', 'error')
    return
  }

  if (!handoverCriminogenicNeeds) {
    logger.error('Cannot load area assessment info: missing handover criminogenic needs data')
    context.setData('currentAreaAssessment', null)
    context.setData('currentAreaAssessmentStatus', 'error')
    return
  }

  try {
    const entityAssessment = await deps.coordinatorApi.getEntityAssessment(assessmentUuid)
    const sanAssessmentData = entityAssessment.sanAssessmentData

    const criminogenicNeedsData = mapHandoverToCriminogenicNeeds(handoverCriminogenicNeeds)
    const areas = transformAssessmentData(sanAssessmentData, criminogenicNeedsData)

    // goalRoute now matches slug directly in the unified areasOfNeed config
    const currentAreaAssessment = areas.find(area => area.goalRoute === currentAreaOfNeed.slug)

    context.setData('currentAreaAssessment', currentAreaAssessment)
    context.setData('currentAreaAssessmentStatus', 'success')
  } catch (error) {
    logger.error(`Failed to load area assessment info for ${currentAreaOfNeed.slug}`, error)
    context.setData('currentAreaAssessment', null)
    context.setData('currentAreaAssessmentStatus', 'error')
  }
}
