import {validation, Self, Answer, Format, when} from '@form-engine/form/builders'
import {
  GovUKRadioInput,
  GovUKCheckboxInput,
  GovUKCharacterCount,
  GovUKSummaryList
} from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { CaseData } from '../../../../constants'

// --- Employment Sector Group ---

export const employmentStatusSummary = GovUKSummaryList({
  card: {
    title: { text: 'Personal details' },
    actions: {
      items: [
        { href: '/delete', text: 'Delete', visuallyHiddenText: 'personal details' },
      ],
    },
  },
  rows: [
    { key: { text: 'Name' }, value: { text: 'John Smith' }, actions: {
        items: [
          { href: 'current-employment', text: 'Change', visuallyHiddenText: 'name' },
        ],
      } },
    { key: { text: 'Email' }, value: { text: 'john@example.com' } },
  ],
})
