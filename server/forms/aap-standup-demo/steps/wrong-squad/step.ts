import { next, step, submitTransition } from '@form-engine/form/builders'
import { wrongSquadContent, continueButton } from './fields'

export const wrongSquadStep = step({
  path: '/wrong-squad',
  title: 'Wrong Squad',
  view: {
    hiddenFromNavigation: true,
  },
  blocks: [wrongSquadContent, continueButton],
  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {
        next: [next({ goto: 'confirmation' })],
      },
    }),
  ],
})
