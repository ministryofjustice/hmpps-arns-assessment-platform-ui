import { DateTime } from 'luxon'
import { defineTransformerFunctions } from '@ministryofjustice/hmpps-forge/core/authoring'
import type { SentencePlanEffectsDeps } from './effects/types'

function assertString(value: unknown, functionName: string): asserts value is string {
  if (typeof value !== 'string') {
    throw new TypeError(`${functionName} expected a string`)
  }
}

const pluralise = (count: number, unit: string): string => (count === 1 ? `${count} ${unit}` : `${count} ${unit}s`)

export const { transformers: SentencePlanTransformers, implementations: sentencePlanTransformerImplementations } =
  defineTransformerFunctions<
    {
      ToSentenceLength: (value: unknown, endDate: unknown) => string
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
  })
