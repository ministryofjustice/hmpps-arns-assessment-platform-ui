import { BadRequest } from 'http-errors'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { addPlanOverviewSuccessNotification, getPlanOwnerPossessive } from '../notifications/notificationUtils'
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
interface CreateGoalOptions {
  addPlanOverviewNotification?: boolean
}

export const createGoal =
  (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext, options?: CreateGoalOptions) => {
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

    if (!goalsCollectionUuid) {
      const createResult = await deps.api.executeCommand({
        type: 'CreateCollectionCommand',
        name: 'GOALS',
        assessmentUuid,
        user,
      })

      goalsCollectionUuid = createResult.collectionUuid
    }

    const properties = buildGoalProperties(status)
    const answers = buildGoalAnswers(goalTitle, areaOfNeedSlug, relatedAreas, targetDate)

    // Create the goal
    const addResult = await deps.api.executeCommand({
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

    // Store goal UUID for redirect to add-steps
    context.setData('activeGoalUuid', addResult.collectionItemUuid)

    if (options?.addPlanOverviewNotification) {
      const planOwnerPossessive = getPlanOwnerPossessive(context)
      await addPlanOverviewSuccessNotification(context, `You added a goal to ${planOwnerPossessive} plan`, 'Goal added')
    }
  }
