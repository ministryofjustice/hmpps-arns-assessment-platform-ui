import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { MOJBanner } from '@ministryofjustice/hmpps-forge/moj-components'
import { not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { questions } from '../personal-relationships-community-summary/fields'
import { personalRelationshipsCommunitySection } from '../../section'
import { commonContentFor } from '../../../../locales'
import { anyAnswered } from '../../../../steps/view-all-answers/fields'
import { summaryPanel } from '../../../finance/steps/finance-summary/fields'

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    personalRelationshipsCommunitySection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.summaryRow,
    personalRelationshipsCommunitySection.practitionerAnalysis.riskOfSeriousHarm.displayModes.summaryRow,
    personalRelationshipsCommunitySection.practitionerAnalysis.riskOfReoffending.displayModes.summaryRow,
  ],
})

export const personalRelationshipsCommunityPractitionerAnalysisSummaryTab = HtmlBlock({
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
