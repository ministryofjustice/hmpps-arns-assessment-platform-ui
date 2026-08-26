import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { MOJBanner } from '@ministryofjustice/hmpps-forge/moj-components'
import { not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { commonContentFor } from '../../../../locales'
import { anyAnswered } from '../../../../steps/view-all-answers/fields'
import { accommodationSection } from '../../section'
import { questions, summaryPanel } from '../accommodation-summary/fields'

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    accommodationSection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.summaryRow,
    accommodationSection.practitionerAnalysis.riskOfSeriousHarm.displayModes.summaryRow,
    accommodationSection.practitionerAnalysis.riskOfReoffending.displayModes.summaryRow,
  ],
})

export const accommodationPractitionerAnalysisSummaryTab = HtmlBlock({
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
          panel: { blocks: summaryPanel },
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
