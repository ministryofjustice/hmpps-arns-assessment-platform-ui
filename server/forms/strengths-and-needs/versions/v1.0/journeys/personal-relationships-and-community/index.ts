import { and, Condition, journey, Query } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Section } from '../../constants/section'
import { sectionPageTitle, sectionStatusTag } from '../../locales'
import { personalRelationshipsChildrenInformationStep } from './steps/personal-relationships-children-information/step'
import { personalRelationshipsStep } from './steps/personal-relationships/step'
import { personalRelationshipsCommunityStep } from './steps/personal-relationships-community/step'
import { personalRelationshipsCommunitySummaryStep } from './steps/personal-relationships-community-summary/step'
import { personalRelationshipsCommunityAnalysisStep } from './steps/personal-relationships-community-analysis/step'
import { isEditMode, redirectToAnalysisIfReadOnly } from '../../guards'
import { Step } from './constants/step'

// Personal relationships and community journey
// Flow:
// 1. personal_relationships_children_information >
// 2. personal_relationships >
// 3. personal-relationships-community >
// 4. personal-relationships-community-summary >
// 5. personal-relationships-community-analysis

export const personalRelationshipsJourney = journey({
  code: Section.personal_relationships_and_community.code,
  title: sectionPageTitle(Section.personal_relationships_and_community),
  path: Section.personal_relationships_and_community.path,
  reachability: { resumeWhen: and(Query('resume').match(Condition.Equals('true')), isEditMode) },
  onAccess: [
    redirectToAnalysisIfReadOnly(
      Section.personal_relationships_and_community.path,
      Step.personal_relationships_community_analysis.path,
    ),
  ],
  view: {
    locals: {
      sectionTitle: sectionPageTitle(Section.personal_relationships_and_community),
      sectionStatusTag: sectionStatusTag(Section.personal_relationships_and_community),
    },
  },
  steps: [
    personalRelationshipsChildrenInformationStep,
    personalRelationshipsStep,
    personalRelationshipsCommunityStep,
    personalRelationshipsCommunitySummaryStep,
    personalRelationshipsCommunityAnalysisStep,
  ],
})
