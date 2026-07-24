import { contentFrom, Locales } from '../../../../../i18n'
import { PersonalRelationshipsAndCommunityLocale, english } from './en-gb'

const locales: Locales = {
  'en-gb': english,
}

export const contentFor = contentFrom<PersonalRelationshipsAndCommunityLocale>(locales)
export const prcShortcut = 'question.personal_relationships_community_'
