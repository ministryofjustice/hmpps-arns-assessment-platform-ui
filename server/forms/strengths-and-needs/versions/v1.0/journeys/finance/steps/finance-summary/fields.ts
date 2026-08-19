import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { financeSection } from '../../section'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { commonContentFor } from '../../../../locales'

export const financeSummary = GovUKSummaryList({
  rows: [
    financeSection.questions.income.displayModes.summaryRow,
    financeSection.questions.bankAccount.displayModes.summaryRow,
    financeSection.questions.moneyManagement.displayModes.summaryRow,
    financeSection.questions.gambling.displayModes.summaryRow,
    financeSection.questions.debt.displayModes.summaryRow,
    financeSection.questions.changes.displayModes.summaryRow,
  ],
})

export const summaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: { blocks: [financeSummary, goToPractitionerAnalysisButton(Step.financeSummary.path)] },
    },
    {
      id: 'practitioner-analysis',
      label: commonContentFor('practitioner_analysis'),
      panel: {
        blocks: [
          financeSection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.field,
          financeSection.practitionerAnalysis.riskOfSeriousHarm.displayModes.field,
          financeSection.practitionerAnalysis.riskOfReoffending.displayModes.field,
          markAsCompleteButton,
        ],
      },
    },
  ],
})
