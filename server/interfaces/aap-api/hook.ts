interface Hook {
  type: string
}

export interface UpdateOasysDataMappingHook extends Hook{
  type: 'UpdateOasysDataMapping'
  formConfig: FormConfig
}

type FieldType =
  | 'TEXT'
  | 'RADIO'
  | 'CHECKBOX'
  | 'DATE'

interface FormConfigOption {
  value?: string
}

interface FormConfigField {
  code: string
  options?: FormConfigOption[]
  type?: FieldType
  section?: string
}

interface FormConfig {
  version: string
  fields?: Record<string, FormConfigField>
}

export type Hooks =
  | UpdateOasysDataMappingHook
