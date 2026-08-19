import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { alcoholSummary } from '../alcohol-use-summary/fields'
import { alcoholUseSection } from '../../section'
import { Step } from '../../constants/step'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import { commonContentFor } from '../../../../locales'

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    alcoholUseSection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.summaryRow,
    alcoholUseSection.practitionerAnalysis.riskOfSeriousHarm.displayModes.summaryRow,
    alcoholUseSection.practitionerAnalysis.riskOfReoffending.displayModes.summaryRow,
  ],
})

export const alcoholPractitionerAnalysisSummaryTab = GovUKTabs({
  id: 'final-alcohol-practitioner-analysis',
  items: [
    {
      id: 'summary-analysis',
      label: commonContentFor('summary'),
      panel: {
        blocks: [
          alcoholSummary,
          goToPractitionerAnalysisButton(Step.alcohol_use_analysis.path, 'practitioner-analysis-summary'),
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
