import { Answer, Format } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants'

// --- Employment Sector Group ---

const employmentStatusSummary = GovUKSummaryList({
  rows: [
    {
      key: { text: Format('What is %1 current employment status?', CaseData.ForenamePossessive) },
      value: { text: 'Employed' },
      actions: {
        items: [{ href: 'current-employment', text: 'Change', visuallyHiddenText: 'name' }],
      },
    },
    {
      key: { text: Format('What is %1 employment history?', CaseData.ForenamePossessive) },
      value: { text: Answer('employment_history_unknown_employment_details') },
      actions: {
        items: [{ href: 'employed', text: 'Change', visuallyHiddenText: 'date of birth' }],
      },
    },
  ],
})

export const employmentStatusSummaryTab = GovUKTabs({
  id: 'cases',
  items: [
    {
      id: 'summary',
      label: 'Summary',
      panel: { blocks: [employmentStatusSummary] },
    },
    {
      id: 'practitioner_analysis',
      label: 'Practitioner analysis',
      panel: { text: 'These are your closed cases.' },
    },
  ],
})
