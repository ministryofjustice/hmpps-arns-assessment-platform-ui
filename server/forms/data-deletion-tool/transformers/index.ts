import { TransformerRegistry } from '@ministryofjustice/hmpps-forge/core/authoring'
import { DataDeletionToolEffectsDeps } from '../effects/types'
import { diffHtml } from './diff'

export const dataDeletionToolTransformerRegistry = new TransformerRegistry<DataDeletionToolEffectsDeps>()

export const DataDeletionToolTransformers = {
  JSONStringify: dataDeletionToolTransformerRegistry.register(
    'JSONStringify',
    () => (value: unknown) => JSON.stringify(value, null, 2),
  ),
  JSONParse: dataDeletionToolTransformerRegistry.register('JSONParse', () => (value: string) => JSON.parse(value)),
  Diff: dataDeletionToolTransformerRegistry.register(
    'Diff',
    () => (left: unknown, right: unknown) => diffHtml(left, right),
  ),
}
