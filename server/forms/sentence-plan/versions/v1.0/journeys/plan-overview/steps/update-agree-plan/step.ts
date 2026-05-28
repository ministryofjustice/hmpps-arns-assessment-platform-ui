import { Data, Post, redirect, step, submit, when, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { updatePlanAgreementQuestion, buttonGroup } from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../../../effects'
import { sentencePlanOverviewPath } from '../../../../constants'
import { redirectUnlessCouldNotAnswer, redirectToOverviewIfReadOnly } from '../../../../guards'

export const updateAgreePlanStep = step({
  path: '/update-agree-plan',
  title: 'Do they agree to their plan?',
  blocks: [updatePlanAgreementQuestion, buttonGroup],
  onAccess: [redirectToOverviewIfReadOnly(), redirectUnlessCouldNotAnswer(sentencePlanOverviewPath)],
  view: {
    locals: {
      backlink: when(Data('navigationReferrer').match(Condition.Equals('plan-history')))
        .then('plan-history')
        .else('overview?type=current'),
    },
  },
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          SentencePlanEffects.updatePlanAgreement(),
          SentencePlanEffects.sendAuditEvent(AuditEvent.EDIT_PLAN_AGREEMENT_UPDATE, {
            agreementStatus: Post('update_plan_agreement_question'),
          }),
        ],
        next: [redirect({ goto: 'overview?type=current' })],
      },
    }),
  ],
})
