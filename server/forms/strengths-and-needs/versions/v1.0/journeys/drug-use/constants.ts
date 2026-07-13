import { Option } from './constants/option'
import { CommonOption } from '../../constants/commonOption'
import {contentFor} from "./locales";
import {ChainableExpr} from "@ministryofjustice/hmpps-forge/core/authoring";
import {commonContentFor} from "../../locales";

export interface Drug {
  value: string
  text: string | ChainableExpr<any>
  injectable: boolean
}

export const drugsList: Drug[] = [
  { value: 'AMPHETAMINES', text: contentFor("option.AMPHETAMINES"), injectable: true },
  { value: 'BENZODIAZEPINES', text: contentFor("option.BENZODIAZEPINES"), injectable: true },
  { value: 'CANNABIS', text: contentFor("option.CANNABIS"), injectable: false },
  { value: 'COCAINE', text: contentFor("option.COCAINE"), injectable: true },
  { value: 'CRACK', text: contentFor("option.CRACK"), injectable: true },
  { value: 'ECSTASY', text: contentFor("option.ECSTASY"), injectable: false },
  { value: 'HALLUCINOGENICS', text: contentFor("option.HALLUCINOGENICS"), injectable: false },
  { value: 'HEROIN', text: contentFor("option.HEROIN"), injectable: true },
  { value: 'METHADONE_NOT_PRESCRIBED', text: contentFor("option.METHADONE_NOT_PRESCRIBED"), injectable: true },
  { value: 'MISUSED_PRESCRIBED_DRUGS', text: contentFor("option.MISUSED_PRESCRIBED_DRUGS"), injectable: true },
  { value: 'OTHER_OPIATES', text: contentFor("option.OTHER_OPIATES"), injectable: true },
  { value: 'SOLVENTS', text: contentFor("option.SOLVENTS"), injectable: false },
  { value: 'STEROIDS', text: contentFor("option.STEROIDS"), injectable: true },
  { value: 'SPICE', text: contentFor("option.SPICE"), injectable: false },
]
export const otherDrugOption: Drug = { value: 'OTHER', text: commonContentFor("option.OTHER"), injectable: true }

export const fieldCode = (prefix: string, drugValue: string) => `${prefix}_${drugValue.toLowerCase()}`
