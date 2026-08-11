import { InternalServerError } from 'http-errors'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { latestVersion } from '../../constants/formVersion'
import { strengthsAndNeedsRootJourney } from '../../index'
import {
  isOptioned,
  isQuestionOption,
  QuestionContent,
  QuestionFormat,
  stableQuestionsOf,
} from '../../constants/questionContent'

interface FormConfigOption {
  value?: string
}

interface FormConfigField {
  code: string
  options?: FormConfigOption[]
  type?: QuestionFormat
  section?: string
}

export interface FormConfig {
  version: string
  fields?: Record<string, FormConfigField>
}

interface Question {
  content: QuestionContent
}

interface Section {
  code: string
  fields: Record<string, Question>
}

export const createFormConfig = (_deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext) => {
  const version = context.getData('assessment').formVersion || latestVersion
  const journey = strengthsAndNeedsRootJourney.children.find(it => it.data.formVersion === version)

  if (!journey || !journey.data.sections) {
    throw new InternalServerError(`No sections defined for version ${version}`)
  }

  const sections = journey.data.sections as Section[]

  const fields: Record<string, FormConfigField> = {}

  sections.forEach(section => {
    stableQuestionsOf(section).forEach(content => {
      fields[content.code] = {
        code: content.code,
        type: content.format,
        section: section.code,
        ...(isOptioned(content)
          ? { options: content.options.filter(isQuestionOption).map(({ value }) => ({ value })) }
          : {}),
      }
    })
  })

  const formConfig: FormConfig = {
    version,
    fields,
  }

  context.setData('formConfig', formConfig)
}
