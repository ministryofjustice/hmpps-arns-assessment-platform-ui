import { contentFrom, Locales } from '../../../../../i18n'
import { HealthAndWellbeingLocale, english } from './en-gb'

const locales: Locales = {
  'en-gb': english,
}

export const contentFor = contentFrom<HealthAndWellbeingLocale>(locales)
