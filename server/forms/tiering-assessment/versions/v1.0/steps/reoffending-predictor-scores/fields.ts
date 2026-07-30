import { GovUKSummaryList } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Session } from '@ministryofjustice/hmpps-forge/core/authoring'

export const uuidSummaryField = GovUKSummaryList({
  card: {
    title: {
      text: 'Assessment',
    },
  },
  rows: [
    {
      key: { text: 'UUID' },
      value: { text: Session('assessmentUuid') },
    },
  ],
})
