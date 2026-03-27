import { redirect, step, submitTransition, Post, when, Query, Format } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { planAgreementQuestion, notesField, saveButton } from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../../../effects'
import { redirectToOverviewIfReadOnly } from '../../../../guards'

export const agreePlanStep = step({
  path: '/agree-plan',
  title: 'Do they agree to this plan?',
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
    submitTransition({
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
