import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { employmentStatusAnalysisSummaryTab } from './fields'
import { Step } from '../../constants/step'
import { analysisPageTitle } from '../../../../locales'
import { Section } from '../../../../constants/section'
import { SanAuditEvent, auditPageView } from '../../../../audit'

export const employmentEducationAnalysisStep = step({
  path: `/${Step.employment_education_analysis.path}`,
  title: analysisPageTitle(Section.employment_and_education),
  blocks: [employmentStatusAnalysisSummaryTab],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_PRACTITIONER_ANALYSIS,
      Section.employment_and_education,
      Step.employment_education_analysis,
    ),
  ],
})
