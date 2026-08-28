import { v1FormConfig } from '../versions/v1.0/constants/formConfig'
import { FormConfig } from './formConfig'

export const formConfigsByVersion: Record<string, FormConfig> = {
  ...v1FormConfig,
}
