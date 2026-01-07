import { unwrapAll } from '../../../../data/aap-api/wrappers'
import {
  AreaOfNeed,
  DerivedGoal,
  DerivedStep,
  DerivedNote,
  GoalAnswers,
  GoalProperties,
  RawCollection,
  SentencePlanContext,
  StepAnswers,
  StepProperties,
} from './types'

/**
 * Resolves an actor value to its human-readable label.
 * Special case: 'person_on_probation' uses the person's forename.
 * Falls back to raw actor value if no label found.
 */
function resolveActorLabel(
  actor: string | undefined,
  actorLabels: Record<string, string> | undefined,
  personName: string,
): string {
  if (!actor) {
    return ''
  }

  if (actor === 'person_on_probation') {
    return personName
  }

  return actorLabels?.[actor] ?? actor
}

/**
 * Resolves an area of need slug (e.g. 'accommodation') to its label (e.g. 'Accommodation').
 * Falls back to raw slug value if no label found.
 */
function resolveAreaOfNeedLabel(slug: string | undefined, areasOfNeed: AreaOfNeed[] | undefined): string {
  if (!slug) {
    return ''
  }

  const area = areasOfNeed?.find(a => a.slug === slug)

  return area?.text ?? slug
}

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

  const caseData = context.getData('caseData') as { name?: { forename?: string } } | undefined
  const personName = caseData?.name?.forename ?? 'Person on probation'
  const actorLabels = context.getData('actorLabels')
  const areasOfNeed = context.getData('areasOfNeed')

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
        actorLabel: resolveActorLabel(stepAnswers.actor, actorLabels, personName),
        status: stepAnswers.status,
        description: stepAnswers.description,
        statusDate: stepProperties.status_date,
      }
    })

    const notesCollections = item.collections?.filter(c => c.name === 'NOTES') ?? []
    const allNoteItems = notesCollections.flatMap(c => c.items)
    const notes: DerivedNote[] = allNoteItems
      .map(noteItem => {
        const noteAnswers = unwrapAll<{ note: string; created_by: string }>(noteItem.answers)
        const noteProperties = unwrapAll<{ created_at: string }>(noteItem.properties)

        return {
          uuid: noteItem.uuid,
          note: noteAnswers.note,
          createdBy: noteAnswers.created_by,
          createdAt: new Date(noteProperties.created_at),
        }
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // Sort newest first

    const relatedAreasOfNeed = answers.related_areas_of_need ?? []

    return {
      uuid: item.uuid,
      title: answers.title,
      status: properties.status,
      targetDate: new Date(answers.target_date),
      statusDate: new Date(properties.status_date),
      areaOfNeed: answers.area_of_need,
      areaOfNeedLabel: resolveAreaOfNeedLabel(answers.area_of_need, areasOfNeed),
      relatedAreasOfNeed,
      relatedAreasOfNeedLabels: relatedAreasOfNeed.map(slug => resolveAreaOfNeedLabel(slug, areasOfNeed)),
      stepsCollectionUuid: stepsCollections[0]?.uuid,
      steps,
      notesCollectionUuid: notesCollections[0]?.uuid,
      notes,
    }
  })

  context.setData('goals', goals)
}
