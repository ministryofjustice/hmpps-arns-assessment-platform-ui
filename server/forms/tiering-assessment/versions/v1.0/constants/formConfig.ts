import { FormConfig } from '../../../constants/formConfig'
import { accommodationFields } from '../steps/accommodation/fields'
import { currentOffenceAndOffendingHistoryFields } from '../steps/current-offence-and-offending-history/fields'
import { dateOfCurrentSupervisionFields } from '../steps/date-of-current-supervision/fields'
import { offencesSinceSupervisionFields } from '../steps/offences-since-supervision/fields'
import { sexualOffendingFields } from '../steps/sexual-offending/fields'
import { formVersion } from './formVersion'

/**
 * Built independently of the journey/effects module graph so it can be
 * imported by code (e.g. UpdateOasysDataMappingHook) without introducing a
 * circular dependency back through the form's effects.
 */
export const v1FormConfig = {
  [formVersion]: new FormConfig(formVersion, [
    currentOffenceAndOffendingHistoryFields,
    currentOffenceAndOffendingHistoryFields,
    sexualOffendingFields,
    dateOfCurrentSupervisionFields,
    offencesSinceSupervisionFields,
    accommodationFields,
  ]),
}
