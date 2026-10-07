import { step, tieBreaker } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKPanel } from '@ministryofjustice/hmpps-forge/govuk-components'

export const successStep = step({
  path: '/success',
  title: 'Data deletion complete',
  reachability: {
    entryWhen: true,
    tieBreakers: [tieBreaker({ priority: 0 })],
  },
  blocks: [
    GovUKPanel({
      titleText: 'Data deletion complete',
      text: 'The assessment data has been reloaded.',
      headingLevel: 3,
      classes: 'govuk-!-width-two-thirds',
    }),
  ],
})
