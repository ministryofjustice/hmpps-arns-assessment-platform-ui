import { sendAuditEvent } from './sendAuditEvent'
import { AuditEvent } from '../../../../services/auditService'
import type { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

interface MockContextOptions {
  user?: { id: string } | null
  requestId?: string | null
  assessmentUuid?: string | null
  crn?: string | null
  activeGoalUuid?: string
}

function createMockContext(options: MockContextOptions = {}) {
  const user = options.user === undefined ? { id: 'test-user' } : (options.user ?? undefined)
  const requestId = options.requestId === undefined ? 'req-123' : (options.requestId ?? undefined)
  const assessmentUuid = options.assessmentUuid === undefined ? 'assessment-456' : (options.assessmentUuid ?? undefined)
  const crn = options.crn === undefined ? 'CRN-001' : (options.crn ?? undefined)

  const stateMap: Record<string, unknown> = { user, requestId }
  const dataMap: Record<string, unknown> = {
    assessmentUuid,
    activeGoalUuid: options.activeGoalUuid,
    formVersion: 'v1.0',
  }

  return {
    getState: jest.fn((key: string) => stateMap[key]),
    getData: jest.fn((key: string) => dataMap[key]),
    getSession: jest.fn(() => ({ caseDetails: crn ? { crn } : undefined })),
  } as unknown as SentencePlanContext
}

function createMockDeps(): SentencePlanEffectsDeps {
  return {
    auditService: { send: jest.fn() },
  } as unknown as SentencePlanEffectsDeps
}

describe('sendAuditEvent', () => {
  let deps: SentencePlanEffectsDeps

  beforeEach(() => {
    deps = createMockDeps()
  })

  it('should send audit event with correct context', async () => {
    const context = createMockContext({ activeGoalUuid: 'goal-789' })

    await sendAuditEvent(deps)(context, AuditEvent.VIEW_PLAN_OVERVIEW)

    expect(deps.auditService.send).toHaveBeenCalledWith({
      action: AuditEvent.VIEW_PLAN_OVERVIEW,
      who: 'test-user',
      subjectId: 'CRN-001',
      subjectType: 'CRN',
      correlationId: 'req-123',
      details: { assessmentUuid: 'assessment-456', formVersion: 'v1.0', goalUuid: 'goal-789' },
    })
  })

  it('should include goalUuid from activeGoalUuid data', async () => {
    const context = createMockContext({ activeGoalUuid: 'goal-uuid-123' })

    await sendAuditEvent(deps)(context, AuditEvent.VIEW_CHANGE_GOAL)

    expect(deps.auditService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        details: expect.objectContaining({ goalUuid: 'goal-uuid-123' }),
      }),
    )
  })

  it('should omit goalUuid when activeGoalUuid is not set', async () => {
    const context = createMockContext()

    await sendAuditEvent(deps)(context, AuditEvent.VIEW_PLAN_OVERVIEW)

    expect(deps.auditService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        details: expect.objectContaining({ goalUuid: undefined }),
      }),
    )
  })

  it('should default who to "unknown" when user is not available', async () => {
    const context = createMockContext({ user: null })

    await sendAuditEvent(deps)(context, AuditEvent.VIEW_PLAN_OVERVIEW)

    expect(deps.auditService.send).toHaveBeenCalledWith(expect.objectContaining({ who: 'unknown' }))
  })

  it('should default correlationId to "unknown" when requestId is not available', async () => {
    const context = createMockContext({ requestId: null })

    await sendAuditEvent(deps)(context, AuditEvent.VIEW_PLAN_OVERVIEW)

    expect(deps.auditService.send).toHaveBeenCalledWith(expect.objectContaining({ correlationId: 'unknown' }))
  })

  it('should not set subjectType when crn is not available', async () => {
    const context = createMockContext({ crn: null })

    await sendAuditEvent(deps)(context, AuditEvent.VIEW_PLAN_OVERVIEW)

    expect(deps.auditService.send).toHaveBeenCalledWith(
      expect.objectContaining({ subjectId: undefined, subjectType: undefined }),
    )
  })

  it('should handle missing session gracefully', async () => {
    const context = {
      getState: jest.fn((): undefined => undefined),
      getData: jest.fn((): undefined => undefined),
      getSession: jest.fn((): undefined => undefined),
    } as unknown as SentencePlanContext

    await sendAuditEvent(deps)(context, AuditEvent.VIEW_PLAN_OVERVIEW)

    expect(deps.auditService.send).toHaveBeenCalledWith({
      action: AuditEvent.VIEW_PLAN_OVERVIEW,
      who: 'unknown',
      subjectId: undefined,
      subjectType: undefined,
      correlationId: 'unknown',
      details: { assessmentUuid: undefined, formVersion: undefined, goalUuid: undefined },
    })
  })

  it('should merge additional details into the details object', async () => {
    const context = createMockContext({ activeGoalUuid: 'goal-123' })

    await sendAuditEvent(deps)(context, AuditEvent.EDIT_GOAL, { planStatus: 'POST_AGREE' })

    expect(deps.auditService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        details: expect.objectContaining({ goalUuid: 'goal-123', planStatus: 'POST_AGREE' }),
      }),
    )
  })

  it('should not include additional details when not provided', async () => {
    const context = createMockContext({ activeGoalUuid: 'goal-123' })

    await sendAuditEvent(deps)(context, AuditEvent.VIEW_CREATE_GOAL)

    expect(deps.auditService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        details: expect.objectContaining({ goalUuid: 'goal-123' }),
      }),
    )
  })
})
