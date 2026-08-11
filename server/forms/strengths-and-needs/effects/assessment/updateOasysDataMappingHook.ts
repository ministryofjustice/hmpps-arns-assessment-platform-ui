import { Hook } from '../../../../interfaces/aap-api/command'
import { FormConfig } from './createFormConfig'

export class UpdateOasysDataMappingHook implements Hook {
  type = 'UpdateOasysDataMapping'

  formConfig: FormConfig

  constructor(formConfig: FormConfig) {
    this.formConfig = formConfig
  }
}
