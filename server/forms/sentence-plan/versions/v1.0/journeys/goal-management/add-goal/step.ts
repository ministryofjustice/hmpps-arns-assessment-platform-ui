import {
  access,
  Answer,
  Data,
  Format,
  Params,
  Post,
  Query,
  redirect,
  step,
  submit,
  Condition,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { contentBlocks, backLinkHref } from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../../effects'
import { CaseData } from '../../../constants'

/**
 * For adding a new goal.
 */
export const createGoalStep = step({
  path: '/add-goal/:areaOfNeed',
  title: 'Add goal details',
  reachability: { entryWhen: true },
  view: {
    locals: {
      // Back returns to area selection with the current area pre-selected, preserving the
      // originating plan tab so the user can keep backing out to where they started.
      backlink: backLinkHref,
    },
  },
  blocks: contentBlocks,
  onAccess: [
    access({
      effects: [
        SentencePlanEffects.setAreaDataFromUrlParam(),
        SentencePlanEffects.loadAreaAssessmentInfo(),
        SentencePlanEffects.sendAuditEvent(AuditEvent.VIEW_CREATE_GOAL, { areaOfNeed: Params('areaOfNeed') }),
      ],
    }),

    // If UUID param is literally ':uuid', redirect to use 'new' instead
    access({
      when: Params('uuid').match(Condition.Equals(':uuid')),
      next: [redirect({ goto: Format('../new/add-goal/%1', Params('areaOfNeed')) })],
    }),

    // If the area of need is not a valid slug, send them back to pick one rather than
    // silently defaulting to a single area.
    access({
      when: Params('areaOfNeed').not.match(Condition.Array.IsIn(Data('areaOfNeedSlugs'))),
      next: [
        redirect({
          when: Query('type').match(Condition.IsRequired()),
          goto: Format('../select-area-of-need?type=%1', Query('type')),
        }),
        redirect({ goto: '../select-area-of-need' }),
      ],
    }),
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('addSteps')),
      validate: true,
      onValid: {
        effects: [
          SentencePlanEffects.createGoal(),
          SentencePlanEffects.sendAuditEvent(AuditEvent.CREATE_GOAL, { areaOfNeed: Params('areaOfNeed') }),
          SentencePlanEffects.addNotification({
            type: 'success',
            message: Format('You added a goal to %1 plan', CaseData.ForenamePossessive),
            target: 'plan-overview',
          }),
        ],
        next: [redirect({ goto: Format('../../%1/add-steps', Data('activeGoalUuid')) })],
      },
    }),
    submit({
      when: Post('action').match(Condition.Equals('saveWithoutSteps')),
      validate: true,
      onValid: {
        effects: [
          SentencePlanEffects.createGoal(),
          SentencePlanEffects.sendAuditEvent(AuditEvent.CREATE_GOAL, { areaOfNeed: Params('areaOfNeed') }),
          SentencePlanEffects.addNotification({
            type: 'success',

            message: Format('You added a goal to %1 plan', CaseData.ForenamePossessive),
            target: 'plan-overview',
          }),
        ],
        next: [
          redirect({
            when: Answer('can_start_now').match(Condition.Equals('no')),
            goto: '../../../plan/overview?type=future',
          }),
          redirect({ goto: '../../../plan/overview?type=current' }),
        ],
      },
    }),
  ],
})
