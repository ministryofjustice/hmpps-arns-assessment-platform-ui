import { contentFrom, Locales } from '../../../../../i18n'
import { english, SexualOffendingLocale } from './en-gb'

const locales: Locales = {
  'en-gb': english,
}

export const contentFor = contentFrom<SexualOffendingLocale>(locales)
