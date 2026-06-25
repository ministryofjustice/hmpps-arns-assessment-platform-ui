import { InternalServerError } from 'http-errors'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { wrapAll } from '../../../../data/aap-api/wrappers'
import { Commands } from '../../../../interfaces/aap-api/command'
import { getRequiredEffectContext, getPractitionerName } from './goalUtils'
import { snapshotFromGoal } from './goalSnapshot'

/**
 * Update the area of need of an existing goal.
 *
 * Writes the newly selected area of need and removes it from the goal's related
 * areas if it overlaps — a goal can't relate to its own primary area. Other goal
 * answers (title, target date, status) and the goal's steps are left untouched.
 *
 * Form fields used:
 * - area_of_need: The newly selected area of need slug
 */
export const updateActiveGoalAreaOfNeed = (deps: SentencePlanEffectsDeps) => async (context: SentencePlanContext) => {
  const { user, assessmentUuid } = getRequiredEffectContext(context, 'updateActiveGoalAreaOfNeed')
  const activeGoal = context.getData('activeGoal')

  if (!activeGoal?.uuid) {
    throw new InternalServerError('Active goal is required for updateActiveGoalAreaOfNeed')
  }

  const newAreaOfNeed = context.getAnswer('area_of_need')

  if (!newAreaOfNeed) {
    throw new InternalServerError('A new area of need is required for updateActiveGoalAreaOfNeed')
  }

  // A goal can't relate to its own primary area, so drop any overlap.
  const relatedAreasOfNeed = (activeGoal.relatedAreasOfNeed ?? []).filter(area => area !== newAreaOfNeed)

  const goalSnapshot = snapshotFromGoal(activeGoal, {
    areaOfNeed: newAreaOfNeed,
    relatedAreasOfNeed,
  })

  const commands: Commands[] = [
    {
      type: 'UpdateCollectionItemAnswersCommand',
      collectionItemUuid: activeGoal.uuid,
      added: wrapAll({
        area_of_need: newAreaOfNeed,
        related_areas_of_need: relatedAreasOfNeed,
      }),
      removed: [],
      timeline: {
        type: 'GOAL_UPDATED',
        data: {
          goalUuid: activeGoal.uuid,
          goalTitle: activeGoal.title,
          updatedBy: getPractitionerName(context, user),
          goalSnapshot,
        },
      },
      assessmentUuid,
      user,
    },
  ]

  await deps.api.executeCommands(...commands)
}
