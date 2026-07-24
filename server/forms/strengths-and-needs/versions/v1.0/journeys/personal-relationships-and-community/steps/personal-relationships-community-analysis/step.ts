import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { personalRelationshipsCommunityPractitionerAnalysisSummaryTab } from './fields'

export const personalRelationshipsCommunityAnalysisStep = step({
  path: `/${Step.personal_relationships_community_analysis.path}`,
  title: 'Personal Relationships and Community analysis',
  blocks: [personalRelationshipsCommunityPractitionerAnalysisSummaryTab],
})
