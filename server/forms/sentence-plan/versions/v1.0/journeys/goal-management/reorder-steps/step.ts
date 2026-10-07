import {
  access,
  Post,
  redirect,
  step,
  submit,
  Condition,
  match,
  Data,
  Format,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { pageLayout } from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../../effects'
import { redirectIfGoalHasLessThanTwoSteps, redirectIfGoalNotFound } from '../../../guards'

const backDestination = match(Data('navigationReferrer'))
  .case('add-steps', Format('../../goal/%1/add-steps', Data('activeGoal.uuid')))
  .otherwise(Format('../../goal/%1/update-goal-steps', Data('activeGoal.uuid')))

/*
Reorder steps page:
- displays the current steps in a numbered table with move up/down buttons
- `saveAndContinue` commits the new order to the API via saveReorderedSteps
- `cancel` and `back` navigate back without saving
 */
export const reorderStepsStep = step({
  path: '/reorder-steps',
  title: 'Reorder steps',
  reachability: { entryWhen: true },
  view: {
    locals: {
      backlink: backDestination,
    },
  },

  blocks: [pageLayout],

  onAccess: [
    access({
      effects: [
        SentencePlanEffects.setActiveGoalContext(),
        SentencePlanEffects.setAreaDataFromActiveGoal(),
        SentencePlanEffects.reorderStepsInSession(),
        SentencePlanEffects.sendAuditEvent(AuditEvent.VIEW_REORDER_STEPS),
      ],
    }),
    redirectIfGoalNotFound('../../plan/overview'),
    redirectIfGoalHasLessThanTwoSteps('../../plan/overview'),
  ],

  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('cancel')),
      validate: false,
      onAlways: {
        next: [redirect({ goto: backDestination })],
      },
    }),

    submit({
      when: Post('action').match(Condition.Equals('saveAndContinue')),
      validate: false,
      onAlways: {
        effects: [
          SentencePlanEffects.saveReorderedSteps(),
          SentencePlanEffects.sendAuditEvent(AuditEvent.REORDER_STEPS),
        ],
        next: [redirect({ goto: backDestination })],
      },
    }),
  ],
})
