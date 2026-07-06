import {Condition, Data, journey, Query} from '@ministryofjustice/hmpps-forge/core/authoring'
import {currentAccommodationStep} from './steps/current-accommodation/step'
import {accommodationSummaryStep} from './steps/accommodation-summary/step'
import {accommodationAnalysisStep} from './steps/accommodation-analysis/step'
import {Section} from '../../constants/section'
import {commonContentFor} from '../../locales'
import {accommodationDetailsStep} from "./steps/accommodation-details/step";

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
  reachability: { resumeWhen: Query('resume').match(Condition.Equals('true')) },
  view: {
    locals: {
      sectionTitle: commonContentFor('sectionTitle.accommodation'),
      sectionStatus: Data(Section.accommodation.statusKey),
    },
  },
  steps: [
    currentAccommodationStep,
    accommodationDetailsStep,
    accommodationSummaryStep,
    accommodationAnalysisStep,
  ],
})
