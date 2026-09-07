import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { financePractitionerAnalysisSummaryTab } from './fields'
import { Step } from '../../constants/step'
import { analysisPageTitle } from '../../../../locales'
import { Section } from '../../../../constants/section'
import { SanAuditEvent, auditPageView } from '../../../../audit'
import { isReadOnlyMode } from '../../../../guards'

export const financeAnalysisStep = step({
  path: `/${Step.financeAnalysis.path}`,
  title: analysisPageTitle(Section.finance),
  blocks: [financePractitionerAnalysisSummaryTab],
  reachability: { entryWhen: isReadOnlyMode },
  onAccess: [auditPageView(SanAuditEvent.VIEW_PRACTITIONER_ANALYSIS, Section.finance, Step.financeAnalysis)],
})
