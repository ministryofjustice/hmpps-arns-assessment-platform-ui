import { Question } from '../constants/question'
import { Locale } from '../../../../../i18n'
import { DomesticAbuseOption } from '../constants/DomesticAbuseOption'
import { OffenceOption } from '../constants/OffenceOption'

export const english = {
  question: {
    [Question.domestic_abuse_against]: {
      text: 'Who was this commited against?',
      option: {
        [DomesticAbuseOption.family_member]: 'Family member',
        [DomesticAbuseOption.intimate_partner]: 'Intimate partner',
        [DomesticAbuseOption.family_member_and_intimate_partner]: 'Family member and intimate partner',
      },
    },
    [Question.offence_elements]: {
      text: 'Does %1 current offence have any of the following elements?',
      option: {
        [OffenceOption.arson]: 'Arson',
        [OffenceOption.domestic_abuse]: 'Domestic abuse',
        [OffenceOption.excessive_violence_or_sadistic_violence]: 'Excessive violence or sadistic violence',
        [OffenceOption.hatred_of_identifiable_group]: 'Hatred of identifiable groups',
        [OffenceOption.physical_violence_against_a_child]: 'Physical violence against a child',
        [OffenceOption.sexual_element]: 'Sexual element',
        [OffenceOption.stalking_element]: 'Stalking element',
        [OffenceOption.violent_or_threat_of_violence_with_a_weapon]: 'Violent or threat of violence with a weapon',
        [OffenceOption.weapon]: 'Weapon',
        na: 'None of these elements',
      },
    },
    [Question.evidence_of_domestic_abuse]: {
      text: 'Is there evidence that %1 has ever been a perpetrator of domestic abuse?',
    },
  },
} as const

export type OffenceAnalysisLocale = Locale<typeof english>
