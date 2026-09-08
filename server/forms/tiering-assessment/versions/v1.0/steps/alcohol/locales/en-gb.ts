import { Question } from '../constants/question'
import { AlcoholUnitsOption, FrequencyOption } from '../constants/option'
import { Locale } from '../../../../../i18n'
import { CommonOption } from '../../../constants/commonOption'

export const english = {
  question: {
    [Question.current_alcohol_use]: {
      text: 'How often has %1 drank alcohol in the last 3 months?',
      option: {
        [FrequencyOption.ONCE_A_MONTH]: 'Once a month or less',
        [FrequencyOption.TWO_TO_FOUR_TIMES_A_MONTH]: '2 to 4 times a month',
        [FrequencyOption.TWO_TO_THREE_TIMES_A_WEEK]: '2 to 3 times a week',
        [FrequencyOption.MORE_THAN_FOUR_TIME_A_WEEK]: 'More than 4 times a week',
      },
    },
    [Question.units_of_alcohol]: {
      text: 'How many units of alcohol does %1 have on a typical day of drinking?',
      option: {
        [AlcoholUnitsOption.ONE_TO_TWO_UNITS]: '1 to 2 units',
        [AlcoholUnitsOption.THREE_TO_FOUR_UNITS]: '3 to 4 units',
        [AlcoholUnitsOption.FIVE_TO_SIX_UNITS]: '5 to 6 units',
        [AlcoholUnitsOption.SEVEN_TO_NINE_UNITS]: '7 to 9 units',
        [AlcoholUnitsOption.TEN_OR_MORE_UNITS]: '10 or more units',
      },
    },
    [Question.alcohol_use_binge_drinking]: {
      text: 'Has %1 shown evidence of binge drinking or excessive alcohol use in the last 6 months?',
      option: {
        [CommonOption.no_problems]: {
          text: 'No evidence of binge drinking or excessive alcohol use',
          hint: '',
        },
        [CommonOption.some_problems]: {
          text: 'Some evidence of binge drinking or excessive alcohol use',
          hint: 'There is a pattern of alcohol use but has not caused any serious problems.',
        },
        [CommonOption.significant_problems]: {
          text: 'Evidence of binge drinking or excessive alcohol use',
          hint: 'There is a detrimental effect on other areas of their life and is often directly related to offending.',
        },
      },
    },
  },
  alcohol_units_table: {
    summary_text: 'Check how many units are consumed',
    type_of_drink_header: 'Type of drink',
    number_of_alcohol_units_header: 'Number of alcohol units',
    unit: 'unit',
    units: 'units',
    single_small_shot_spirit: 'Single small shot of spirits (25ml, ABV 40%) For example, whisky or vodka.',
    alcopop: 'Alcopop (275ml, ABV 5.5%)',
    small_glass_wine: 'Small glass of red/white/rosé wine (125ml, ABV 12%)',
    bottle_of_beer: 'Bottle of lager/beer/cider (330ml, ABV 5%)',
    can_of_beer: 'Can of lager/beer/cider (440ml, ABV 5.5%)',
    pint_lower_strength_beer: 'Pint of lower-strength lager/beer/cider (ABV 3.6%)',
    standard_glass_wine: 'Standard glass of red/white/rosé wine (175ml, ABV 12%)',
    pint_higher_strength_beer: 'Pint of higher-strength lager/beer/cider (ABV 5.2%)',
    larger_glass_wine: 'Large glass of red/white/rosé wine (250ml, ABV 12%)',
  },
} as const

export type AlcoholLocale = Locale<typeof english>
