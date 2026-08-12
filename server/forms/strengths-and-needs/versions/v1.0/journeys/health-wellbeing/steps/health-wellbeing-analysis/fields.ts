import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { healthWellbeingSummary } from '../health-wellbeing-summary/fields'
import { healthWellbeingSection } from '../../section'
import { Step } from '../../constants/step'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import { commonContentFor } from '../../../../locales'

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    healthWellbeingSection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.summaryRow,
    healthWellbeingSection.practitionerAnalysis.riskOfSeriousHarm.displayModes.summaryRow,
    healthWellbeingSection.practitionerAnalysis.riskOfReoffending.displayModes.summaryRow,
  ],
})

export const healthWellbeingAnalysisSummaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: {
        blocks: [healthWellbeingSummary, goToPractitionerAnalysisButton(Step.health_wellbeing_analysis.path)],
      },
    },
    {
      id: 'practitioner-analysis',
      label: commonContentFor('practitioner_analysis'),
      panel: { blocks: [practitionerAnalysisSummary] },
    },
  ],
})
