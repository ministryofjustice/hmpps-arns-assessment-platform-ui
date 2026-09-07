import { Question } from '../constants/question'
import { Locale } from '../../../../../i18n'
import { DrugOption } from '../constants/DrugOption'
import { CommonOption } from '../../../constants/commonOption'

export const english = {
  question: {
    [Question.drug_use]: {
      text: 'Which drugs has %1 misused?',
      option: {
        [DrugOption.amphetamines]: 'Amphetamines',
        [DrugOption.benzodiazepines]: 'Benzodiazepines',
        [DrugOption.cannabis]: 'cannabis',
        [DrugOption.cocaine_hydrochloride]: 'Cocaine hydrochloride',
        [DrugOption.crack_or_cocaine]: 'Crack or cocaine',
        [DrugOption.ecstasy]: 'Ecstasy (also known as MDMA)',
        [DrugOption.hallucinogens]: 'Hallucinogens',
        [DrugOption.heroin]: 'Heroin',
        [DrugOption.ketamine]: 'Ketamine',
        [DrugOption.methadone]: 'Methadone (not prescribed)',
        [DrugOption.misused_prescribed_drugs]: 'Misused prescribed drugs',
        [DrugOption.other_opiates]: 'Other opiates',
        [DrugOption.solvents]: 'Solvents (including gases and glues)',
        [DrugOption.spice]: 'Spice',
        [DrugOption.steroids]: 'Steroids',
        [DrugOption.other_drugs]: 'Other',
      },
    },
    [Question.motivation_to_tackle_drug_misuse]: {
      text: 'Does %1 seem motivated to stop or reduce their drug use?',
      option: {
        [CommonOption.no_motivation]: 'Does not show motivation to stop or reduce',
        [CommonOption.partial_motivation]: 'Shows some motivation to stop or reduce',
        [CommonOption.full_motivation]: 'Motivated to stop or reduce',
      },
    },
    [Question.other_drug_name]: {
      text: 'other drug name',
      char_count_validation: 'Must be 200 characters or less',
    },
    [Question.drug_radio]: {
      code: '1%_RADIO',
      text: '1% radio',
      option: {
        [CommonOption.yes]: 'Used in the last 6 months',
        [CommonOption.no]: 'Used more than 6 months ago',
      },
    },
  },
} as const

export type DrugUseLocale = Locale<typeof english>
