import { InternalServerError, NotFound } from 'http-errors'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { derivePlanAgreementsData } from './derivePlanAgreementsFromAssessment'
import { deriveGoalsWithSteps } from '../goals/deriveGoalsWithStepsFromAssessment'

/**
 * Load a historic plan version using the plan uuid from context and timestamp from URL param.
 */
export const loadHistoricPlan = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const assessmentUuid = context.getData('assessmentUuid')
  const user = context.getState('user')
  const session = context.getSession()
  const sessionDetails = session.sessionDetails

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment UUID is required to load a historic plan')
  }

  if (!user) {
    throw new InternalServerError('User is required to load a historic plan')
  }

  if (!sessionDetails?.planIdentifier) {
    throw new InternalServerError('Plan identifier is required to load a historic plan')
  }

  const pointInTime = new Date(Number(context.getRequestParam('timestamp')))

  const assessment = await deps.api.executeQuery({
    type: 'AssessmentVersionQuery',
    user,
    assessmentIdentifier: sessionDetails.planIdentifier,
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
