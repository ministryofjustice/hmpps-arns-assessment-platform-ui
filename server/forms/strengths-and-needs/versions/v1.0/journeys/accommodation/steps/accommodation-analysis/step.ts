import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { accommodationPractitionerAnalysisSummaryTab } from './fields'
import { analysisPageTitle } from '../../../../locales'
import { Section } from '../../../../constants/section'
import { SanAuditEvent, auditPageView } from '../../../../audit'

export const accommodationAnalysisStep = step({
  path: `/${Step.accommodation_analysis.path}`,
  title: analysisPageTitle(Section.accommodation),
  blocks: [accommodationPractitionerAnalysisSummaryTab],
  onAccess: [
    auditPageView(SanAuditEvent.VIEW_PRACTITIONER_ANALYSIS, Section.accommodation, Step.accommodation_analysis),
  ],
})
