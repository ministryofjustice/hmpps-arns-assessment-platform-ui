import { next, step, submitTransition } from '@form-engine/form/builders'
import { pageHeading, backButton } from './fields'

export const viewHistoricStep = step({
  path: '/view-historic/:planVersionUuid',
  title: 'View Historic Version',
  blocks: [pageHeading, backButton],
  onSubmission: [
    submitTransition({
      onAlways: {
        next: [next({ goto: 'previous-versions' })],
      },
    }),
  ],
})
