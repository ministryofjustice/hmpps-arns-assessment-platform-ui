import { accessTransition, Data, Format, step, when } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import {
  pageHeading,
  goalSubheading,
  goalAchievedInfo,
  goalRemovedInfo,
  reviewStepsSection,
  viewAllNotesSection,
  addToPlanButton,
} from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../../effects'
import { redirectIfGoalNotFound } from '../../../guards'

/**
 * Shared view for inactive goals (achieved or removed)
 *
 * This step handles both ACHIEVED and REMOVED goals, displaying:
 * - Goal details (area of need, title)
 * - Status date (achieved or removed)
 * - Steps table
 * - Notes
 * - Appropriate action buttons (re-add for removed goals)
 *
 * This is only accessible when a plan has been agreed.
 */
export const viewInactiveGoalStep = step({
  path: '/view-inactive-goal',
  title: `View inactive goal`,
  isEntryPoint: true,
  view: {
    locals: {
      backlink: when(Data('navigationReferrer').match(Condition.Equals('plan-history')))
        .then('../../plan/plan-history')
        .else(
          when(Data('activeGoal.status').match(Condition.Equals('ACHIEVED')))
            .then('../../plan/overview?type=achieved')
            .else('../../plan/overview?type=removed'),
        ),
      dynamicTitle: Format('View %1 goal', Data('activeGoal.status').pipe(Transformer.String.ToLowerCase())),
    },
  },
  blocks: [
    pageHeading,
    goalSubheading,
    goalAchievedInfo,
    goalRemovedInfo,
    reviewStepsSection,
    viewAllNotesSection,
    addToPlanButton,
  ],
  onAccess: [
    accessTransition({
      effects: [
        SentencePlanEffects.loadNavigationReferrer(),
        SentencePlanEffects.loadActiveGoalForEdit(),
        SentencePlanEffects.sendAuditEvent(AuditEvent.VIEW_INACTIVE_GOAL, { goalStatus: Data('activeGoal.status') }),
      ],
    }),
    redirectIfGoalNotFound('../../plan/overview'),
  ],
})
