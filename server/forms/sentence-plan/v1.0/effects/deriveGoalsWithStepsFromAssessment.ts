import { unwrapAll } from '../../../../data/aap-api/wrappers'
import {
  DerivedGoal,
  DerivedStep,
  GoalAnswers,
  GoalProperties,
  RawCollection,
  SentencePlanContext,
  StepAnswers,
  StepProperties,
} from './types'

/**
 * Derive goals with steps from the loaded assessment
 *
 * Extracts the GOALS collection from the assessment, unwraps the
 * answers and properties, and includes nested STEPS for each goal.
 *
 * Sets:
 * - Data('goals'): Array of derived goals with their steps
 * - Data('goalsCollectionUuid'): UUID of the GOALS collection (for adding new goals)
 */
export const deriveGoalsWithStepsFromAssessment = () => async (context: SentencePlanContext) => {
  const assessment = context.getData('assessment') as { collections?: RawCollection[] } | undefined

  if (!assessment?.collections) {
    context.setData('goals', [])
    return
  }

  const goalsCollection = assessment.collections.find(c => c.name === 'GOALS')

  if (!goalsCollection) {
    context.setData('goals', [])
    return
  }

  context.setData('goalsCollectionUuid', goalsCollection.uuid)

  const goals: DerivedGoal[] = goalsCollection.items.map(item => {
    const answers = unwrapAll<GoalAnswers>(item.answers)
    const properties = unwrapAll<GoalProperties>(item.properties)

    const stepsCollections = item.collections?.filter(c => c.name === 'STEPS') ?? []
    const allStepItems = stepsCollections.flatMap(c => c.items)
    const steps: DerivedStep[] = allStepItems.map(stepItem => {
      const stepAnswers = unwrapAll<StepAnswers>(stepItem.answers)
      const stepProperties = unwrapAll<StepProperties>(stepItem.properties)

      return {
        uuid: stepItem.uuid,
        actor: stepAnswers.actor,
        status: stepAnswers.status,
        description: stepAnswers.description,
        statusDate: stepProperties.status_date,
      }
    })

    return {
      uuid: item.uuid,
      title: answers.title,
      status: properties.status,
      targetDate: answers.target_date,
      statusDate: properties.status_date,
      areaOfNeed: answers.area_of_need,
      relatedAreasOfNeed: answers.related_areas_of_need ?? [],
      stepsCollectionUuid: stepsCollections[0]?.uuid,
      steps,
    }
  })

  context.setData('goals', goals)
}
