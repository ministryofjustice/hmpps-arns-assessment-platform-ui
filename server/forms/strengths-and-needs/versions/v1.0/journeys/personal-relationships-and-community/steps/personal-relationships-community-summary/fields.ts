import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { personalRelationshipsCommunitySection } from '../../section'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { commonContentFor } from '../../../../locales'

export const personalRelationshipsCommunitySummary = GovUKSummaryList({
  rows: [
    personalRelationshipsCommunitySection.fields.childrenDetails.displayModes.summaryRow,
    personalRelationshipsCommunitySection.fields.importantPeople.displayModes.summaryRow,
    personalRelationshipsCommunitySection.fields.currentRelationship.displayModes.summaryRow,
    personalRelationshipsCommunitySection.fields.intimateRelationship.displayModes.summaryRow,
    personalRelationshipsCommunitySection.fields.challengesIntimateRelationship.displayModes.summaryRow,
    personalRelationshipsCommunitySection.fields.parentalResponsibilities.displayModes.summaryRow,
    personalRelationshipsCommunitySection.fields.familyRelationship.displayModes.summaryRow,
    personalRelationshipsCommunitySection.fields.childhood.displayModes.summaryRow,
    personalRelationshipsCommunitySection.fields.childhoodBehaviour.displayModes.summaryRow,
    personalRelationshipsCommunitySection.fields.belonging.displayModes.summaryRow,
    personalRelationshipsCommunitySection.fields.changes.displayModes.summaryRow,
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
          personalRelationshipsCommunitySection.fields.strengthsOrProtectiveFactors.displayModes.field,
          personalRelationshipsCommunitySection.fields.riskOfSeriousHarm.displayModes.field,
          personalRelationshipsCommunitySection.fields.riskOfReoffending.displayModes.field,
          markAsCompleteButton,
        ],
      },
    },
  ],
})
