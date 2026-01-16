import {
  accessTransition,
  Answer,
  Data,
  Format,
  loadTransition,
  next,
  Params,
  Post,
  Query,
  step,
  submitTransition,
  when,
} from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { twoColumnLayout } from './fields'
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
    },
  },
  blocks: [twoColumnLayout()],
  onLoad: [
    loadTransition({
      effects: [
        SentencePlanEffects.deriveGoalsWithStepsFromAssessment(),
        SentencePlanEffects.deriveGoalCurrentAreaOfNeed(),
      ],
    }),
  ],
  onAccess: [
    // If UUID param is literally ':uuid', redirect to use 'new' instead
    accessTransition({
      guards: Params('uuid').match(Condition.Equals(':uuid')),
      redirect: [next({ goto: Format('../new/add-goal/%1', Params('areaOfNeed')) })],
    }),

    // If area of need is not a valid slug, redirect them to `accommodation` by default.
    accessTransition({
      guards: Params('areaOfNeed').not.match(Condition.Array.IsIn(Data('areaOfNeedSlugs'))),
      redirect: [next({ goto: 'add-goal/accommodation' })],
    }),
  ],
  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('addSteps')),
      validate: true,
      onValid: {
        effects: [SentencePlanEffects.saveActiveGoal(), SentencePlanEffects.setNavigationReferrer('add-goal')],
        next: [next({ goto: Format('../%1/add-steps', Data('activeGoalUuid')) })],
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
          next({
            when: Query('type').match(Condition.IsRequired()),
            goto: Format('../../plan/overview?type=%1', Query('type')),
          }),
          next({
            when: Answer('can_start_now').match(Condition.Equals('no')),
            goto: '../../plan/overview?type=future',
          }),
          next({ goto: '../../plan/overview?type=current' }),
        ],
      },
    }),
  ],
})
