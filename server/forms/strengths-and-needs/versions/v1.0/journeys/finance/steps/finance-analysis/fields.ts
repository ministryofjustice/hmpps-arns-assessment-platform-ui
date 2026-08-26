import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { MOJBanner } from '@ministryofjustice/hmpps-forge/moj-components'
import { not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { healthWellbeingSection } from '../../../health-wellbeing/section'
import { commonContentFor } from '../../../../locales'
import { anyAnswered } from '../../../../steps/view-all-answers/fields'
import { questions, summary } from '../finance-summary/fields'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    healthWellbeingSection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.summaryRow,
    healthWellbeingSection.practitionerAnalysis.riskOfSeriousHarm.displayModes.summaryRow,
    healthWellbeingSection.practitionerAnalysis.riskOfReoffending.displayModes.summaryRow,
  ],
})

const summaryPanel = [summary, goToPractitionerAnalysisButton(Step.financeAnalysis.path)]

export const financePractitionerAnalysisSummaryTab = HtmlBlock({
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
          panel: { blocks: [practitionerAnalysisSummary] },
        },
      ],
      visibleWhen: anyAnswered(questions),
    }),
  ],
})
