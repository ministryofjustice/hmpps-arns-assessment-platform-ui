import { contentFrom, Locales } from '../../../../../i18n'
import { english, OffenceAnalysisLocale } from './en-gb'

const locales: Locales = {
  'en-gb': english,
}

export const contentFor = contentFrom<OffenceAnalysisLocale>(locales)
