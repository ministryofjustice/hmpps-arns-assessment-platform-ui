import { DateTime } from 'luxon'
import { defineTransformerFunctions } from '@ministryofjustice/hmpps-forge/core/authoring'
import type { SentencePlanEffectsDeps } from './effects/types'

interface FormatDateOptions extends Intl.DateTimeFormatOptions {
  readonly locale?: string
}

function assertString(value: unknown, functionName: string): asserts value is string {
  if (typeof value !== 'string') {
    throw new TypeError(`${functionName} expected a string`)
  }
}

function assertFormatDateOptions(value: unknown, functionName: string): asserts value is FormatDateOptions {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new TypeError(`${functionName} expected date format options`)
  }

  if ('locale' in value && typeof value.locale !== 'string') {
    throw new TypeError(`${functionName} expected locale to be a string`)
  }
}

const pluralise = (count: number, unit: string): string => (count === 1 ? `${count} ${unit}` : `${count} ${unit}s`)

const { transformers: sentencePlanTransformerFunctions, implementations: sentencePlanTransformerImplementations } =
  defineTransformerFunctions<
    {
      ToSentenceLength: (value: unknown, endDate: unknown) => string
      FormatDate: (value: unknown, options: FormatDateOptions) => string
    },
    SentencePlanEffectsDeps
  >({
    ToSentenceLength: () => (value: unknown, endDate: unknown) => {
      assertString(value, 'SentencePlanTransformers.ToSentenceLength (startDate)')
      assertString(endDate, 'SentencePlanTransformers.ToSentenceLength (endDate)')

      const startTrimmed = value.trim()
      const endTrimmed = endDate.trim()

      if (!startTrimmed || !endTrimmed) {
        return ''
      }

      const { years, months, days } = DateTime.fromISO(endTrimmed).diff(DateTime.fromISO(startTrimmed), [
        'years',
        'months',
        'days',
      ])

      const parts = [
        years > 0 ? pluralise(years, 'year') : undefined,
        months > 0 ? pluralise(months, 'month') : undefined,
        days > 0 ? pluralise(days, 'day') : undefined,
      ].filter((part): part is string => Boolean(part))

      if (parts.length === 0) {
        return ''
      }

      if (parts.length === 1) {
        return `(${parts[0]})`
      }

      if (parts.length === 2) {
        return `(${parts[0]} and ${parts[1]})`
      }

      return `(${parts[0]}, ${parts[1]} and ${parts[2]})`
    },
    FormatDate: () => (value: unknown, options: FormatDateOptions) => {
      assertString(value, 'SentencePlanTransformers.String.FormatDate')
      assertFormatDateOptions(options, 'SentencePlanTransformers.String.FormatDate')

      const date = new Date(value)
      if (Number.isNaN(date.getTime())) {
        throw new Error(`SentencePlanTransformers.String.FormatDate: "${value}" is not a valid date`)
      }

      const { locale, ...dateTimeFormatOptions } = options

      return new Intl.DateTimeFormat(locale ?? 'en-GB', dateTimeFormatOptions).format(date)
    },
  })

export const SentencePlanTransformers = {
  ToSentenceLength: sentencePlanTransformerFunctions.ToSentenceLength,
  String: {
    FormatDate: sentencePlanTransformerFunctions.FormatDate,
  },
} as const

export { sentencePlanTransformerImplementations }
