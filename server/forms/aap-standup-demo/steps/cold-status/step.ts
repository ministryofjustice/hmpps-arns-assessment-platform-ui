import { Answer, next, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { coldNotice, coldDecision, continueButton } from './fields'
import { StandupDemoEffects } from '../../effects'

export const coldStatusStep = step({
  path: '/cold-status',
  title: 'My standup update',
  isEntryPoint: true,
  blocks: [coldNotice, coldDecision, continueButton],
  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {
        effects: [StandupDemoEffects.standupSaveStepAnswers()],
        next: [
          next({
            when: Answer('coldDecision').match(Condition.Equals('bed')),
            goto: 'bed-rejection',
          }),
          next({
            goto: 'squad-selection',
          }),
        ],
      },
    }),
  ],
})
