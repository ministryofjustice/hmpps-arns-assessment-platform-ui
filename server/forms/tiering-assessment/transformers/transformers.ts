import { TransformerRegistry } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Language, Locales } from '../i18n'
import { TieringAssessmentEffectsDeps } from '../@types/TieringAssessmentEffectsDeps'

const DEFAULT_LANGUAGE = 'en-gb'

export const sanTransformers = new TransformerRegistry<TieringAssessmentEffectsDeps>()

export const StrengthsAndNeedsTransformers = {
  ContentFor: sanTransformers.register(
    'ContentFor',
    () =>
      (language: string, locales: Locales, path: string, ...replacements: string[]): string => {
        const lang = (language?.split(',')[0]?.toLowerCase() ?? DEFAULT_LANGUAGE) as unknown as Language

        const pathParts = path.split('.')

        const raw = pathParts.reduce((acc, segment) => acc?.[segment], locales[lang] ?? locales['en-gb'])

        if (typeof raw !== 'string') {
          return 'NO_TRANSLATION'
        }

        return replacements.reduce((acc, value, index) => acc.replace(`%${index + 1}`, value), raw)
      },
  ),

  ToISO: sanTransformers.register('ToISO', () => (value: any) => {
    if (typeof value !== 'object') {
      return value
    }

    const day = value.day
    const month = value.month
    const year = value.year

    if (day === '' && month === '' && year === '') {
      return ''
    }

    if (day !== '' && month !== '' && year !== '') {
      const paddedYear = year.padStart(4, '0')
      const paddedMonth = month.padStart(2, '0')
      const paddedDay = day.padStart(2, '0')
      return `${paddedYear}-${paddedMonth}-${paddedDay}`
    }

    return value
  }),

  JsonStringify: sanTransformers.register('JsonStringify', () => (value: unknown) => JSON.stringify(value, null, 2)),
}
