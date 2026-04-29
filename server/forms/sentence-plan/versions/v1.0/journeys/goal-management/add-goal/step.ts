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
  when,
  Condition,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { sideNav, contentBlocks } from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../../effects'
import { CaseData } from '../../../constants'

/**
 * For adding a new goal.
 */
export const createGoalStep = step({
  path: '/add-goal/:areaOfNeed',
  title: 'Create a goal',
  reachability: { entryWhen: true },
  view: {
    locals: {
      backlink: when(Query('type').match(Condition.IsRequired()))
        .then(Format('../../../plan/overview?type=%1', Query('type')))
        .else('../../../plan/overview?type=current'),
      twoColumnLayout: {
        sidebarBlockIndex: 0,
      },
    },
  },
  blocks: [sideNav, ...contentBlocks],
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

    // If area of need is not a valid slug, redirect them to `accommodation` by default.
    access({
      when: Params('areaOfNeed').not.match(Condition.Array.IsIn(Data('areaOfNeedSlugs'))),
      next: [redirect({ goto: 'add-goal/accommodation' })],
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
