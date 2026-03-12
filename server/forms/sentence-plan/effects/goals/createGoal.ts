import { BadRequest } from 'http-errors'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { Commands } from '../../../../interfaces/aap-api/command'
import { AddCollectionItemCommandResult } from '../../../../interfaces/aap-api/commandResult'
import {
  getRequiredEffectContext,
  calculateTargetDate,
  determineGoalStatus,
  buildGoalProperties,
  buildGoalAnswers,
} from './goalUtils'

/**
 * Create a new goal
 *
 * Uses the GOALS collection UUID from derived data, or creates the collection
 * if it doesn't exist. Stores the goal UUID in context for navigation to add-steps.
 *
 * Form fields used:
 * - goal_title: Goal title
 * - areaOfNeed (param): Primary area of need slug
 * - related_areas_of_need: Related areas (if applicable)
 * - can_start_now: 'yes' or 'no'
 * - target_date_option: Target date option
 * - custom_target_date: Custom date (if set_another_date)
 */
export const createGoal = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const { user, assessmentUuid } = getRequiredEffectContext(context, 'createGoal')
  const areaOfNeedSlug = context.getRequestParam('areaOfNeed')

  if (!areaOfNeedSlug) {
    throw new BadRequest('Area of need is required to create a goal')
  }

  // Get form answers
  const goalTitle = context.getAnswer('goal_title')
  const relatedAreas = context.getAnswer('related_areas_of_need') ?? []
  const canStartNow = context.getAnswer('can_start_now')
  const targetDateOption = context.getAnswer('target_date_option')
  const customDate = context.getAnswer('custom_target_date')

  // Calculate target date and status
  const targetDate = calculateTargetDate(canStartNow, targetDateOption, customDate)
  const status = determineGoalStatus(canStartNow)

  // Get or create GOALS collection
  let goalsCollectionUuid = context.getData('goalsCollectionUuid')

  const commands: Commands[] = []

  if (!goalsCollectionUuid) {
    commands.push({
      type: 'CreateCollectionCommand',
      name: 'GOALS',
      assessmentUuid,
      user,
    })

    goalsCollectionUuid = `@${commands.length - 1}`
  }

  const properties = buildGoalProperties(status)
  const answers = buildGoalAnswers(goalTitle, areaOfNeedSlug, relatedAreas, targetDate)

  // Create the goal
  commands.push({
    type: 'AddCollectionItemCommand',
    collectionUuid: goalsCollectionUuid,
    properties: wrapAll(properties),
    answers: wrapAll(answers),
    timeline: {
      type: 'GOAL_CREATED',
      data: {},
    },
    assessmentUuid,
    user,
  })

  const results = await deps.api.executeCommands(...commands)
  const addResult = results[commands.length - 1] as AddCollectionItemCommandResult

  // Store goal UUID for redirect to add-steps
  context.setData('activeGoalUuid', addResult.collectionItemUuid)
}
