import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { personalRelationshipsCommunitySummary } from '../personal-relationships-community-summary/fields'
import { personalRelationshipsCommunitySection } from '../../section'
import { Step } from '../../constants/step'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import { commonContentFor } from '../../../../locales'

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    personalRelationshipsCommunitySection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.summaryRow,
    personalRelationshipsCommunitySection.practitionerAnalysis.riskOfSeriousHarm.displayModes.summaryRow,
    personalRelationshipsCommunitySection.practitionerAnalysis.riskOfReoffending.displayModes.summaryRow,
  ],
})

export const personalRelationshipsCommunityPractitionerAnalysisSummaryTab = GovUKTabs({
  id: 'personal-relationships-community-summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: {
        blocks: [
          personalRelationshipsCommunitySummary,
          goToPractitionerAnalysisButton(Step.personal_relationships_community_analysis.path),
        ],
      },
    },
    {
      id: 'practitioner-analysis',
      label: commonContentFor('practitioner_analysis'),
      panel: { blocks: [practitionerAnalysisSummary] },
    },
  ],
})
