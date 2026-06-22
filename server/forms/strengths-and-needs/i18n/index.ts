import {
  and,
  Answer,
  ChainableExpr,
  Condition,
  or,
  PipelineExpr,
  Request,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKBody } from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsTransformers } from '../transformers'
import { StrengthsAndNeedsConditions } from '../conditions'

export type Language = 'en-gb'

export type Locales = Record<Language, Record<string, any>>

export type Paths<T> = {
  [K in keyof T & string]: T[K] extends object ? `${K}.${Paths<T[K]>}` : K
}[keyof T & string]

export type Locale<T> = {
  [K in keyof T]: T[K] extends string ? string : T[K] extends object ? Locale<T[K]> : T[K]
}

export const contentFrom =
  <T>(locales: Locales) =>
  (code: Paths<T>, ...replacements: any[]): ChainableExpr<PipelineExpr> =>
    Request.Headers('accept-language').pipe(StrengthsAndNeedsTransformers.ContentFor(locales, code, ...replacements))

export const getDisplayTextForItems = (fieldCode: string, items: any[], options: { size?: 's' | 'l' } = {}) =>
  items.filter(item => !item.divider)
    .map(item => getDisplayTextForItem(fieldCode, item, options))

export const getDisplayTextForSpecificItem = (fieldCode: string, items: any[], value: string, options: { size?: 's' | 'l' } = {}) =>
  items.filter(item => !item.divider && item.value === value)
    .map(item => getDisplayTextForItem(fieldCode, item, options))

export const getDisplayTextForItem = (
  fieldCode: string,
  item: { text: string; value: string },
  options: { size?: 's' | 'l' } = {},
) =>
  GovUKBody({
    text: item.text,
    visibleWhen: or(
      and(
        Answer(fieldCode).match(StrengthsAndNeedsConditions.IsArray()),
        Answer(fieldCode).match(Condition.Array.Contains(item.value)),
      ),
      and(
        Answer(fieldCode).not.match(StrengthsAndNeedsConditions.IsArray()),
        Answer(fieldCode).match(Condition.Equals(item.value)),
      ),
    ),
    size: options.size,
  })
