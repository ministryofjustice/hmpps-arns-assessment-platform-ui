import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { MOJBanner } from '@ministryofjustice/hmpps-forge/moj-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { personalRelationshipsCommunitySection } from '../../section'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { commonContentFor } from '../../../../locales'
import { questionsOf } from '../../../../steps/view-all-answers/sections'
import { answersFor, anyAnswered } from '../../../../steps/view-all-answers/fields'
import { Section } from '../../../../constants/section'

export const questions = questionsOf({
  section: Section.personal_relationships_and_community,
  config: personalRelationshipsCommunitySection,
})

export const summary = GovUKSummaryList({
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

export const summaryPanel = [
  MOJBanner({
    bannerType: 'information',
    text: 'This section has not been started',
    visibleWhen: not(anyAnswered(questions)),
  }),
  HtmlBlock({
    content: [
      answersFor(questions),
      goToPractitionerAnalysisButton(Step.personal_relationships_community_summary.path),
    ],
    visibleWhen: anyAnswered(questions),
  }),
]

export const personalRelationshipsCommunitySummaryTab = GovUKTabs({
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
