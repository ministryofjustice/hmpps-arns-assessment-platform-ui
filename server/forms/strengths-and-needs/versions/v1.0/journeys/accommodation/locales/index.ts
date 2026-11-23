import { AccommodationLocale, english } from './en-gb'
import { contentFrom, Locales } from '../../../../../i18n'

const locales: Locales = {
  'en-gb': english,
}

export const contentFor = contentFrom<AccommodationLocale>(locales)
