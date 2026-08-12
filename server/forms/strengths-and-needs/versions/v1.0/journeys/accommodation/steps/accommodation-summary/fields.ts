import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { accommodationSection } from '../../section'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { commonContentFor } from '../../../../locales'

export const accommodationSummary = GovUKSummaryList({
  rows: [
    accommodationSection.questions.currentAccommodation.displayModes.summaryRow,
    accommodationSection.questions.livingWith.displayModes.summaryRow,
    accommodationSection.questions.suitableHousingLocation.displayModes.summaryRow,
    accommodationSection.questions.suitableHousing.displayModes.summaryRow,
    accommodationSection.questions.noAccommodationReason.displayModes.summaryRow,
    accommodationSection.questions.pastAccommodationDetails.displayModes.summaryRow,
    accommodationSection.questions.suitableHousingPlanned.displayModes.summaryRow,
    accommodationSection.questions.changes.displayModes.summaryRow,
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
          accommodationSection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.field,
          accommodationSection.practitionerAnalysis.riskOfSeriousHarm.displayModes.field,
          accommodationSection.practitionerAnalysis.riskOfReoffending.displayModes.field,
          markAsCompleteButton,
        ],
      },
    },
  ],
})
