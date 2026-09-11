import { Question } from '../constants/question'
import { Locale } from '../../../../../i18n'
import { Option } from '../constants/option'

export const english = {
  question: {
    [Question.previous_convictions]: {
      text: 'Has %1 previously been convicted of any of these offences?',
      validation: "Select all that apply, or select 'None of these offences'.",
      option: {
        [Option.HOMICIDE]: 'Murder, attempted murder, threat or conspiracy to murder or manslaughter',
        [Option.WOUNDING_GBH]: 'Wounding or GBH',
        [Option.RAPE_OR_SERIOUS_SEXUAL_OFFENCE]: 'Rape or serious sexual offence against an adult',
        [Option.SEXUAL_OFFENCE_AGAINST_CHILD]: 'Any sexual offence against a child',
        [Option.OTHER_OFFENCE_AGAINST_CHILD]: 'Any other offence against a child',
        [Option.CRIMINAL_DAMAGE]: 'Criminal damage with intent to endanger life',
        [Option.WEAPON]: 'Any offence involving possession or use of weapons',
        [Option.KIDNAPPING]: 'Kidnapping or false imprisonment',
        [Option.ARSON]: 'Arson',
        [Option.RACIAL_OFFENCE]: 'Racially motivated or racially aggravated offence',
        [Option.AGGRAVATED_BURGLARY]: 'Aggravated burglary',
        [Option.ROBBERY]: 'Robbery',
        [Option.OTHER_SERIOUS_OFFENCE]:
          'Any other serious offence (for example, blackmail, harassment, stalking, indecent images of children, child neglect or abduction)',
        [Option.OFFENCE_COMMITTED_IN_CUSTODY]: 'Any offence committed in custody',
        [Option.FIREARMS]: 'Possession of a firearm with intent to endanger life or resist arrest',
        [Option.NA]: 'None of these offences',
      },
    },
  },
} as const

export type PreviousConvictionsLocale = Locale<typeof english>
