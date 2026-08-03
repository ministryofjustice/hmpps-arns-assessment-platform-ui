/** Port of oasys/datamapping/SectionMappingTest.kt's `Given` test-data builder. */

import { Field, fieldLower, type Value } from '../../codes'
import { AnswerType, type Answers, type PersistedAnswer } from '../../answers'
import { AnswersProvider } from '../../common/answersProvider'
import type { SectionMapping } from '../../common/sectionMapping'
import type { FormConfig } from '../../formConfig'
import { formConfig1_0 } from './formConfig'

export class Given {
  answers: Answers = {}

  expected: unknown = null

  constructor(field?: Field, value?: string | null | Value[]) {
    if (field !== undefined) {
      this.and(field, value as string | null | Value[])
    }
  }

  and(field: Field, value: string | null | Value[]): Given {
    const lower = fieldLower(field)
    const answer: PersistedAnswer = Array.isArray(value)
      ? { type: AnswerType.CHECKBOX, description: '', values: value }
      : { type: AnswerType.TEXT, description: '', value }
    this.answers = { ...this.answers, [lower]: answer }
    return this
  }

  expect(expected: unknown): Given {
    this.expected = expected
    return this
  }

  static aCollectionOf(field: Field, collection: Answers[]): Given {
    const given = new Given()
    given.answers = { [fieldLower(field)]: { type: AnswerType.COLLECTION, description: '', collection } }
    return given
  }
}

/** Port of SectionMappingTest.kt's `test(questionCode, vararg scenarios)`. */
export function testSection(
  sectionMapping: SectionMapping,
  questionCode: string,
  scenarios: Given[],
  formConfig: FormConfig = formConfig1_0,
): void {
  scenarios.forEach((scenario, index) => {
    const answersProvider = new AnswersProvider(scenario.answers, formConfig)
    const result = sectionMapping.map(answersProvider)

    try {
      expect(Object.prototype.hasOwnProperty.call(result, questionCode)).toBe(true)
      expect(result[questionCode]).toEqual(scenario.expected)
    } catch (error) {
      if (error instanceof Error) {
        error.message = `Scenario ${index + 1} failed: ${error.message}`
      }
      throw error
    }
  })
}
