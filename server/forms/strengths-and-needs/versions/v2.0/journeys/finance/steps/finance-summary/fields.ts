import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { MOJBanner } from '@ministryofjustice/hmpps-forge/moj-components'
import { financeSection, hasFinancialConcerns } from '../../section'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { commonContentFor } from '../../../../locales'
import { questionsOf } from '../../../../steps/view-all-answers/sections'
import { anyAnswered } from '../../../../steps/view-all-answers/fields'
import { Section } from '../../../../constants/section'
import { Step } from '../../constants/step'

export const questions = questionsOf({
  section: Section.finance,
  config: financeSection,
})

export const summary = GovUKSummaryList({
  rows: [
    financeSection.questions.income.displayModes.summaryRow,
    financeSection.questions.overReliantOnFamilyOrFriends.displayModes.summaryRow,
    financeSection.questions.financialConcerns.displayModes.summaryRow,
    financeSection.questions.moneyManagement.displayModes.summaryRow,
    financeSection.questions.debt.displayModes.summaryRow,
    financeSection.questions.debtTypeTheir.displayModes.summaryRow,
    financeSection.questions.debtTypeSomeoneElses.displayModes.summaryRow,
    financeSection.questions.changes.displayModes.summaryRow,
  ],
})

const summaryPanel = [
  summary,
  goToPractitionerAnalysisButton(Step.finance_summary.path, 'practitioner-analysis', hasFinancialConcerns),
]

export const summaryTab = HtmlBlock({
  content: [
    MOJBanner({
      bannerType: 'information',
      text: commonContentFor('section_has_not_been_started'),
      visibleWhen: not(anyAnswered(questions)),
    }),
    GovUKTabs({
      id: 'summaries',
      items: [
        {
          id: 'summary',
          label: commonContentFor('summary'),
          panel: { blocks: summaryPanel },
        },
        {
          id: 'practitioner-analysis',
          label: commonContentFor('practitioner_analysis'),
          visibleWhen: hasFinancialConcerns,
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
