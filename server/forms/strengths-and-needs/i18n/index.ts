import { Request } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsTransformers } from '../transformers'

export type Language = 'en-gb'

export type Locales = Record<Language, Record<string, any>>

export type Paths<T> = {
  [K in keyof T & string]: T[K] extends object ? `${K}.${Paths<T[K]>}` : K
}[keyof T & string]

export const contentFrom =
  <T>(locales: Locales) =>
    (code: Paths<T>, ...replacements: any[]) =>
      Request.Headers('accept-language').pipe(StrengthsAndNeedsTransformers.ContentFor(locales, code, ...replacements))
