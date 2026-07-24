import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { personalRelationshipsCommunityPractitionerAnalysisSummaryTab } from './fields'
import { contentFor } from '../../locales'

export const personalRelationshipsCommunityAnalysisStep = step({
  path: `/${Step.personal_relationships_community_analysis.path}`,
  title: contentFor('step.personal_relationships_community_analysis'),
  blocks: [personalRelationshipsCommunityPractitionerAnalysisSummaryTab],
})
