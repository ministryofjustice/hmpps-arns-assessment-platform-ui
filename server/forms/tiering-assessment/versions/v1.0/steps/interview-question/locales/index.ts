import { contentFrom, Locales } from '../../../../../i18n'
import { InterviewLocale, english } from './en-gb'

const locales: Locales = {
  'en-gb': english,
}

export const contentFor = contentFrom<InterviewLocale>(locales)
