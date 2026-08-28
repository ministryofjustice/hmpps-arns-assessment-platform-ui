import { FormConfig } from '../../../constants/formConfig'
import { accommodationSection } from '../steps/accommodation/section'
import { currentOffenceAndOffendingHistorySection } from '../steps/current-offence-and-offending-history/section'
import { formVersion } from './formVersion'

/**
 * Built independently of the journey/effects module graph so it can be
 * imported by code (e.g. UpdateOasysDataMappingHook) without introducing a
 * circular dependency back through the form's effects.
 */
export const v1FormConfig = {
  [formVersion]: new FormConfig(formVersion, [currentOffenceAndOffendingHistorySection, accommodationSection]),
}
