import { SentencePlanContext } from './types'
import { canAccessSanContent } from './helpers'

const createMockContext = (
  overrides: {
    data?: Record<string, unknown>
    session?: Record<string, unknown>
  } = {},
): SentencePlanContext =>
  ({
    getData: jest.fn((key: string) => overrides.data?.[key]),
    setData: jest.fn(),
    getSession: jest.fn(() => overrides.session ?? {}),
  }) as unknown as SentencePlanContext

describe('canAccessSanContent()', () => {
  it('should return true when assessment has SAN_BETA flag and access is not MPoP', () => {
    const context = createMockContext({
      data: { assessment: { flags: ['SAN_BETA'] } },
      session: { sessionDetails: { accessType: 'OASYS' } },
    })

    expect(canAccessSanContent(context)).toBe(true)
  })

  it('should return false when assessment has no SAN_BETA flag', () => {
    const context = createMockContext({
      data: { assessment: { flags: [] } },
      session: { sessionDetails: { accessType: 'OASYS' } },
    })

    expect(canAccessSanContent(context)).toBe(false)
  })

  it('should return false when access type is HMPPS_AUTH (MPoP)', () => {
    const context = createMockContext({
      data: { assessment: { flags: ['SAN_BETA'] } },
      session: { sessionDetails: { accessType: 'HMPPS_AUTH' } },
    })

    expect(canAccessSanContent(context)).toBe(false)
  })

  it('should return false when assessment has no flags property', () => {
    const context = createMockContext({
      data: { assessment: { assessmentUuid: 'some-uuid' } },
      session: { sessionDetails: { accessType: 'OASYS' } },
    })

    expect(canAccessSanContent(context)).toBe(false)
  })

  it('should return false when assessment is undefined', () => {
    const context = createMockContext({
      session: { sessionDetails: { accessType: 'OASYS' } },
    })

    expect(canAccessSanContent(context)).toBe(false)
  })

  it('should return true when sessionDetails is undefined', () => {
    const context = createMockContext({
      data: { assessment: { flags: ['SAN_BETA'] } },
    })

    expect(canAccessSanContent(context)).toBe(true)
  })

  it('should return false when both SAN_BETA is missing and access is MPoP', () => {
    const context = createMockContext({
      data: { assessment: { flags: [] } },
      session: { sessionDetails: { accessType: 'HMPPS_AUTH' } },
    })

    expect(canAccessSanContent(context)).toBe(false)
  })
})
