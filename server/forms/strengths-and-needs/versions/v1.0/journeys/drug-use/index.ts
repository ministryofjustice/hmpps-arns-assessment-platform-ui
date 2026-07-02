import { Data, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { drugUseStep } from './steps/drug-use/step'
import { addDrugsStep } from './steps/add-drugs/step'
import { drugDetailsStep } from './steps/drug-details/step'
import { drugUseHistoryStep } from './steps/drug-use-history/step'
import { drugUseHistoryMoreThanSixMonthsStep } from './steps/drug-use-history-more-than-six-months/step'
import { drugUseSummaryStep } from './steps/drug-use-summary/step'
import { drugUseAnalysisStep } from './steps/drug-use-analysis/step'

/**
 * Drug Use Journey
 *
 * Flow:
 * drug-use → (YES) → add-drugs → (branching based on injectable + recency)
 *   ├── drug-details                              → drug-use-history
 *   ├── drug-details-injected                     → drug-use-history
 *   ├── drug-details-more-than-six-months         → drug-use-history-more-than-six-months
 *   └── drug-details-more-than-six-months-injected → drug-use-history-more-than-six-months
 *                                                        → drug-use-summary
 * drug-use → (NO) → drug-use-summary → drug-use-analysis
 */
export const drugUseJourney = journey({
  code: 'drug-use',
  title: 'Drug use',
  path: '/drug-use',
  view: {
    locals: {
      sectionTitle: 'Drug use',
      sectionStatus: Data('sectionStatus.drug-use'),
    },
  },
  steps: [
    drugUseStep,
    addDrugsStep,
    drugDetailsStep,
    drugUseHistoryStep,
    drugUseHistoryMoreThanSixMonthsStep,
    drugUseSummaryStep,
    drugUseAnalysisStep,
  ],
})
