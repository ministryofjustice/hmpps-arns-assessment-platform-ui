import { and, Condition, journey, Query } from '@ministryofjustice/hmpps-forge/core/authoring'
import { drugUseStatusStep } from './steps/drug-use-status/step'
import { drugUseTypesStep } from './steps/drug-use-types/step'
import { drugUseLastUsedStep } from './steps/drug-use-last-used/step'
import { drugUseDetailsStep } from './steps/drug-use-details/step'
import { drugUseLastInjectedStep } from './steps/drug-use-last-injected/step'
import { drugUseReduceUseStep } from './steps/drug-use-reduce-use/step'
import { drugUseChangeUseStep } from './steps/drug-use-change-use/step'
import { drugUseSummaryStep } from './steps/drug-use-summary/step'
import { drugUseAnalysisStep } from './steps/drug-use-analysis/step'
import { Section } from '../../constants/section'
import { sectionPageTitle, sectionStatusTag } from '../../locales'
import { isEditMode, redirectToAnalysisIfReadOnly } from '../../guards'
import { Step } from './constants/step'

/**
 * Drug Use Journey
 *
 * Flow:
 * drug-use-status → (YES) → drug-use-types → drug-use-last-used → drug-use-details (Has injected for drug used in last 6 months) → drug-use-last-injected → drug-use-reduce-use → drug-use-change-use → drug-use-summary
 * drug-use-status → (YES) → drug-use-types → drug-use-last-used → drug-use-details (Has NOT injected for drug used in last 6 months) → drug-use-reduce-use → drug-use-change-use → drug-use-summary
 * drug-use-status → (NO)  → drug-use-summary
 * drug-use-summary → drug-use-analysis
 */
export const drugUseJourney = journey({
  code: Section.drug_use.code,
  title: sectionPageTitle(Section.drug_use),
  path: Section.drug_use.path,
  reachability: { resumeWhen: and(Query('resume').match(Condition.Equals('true')), isEditMode) },
  onAccess: [redirectToAnalysisIfReadOnly(Section.drug_use.path, Step.drug_use_analysis.path)],
  view: {
    locals: {
      sectionTitle: sectionPageTitle(Section.drug_use),
      sectionStatusTag: sectionStatusTag(Section.drug_use),
    },
  },
  steps: [
    drugUseStatusStep,
    drugUseTypesStep,
    drugUseLastUsedStep,
    drugUseDetailsStep,
    drugUseLastInjectedStep,
    drugUseReduceUseStep,
    drugUseChangeUseStep,
    drugUseSummaryStep,
    drugUseAnalysisStep,
  ],
})
