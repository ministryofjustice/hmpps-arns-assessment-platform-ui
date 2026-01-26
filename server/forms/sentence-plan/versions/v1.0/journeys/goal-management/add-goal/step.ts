import {
  accessTransition,
  Answer,
  Data,
  Format,
  Params,
  Post,
  Query,
  redirect,
  step,
  submitTransition,
  when,
} from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { sideNav, contentBlocks } from './fields'
import { SentencePlanEffects } from '../../../../../effects'
import { CaseData } from '../../../constants'

/**
 * For adding a new goal.
 */
export const createGoalStep = step({
  path: '/add-goal/:areaOfNeed',
  title: 'Create Goal',
  isEntryPoint: true,
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
    accessTransition({
      effects: [SentencePlanEffects.deriveGoalCurrentAreaOfNeed()],
    }),

    // If UUID param is literally ':uuid', redirect to use 'new' instead
    accessTransition({
      when: Params('uuid').match(Condition.Equals(':uuid')),
      next: [redirect({ goto: Format('../new/add-goal/%1', Params('areaOfNeed')) })],
    }),

    // If area of need is not a valid slug, redirect them to `accommodation` by default.
    accessTransition({
      when: Params('areaOfNeed').not.match(Condition.Array.IsIn(Data('areaOfNeedSlugs'))),
      next: [redirect({ goto: 'add-goal/accommodation' })],
    }),
  ],
  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('addSteps')),
      validate: true,
      onValid: {
        effects: [SentencePlanEffects.saveActiveGoal(), SentencePlanEffects.setNavigationReferrer('add-goal')],
        next: [redirect({ goto: Format('../%1/add-steps', Data('activeGoalUuid')) })],
      },
    }),
    submitTransition({
      when: Post('action').match(Condition.Equals('saveWithoutSteps')),
      validate: true,
      onValid: {
        effects: [
          SentencePlanEffects.saveActiveGoal(),
          SentencePlanEffects.addNotification({
            type: 'success',
            title: 'Goal added',
            message: Format('You added a goal to %1 plan', CaseData.ForenamePossessive),
            target: 'plan-overview',
          }),
        ],
        next: [
          redirect({
            when: Query('type').match(Condition.IsRequired()),
            goto: Format('../../plan/overview?type=%1', Query('type')),
          }),
          redirect({
            when: Answer('can_start_now').match(Condition.Equals('no')),
            goto: '../../plan/overview?type=future',
          }),
          redirect({ goto: '../../plan/overview?type=current' }),
        ],
      },
    }),
  ],
})
