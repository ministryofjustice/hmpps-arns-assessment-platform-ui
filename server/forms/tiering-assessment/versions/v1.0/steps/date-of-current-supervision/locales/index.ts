import { contentFrom, Locales } from '../../../../../i18n'
import { AccommodationLocale, english } from './en-gb'

const locales: Locales = {
  'en-gb': english,
}

export const contentFor = contentFrom<AccommodationLocale>(locales)
