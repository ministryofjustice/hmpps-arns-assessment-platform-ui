import {
  ChainableExpr,
  defineGeneratorFunctions,
  GeneratorBuilder,
  GeneratorFunctionExpr,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'
import { getTextFromListDefinition } from './getTextFromListDefinition'
import { getFormatterDateFromIso } from './getFormatterDateFromIso'
import { getDrugValueLower } from './getDrugValueLower'

export interface SANGeneratorShape {
  getTextFromListDefinition: (
    items: any[] | ChainableExpr<any[]>,
    value: string | ResolvableString,
  ) => GeneratorBuilder<ResolvableString[]>
  getFormatterDateFromIso: (value: any | ChainableExpr<any>) => GeneratorFunctionExpr
  getDrugValueLower: (value: string | ChainableExpr<any>) => GeneratorBuilder<ResolvableString[]>
}

export const { generators: SANGenerators, implementations: StrengthsAndNeedsGeneratorImplementations } =
  defineGeneratorFunctions<SANGeneratorShape, unknown>({
    getTextFromListDefinition,
    getFormatterDateFromIso,
    getDrugValueLower,
  })
