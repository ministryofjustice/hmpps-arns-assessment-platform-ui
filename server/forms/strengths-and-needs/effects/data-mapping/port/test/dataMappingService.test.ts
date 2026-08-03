/**
 * Port of oasys/service/DataMappingServiceTest.kt.
 *
 * The Kotlin test also covers "throws exception when assessment does not
 * have a form version" - that scenario is inherent to the Spring service's
 * AssessmentVersion/AssessmentFormInfo entity graph (a nullable `info`
 * relation), which this standalone package has no equivalent of: here,
 * `formConfig` is always a required, already-resolved argument. There is
 * nothing to port for that case.
 */

import { Field } from '../codes'
import { getOasysEquivalent } from '../dataMappingService'
import { SectionMapping, type FieldsToMap } from '../common/sectionMapping'
import type { AnswersProvider } from '../common/answersProvider'
import { FieldType, type FormConfig } from '../formConfig'
import { AnswerType, type Answers } from '../answers'

class StubSectionMapping extends SectionMapping {
  constructor(private readonly build: (ap: AnswersProvider) => FieldsToMap) {
    super()
  }

  getFieldsToMap(): FieldsToMap {
    return this.build(this.ap)
  }
}

describe('DataMappingService', () => {
  const testConfig: FormConfig = {
    version: '1.0',
    fields: {
      [Field.TEST_FIELD.toLowerCase()]: { code: Field.TEST_FIELD.toLowerCase(), type: FieldType.RADIO, options: [] },
    },
  }

  describe('getOasysEquivalent', () => {
    it('returns empty result', () => {
      const mockSectionMapping = new StubSectionMapping(() => ({}))

      const result = getOasysEquivalent({}, testConfig, [mockSectionMapping])

      expect(result).toEqual({})
    })

    it('returns non-empty result comprising of multiple section mappings', () => {
      const mockSectionMapping = new StubSectionMapping(ap => ({
        'oasys-key-1': () => {
          expect(ap.answer(Field.TEST_FIELD).value).toEqual('all good')
          return 'val-1'
        },
      }))

      const mockSectionMappingTwo = new StubSectionMapping(ap => ({
        'oasys-key-2': () => {
          expect(ap.answer(Field.TEST_FIELD).value).toEqual('all good')
          return ['val-2', 'val-3']
        },
      }))

      const answers: Answers = {
        [Field.TEST_FIELD.toLowerCase()]: { type: AnswerType.TEXT, description: '', value: 'all good' },
      }

      const result = getOasysEquivalent(answers, testConfig, [mockSectionMapping, mockSectionMappingTwo])

      expect(result).toEqual({
        'oasys-key-1': 'val-1',
        'oasys-key-2': ['val-2', 'val-3'],
      })
    })
  })
})
