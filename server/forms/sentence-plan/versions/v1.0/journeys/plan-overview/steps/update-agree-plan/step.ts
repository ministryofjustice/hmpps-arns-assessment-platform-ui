import { accessTransition, Data, Post, redirect, step, submitTransition, when } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { updatePlanAgreementQuestion, buttonGroup } from './fields'
import { SentencePlanEffects } from '../../../../../../effects'
import { sentencePlanOverviewPath } from '../../../../constants'

export const updateAgreePlanStep = step({
  path: '/update-agree-plan',
  title: 'Do they agree to their plan?',
  blocks: [updatePlanAgreementQuestion, buttonGroup],
  onAccess: [
    accessTransition({
      effects: [SentencePlanEffects.loadNavigationReferrer()],
    }),
    accessTransition({
      when: Data('sessionDetails.planAccessMode').match(Condition.Equals('READ_ONLY')),
      next: [redirect({ goto: sentencePlanOverviewPath })],
    }),
    accessTransition({
      when: Data('latestAgreementStatus').not.match(Condition.Equals('COULD_NOT_ANSWER')),
      next: [redirect({ goto: sentencePlanOverviewPath })],
    }),
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
