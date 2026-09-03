import { access, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { drugsSummaryAnalysisTab } from './fields'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { analysisPageTitle } from '../../../../locales'
import { Section } from '../../../../constants/section'
import { SanAuditEvent, auditPageView } from '../../../../audit'

export const drugUseAnalysisStep = step({
  path: `/${Step.drug_use_analysis.path}`,
  title: analysisPageTitle(Section.drug_use),
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.deriveDrugCategories()],
    }),
    auditPageView(SanAuditEvent.VIEW_PRACTITIONER_ANALYSIS, Section.drug_use, Step.drug_use_analysis),
  ],
  // TODO: Add template for read-only analysis display
  blocks: [drugsSummaryAnalysisTab],
})
