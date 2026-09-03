import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { alcoholPractitionerAnalysisSummaryTab } from './fields'
import { analysisPageTitle } from '../../../../locales'
import { Section } from '../../../../constants/section'
import { SanAuditEvent, auditPageView } from '../../../../audit'
import { isReadOnlyMode } from '../../../../guards'

export const alcoholUseAnalysisStep = step({
  path: `/${Step.alcohol_use_analysis.path}`,
  title: analysisPageTitle(Section.alcohol_use),
  blocks: [alcoholPractitionerAnalysisSummaryTab],
  reachability: { entryWhen: isReadOnlyMode },
  onAccess: [auditPageView(SanAuditEvent.VIEW_PRACTITIONER_ANALYSIS, Section.alcohol_use, Step.alcohol_use_analysis)],
})
