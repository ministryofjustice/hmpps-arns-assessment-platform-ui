import { ConditionFunctionExpr, defineConditionFunctions } from '@ministryofjustice/hmpps-forge/core/authoring'
import { IsValidJson } from './json'

export const { conditions: DataDeletionConditions, implementations: DataDeletionConditionImplementations } =
  defineConditionFunctions<
    {
      IsValidJson: () => ConditionFunctionExpr
    },
    any
  >({
    IsValidJson,
  })
