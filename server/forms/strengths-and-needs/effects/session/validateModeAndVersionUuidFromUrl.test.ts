import { createTestEffectContext } from '@ministryofjustice/hmpps-forge/core/testing'
import { BadRequest, NotFound } from 'http-errors'
import { validateModeAndVersionUuidFromUrl } from './validateModeAndVersionUuidFromUrl'
import { StrengthsAndNeedsContext } from '../types'

const assessmentUuid = 'e8f1a0a4-0000-4000-8000-000000000001'
const versionUuid = 'e8f1a0a4-0000-4000-8000-000000000002'

const validate = (params: Record<string, string | undefined>) => {
  const context = createTestEffectContext({}) as unknown as StrengthsAndNeedsContext
  jest.spyOn(context, 'getRequestParam').mockImplementation(key => params[key])

  return () => validateModeAndVersionUuidFromUrl()(context)
}

describe('validateModeAndVersionUuidFromUrl', () => {
  it.each([
    { mode: 'edit', assessmentUuid, versionUuid: 'current' },
    { mode: 'view', assessmentUuid, versionUuid: 'current' },
    { mode: 'view', assessmentUuid, versionUuid },
    // not an assessment page, e.g. the entry step
    { mode: undefined, assessmentUuid: undefined, versionUuid: undefined },
  ])('accepts $mode/$assessmentUuid/$versionUuid', params => {
    expect(validate(params)).not.toThrow()
  })

  it.each([
    { error: BadRequest, mode: 'view-historic', assessmentUuid, versionUuid },
    { error: NotFound, mode: 'view', assessmentUuid: 'current', versionUuid },
    { error: NotFound, mode: 'view', assessmentUuid, versionUuid: 'null' },
    { error: NotFound, mode: 'view', assessmentUuid, versionUuid: 'accommodation' },
  ])('rejects $mode/$assessmentUuid/$versionUuid', ({ error, ...params }) => {
    expect(validate(params)).toThrow(error)
  })
})
