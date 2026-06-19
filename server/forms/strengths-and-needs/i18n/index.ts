import { Answer, ChainableExpr, Condition, PipelineExpr, Request } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsTransformers } from '../transformers'
import { GovUKBody } from '@ministryofjustice/hmpps-forge/govuk-components'

export type Language = 'en-gb'

export type Locales = Record<Language, Record<string, any>>

export type Paths<T> = {
  [K in keyof T & string]: T[K] extends object ? `${K}.${Paths<T[K]>}` : K
}[keyof T & string]

export type Locale<T> = {
  [K in keyof T]:
  T[K] extends string
    ? string
    : T[K] extends object
      ? Locale<T[K]>
      : T[K];
};

export const contentFrom =
  <T>(locales: Locales) =>
    (code: Paths<T>, ...replacements: any[]): ChainableExpr<PipelineExpr> =>
      Request.Headers('accept-language').pipe(StrengthsAndNeedsTransformers.ContentFor(locales, code, ...replacements))

export const getDisplayTextForItems = (fieldCode: string, items: any[], options: { size?: 's' | 'l' } = {}) =>
  items.filter(item => !item.divider)
    .map(item => {
      return GovUKBody({
        text: item.text,
        visibleWhen: Answer(fieldCode).match(
          Condition.Array.Contains(item.value),
        ),
        size: options.size,
      })
    })
