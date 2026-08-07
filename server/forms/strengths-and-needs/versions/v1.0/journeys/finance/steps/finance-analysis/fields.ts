import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { financeSummary } from '../finance-summary/fields'
import { financeSection } from '../../section'
import { Step } from '../../constants/step'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import { commonContentFor } from '../../../../locales'

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    financeSection.fields.strengthsOrProtectiveFactors.displayModes.summaryRow,
    financeSection.fields.riskOfSeriousHarm.displayModes.summaryRow,
    financeSection.fields.riskOfReoffending.displayModes.summaryRow,
  ],
})

export const financePractitionerAnalysisSummaryTab = GovUKTabs({
  id: 'finance-analysis',
  items: [
    {
      id: 'summary-analysis',
      label: commonContentFor('summary'),
      panel: { blocks: [financeSummary, goToPractitionerAnalysisButton(Step.financeAnalysis.path)] },
    },
    {
      id: 'practitioner-analysis-summary',
      label: commonContentFor('practitioner_analysis'),
      panel: { blocks: [practitionerAnalysisSummary] },
    },
  ],
})
