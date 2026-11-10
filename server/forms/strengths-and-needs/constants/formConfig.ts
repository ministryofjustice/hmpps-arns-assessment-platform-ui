import {
  collectionsOf,
  isOptioned,
  isQuestionOption,
  QuestionContent,
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

export interface FormConfig {
  version: string
  fields: Record<string, FormConfigField>
  goLiveDate?: string
}

const fieldOptionsOf = (content: QuestionContent): Pick<FormConfigField, 'options'> =>
  isOptioned(content) ? { options: content.options.filter(isQuestionOption).map(({ value }) => ({ value })) } : {}

/**
 * Built as a plain object for mapping hooks and the version-configured diagnostic
 * step's `data`, which Forge requires to be JSON-serialisable. Ordinary steps do
 * not need this mapping configuration in their request data.
 */
export const buildFormConfig = (
  version: string,
  sections: SectionDefinition[],
  sectionStatusKeys: string[],
  goLiveDate?: string,
): FormConfig => {
  const fields: Record<string, FormConfigField> = {}

  sections.forEach(section => {
    stableQuestionsOf(section).forEach(content => {
      fields[content.code] = {
        code: content.code,
        type: content.format,
        section: section.code,
        ...fieldOptionsOf(content),
      }
    })

    collectionsOf(section).forEach(collectionDef => {
      collectionDef.questions.forEach(content => {
        fields[content.code] = {
          code: content.code,
          type: content.format,
          section: section.code,
          collection: collectionDef.name,
          ...fieldOptionsOf(content),
        }
      })
    })
  })

  sectionStatusKeys.forEach(sectionStatusKey => {
    fields[sectionStatusKey] = {
      code: sectionStatusKey,
      type: QuestionFormat.RADIO,
      options: Object.values(SectionComplete).map(value => ({ value })),
    }
  })

  return { version, fields, goLiveDate }
}
