import { contentFrom, Locales } from '../../../i18n'
import { CommonLocale, english } from './en-gb'
import { Section } from '../constants/section'

const locales: Locales = {
  'en-gb': english,
}

export const commonContentFor = contentFrom<CommonLocale>(locales)

type SectionDefinition = (typeof Section)[keyof typeof Section]

/**
 * Page titles derived from the `sectionTitle` entry. Summary and
 * analysis pages append a suffix, every other page is the plain section name.
 */
export const sectionPageTitle = (section: SectionDefinition) => commonContentFor(`sectionTitle.${section.code}`)

export const summaryPageTitle = (section: SectionDefinition) =>
  commonContentFor('pageTitle.summary', sectionPageTitle(section))

export const analysisPageTitle = (section: SectionDefinition) =>
  commonContentFor('pageTitle.analysis', sectionPageTitle(section))
