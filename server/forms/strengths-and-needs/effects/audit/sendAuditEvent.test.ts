import { sendAuditEvent } from './sendAuditEvent'
import { SanAuditEvent } from '../../auditEvents'
import { CommonAuditEvent } from '../../../shared'
import type { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'

interface MockContextOptions {
  user?: { id: string } | null
  requestId?: string | null
  assessmentUuid?: string | null
  crn?: string | null
}

function createMockContext(options: MockContextOptions = {}) {
  const user = options.user === undefined ? { id: 'test-user' } : (options.user ?? undefined)
  const requestId = options.requestId === undefined ? 'req-123' : (options.requestId ?? undefined)
  const assessmentUuid = options.assessmentUuid === undefined ? 'assessment-456' : (options.assessmentUuid ?? undefined)
  const crn = options.crn === undefined ? 'CRN-001' : (options.crn ?? undefined)

  const stateMap: Record<string, unknown> = { user, requestId }
  const dataMap: Record<string, unknown> = { assessmentUuid, formVersion: 'v1.0' }

  return {
    getState: jest.fn((key: string) => stateMap[key]),
    getData: jest.fn((key: string) => dataMap[key]),
    getSession: jest.fn(() => ({ caseDetails: crn ? { crn } : undefined })),
  } as unknown as StrengthsAndNeedsContext
}

function createMockDeps(): StrengthsAndNeedsEffectsDeps {
  return { auditService: { send: jest.fn() } } as unknown as StrengthsAndNeedsEffectsDeps
}

describe('sendAuditEvent', () => {
  let deps: StrengthsAndNeedsEffectsDeps

  beforeEach(() => {
    deps = createMockDeps()
  })

  it('sends the event with the common SAN context', async () => {
    await sendAuditEvent(deps)(createMockContext(), SanAuditEvent.VIEW_QUESTION_PAGE, {
      section: 'accommodation',
      page: 'current_accommodation',
    })

    expect(deps.auditService.send).toHaveBeenCalledWith({
      action: SanAuditEvent.VIEW_QUESTION_PAGE,
      who: 'test-user',
      subjectId: 'CRN-001',
      subjectType: 'CRN',
      correlationId: 'req-123',
      details: {
        form: 'strengths-and-needs',
        assessmentUuid: 'assessment-456',
        formVersion: 'v1.0',
        section: 'accommodation',
        page: 'current_accommodation',
      },
    })
  })

  it('names the form, so an action shared with another form can be told apart', async () => {
    await sendAuditEvent(deps)(createMockContext(), CommonAuditEvent.CONFIRM_PRIVACY_SCREEN)

    expect(deps.auditService.send).toHaveBeenCalledWith(
      expect.objectContaining({ details: expect.objectContaining({ form: 'strengths-and-needs' }) }),
    )
  })

  it('omits the subject type when there is no CRN', async () => {
    await sendAuditEvent(deps)(createMockContext({ crn: null }), SanAuditEvent.VIEW_ALL_ANSWERS)

    expect(deps.auditService.send).toHaveBeenCalledWith(
      expect.objectContaining({ subjectId: undefined, subjectType: undefined }),
    )
  })

  it('falls back to "unknown" when the user and request id are missing', async () => {
    await sendAuditEvent(deps)(
      createMockContext({ user: null, requestId: null }),
      CommonAuditEvent.CONFIRM_PRIVACY_SCREEN,
    )

    expect(deps.auditService.send).toHaveBeenCalledWith(
      expect.objectContaining({ who: 'unknown', correlationId: 'unknown' }),
    )
  })

  it('is callable directly by effects that already know what changed', async () => {
    await sendAuditEvent(deps)(createMockContext(), SanAuditEvent.EDIT_ANSWERS, {
      changedFields: ['current_accommodation'],
    })

    expect(deps.auditService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        action: SanAuditEvent.EDIT_ANSWERS,
        details: expect.objectContaining({ changedFields: ['current_accommodation'] }),
      }),
    )
  })
})
