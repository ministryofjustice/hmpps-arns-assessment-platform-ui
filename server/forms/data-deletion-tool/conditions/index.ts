import { ConditionRegistry } from '@ministryofjustice/hmpps-forge/core/authoring'
import { IsValidJson } from './json'

export const dataDeletionToolConditionRegistry = new ConditionRegistry<any>()

export const DataDeletionConditions = {
  IsValidJson: dataDeletionToolConditionRegistry.register('IsValidJson', IsValidJson),
}
