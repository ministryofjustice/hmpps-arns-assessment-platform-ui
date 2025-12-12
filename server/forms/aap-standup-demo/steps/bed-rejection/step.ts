import { next, step, submitTransition } from '@form-engine/form/builders'
import { rejectionNotice, begrudgedButton } from './fields'

export const bedRejectionStep = step({
  path: '/bed-rejection',
  title: 'Nice Try',
  view: {
    hiddenFromNavigation: true,
  },
  blocks: [rejectionNotice, begrudgedButton],
  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {
        next: [next({ goto: 'squad-selection' })],
      },
    }),
  ],
})
