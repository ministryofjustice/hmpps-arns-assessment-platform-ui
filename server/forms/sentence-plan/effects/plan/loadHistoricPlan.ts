import { NotFound } from 'http-errors'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { derivePlanAgreementsData } from './derivePlanAgreementsFromAssessment'
import { deriveGoalsWithSteps } from '../goals/deriveGoalsWithStepsFromAssessment'
import { getRequiredEffectContext } from '../goals/goalUtils'

/**
 * Load a historic plan version using the plan uuid from context and timestamp from URL param.
 */
export const loadHistoricPlan = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const { user, assessmentUuid } = getRequiredEffectContext(context, 'loadHistoricPlan')

  const pointInTime = new Date(Number(context.getRequestParam('timestamp')))

  const assessment = await deps.api.executeQuery({
    type: 'AssessmentVersionQuery',
    user,
    assessmentIdentifier: { type: 'UUID', uuid: assessmentUuid },
    timestamp: pointInTime.toISOString().replace('Z', '999Z'),
  })

  if (!assessment) {
    throw new NotFound('Historic sentence plan not found')
  }

  const planAgreementsData = derivePlanAgreementsData(assessment)

  const derivedGoals = deriveGoalsWithSteps({
    assessment,
    caseData: context.getData('caseData'),
    actorLabels: context.getData('actorLabels'),
    areasOfNeed: context.getData('areasOfNeed'),
  })

  context.setData('historic', {
    assessment,
    goals: derivedGoals.goals,
    latestAgreementDate: planAgreementsData.latestAgreementDate,
    latestAgreementStatus: planAgreementsData.latestAgreementStatus,
  })
}
