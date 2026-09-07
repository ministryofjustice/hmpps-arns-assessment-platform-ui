import { contentFrom, Locales } from '../../../../../i18n'
import { DrugUseLocale, english } from './en-gb'

const locales: Locales = {
  'en-gb': english,
}

export const contentFor = contentFrom<DrugUseLocale>(locales)
