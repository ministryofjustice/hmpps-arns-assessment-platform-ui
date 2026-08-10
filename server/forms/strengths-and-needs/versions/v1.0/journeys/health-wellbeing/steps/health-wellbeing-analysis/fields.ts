import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { healthWellbeingSummary } from '../health-wellbeing-summary/fields'
import { healthWellbeingSection } from '../../section'
import { Step } from '../../constants/step'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import { commonContentFor } from '../../../../locales'

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    healthWellbeingSection.fields.strengthsOrProtectiveFactors.displayModes.summaryRow,
    healthWellbeingSection.fields.riskOfSeriousHarm.displayModes.summaryRow,
    healthWellbeingSection.fields.riskOfReoffending.displayModes.summaryRow,
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
