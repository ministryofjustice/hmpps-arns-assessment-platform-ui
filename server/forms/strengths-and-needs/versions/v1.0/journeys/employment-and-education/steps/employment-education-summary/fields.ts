import {Answer, Format} from '@form-engine/form/builders'
import {GovUKRadioInput, GovUKSummaryList, GovUKTabs} from '@form-engine-govuk-components/components'
import {CaseData} from '../../../../constants'
import {currentEmployment} from "../current-employment/fields";
import {ConditionalString} from "@form-engine/form/types/structures.type";

// --- Employment Sector Group ---


const employmentStatusSummary = GovUKSummaryList({
  rows: [
    {
      key: {text: Format('What is %1 current employment status?', CaseData.ForenamePossessive)},
      value: { text: getGovUKRadioInputTextDefinition(currentEmployment, 'EMPLOYED') },
      actions: {
        items: [{href: 'current-employment', text: 'Change', visuallyHiddenText: 'name'}],
      },
    },
    {
      key: {text: Format('What is %1 employment history?', CaseData.ForenamePossessive)},
      value: {text: Answer('employment_history_unknown_employment_details')},
      actions: {
        items: [{href: 'employed', text: 'Change', visuallyHiddenText: 'date of birth'}],
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
      panel: {blocks: [employmentStatusSummary]},
    },
    {
      id: 'practitioner_analysis',
      label: 'Practitioner analysis',
      panel: {text: 'These are your closed cases.'},
    },
  ],
})

export function getGovUKRadioInputTextDefinition(block: GovUKRadioInput, value: String): ConditionalString | undefined {
  const selectedItem
    = block.items.find(item=> 'value' in item && item.value === value)

  if (!selectedItem || !('text' in selectedItem)) {
    return ''
  }

  return selectedItem.text
}
