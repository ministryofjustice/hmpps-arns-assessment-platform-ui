import { and, Condition, journey, Query } from '@ministryofjustice/hmpps-forge/core/authoring'
import { financeStep } from './steps/finance/step'
import { financeSummaryStep } from './steps/finance-summary/step'
import { financeAnalysisStep } from './steps/finance-analysis/step'
import { Section } from '../../constants/section'
import { sectionPageTitle, sectionStatusTag } from '../../locales'
import { isEditMode, redirectToAnalysisIfReadOnly } from '../../guards'
import { Step } from './constants/step'

/**
 * Finance Journey
 *
 * Flow:
 * finance → (branching based on type)
 *   ├── finance            → finance
 *   ├── finance-summary    → finance-analysis
 *   ├── finance-analysis   →
 */
export const financeJourney = journey({
  code: Section.finance.code,
  path: Section.finance.path,
  title: sectionPageTitle(Section.finance),
  reachability: { resumeWhen: and(Query('resume').match(Condition.Equals('true')), isEditMode) },
  onAccess: [redirectToAnalysisIfReadOnly(Section.finance.path, Step.financeAnalysis.path)],
  view: {
    locals: {
      sectionTitle: sectionPageTitle(Section.finance),
      sectionStatusTag: sectionStatusTag(Section.finance),
    },
  },
  steps: [financeStep, financeSummaryStep, financeAnalysisStep],
})
