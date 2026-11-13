import { InternalServerError } from 'http-errors'
import { AssessmentVersionQueryResult } from '../../../../interfaces/aap-api/queryResult'
import { formConfigsByVersion } from '../../constants/formConfigRegistry'
import { UpdateOasysDataMappingHook } from './updateOasysDataMappingHook'

const assessmentFor = (formVersion: string): AssessmentVersionQueryResult => ({
  type: 'AssessmentVersionQueryResult',
  assessmentUuid: 'assessment',
  aggregateUuid: 'aggregate',
  assessmentType: 'SAN_SP',
  formVersion,
  createdAt: '2026-10-01T10:00:00Z',
  updatedAt: '2026-10-01T10:00:00Z',
  answers: {},
  properties: {},
  collections: [],
  collaborators: [],
  identifiers: {},
  flags: [],
})

describe('UpdateOasysDataMappingHook', () => {
  it.each(Object.keys(formConfigsByVersion))(
    'uses the complete registry mapping for %s without request data',
    version => {
      const hook = new UpdateOasysDataMappingHook(assessmentFor(version))

      expect(hook.formConfig).toBe(formConfigsByVersion[version])
      expect(hook).toEqual({ type: 'UpdateOasysDataMapping', formConfig: formConfigsByVersion[version] })
      expect(Object.values(hook.formConfig.fields).some(field => field.options?.length)).toBe(true)
      expect(Object.values(hook.formConfig.fields).some(field => field.collection)).toBe(true)
    },
  )

  it('preserves the latest-version fallback when the assessment has no version', () => {
    expect(new UpdateOasysDataMappingHook(assessmentFor('')).formConfig).toBe(formConfigsByVersion['v1.0'])
  })

  it('continues to fail explicitly for an unknown assessment version', () => {
    expect(() => new UpdateOasysDataMappingHook(assessmentFor('unknown'))).toThrow(InternalServerError)
    expect(() => new UpdateOasysDataMappingHook(assessmentFor('unknown'))).toThrow(
      'No formConfig defined for version unknown',
    )
  })
})
