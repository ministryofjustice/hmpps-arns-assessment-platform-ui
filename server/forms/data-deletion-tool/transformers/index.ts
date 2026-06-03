import { defineTransformerFunctions } from '@ministryofjustice/hmpps-forge/core/authoring'
import { DataDeletionToolEffectsDeps } from '../effects/types'
import { diffHtml } from './diff'

export const { transformers: DataDeletionToolTransformers, implementations: DataDeletionToolTransformerImplementations } =
  defineTransformerFunctions<
    {
      JSONStringify: (value: unknown) => string
      JSONParse: (value: string) => Record<string, any>
      Diff: (left: unknown, right: unknown) => string
    },
    DataDeletionToolEffectsDeps
  >({
    JSONStringify: () => (value: unknown) => JSON.stringify(value, null, 2),
    JSONParse: () => (value: string) => JSON.parse(value),
    Diff: () => (left: unknown, right: unknown) => diffHtml(left, right),
  })
