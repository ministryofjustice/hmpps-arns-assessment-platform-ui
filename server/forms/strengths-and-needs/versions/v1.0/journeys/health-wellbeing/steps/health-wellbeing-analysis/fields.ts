import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { MOJBanner } from '@ministryofjustice/hmpps-forge/moj-components'
import { not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { questions, summary } from '../health-wellbeing-summary/fields'
import { healthWellbeingSection } from '../../section'
import { commonContentFor } from '../../../../locales'
import { anyAnswered } from '../../../../steps/view-all-answers/fields'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    healthWellbeingSection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.summaryRow,
    healthWellbeingSection.practitionerAnalysis.riskOfSeriousHarm.displayModes.summaryRow,
    healthWellbeingSection.practitionerAnalysis.riskOfReoffending.displayModes.summaryRow,
  ],
})

const summaryPanel = [summary, goToPractitionerAnalysisButton(Step.health_wellbeing_analysis.path)]

export const healthWellbeingAnalysisSummaryTab = HtmlBlock({
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
