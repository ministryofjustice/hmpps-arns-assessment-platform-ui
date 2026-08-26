import { Section } from '../constants/section'
import { CommonOption } from '../constants/commonOption'
import { Locale } from '../../../i18n'

export const english = {
  select_all_that_apply: 'Select all that apply.',
  save_and_continue: 'Save and continue',
  or: 'or',
  change: 'Change',
  summary: 'Summary',
  all_answers_heading: 'Tiering Assessment',
  sectionTitle: {
    [Section.accommodation.code]: 'Accommodation',
  },
  // Page titles derive from sectionTitle above, so a section is named in one place.
  pageTitle: {
    check_your_answers: 'Check your answers',
  },
  validation: {
    this_is_a_required_field: 'This is a required field'
  },
  option: {
    [CommonOption.yes]: 'Yes',
    [CommonOption.no]: 'No',
    [CommonOption.none_of_these]: 'None of these',
    [CommonOption.other]: 'Other',
    [CommonOption.unknown]: 'Unknown',
    [CommonOption.none]: 'None',
  },
} as const

export type CommonLocale = Locale<typeof english>
