import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { accommodationSection } from '../../section'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { commonContentFor } from '../../../../locales'

export const accommodationSummary = GovUKSummaryList({
  rows: [
    accommodationSection.fields.currentAccommodation.displayModes.summaryRow,
    accommodationSection.fields.livingWith.displayModes.summaryRow,
    accommodationSection.fields.suitableHousingLocation.displayModes.summaryRow,
    accommodationSection.fields.suitableHousing.displayModes.summaryRow,
    accommodationSection.fields.noAccommodationReason.displayModes.summaryRow,
    accommodationSection.fields.pastAccommodationDetails.displayModes.summaryRow,
    accommodationSection.fields.suitableHousingPlanned.displayModes.summaryRow,
    accommodationSection.fields.changes.displayModes.summaryRow,
  ],
})

export const accommodationSummaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: {
        blocks: [accommodationSummary, goToPractitionerAnalysisButton(Step.accommodation_summary.path)],
      },
    },
    {
      id: 'practitioner-analysis',
      label: commonContentFor('practitioner_analysis'),
      panel: {
        blocks: [
          accommodationSection.fields.strengthsOrProtectiveFactors.displayModes.field,
          accommodationSection.fields.riskOfSeriousHarm.displayModes.field,
          accommodationSection.fields.riskOfReoffending.displayModes.field,
          markAsCompleteButton,
        ],
      },
    },
  ],
})
