import { Data, journey } from '@form-engine/form/builders'
import { currentAccommodationStep } from './steps/current-accommodation/step'
import { settledAccommodationStep } from './steps/settled-accommodation/step'
import { temporaryAccommodationStep } from './steps/temporary-accommodation/step'
import { temporaryAccommodationCasApStep } from './steps/temporary-accommodation-cas-ap/step'
import { noAccommodationStep } from './steps/no-accommodation/step'
import { accommodationSummaryStep } from './steps/accommodation-summary/step'
import { accommodationAnalysisStep } from './steps/accommodation-analysis/step'

/**
 * Accommodation Journey
 *
 * Flow:
 * current-accommodation → (branching based on type)
 *   ├── settled-accommodation        → accommodation-summary
 *   ├── temporary-accommodation      → accommodation-summary
 *   ├── temporary-accommodation-cas-ap → accommodation-summary
 *   └── no-accommodation             → accommodation-summary
 *                                         → accommodation-analysis
 */
export const accommodationJourney = journey({
  code: 'accommodation',
  title: 'Accommodation',
  path: '/accommodation',
  view: {
    locals: {
      sectionTitle: 'Accommodation',
      sectionStatus: Data('sectionStatus.accommodation'),
    },
  },
  steps: [
    currentAccommodationStep,
    settledAccommodationStep,
    temporaryAccommodationStep,
    temporaryAccommodationCasApStep,
    noAccommodationStep,
    accommodationSummaryStep,
    accommodationAnalysisStep,
  ],
})
