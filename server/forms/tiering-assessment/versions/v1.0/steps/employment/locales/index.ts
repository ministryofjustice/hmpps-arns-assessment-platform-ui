import { contentFrom, Locales } from '../../../../../i18n'
import { EmploymentLocale, english } from './en-gb'

const locales: Locales = {
  'en-gb': english,
}

export const contentFor = contentFrom<EmploymentLocale>(locales)
