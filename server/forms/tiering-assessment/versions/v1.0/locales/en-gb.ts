import { Section } from '../constants/section'
import { CommonOption } from '../constants/commonOption'
import { Locale } from '../../../i18n'

export const english = {
  strengths_and_needs: 'Strengths and needs',
  optional_details: 'Give details (optional)',
  required_details: 'Give details',
  select_one_option: 'Select one option',
  select_one_or_both: 'Select one or both.',
  select_all_that_apply: 'Select all that apply.',
  select_all_that_apply_optional: 'Select all that apply (optional).',
  save_and_continue: 'Save and continue',
  mark_as_complete: 'Mark as complete',
  or: 'or',
  change: 'Change',
  summary: 'Summary',
  all_answers_heading: '%1 strengths and needs',
  sectionTitle: {
    [Section.accommodation.code]: 'Accommodation',
  },
  // Page titles derive from sectionTitle above, so a section is named in one place.
  pageTitle: {
    check_your_answers: 'View all answers',
  },
  validation: {
    enter_details: 'Enter details',
    select_at_least_one_option: 'Select at least one option',
    select_changes: 'Select if they want to make changes to their %1',
    must_answer: '%1 must answer this question.',
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
