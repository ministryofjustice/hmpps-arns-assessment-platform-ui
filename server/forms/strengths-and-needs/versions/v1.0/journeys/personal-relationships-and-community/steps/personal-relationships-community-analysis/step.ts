import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { personalRelationshipsCommunityPractitionerAnalysisSummaryTab } from './fields'
import { analysisPageTitle } from '../../../../locales'
import { Section } from '../../../../constants/section'
import { SanAuditEvent, auditPageView } from '../../../../audit'
import { isReadOnlyMode } from '../../../../guards'

export const personalRelationshipsCommunityAnalysisStep = step({
  path: `/${Step.personal_relationships_community_analysis.path}`,
  title: analysisPageTitle(Section.personal_relationships_and_community),
  blocks: [personalRelationshipsCommunityPractitionerAnalysisSummaryTab],
  reachability: { entryWhen: isReadOnlyMode },
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_PRACTITIONER_ANALYSIS,
      Section.personal_relationships_and_community,
      Step.personal_relationships_community_analysis,
    ),
  ],
})
