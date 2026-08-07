import { ChainableExpr, PipelineExpr, Transformer } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Option } from './constants/option'
import { CommonOption } from '../../constants/commonOption'

export interface Drug {
  value: string
  text?: string
  injectable: boolean
}

export const drugsList: Drug[] = [
  { value: Option.amphetamines, injectable: true },
  { value: Option.benzodiazepines, injectable: true },
  { value: Option.cannabis, injectable: false },
  { value: Option.cocaine, injectable: true },
  { value: Option.crack, injectable: true },
  { value: Option.ecstasy, injectable: false },
  { value: Option.hallucinogenics, injectable: false },
  { value: Option.heroin, injectable: true },
  { value: Option.methadone_not_prescribed, injectable: true },
  { value: Option.misused_prescribed_drugs, injectable: true },
  { value: Option.other_opiates, injectable: true },
  { value: Option.solvents, injectable: false },
  { value: Option.steroids, injectable: true },
  { value: Option.spice, injectable: false },
  { value: CommonOption.other, injectable: true },
]

export const fieldCodeString = (prefix: string, drugValue: string) => `${prefix}_${drugValue.toLowerCase()}`
export const fieldCode = (prefix: string, drugValue: ChainableExpr<PipelineExpr>) =>
  `${prefix}_${drugValue.pipe(Transformer.String.ToLowerCase())}`
