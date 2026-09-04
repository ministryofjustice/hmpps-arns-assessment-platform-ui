import { contentFrom, Locales } from '../../../i18n'
import { CommonLocale, english } from './en-gb'
import { Step } from '../constants/page'

const locales: Locales = {
  'en-gb': english,
}

export const commonContentFor = contentFrom<CommonLocale>(locales)

export type StepDefinition = (typeof Step)[keyof typeof Step]

/**
 * Step titles derived from the `stepTitle` entry.
 */
export const stepTitle = (step: StepDefinition) => commonContentFor(`stepTitle.${step.code}`)
