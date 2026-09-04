import { access, and, Condition, journey, Query } from '@ministryofjustice/hmpps-forge/core/authoring'
import { currentAccommodationStep } from './steps/current-accommodation/step'
import { accommodationSummaryStep } from './steps/accommodation-summary/step'
import { accommodationAnalysisStep } from './steps/accommodation-analysis/step'
import { Section } from '../../constants/section'
import { sectionPageTitle, sectionStatusTag } from '../../locales'
import { accommodationDetailsStep } from './steps/accommodation-details/step'
import { StrengthsAndNeedsEffects } from '../../../../effects'
import { isEditMode, redirectToAnalysisIfReadOnly } from '../../guards'
import { Step } from './constants/step'

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
  title: sectionPageTitle(Section.accommodation),
  path: Section.accommodation.path,
  reachability: { resumeWhen: and(Query('resume').match(Condition.Equals('true')), isEditMode) },
  onAccess: [
    redirectToAnalysisIfReadOnly(Section.accommodation.path, Step.accommodation_analysis.path),
    access({
      effects: [StrengthsAndNeedsEffects.setRiskOfSexualHarm()],
    }),
  ],
  view: {
    locals: {
      sectionTitle: sectionPageTitle(Section.accommodation),
      sectionStatusTag: sectionStatusTag(Section.accommodation),
    },
  },
  steps: [currentAccommodationStep, accommodationDetailsStep, accommodationSummaryStep, accommodationAnalysisStep],
})
