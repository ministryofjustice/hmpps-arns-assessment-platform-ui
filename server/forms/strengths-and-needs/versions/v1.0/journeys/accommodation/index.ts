import { Data, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { currentAccommodationStep } from './steps/current-accommodation/step'
import { settledAccommodationStep } from './steps/settled-accommodation/step'
import { temporaryAccommodationStep } from './steps/temporary-accommodation/step'
import { temporaryAccommodationCasApStep } from './steps/temporary-accommodation-cas-ap/step'
import { noAccommodationStep } from './steps/no-accommodation/step'
import { accommodationSummaryStep } from './steps/accommodation-summary/step'
import { accommodationAnalysisStep } from './steps/accommodation-analysis/step'
import { Section } from '../../constants/section'
import { commonContentFor } from '../../locales'

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
  code: Section.accommodation.code,
  title: 'Accommodation', // TODO: commonContentFor('sectionTitle.accommodation')
  path: Section.accommodation.path,
  view: {
    locals: {
      sectionTitle: commonContentFor('sectionTitle.accommodation'),
      sectionStatus: Data(Section.accommodation.statusKey),
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
