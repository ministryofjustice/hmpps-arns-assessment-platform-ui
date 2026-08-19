import { isOptioned, isQuestionOption, QuestionFormat, SectionDefinition, stableQuestionsOf } from './questionContent'

interface FormConfigOption {
  value?: string
}

interface FormConfigField {
  code: string
  options?: FormConfigOption[]
  type?: QuestionFormat
  section?: string
}

export class FormConfig {
  version: string

  fields: Record<string, FormConfigField>

  constructor(version: string, sections: SectionDefinition[]) {
    this.version = version
    this.fields = {}

    sections.forEach(section => {
      stableQuestionsOf(section).forEach(content => {
        this.fields[content.code] = {
          code: content.code,
          type: content.format,
          section: section.code,
          ...(isOptioned(content)
            ? { options: content.options.filter(isQuestionOption).map(({ value }) => ({ value })) }
            : {}),
        }
      })
    })
  }
}
