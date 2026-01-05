import { next, step, submitTransition, Post } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { planAgreementQuestion, notesField, saveButton } from './fields'
import { SentencePlanV1Effects } from '../../../../effects'

export const agreePlanStep = step({
  path: '/agree-plan',
  title: 'Agree Plan',
  blocks: [planAgreementQuestion, notesField, saveButton],
  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [SentencePlanV1Effects.updatePlanAgreementStatus()],
        next: [next({ goto: 'overview' })],
      },
    }),
  ],
})
