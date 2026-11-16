import {
  access,
  redirect,
  step,
  submit,
  Post,
  Query,
  Format,
  Condition,
  and,
  not,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { planAgreementQuestion, notesField, saveButton } from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../../../effects'
import { CaseData } from '../../../../constants'
import {
  isDraftPlanConfirmationEnabled,
  hasPostAgreementStatus,
  isOasysAccess,
  redirectToOverviewIfReadOnly,
  redirectUnlessAllActiveGoalsHaveSteps,
} from '../../../../guards'

export const agreePlanStep = step({
  path: '/agree-plan',
  title: when(isDraftPlanConfirmationEnabled)
    .then(Format('Have you shared this plan with %1?', CaseData.Forename))
    .else('Do they agree to this plan?'),
  reachability: { entryWhen: true },
  blocks: [planAgreementQuestion, notesField, saveButton],
  view: {
    locals: {
      backlink: Format('overview?goalStatusTab=%1', Query('goalStatusTab').nullish('current')),
      buttons: {
        showReturnToOasysLink: and(isOasysAccess, isDraftPlanConfirmationEnabled, not(hasPostAgreementStatus)),
      },
    },
  },
  onAccess: [
    redirectToOverviewIfReadOnly(),
    redirectUnlessAllActiveGoalsHaveSteps('overview'),
    access({
      effects: [SentencePlanEffects.sendAuditEvent(AuditEvent.VIEW_PLAN_AGREEMENT)],
    }),
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          SentencePlanEffects.updatePlanAgreementStatus(),
          SentencePlanEffects.sendAuditEvent(AuditEvent.EDIT_PLAN_AGREEMENT, {
            agreementStatus: Post('plan_agreement_question'),
          }),
        ],
        next: [redirect({ goto: 'overview' })],
      },
    }),
  ],
})
