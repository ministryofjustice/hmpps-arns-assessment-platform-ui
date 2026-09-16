import { TransformerRegistry } from '@ministryofjustice/hmpps-forge/core/authoring'
import { DateTime } from 'luxon'
import { StrengthsAndNeedsEffectsDeps } from './effects/types'
import { Language, Locales } from './i18n'

const DEFAULT_LANGUAGE = 'en-gb'

const ordinalSuffix = (day: number): string => {
  const remainderTen = day % 10
  const remainderHundred = day % 100

  if (remainderTen === 1 && remainderHundred !== 11) return 'st'
  if (remainderTen === 2 && remainderHundred !== 12) return 'nd'
  if (remainderTen === 3 && remainderHundred !== 13) return 'rd'
  return 'th'
}

export const sanTransformers = new TransformerRegistry<StrengthsAndNeedsEffectsDeps>()

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

  FormatFullDateTime: sanTransformers.register('FormatFullDateTime', () => (value: unknown) => {
    if (typeof value !== 'number' || value <= 0) {
      return ''
    }

    const dateTime = DateTime.fromMillis(value)

    if (!dateTime.isValid) {
      return ''
    }

    const day = dateTime.day
    return `${dateTime.toFormat('cccc')} ${day}${ordinalSuffix(day)} ${dateTime.toFormat('LLLL')} ${dateTime.toFormat('yyyy')} ${dateTime.toFormat('h:mm')}${dateTime.toFormat('a').toLowerCase()}`
  }),

  FormatDate: sanTransformers.register('FormatDate', () => (value: unknown) => {
    if (typeof value !== 'number' || value <= 0) {
      return ''
    }

    const dateTime = DateTime.fromMillis(value)

    if (!dateTime.isValid) {
      return ''
    }

    const day = dateTime.day
    return `${day}${ordinalSuffix(day)} ${dateTime.toFormat('LLLL')} ${dateTime.toFormat('yyyy')}`
  }),

  FormatVersionStatus: sanTransformers.register('FormatVersionStatus', () => (value: string) => {
    const statusMappings: Record<string, string> = {
      AWAITING_COUNTERSIGN: 'Awaiting Countersign',
      AWAITING_DOUBLE_COUNTERSIGN: 'Awaiting Countersign',
      CLONED: 'Cloned',
      COUNTERSIGNED: 'Countersigned',
      CREATED: 'Created',
      DOUBLE_COUNTERSIGNED: 'Countersigned',
      LOCKED: 'Locked',
      REJECTED: 'Rejected',
      ROLLED_BACK: 'Rolled Back',
      SELF_SIGNED: 'Self Signed',
      UNSIGNED: 'Edited',
    }

    return value ? statusMappings[value] : value
  }),
}
