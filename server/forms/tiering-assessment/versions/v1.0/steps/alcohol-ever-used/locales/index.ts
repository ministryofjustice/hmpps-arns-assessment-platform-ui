import { contentFrom, Locales } from '../../../../../i18n'
import { AlcoholEverUsedLocale, english } from './en-gb'

const locales: Locales = {
  'en-gb': english,
}

export const contentFor = contentFrom<AlcoholEverUsedLocale>(locales)
