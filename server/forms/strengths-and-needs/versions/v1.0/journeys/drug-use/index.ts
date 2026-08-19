import { Condition, journey, Query } from '@ministryofjustice/hmpps-forge/core/authoring'
import { drugUseStep } from './steps/drug-use/step'
import { addDrugsStep } from './steps/add-drugs/step'
import { drugDetailsStep } from './steps/drug-details/step'
import { drugUseHistoryStep } from './steps/drug-use-history/step'
import { drugUseSummaryStep } from './steps/drug-use-summary/step'
import { drugUseAnalysisStep } from './steps/drug-use-analysis/step'
import { Section } from '../../constants/section'
import { sectionPageTitle, sectionStatusTag } from '../../locales'

/**
 * Drug Use Journey
 *
 * Flow:
 * drug-use → (YES) → add-drugs → (branching based on injectable + recency)
 *   ├── drug-details                              → drug-use-history
 *   ├── drug-details-injected                     → drug-use-history
 *   ├── drug-details-more-than-six-months         → drug-use-history-more-than-six-months
 *                                                        → drug-use-summary
 * drug-use → (NO) → drug-use-summary → drug-use-analysis
 */
export const drugUseJourney = journey({
  code: Section.drug_use.code,
  title: sectionPageTitle(Section.drug_use),
  path: Section.drug_use.path,
  reachability: { resumeWhen: Query('resume').match(Condition.Equals('true')) },
  view: {
    locals: {
      sectionTitle: sectionPageTitle(Section.drug_use),
      sectionStatusTag: sectionStatusTag(Section.drug_use),
    },
  },
  steps: [drugUseStep, addDrugsStep, drugDetailsStep, drugUseHistoryStep, drugUseSummaryStep, drugUseAnalysisStep],
})
