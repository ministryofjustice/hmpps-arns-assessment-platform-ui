import { contentFrom, Locales } from '../../../i18n'
import { CommonLocale, english } from './en-gb'

const locales: Locales = {
  'en-gb': english,
}

export const commonContentFor = contentFrom<CommonLocale>(locales)
