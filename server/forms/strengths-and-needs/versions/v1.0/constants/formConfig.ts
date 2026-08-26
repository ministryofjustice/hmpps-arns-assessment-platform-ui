import { FormConfig } from '../../../constants/formConfig'
import { formVersion } from './formVersion'
import { accommodationSection } from '../journeys/accommodation/section'
import { alcoholUseSection } from '../journeys/alcohol-use/section'
import { drugUseSection } from '../journeys/drug-use/section'
import { employmentEducationSection } from '../journeys/employment-and-education/section'
import { financeSection } from '../journeys/finance/section'
import { healthWellbeingSection } from '../journeys/health-wellbeing/section'
import { personalRelationshipsCommunitySection } from '../journeys/personal-relationships-and-community/section'
import { thinkingBehavioursAttitudesSection } from '../journeys/thinking-behaviours-and-attitudes/section'
import { offenceAnalysisSection } from '../journeys/offence-analysis/section'

/**
 * Built independently of the journey/effects module graph so it can be
 * imported by code (e.g. UpdateOasysDataMappingHook) without introducing a
 * circular dependency back through the form's effects.
 */
export const v1FormConfig = {
  [formVersion]: new FormConfig(formVersion, [
    accommodationSection,
    alcoholUseSection,
    drugUseSection,
    employmentEducationSection,
    financeSection,
    healthWellbeingSection,
    personalRelationshipsCommunitySection,
    thinkingBehavioursAttitudesSection,
    offenceAnalysisSection,
  ]),
}
