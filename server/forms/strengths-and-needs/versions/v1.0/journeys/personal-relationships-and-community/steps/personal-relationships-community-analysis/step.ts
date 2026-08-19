import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { personalRelationshipsCommunityPractitionerAnalysisSummaryTab } from './fields'
import { analysisPageTitle } from '../../../../locales'
import { Section } from '../../../../constants/section'

export const personalRelationshipsCommunityAnalysisStep = step({
  path: `/${Step.personal_relationships_community_analysis.path}`,
  title: analysisPageTitle(Section.personal_relationships_and_community),
  blocks: [personalRelationshipsCommunityPractitionerAnalysisSummaryTab],
  reachability: { entryWhen: true },
})
