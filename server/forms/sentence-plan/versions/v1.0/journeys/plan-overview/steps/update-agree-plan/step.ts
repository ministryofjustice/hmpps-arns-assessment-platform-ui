import { accessTransition, when, Data, redirect, step, Post, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { sentencePlanOverviewPath } from '../../../../constants'
import { updatePlanAgreementQuestion, saveButton } from './fields'
import { SentencePlanEffects } from '../../../../../../effects'

export const updateAgreePlanStep = step({
  path: '/update-agree-plan',
  title: 'Do they agree to their plan?',
  blocks: [updatePlanAgreementQuestion, saveButton],
  onAccess: [
    accessTransition({
      effects: [SentencePlanEffects.loadNavigationReferrer()],
    }),
    accessTransition({
      when: Data('sessionDetails.accessMode').match(Condition.Equals('READ_ONLY')),
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
