import { Answer, next, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { squadScripts, squadSelection, continueButton } from './fields'
import { StandupDemoEffects } from '../../effects'

export const squadSelectionStep = step({
  path: '/squad-selection',
  title: 'Squad Selection',
  blocks: [squadScripts, squadSelection, continueButton],
  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {
        effects: [StandupDemoEffects.standupSaveStepAnswers()],
        next: [
          next({
            when: Answer('targetSquad').match(Condition.Equals('phoenix')),
            goto: 'squad-2-progress',
          }),
          next({
            when: Answer('targetSquad').match(Condition.Equals('koala')),
            goto: 'squad-4-progress',
          }),
          next({
            goto: 'wrong-squad',
          }),
        ],
      },
    }),
  ],
})
