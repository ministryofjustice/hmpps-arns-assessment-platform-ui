/** Port of oasys/datamapping/common/AnswersProviderTest.kt. */

import { FieldType, type FormConfig } from '../../formConfig'
import { Field, Value } from '../../codes'
import { InvalidMappingException } from '../../exceptions'
import {
  AnswersProvider,
  CollectionAnswer,
  MultipleValuesAnswer,
  SingleValueAnswer,
} from '../../common/answersProvider'
import { AnswerType, type Answers } from '../../answers'

describe('AnswersProvider', () => {
  const testAnswers: Answers = {
    [Field.CURRENT_ACCOMMODATION.toLowerCase()]: { type: AnswerType.TEXT, description: '', value: Value.SETTLED },
    [Field.FINANCE_INCOME.toLowerCase()]: {
      type: AnswerType.CHECKBOX,
      description: '',
      values: [Value.FAMILY_OR_FRIENDS],
    },
    [Field.EDUCATION_DIFFICULTIES.toLowerCase()]: { type: AnswerType.CHECKBOX, description: '', values: [''] },
    [Field.OFFENCE_ANALYSIS_VICTIMS_COLLECTION.toLowerCase()]: {
      type: AnswerType.COLLECTION,
      description: '',
      collection: [],
    },
  }

  let sut: AnswersProvider

  beforeEach(() => {
    const testFormConfig: FormConfig = {
      version: '1.0',
      fields: {
        [Field.CURRENT_ACCOMMODATION.toLowerCase()]: {
          code: Field.CURRENT_ACCOMMODATION.toLowerCase(),
          type: FieldType.RADIO,
          options: [{ value: Value.TEMPORARY }, { value: Value.NO_ACCOMMODATION }, { value: Value.SETTLED }],
        },
        [Field.FINANCE_INCOME.toLowerCase()]: {
          code: Field.FINANCE_INCOME.toLowerCase(),
          type: FieldType.CHECKBOX,
          options: [{ value: Value.FAMILY_OR_FRIENDS }],
        },
        [Field.EDUCATION_DIFFICULTIES.toLowerCase()]: {
          code: Field.EDUCATION_DIFFICULTIES.toLowerCase(),
          type: FieldType.CHECKBOX,
          options: [{ value: 'Some value' }],
        },
        [Field.OFFENCE_ANALYSIS_VICTIMS_COLLECTION.toLowerCase()]: {
          code: Field.OFFENCE_ANALYSIS_VICTIMS_COLLECTION.toLowerCase(),
          type: FieldType.COLLECTION,
          options: [],
        },
      },
    }

    sut = new AnswersProvider(testAnswers, testFormConfig)
  })

  describe('answer', () => {
    it('throws exception when field not in config', () => {
      expect(() => sut.answer(Field.TEST_FIELD)).toThrow(
        new InvalidMappingException('Field test_field does not exist in form config version 1.0'),
      )
    })

    it('returns the value of an existing answer', () => {
      const answer = sut.answer(Field.CURRENT_ACCOMMODATION)

      expect(answer.value).toEqual(Value.SETTLED)

      expect(() => answer.values).toThrow(
        new InvalidMappingException(`Invalid use of '.values' on a ${SingleValueAnswer.name}`),
      )
      expect(() => answer.collection).toThrow(
        new InvalidMappingException(`Invalid use of '.collection' on a ${SingleValueAnswer.name}`),
      )
    })

    it('returns the checkbox values of an existing answer', () => {
      const answer = sut.answer(Field.FINANCE_INCOME)

      expect(answer.values).toEqual([Value.FAMILY_OR_FRIENDS])

      expect(() => answer.value).toThrow(
        new InvalidMappingException(`Invalid use of '.value' on a ${MultipleValuesAnswer.name}`),
      )
      expect(() => answer.collection).toThrow(
        new InvalidMappingException(`Invalid use of '.collection' on a ${MultipleValuesAnswer.name}`),
      )
    })

    it('returns empty checkbox values when the answer is an array of empty string', () => {
      const answer = sut.answer(Field.EDUCATION_DIFFICULTIES)
      expect(answer.values).toEqual([])
    })

    it('returns the collection values of an existing answer', () => {
      const answer = sut.answer(Field.OFFENCE_ANALYSIS_VICTIMS_COLLECTION)

      expect(answer.collection).toEqual([])

      expect(() => answer.value).toThrow(
        new InvalidMappingException(`Invalid use of '.value' on a ${CollectionAnswer.name}`),
      )
      expect(() => answer.values).toThrow(
        new InvalidMappingException(`Invalid use of '.values' on a ${CollectionAnswer.name}`),
      )
    })
  })

  describe('get', () => {
    it('throws exception when called outside of a field context', () => {
      expect(() => sut.get(Value.YES)).toThrow(
        new InvalidMappingException('Cannot obtain values without a field context. Call answer() first'),
      )
    })

    it('throws exception for invalid field option', () => {
      sut.answer(Field.FINANCE_INCOME)
      expect(() => sut.get(Value.NO_ACCOMMODATION)).toThrow(
        new InvalidMappingException(
          'NO_ACCOMMODATION is not a valid option for field finance_income in form config version 1.0',
        ),
      )
    })

    it('returns value name for a valid field value', () => {
      sut.answer(Field.FINANCE_INCOME)
      expect(sut.get(Value.FAMILY_OR_FRIENDS)).toEqual('FAMILY_OR_FRIENDS')
    })
  })
})
