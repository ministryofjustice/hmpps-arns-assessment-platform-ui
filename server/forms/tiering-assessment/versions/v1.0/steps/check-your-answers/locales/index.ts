import { contentFrom, Locales } from '../../../../../i18n'
import { CheckYourAnswersLocale, english } from './en-gb'

const locales: Locales = {
  'en-gb': english,
}

export const contentFor = contentFrom<CheckYourAnswersLocale>(locales)
