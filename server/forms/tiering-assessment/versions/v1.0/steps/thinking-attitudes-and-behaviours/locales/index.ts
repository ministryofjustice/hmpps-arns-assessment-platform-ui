import { contentFrom, Locales } from '../../../../../i18n'
import { english, ThinkAttitudesBehaviourLocale } from './en-gb'

const locales: Locales = {
  'en-gb': english,
}

export const contentFor = contentFrom<ThinkAttitudesBehaviourLocale>(locales)
