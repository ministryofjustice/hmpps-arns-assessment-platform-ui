import { BadRequest, InternalServerError } from 'http-errors'
import {
  AddCollectionItemCommandResult,
  CreateCollectionCommandResult,
} from '../../../../interfaces/aap-api/commandResult'
import { AssessmentVersionQueryResult } from '../../../../interfaces/aap-api/queryResult'
import { EffectFunction } from './index'

/**
 * Create a new goal
 *
 * Gets or creates the GOALS collection, then adds a new goal item.
 * Stores the goal UUID in context for navigation to add-steps.
 *
 * Form fields used:
 * - goalNameInput: Goal title
 * - areaOfNeed (param): Primary area of need slug
 * - areaOfNeedCheckboxes: Related areas (if applicable)
 * - canStartWorkingOnGoalNow: 'yes' or 'no'
 * - whenShouldTheGoalBeAchieved: Target date option
 * - dateOfCurrentGoal: Custom date (if set_another_date)
 */
export const saveGoal: EffectFunction = deps => async context => {
  const user = context.getState('user')
  const assessment = context.getData('assessment') as AssessmentVersionQueryResult | undefined
  const assessmentUuid = context.getData('assessmentUuid')

  // Get form answers
  const goalTitle = context.getAnswer('goalNameInput') as string
  const areaOfNeedSlug = context.getRequestParam('areaOfNeed')
  const relatedAreas = (context.getAnswer('areaOfNeedCheckboxes') as string[]) ?? []
  const canStartNow = context.getAnswer('canStartWorkingOnGoalNow') as string
  const targetDateOption = context.getAnswer('whenShouldTheGoalBeAchieved') as string
  const customDate = context.getAnswer('dateOfCurrentGoal') as string

  if (!user) {
    throw new InternalServerError('User is required to save a goal')
  }

  if (!assessmentUuid) {
    throw new InternalServerError('Assessment UUID is required to save a goal')
  }

  if (!areaOfNeedSlug) {
    throw new BadRequest('Area of need is required to save a goal')
  }

  // Calculate target date
  let targetDate: string | undefined

  if (canStartNow === 'yes') {
    const today = new Date()

    if (targetDateOption === 'date_in_3_months') {
      today.setMonth(today.getMonth() + 3)
      targetDate = today.toISOString()
    } else if (targetDateOption === 'date_in_6_months') {
      today.setMonth(today.getMonth() + 6)
      targetDate = today.toISOString()
    } else if (targetDateOption === 'date_in_12_months') {
      today.setMonth(today.getMonth() + 12)
      targetDate = today.toISOString()
    } else if (targetDateOption === 'set_another_date' && customDate) {
      targetDate = new Date(customDate).toISOString()
    }
  }

  // Find or create GOALS collection
  let goalsCollectionUuid = assessment?.collections?.find(c => c.name === 'GOALS')?.uuid

  if (!goalsCollectionUuid) {
    const createCollectionResponse = await deps.api.executeCommands({
      commands: [
        {
          type: 'CreateCollectionCommand',
          name: 'GOALS',
          assessmentUuid,
          user,
        },
      ],
    })

    const createResult = createCollectionResponse.commands[0]?.result

    if (createResult?.type !== 'CreateCollectionCommandResult') {
      throw new Error(`Failed to create GOALS collection: ${createResult?.message ?? 'Unknown error'}`)
    }

    goalsCollectionUuid = (createResult as CreateCollectionCommandResult).collectionUuid
  }

  // Determine goal status based on whether they can start now
  const status = canStartNow === 'yes' ? 'ACTIVE' : 'FUTURE'

  // Create the goal
  const addGoalResponse = await deps.api.executeCommands({
    commands: [
      {
        type: 'AddCollectionItemCommand',
        collectionUuid: goalsCollectionUuid,
        properties: {
          STATUS: { type: 'Single', value: status },
          STATUS_DATE: { type: 'Single', value: new Date().toISOString() },
        },
        answers: {
          TITLE: { type: 'Single', value: goalTitle },
          AREA_OF_NEED: { type: 'Single', value: areaOfNeedSlug ?? '' },
          RELATED_AREAS_OF_NEED: { type: 'Multi', values: relatedAreas },
          ...(targetDate ? { TARGET_DATE: { type: 'Single', value: targetDate } } : {}),
        },
        timeline: {
          type: 'GOAL_CREATED',
          data: {},
        },
        assessmentUuid,
        user,
      },
    ],
  })

  const addResult = addGoalResponse.commands[0]?.result

  if (addResult?.type !== 'AddCollectionItemCommandResult') {
    throw new Error(`Failed to create goal: ${addResult?.message ?? 'Unknown error'}`)
  }

  const goalUuid = (addResult as AddCollectionItemCommandResult).collectionItemUuid

  // Store goal UUID for redirect
  context.setData('goalUuid', goalUuid)
}
