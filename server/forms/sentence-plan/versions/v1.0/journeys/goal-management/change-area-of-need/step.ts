import { access, Data, Format, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { pageHeading, areaOfNeedField, continueButton } from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../../effects'
import { redirectIfGoalNotFound } from '../../../guards'

/**
 * Change area of need page
 *
 * Lets the practitioner change the area of need of an existing goal.
 * Reached from the "Change area of need" link on the Update goal page.
 */
export const changeAreaOfNeedStep = step({
  path: '/change-area-of-need',
  title: 'Change area of need',
  reachability: { entryWhen: true },
  view: {
    locals: {
      backlink: Format('../../goal/%1/change-goal', Data('activeGoal.uuid')),
    },
  },

  blocks: [pageHeading, areaOfNeedField, continueButton],

  onAccess: [
    access({
      effects: [
        SentencePlanEffects.setActiveGoalContext(),
        SentencePlanEffects.sendAuditEvent(AuditEvent.VIEW_CHANGE_AREA_OF_NEED),
      ],
    }),
    redirectIfGoalNotFound('../../plan/overview'),
  ],

  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          SentencePlanEffects.updateActiveGoalAreaOfNeed(),
          SentencePlanEffects.sendAuditEvent(AuditEvent.EDIT_GOAL),
        ],
        next: [redirect({ goto: Format('../../goal/%1/change-goal', Data('activeGoal.uuid')) })],
      },
    }),
  ],
})
