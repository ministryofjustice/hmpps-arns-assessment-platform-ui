import { contentFrom, Locales } from '../../../../../i18n'
import { BingeDrinkingLocale, english } from './en-gb'

const locales: Locales = {
  'en-gb': english,
}

export const contentFor = contentFrom<BingeDrinkingLocale>(locales)
