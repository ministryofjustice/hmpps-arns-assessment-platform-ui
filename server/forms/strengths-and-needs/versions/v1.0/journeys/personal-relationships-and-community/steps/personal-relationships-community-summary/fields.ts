import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { personalRelationshipsCommunitySection } from '../../section'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { commonContentFor } from '../../../../locales'

export const personalRelationshipsCommunitySummary = GovUKSummaryList({
  rows: [
    personalRelationshipsCommunitySection.questions.childrenDetails.displayModes.summaryRow,
    personalRelationshipsCommunitySection.questions.importantPeople.displayModes.summaryRow,
    personalRelationshipsCommunitySection.questions.currentRelationship.displayModes.summaryRow,
    personalRelationshipsCommunitySection.questions.intimateRelationship.displayModes.summaryRow,
    personalRelationshipsCommunitySection.questions.challengesIntimateRelationship.displayModes.summaryRow,
    personalRelationshipsCommunitySection.questions.parentalResponsibilities.displayModes.summaryRow,
    personalRelationshipsCommunitySection.questions.familyRelationship.displayModes.summaryRow,
    personalRelationshipsCommunitySection.questions.childhood.displayModes.summaryRow,
    personalRelationshipsCommunitySection.questions.childhoodBehaviour.displayModes.summaryRow,
    personalRelationshipsCommunitySection.questions.belonging.displayModes.summaryRow,
    personalRelationshipsCommunitySection.questions.changes.displayModes.summaryRow,
  ],
})

export const personalRelationshipsCommunitySummaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: {
        blocks: [
          personalRelationshipsCommunitySummary,
          goToPractitionerAnalysisButton(Step.personal_relationships_community_summary.path),
        ],
      },
    },
    {
      id: 'practitioner-analysis',
      label: commonContentFor('practitioner_analysis'),
      panel: {
        blocks: [
          personalRelationshipsCommunitySection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.field,
          personalRelationshipsCommunitySection.practitionerAnalysis.riskOfSeriousHarm.displayModes.field,
          personalRelationshipsCommunitySection.practitionerAnalysis.riskOfReoffending.displayModes.field,
          markAsCompleteButton,
        ],
      },
    },
  ],
})
