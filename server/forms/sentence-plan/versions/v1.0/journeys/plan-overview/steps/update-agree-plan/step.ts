import { accessTransition, Data, Post, redirect, step, submitTransition, when } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { updatePlanAgreementQuestion, buttonGroup } from './fields'
import { SentencePlanEffects } from '../../../../../../effects'
import { sentencePlanOverviewPath } from '../../../../constants'
import { redirectUnlessCouldNotAnswer, redirectToOverviewIfReadOnly } from '../../../../guards'

export const updateAgreePlanStep = step({
  path: '/update-agree-plan',
  title: 'Do they agree to their plan?',
  blocks: [updatePlanAgreementQuestion, buttonGroup],
  onAccess: [
    accessTransition({
      effects: [SentencePlanEffects.loadNavigationReferrer()],
    }),
    redirectToOverviewIfReadOnly(),
    redirectUnlessCouldNotAnswer(sentencePlanOverviewPath),
  ],
  view: {
    locals: {
      backlink: when(Data('navigationReferrer').match(Condition.Equals('plan-history')))
        .then('plan-history')
        .else('overview?type=current'),
    },
  },
  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [SentencePlanEffects.updatePlanAgreement()],
        next: [redirect({ goto: 'overview?type=current' })],
      },
    }),
  ],
})
