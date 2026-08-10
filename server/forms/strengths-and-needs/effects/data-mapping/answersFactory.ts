import { AssessmentVersionQueryResult } from '../../../../interfaces/aap-api/queryResult'
import { AnswerType, Answers, FieldType, FormConfig, InvalidMappingException } from './port'

const ANSWER_TYPE_BY_FIELD_TYPE: Record<FieldType, AnswerType> = {
  [FieldType.TEXT]: AnswerType.TEXT,
  [FieldType.TEXT_AREA]: AnswerType.TEXT_AREA,
  [FieldType.RADIO]: AnswerType.RADIO,
  [FieldType.CHECKBOX]: AnswerType.CHECKBOX,
  [FieldType.DROPDOWN]: AnswerType.DROPDOWN,
  [FieldType.AUTOCOMPLETE]: AnswerType.AUTOCOMPLETE,
  [FieldType.COLLECTION]: AnswerType.COLLECTION,
  [FieldType.DATE]: AnswerType.DATE,
  [FieldType.HIDDEN]: AnswerType.TEXT,
}

export const answersFromAssessment = (assessment: AssessmentVersionQueryResult, formConfig: FormConfig): Answers => {
  const answers: Answers = {}

  Object.entries(assessment.answers).forEach(([code, wrapped]) => {
    const fieldConfig = formConfig.fields[code]
    if (!fieldConfig) {
      throw new InvalidMappingException(`Field ${code} does not exist in form config version ${formConfig.version}`)
    }
    const type = ANSWER_TYPE_BY_FIELD_TYPE[fieldConfig.type]

    answers[code] =
      wrapped.type === 'Multi'
        ? { type, description: '', values: wrapped.values }
        : { type, description: '', value: wrapped.value }
  })

  return answers
}
