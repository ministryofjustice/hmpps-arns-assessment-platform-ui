import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { MOJBanner } from '@ministryofjustice/hmpps-forge/moj-components'
import { not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { thinkingBehavioursAttitudesSection } from '../../section'
import { commonContentFor } from '../../../../locales'
import { questions, summary } from '../thinking-behaviours-summary/fields'
import { anyAnswered } from '../../../../steps/view-all-answers/fields'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    thinkingBehavioursAttitudesSection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.practitionerAnalysis.linkedToSeriousHarm.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.practitionerAnalysis.linkedToReoffending.displayModes.summaryRow,
  ],
})

const summaryPanel = [summary, goToPractitionerAnalysisButton(Step.thinkingBehavioursAnalysis.path)]

export const thinkingBehavioursAnalysisSummaryTab = HtmlBlock({
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
