import { ConditionRegistry } from '@ministryofjustice/hmpps-forge/core/authoring'
import { DataDeletionToolEffectsDeps } from '../effects/types'
import { IsValidJson } from './json'

export const dataDeletionToolConditionRegistry = new ConditionRegistry<DataDeletionToolEffectsDeps>()

export const DataDeletionConditions = {
  IsValidJson: dataDeletionToolConditionRegistry.register('IsValidJson', IsValidJson),
}
