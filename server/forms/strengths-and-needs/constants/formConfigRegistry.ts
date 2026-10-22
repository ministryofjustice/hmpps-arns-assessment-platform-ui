import { FormConfig } from './formConfig'
//import { v1FormConfig } from '../versions/v1.0/constants/formConfig'
import { v2FormConfig } from '../versions/v2.0/constants/formConfig'

export const formConfigsByVersion: Record<string, FormConfig> = {
  // TODO versioning ...v1FormConfig,
  ...v2FormConfig,
}
