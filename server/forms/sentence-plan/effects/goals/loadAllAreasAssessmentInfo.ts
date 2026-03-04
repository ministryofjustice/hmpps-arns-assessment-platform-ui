import { TransformersRegistry } from '@form-engine/registry/transformers'
import logger from '../../../../../logger'
import { transformAssessmentData } from '../../../../utils/assessmentUtils'
import { mapHandoverToCriminogenicNeeds } from '../../../../utils/handoverApiMapper'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { AssessmentArea } from '../../../../interfaces/coordinator-api/entityAssessment'

// Loads assessment information for ALL areas of need and groups them by scoring category.

// Data sources:
// - coordinator API (sanAssessmentData): section complete status, practitioner analysis details, motivation
// - handover service (session): linked indicators (YES/NO), scores

// Groups areas into:
// - incompleteAreas: section not marked as complete
// - highScoringAreas: complete and score >= threshold
// - lowScoringAreas: complete and score < threshold
// - otherAreas: Finance, Health & wellbeing once completed (no scoring)
export const loadAllAreasAssessmentInfo = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const assessmentUuid = context.getData('assessmentUuid')
  const session = context.getSession()
  const handoverCriminogenicNeeds = session.handoverContext?.criminogenicNeedsData

  if (!assessmentUuid) {
    logger.error('Cannot load all areas assessment info: missing assessmentUuid')
    setErrorState(context)
    return
  }

  if (!handoverCriminogenicNeeds) {
    logger.error('Cannot load all areas assessment info: missing handover criminogenic needs data')
    setErrorState(context)
    return
  }

  try {
    const entityAssessment = await deps.coordinatorApi.getEntityAssessment(assessmentUuid)
    const sanAssessmentData = entityAssessment.sanAssessmentData

    const criminogenicNeedsData = mapHandoverToCriminogenicNeeds(handoverCriminogenicNeeds)
    const allAreas = transformAssessmentData(sanAssessmentData, criminogenicNeedsData)

    // group areas by scoring category
    const { incompleteAreas, highScoringAreas, lowScoringAreas, otherAreas } = groupAreasByCategory(allAreas)

    // check if assessment is complete:
    // - all sections must be marked as complete
    // - all areas with a threshold (excludes Finance and Health & Wellbeing) must have a score
    const allSectionsComplete = allAreas.every(area => area.isAssessmentSectionComplete)
    const allScoredAreasHaveScores = allAreas
      .filter(area => area.threshold !== null)
      .every(area => area.score !== null)
    const isAssessmentComplete = allSectionsComplete && allScoredAreasHaveScores

    context.setData('allAssessmentAreas', allAreas)
    context.setData('highScoringAreas', highScoringAreas)
    context.setData('lowScoringAreas', lowScoringAreas)
    context.setData('otherAreas', otherAreas)
    context.setData('incompleteAreas', incompleteAreas)
    context.setData('isAssessmentComplete', isAssessmentComplete)

    // store areas indexed by goalRoute for easy lookup in nested blocks
    const areasByGoalRoute = Object.fromEntries(allAreas.map(area => [area.goalRoute, area]))
    context.setData('areasByGoalRoute', areasByGoalRoute)

    const lastUpdated = entityAssessment.lastUpdatedTimestampSAN
      ? TransformersRegistry.ToUKLongDate.evaluate(new Date(entityAssessment.lastUpdatedTimestampSAN))
      : null
    context.setData('assessmentLastUpdated', lastUpdated)

    context.setData('allAreasAssessmentStatus', 'success')
  } catch (error) {
    logger.error('Failed to load all areas assessment info', error)
    setErrorState(context)
  }
}

const setErrorState = (context: SentencePlanContext): void => {
  context.setData('allAssessmentAreas', [])
  context.setData('highScoringAreas', [])
  context.setData('lowScoringAreas', [])
  context.setData('otherAreas', [])
  context.setData('incompleteAreas', [])
  context.setData('isAssessmentComplete', false)
  context.setData('assessmentLastUpdated', null)
  context.setData('allAreasAssessmentStatus', 'error')
  context.setData('areasByGoalRoute', {})
}

const groupAreasByCategory = (
  allAreas: AssessmentArea[],
): {
  incompleteAreas: AssessmentArea[]
  highScoringAreas: AssessmentArea[]
  lowScoringAreas: AssessmentArea[]
  otherAreas: AssessmentArea[]
} => {
  const incompleteAreas: AssessmentArea[] = []
  const highScoringAreas: AssessmentArea[] = []
  const lowScoringAreas: AssessmentArea[] = []
  const otherAreas: AssessmentArea[] = []

  for (const area of allAreas) {
    if (!area.isAssessmentSectionComplete) {
      incompleteAreas.push(area)
    } else if (area.threshold === null) {
      // only Finance and Health & Wellbeing have no threshold (can't be scored)
      otherAreas.push(area)
    } else if (area.isHighScoring) {
      highScoringAreas.push(area)
    } else if (area.isLowScoring) {
      lowScoringAreas.push(area)
    } else {
      // NOTE: this is to account for edge cases where SAN returns assessment data with section complete
      // but area didn't receive score from OASYS for some reason yet (even though threshold is present)
      incompleteAreas.push(area)
    }
  }

  return {
    incompleteAreas: sortAlphabetically(incompleteAreas),
    highScoringAreas: sortByRiskAndScore(highScoringAreas),
    lowScoringAreas: sortByRiskAndScore(lowScoringAreas),
    otherAreas: sortByRiskAndScore(otherAreas),
  }
}

// Sorts areas alphabetically by title:
// - used for incomplete areas and for areas within the same risk tier with equal score - threshold difference
const sortAlphabetically = (areas: AssessmentArea[]): AssessmentArea[] => {
  return areas.sort((a, b) => a.title.localeCompare(b.title))
}

// sorts areas by risk flags first, then by distance from threshold, then alphabetically.
// priority:
//  1.Risk of Harm AND Reoffending (both flags)
//  2.Risk of Harm only
//  3.Risk of Reoffending only
//  4.No flags
// within each risk tier: sort by effectiveDistance (accounts for sub-areas) descending, then alphabetically.
const sortByRiskAndScore = (areas: AssessmentArea[]): AssessmentArea[] => {
  return areas.sort((a, b) => {
    // calculates risk tier using weighted scoring
    // - linkedToHarm contributes 2 points (higher priority)
    // - linkedToReoffending contributes 1 point (lower priority)
    // which creates 4 tiers:
    //   3 = Harm + Reoffending (2+1)
    //   2 = Harm only (2+0)
    //   1 = Reoffending only (0+1)
    //   0 = No flags (0+0)
    const riskA = (a.linkedToHarm === 'YES' ? 2 : 0) + (a.linkedToReoffending === 'YES' ? 1 : 0)
    const riskB = (b.linkedToHarm === 'YES' ? 2 : 0) + (b.linkedToReoffending === 'YES' ? 1 : 0)

    // compares risk tiers in descending order (higher risk first)
    // if areas are in different tiers, the one with higher risk comes first
    if (riskA !== riskB) {
      return riskB - riskA
    }

    // within the same risk tier, sort by pre-calculated effectiveDistance
    if (a.effectiveScoreToThresholdDistance != null && b.effectiveScoreToThresholdDistance != null) {
      if (a.effectiveScoreToThresholdDistance !== b.effectiveScoreToThresholdDistance) {
        return b.effectiveScoreToThresholdDistance - a.effectiveScoreToThresholdDistance
      }
    }

    // if same risk tier and same effectiveDistance, sort alphabetically by title
    return a.title.localeCompare(b.title)
  })
}
