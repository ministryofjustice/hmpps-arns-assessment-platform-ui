import { Locale } from '../../../../../i18n'
import { Question } from '../constants/question'
import { Option } from '../constants/option'

export const english = {
  question: {
    [Question.drug_use]: {
      text: 'Has %1 ever misused drugs?',
      hint: 'This includes illegal and prescription drugs.',
      validation: 'Select if they’ve ever misused drugs',
    },
    [Question.drug_last_used]: {
      text: 'When did they last use %1?',
      option: {
        [Option.last_six]: 'Used in the last 6 months',
        [Option.more_than_six]: 'Used more than 6 months ago',
      },
      validation: 'Select when they last used this drug',
    },
    [Question.other_drug_name]: {
      text: 'Enter which other drug they’ve misused',
      hint: 'Add drug name',
      option: {
        [Option.last_six]: 'Used in the last 6 months',
        [Option.more_than_six]: 'Used more than 6 months ago',
      },
      validation: 'Drug name must be %1 characters or less',
    },
    [Question.select_misused_drugs]: {
      text: 'Which drugs has %1 misused?',
      hint: 'Select all that apply.',
      option: {
        [Option.last_six]: 'Used in the last 6 months',
        [Option.more_than_six]: 'Used more than 6 months ago',
      },
      validation: 'Select which drugs they’ve misused',
    },
    [Question.how_often_used]: {
      text: 'How often was %1 using this drug?',
      summaryText: 'How to record frequency',
      summaryHtml:
        '<p class="govuk-body"><strong>Daily:</strong> uses every day or most days.</p>' +
        '<p class="govuk-body"><strong>Weekly:</strong> uses once or more a week but not daily (for example, every Friday and Saturday night).</p>' +
        '<p class="govuk-body"><strong>Monthly:</strong> uses once or more a month but not every week.</p>' +
        '<p class="govuk-body govuk-!-margin-bottom-0"><strong>Occasionally:</strong> uses less than once a month.</p>',
      option: {
        [Option.daily]: 'Daily',
        [Option.weekly]: 'Weekly',
        [Option.monthly]: 'Monthly',
        [Option.occasionally]: 'Occasionally',
      },
      validation: 'Select how often they’re using this drug',
    },
    [Question.drugs_injected]: {
      text: 'Which drugs has %1 injected?',
      hint: 'Select all that apply.',
      validation: "Select which drugs they’ve injected, or select 'None'",
    },
    [Question.drugs_injected_months]: {
      code: 'drugs_injected_%1',
      hint: 'Select one or both.',
      validation: 'Select when they injected this drug',
    },
    [Question.drugs_anything_helped_stop_or_reduce_use]: {
      text: 'Has anything helped %1 stop or reduce their drug use?',
      hint: 'Note any treatment or lifestyle changes that have helped them.',
    },
    [Question.drugs_anything_helped_stop_or_reduce_use_details]: {
      validation: "Enter details on what has/hasn't helped stop or reduce their drug use",
    },
    [Question.drugs_motivated_to_stop_or_reduce_use]: {
      text: 'Does %1 seem motivated to stop or reduce their drug use?',
      option: {
        [Option.no_motivation]: 'Does not show motivation to stop or reduce',
        [Option.partial_motivation]: 'Shows some motivation to stop or reduce',
        [Option.full_motivation]: 'Motivated to stop or reduce',
      },
      validation: 'Select if they seem motivated to stop or reduce their drug use',
    },
    [Question.drug_use_changes]: {
      text: 'Does %1 want to make changes to their drug use?',
      hint: '%1 must answer this question.',
      validation: 'Select if they want to make changes to their drug use',
    },
    [Question.drugs_practitioner_analysis_motivated_to_stop]: {
      text: 'Does %1 seem motivated to stop or reduce their drug use?',
      option: {
        [Option.no_motivation]: 'Does not show motivation to stop or reduce',
        [Option.partial_motivation]: 'Shows some motivation to stop or reduce',
        [Option.full_motivation]: 'Motivated to stop or reduce',
      },
      validation: 'Select if they seem motivated to stop or reduce their drug use',
    },
    [Question.drug_use_practitioner_analysis_strengths_or_protective_factors]: {
      text: 'Are there any strengths or protective factors related to %1 drug use?',
      hint: 'Include any strategies, people or support networks that helped.',
      validation: 'Select if there are any strengths or protective factors',
    },
    [Question.drug_use_practitioner_analysis_strengths_or_protective_factors_yes_details]: {
      validation: 'Give details on strengths or protective factors related to their drug use',
    },
    [Question.drug_use_practitioner_analysis_risk_of_serious_harm]: {
      text: 'Is %1 drug use linked to risk of serious harm?',
      validation: 'Select if linked to risk of serious harm',
    },
    [Question.drug_use_practitioner_analysis_risk_of_serious_harm_yes_details]: {
      validation: 'Give details on the risk of serious harm',
    },
    [Question.drug_use_practitioner_analysis_risk_of_reoffending]: {
      text: 'Is %1 drug use linked to risk of reoffending?',
      validation: 'Select if linked to risk of reoffending',
    },
    [Question.drug_use_practitioner_analysis_risk_of_reoffending_yes_details]: {
      validation: 'Give details on the risk of reoffending',
    },
  },
  text: {
    lastUsed: { text: 'Last used' },
    howOften: { text: 'How often' },
    howOftenDetails: { text: 'Details' },
    injected: { text: 'Injected' },
    lastInjected: { text: 'Last injected' },
    more_information: 'More information',
  },
  option: {
    [Option.amphetamines]: 'Amphetamines (including speed, methamphetamine)',
    [Option.benzodiazepines]: 'Benzodiazepines (including diazepam, temazepam)',
    [Option.cannabis]: 'Cannabis',
    [Option.cocaine]: 'Cocaine',
    [Option.crack]: 'Crack cocaine',
    [Option.ecstasy]: 'Ecstasy (MDMA)',
    [Option.hallucinogenics]: 'Hallucinogens',
    [Option.heroin]: 'Heroin',
    [Option.methadone_not_prescribed]: 'Methadone (not prescribed)',
    [Option.misused_prescribed_drugs]: 'Prescribed drugs',
    [Option.other_opiates]: 'Other opiates',
    [Option.solvents]: 'Solvents (including gases and glues)',
    [Option.steroids]: 'Steroids',
    [Option.spice]: 'Synthetic cannabinoids (spice)',
    [Option.last_six]: 'Used in the last 6 months',
    [Option.in_the_last_six]: 'In the last 6 months',
    [Option.more_than_six]: 'More than 6 months ago',
    [Option.used_more_than_six]: 'Used more than 6 months ago',
  },
  heading: {
    when_did_last_use_these_drugs: 'When did %1 last use these drugs?',
    when_has_injected_drugs: 'When has %1 injected drugs?',
    not_used_in_last_six_months: 'Not used in the last 6 months',
    used_more_than_six_months_ago: 'Used more than 6 months ago',
  },
  inset: {
    used_more_than_six_months_ago: '%1 used %2 more than 6 months ago.',
  },
} as const

export type DrugUseLocale = Locale<typeof english>
