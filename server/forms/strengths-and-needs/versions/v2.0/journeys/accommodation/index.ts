import { access, and, Condition, journey, Query } from '@ministryofjustice/hmpps-forge/core/authoring'
import { accommodationSummaryStep } from './steps/accommodation-summary/step'
import { accommodationAnalysisStep } from './steps/accommodation-analysis/step'
import { Section } from '../../constants/section'
import { sectionPageTitle, sectionStatusTag } from '../../locales'
import { StrengthsAndNeedsEffects } from '../../../../effects'
import { isEditMode, redirectToAnalysisIfReadOnly } from '../../guards'
import { Step } from './constants/step'
import { accommodationSettledStep } from './steps/accommodation-community-accommodation-settled/step'
import { suitableHousingLocationStep } from './steps/accommodation-community-suitable-housing-location/step'
import { suitableHousingStep } from './steps/accommodation-community-suitable-housing/step'
import { suitableHousingLocationConcernsStep } from './steps/accommodation-community-suitable-housing-location-concerns/step'
import { suitableHousingConcernsStep } from './steps/accommodation-community-suitable-housing-concerns/step'
import { noAccommodationStep } from './steps/accommodation-community-no-accommodation/step'
import { currentAccommodationStep } from './steps/accommodation-community-current-accommodation/step'
import { accommodationChangesStep } from './steps/accommodation-changes/step'

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
  steps: [
    currentAccommodationStep,
    accommodationSettledStep,
    suitableHousingLocationStep,
    suitableHousingLocationConcernsStep,
    suitableHousingStep,
    suitableHousingConcernsStep,
    noAccommodationStep,
    accommodationChangesStep,
    accommodationSummaryStep,
    accommodationAnalysisStep,
  ],
})
