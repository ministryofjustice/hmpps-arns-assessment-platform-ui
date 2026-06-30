import {
  redirect,
  step,
  submit,
  Post,
  when,
  Query,
  Format,
  Condition,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { planAgreementQuestion, notesField, saveButton } from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../../../effects'
import { redirectToOverviewIfReadOnly } from '../../../../guards'

export const agreePlanStep = step({
  path: '/agree-plan',
  title: 'Do they agree to this plan?',
  reachability: { entryWhen: true },
  blocks: [planAgreementQuestion, notesField, saveButton],
  view: {
    locals: {
      backlink: when(Query('type').match(Condition.IsRequired()))
        .then(Format('overview?type=%1', Query('type')))
        .else('overview?type=current'),
    },
  },
  onAccess: [redirectToOverviewIfReadOnly()],
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
