import { Locale } from '../../../../../i18n'
import { Question } from '../constants/question'
import { Step } from '../constants/step'
import { Option } from '../constants/option'

export const english = {
  step: {
    [Step.drug_use.code]: 'Drug use',
    [Step.drug_use_summary.code]: 'Drug use summary',
    [Step.accommodation_analysis.code]: 'Accommodation analysis',
  },
  question: {
    [Question.drug_use]: {
      text: 'Has %1 ever misused drugs?',
      hint: 'This includes illegal and prescription drugs.',
      validation: "Select if they've ever misused drugs",
    },
    [Question.drug_last_used]: {
      text: 'When did they last use %1?',
      hint: 'This includes illegal and prescription drugs.',
      option: {
        [Option.last_six]: 'Used in the last 6 months',
        [Option.more_than_six]: 'Used more than 6 months ago',
      },
      validation: 'Select when they last used this drug',
    },
    [Question.other_drug_name]: {
      text: "Enter which other drug they've misused",
      hint: 'Add drug name',
      option: {
        [Option.last_six]: 'Used in the last 6 months',
        [Option.more_than_six]: 'Used more than 6 months ago',
      },
      validation: 'Drug name must be 200 characters or less',
    },
    [Question.select_misused_drugs]: {
      text: 'Which drugs has %1 misused?',
      hint: 'Select all that apply.',
      option: {
        [Option.last_six]: 'Used in the last 6 months',
        [Option.more_than_six]: 'Used more than 6 months ago',
      },
      validation: "Select which drugs they've misused",
    },
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
  },
  expected_end_date: 'Expected end date:',
  not_provided: 'Not provided',
} as const

export type AccommodationLocale = Locale<typeof english>
