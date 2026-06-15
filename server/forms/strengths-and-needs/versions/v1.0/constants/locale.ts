import { Section } from './section';

export const commonLocale = {
  strengths_and_needs: 'Strengths and needs',
  optional_details: 'Give details (optional)',
  required_details: 'Give details',
  select_one_option: 'Select one option',
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
    [Section.finances.code]: 'Finances',
    [Section.health_and_wellbeing.code]: 'Health and wellbeing',
  }
}
