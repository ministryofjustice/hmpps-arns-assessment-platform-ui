import {
  ChainableExpr,
  defineGeneratorFunctions,
  GeneratorFunctionExpr,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'
import { getTextFromListDefinition } from './getTextFromListDefinition'
import {getFormatterDateFromIso} from "./getFormatterDateFromIso";

export interface SANGeneratorShape {
  getTextFromListDefinition: (
    items: any[] | ChainableExpr<any[]>,
    value: string | ResolvableString,
  ) => GeneratorFunctionExpr,
  getFormatterDateFromIso: (
    value: any | ChainableExpr<any>
  ) => GeneratorFunctionExpr,
}

export const { generators: SANGenerators, implementations: StrengthsAndNeedsGeneratorImplementations } =
  defineGeneratorFunctions<SANGeneratorShape, unknown>({
    getTextFromListDefinition,
    getFormatterDateFromIso
  })
