import { contentFrom, Locales } from '../../../../../i18n'
import { EmploymentAndEducationLocale, english } from './en-gb'

const locales: Locales = {
  'en-gb': english,
}

export const contentFor = contentFrom<EmploymentAndEducationLocale>(locales)
