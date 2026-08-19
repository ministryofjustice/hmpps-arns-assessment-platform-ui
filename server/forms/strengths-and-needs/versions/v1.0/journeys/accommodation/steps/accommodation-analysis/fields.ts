import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { accommodationSummary } from '../accommodation-summary/fields'
import { accommodationSection } from '../../section'
import { Step } from '../../constants/step'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import { commonContentFor } from '../../../../locales'

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    accommodationSection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.summaryRow,
    accommodationSection.practitionerAnalysis.riskOfSeriousHarm.displayModes.summaryRow,
    accommodationSection.practitionerAnalysis.riskOfReoffending.displayModes.summaryRow,
  ],
})

export const accommodationPractitionerAnalysisSummaryTab = GovUKTabs({
  id: 'final-accommodation-practitioner-analysis',
  items: [
    {
      id: 'summary-analysis',
      label: commonContentFor('summary'),
      panel: {
        blocks: [
          accommodationSummary,
          goToPractitionerAnalysisButton(Step.accommodation_analysis.path, 'practitioner-analysis-summary'),
        ],
      },
    },
    {
      id: 'practitioner-analysis-summary',
      label: commonContentFor('practitioner_analysis'),
      panel: { blocks: [practitionerAnalysisSummary] },
    },
  ],
})
