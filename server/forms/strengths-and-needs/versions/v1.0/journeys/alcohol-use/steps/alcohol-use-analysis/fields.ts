import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { MOJBanner } from '@ministryofjustice/hmpps-forge/moj-components'
import { not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { commonContentFor } from '../../../../locales'
import { alcoholUseSection } from '../../section'
import { anyAnswered } from '../../../../steps/view-all-answers/fields'
import { questions, summaryPanel } from '../alcohol-use-summary/fields'

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    alcoholUseSection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.summaryRow,
    alcoholUseSection.practitionerAnalysis.riskOfSeriousHarm.displayModes.summaryRow,
    alcoholUseSection.practitionerAnalysis.riskOfReoffending.displayModes.summaryRow,
  ],
})

export const alcoholPractitionerAnalysisSummaryTab = HtmlBlock({
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
