import { contentFrom, Locales } from '../../../../../i18n'
import { drugMisuseLocale, english } from './en-gb'

const locales: Locales = {
  'en-gb': english,
}

export const contentFor = contentFrom<drugMisuseLocale>(locales)
