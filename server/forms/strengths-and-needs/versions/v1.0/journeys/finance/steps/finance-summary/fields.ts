import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { financeSection } from '../../section'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { commonContentFor } from '../../../../locales'

export const financeSummary = GovUKSummaryList({
  rows: [
    financeSection.fields.income.displayModes.summaryRow,
    financeSection.fields.bankAccount.displayModes.summaryRow,
    financeSection.fields.moneyManagement.displayModes.summaryRow,
    financeSection.fields.gambling.displayModes.summaryRow,
    financeSection.fields.debt.displayModes.summaryRow,
    financeSection.fields.changes.displayModes.summaryRow,
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
          financeSection.fields.strengthsOrProtectiveFactors.displayModes.field,
          financeSection.fields.riskOfSeriousHarm.displayModes.field,
          financeSection.fields.riskOfReoffending.displayModes.field,
          markAsCompleteButton,
        ],
      },
    },
  ],
})
