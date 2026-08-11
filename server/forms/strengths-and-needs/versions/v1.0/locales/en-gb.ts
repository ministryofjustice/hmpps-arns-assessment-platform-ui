import { Section, SectionComplete } from '../constants/section'
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
  go_to_practitioner_analysis: 'Go to practitioner analysis',
  summary: 'Summary',
  practitioner_analysis: 'Practitioner analysis',
  sectionTitle: {
    [Section.accommodation.code]: 'Accommodation',
    [Section.offence_analysis.code]: 'Offence analysis',
    [Section.thinking_behaviours_and_attitudes.code]: 'Thinking, behaviours and attitudes',
    [Section.personal_relationships_and_community.code]: 'Personal relationships and community',
    [Section.alcohol_use.code]: 'Alcohol use',
    [Section.drug_use.code]: 'Drug use',
    [Section.employment_and_education.code]: 'Employment and education',
    [Section.finance.code]: 'Finances',
    [Section.health_and_wellbeing.code]: 'Health and wellbeing',
  },
  sectionComplete: {
    [SectionComplete.yes]: 'Complete',
    [SectionComplete.no]: 'Incomplete',
  },
  // Page titles derive from sectionTitle above, so a section is named in one place.
  pageTitle: {
    summary: '%1 summary',
    analysis: '%1 analysis',
    privacy: 'Close other applications',
  },
  validation: {
    details_must_be_less_than: 'Details must be %1 characters or less',
    valid_date: 'Enter a valid date',
    valid_date_day: 'Date must include a day',
    valid_date_month: 'Date must include a month',
    valid_date_year: 'Date must include a year',
    future_date: 'The date must be in the future',
    enter_details: 'Enter details',
    select_at_least_one_option: 'Select at least one option',
    select_changes: 'Select if they want to make changes to their %1',
    must_answer: '%1 must answer this question.',
  },
  option: {
    [CommonOption.made_changes]: 'I have already made positive changes and want to maintain them',
    [CommonOption.making_changes]: 'I am actively making changes',
    [CommonOption.want_to_make_changes]: 'I want to make changes and know how to',
    [CommonOption.needs_help_to_make_changes]: 'I want to make changes but need help',
    [CommonOption.thinking_about_making_changes]: 'I am thinking about making changes',
    [CommonOption.does_not_want_to_make_changes]: 'I do not want to make changes',
    [CommonOption.does_not_want_to_answer]: 'I do not want to answer',
    [CommonOption.not_present]: '%1 is not present',
    [CommonOption.not_applicable]: 'Not applicable',
    [CommonOption.yes]: 'Yes',
    [CommonOption.no]: 'No',
    [CommonOption.none_of_these]: 'None of these',
    [CommonOption.other]: 'Other',
    [CommonOption.unknown]: 'Unknown',
    [CommonOption.none]: 'None',
  },
} as const

export type CommonLocale = Locale<typeof english>
