import { defineTransformerFunctions } from '@ministryofjustice/hmpps-forge/core/authoring'
import { DataDeletionToolEffectsDeps } from './effects/types';

export const { transformers: DataDeletionToolTransformers, implementations: DataDeletionToolTransformerImplementations } =
  defineTransformerFunctions<
    {
      JSONStringify: (value: unknown) => string
    },
    DataDeletionToolEffectsDeps
  >({
    JSONStringify: () => (value: unknown) => JSON.stringify(value, null, 2),
  })
