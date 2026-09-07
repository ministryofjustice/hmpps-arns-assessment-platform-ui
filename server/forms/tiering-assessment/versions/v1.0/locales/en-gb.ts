import { Step } from '../constants/page'
import { CommonOption } from '../constants/commonOption'
import { Locale } from '../../../i18n'

export const english = {
  select_all_that_apply: 'Select all that apply.',
  save_and_continue: 'Save and continue',
  or: 'or',
  change: 'Change',
  summary: '',
  all_answers_heading: 'Tiering Assessment',
  stepTitle: {
    [Step.accommodation.code]: 'Accommodation',
    [Step.current_offence_and_offending_history.code]: 'Current offence and offending history',
    [Step.sexual_offending.code]: 'Sexual offending',
    [Step.date_of_current_supervision.code]: 'Date of current supervision',
    [Step.offences_since_community_date.code]: 'Offences since community date',
    [Step.employment.code]: 'Employment and education',
    [Step.check_your_answers.code]: 'Check your answers',
  },
  validation: {
    this_is_a_required_field: 'This is a required field.',
    valid_date: 'Please enter a valid date.',
    number: {
      not_whole_number: 'Must be a whole number.',
      greater_than_zero: 'Must be greater than 0.',
      greater_or_equal_zero: 'Must be greater than or equal to 0.',
    },
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
