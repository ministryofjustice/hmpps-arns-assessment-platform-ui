import { next, step, submitTransition } from '@form-engine/form/builders'
import { progressHeading, progressChecklist, continueButton } from './fields'
import { StandupDemoEffects } from '../../effects'

export const squad2ProgressStep = step({
  path: '/squad-2-progress',
  title: 'Squad 2 Progress',
  blocks: [progressHeading, progressChecklist, continueButton],
  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {
        effects: [StandupDemoEffects.standupSaveStepAnswers()],
        next: [next({ goto: 'confirmation' })],
      },
    }),
  ],
})
