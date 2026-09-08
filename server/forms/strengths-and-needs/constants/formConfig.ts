import {
  collectionsOf,
  isOptioned,
  isQuestionOption,
  QuestionFormat,
  SectionDefinition,
  stableQuestionsOf,
} from './questionContent'
import { SectionComplete } from '../versions/v1.0/constants/section'

interface FormConfigOption {
  value?: string
}

interface FormConfigField {
  code: string
  options?: FormConfigOption[]
  type?: QuestionFormat
  section?: string
  // Set instead of/alongside `section` when the field belongs to a
  // repeatable item collection (e.g. victims) rather than being asked once
  // per assessment.
  collection?: string
}

export class FormConfig {
  version: string

  fields: Record<string, FormConfigField>

  constructor(version: string, sections: SectionDefinition[], sectionStatusKeys: string[]) {
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

      collectionsOf(section).forEach(collectionDef => {
        collectionDef.questions.forEach(content => {
          this.fields[content.code] = {
            code: content.code,
            type: content.format,
            section: section.code,
            collection: collectionDef.name,
            ...(isOptioned(content)
              ? { options: content.options.filter(isQuestionOption).map(({ value }) => ({ value })) }
              : {}),
          }
        })
      })
    })

    sectionStatusKeys.forEach(sectionStatusKey => {
      this.fields[sectionStatusKey] = {
        code: sectionStatusKey,
        type: QuestionFormat.RADIO,
        options: Object.values(SectionComplete).map(value => ({ value })),
      }
    })
  }
}
