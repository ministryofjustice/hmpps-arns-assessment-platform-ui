import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { MOJBanner } from '@ministryofjustice/hmpps-forge/moj-components'
import { financeSection } from '../../section'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { commonContentFor } from '../../../../locales'
import { questionsOf } from '../../../../steps/view-all-answers/sections'
import { anyAnswered } from '../../../../steps/view-all-answers/fields'
import { Section } from '../../../../constants/section'

export const questions = questionsOf({
  section: Section.finance,
  config: financeSection,
})

export const summary = GovUKSummaryList({
  rows: [
    financeSection.questions.income.displayModes.summaryRow,
    financeSection.questions.bankAccount.displayModes.summaryRow,
    financeSection.questions.moneyManagement.displayModes.summaryRow,
    financeSection.questions.gambling.displayModes.summaryRow,
    financeSection.questions.debt.displayModes.summaryRow,
    financeSection.questions.changes.displayModes.summaryRow,
  ],
})

const summaryPanel = [summary, goToPractitionerAnalysisButton(Step.financeSummary.path)]

export const summaryTab = HtmlBlock({
  content: [
    MOJBanner({
      bannerType: 'information',
      text: 'This section has not been started',
      visibleWhen: not(anyAnswered(questions)),
    }),
    GovUKTabs({
      id: 'summaries',
      items: [
        {
          id: 'summary',
          label: commonContentFor('summary'),
          panel: {
            blocks: summaryPanel,
          },
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
      visibleWhen: anyAnswered(questions),
    }),
  ],
})
