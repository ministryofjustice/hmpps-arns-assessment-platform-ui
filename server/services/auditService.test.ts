import AuditService, { AuditEvent, AuditMessage } from './auditService'

jest.mock('@ministryofjustice/hmpps-audit-client', () => ({
  auditService: {
    sendAuditMessage: jest.fn(),
  },
}))

const { auditService: mockAuditClient } = jest.requireMock('@ministryofjustice/hmpps-audit-client')

describe('AuditService', () => {
  let auditService: AuditService

  beforeEach(() => {
    jest.clearAllMocks()
    auditService = new AuditService('test-app')
  })

  describe('send', () => {
    it('should send audit event with all fields populated', async () => {
      const message: AuditMessage = {
        action: AuditEvent.VIEW_PLAN_OVERVIEW,
        who: 'testuser',
        subjectId: 'CRN123',
        subjectType: 'CRN',
        correlationId: 'correlation-123',
        details: { assessmentUuid: 'assessment-uuid-123', customField: 'custom-value' },
      }

      await auditService.send(message)

      expect(mockAuditClient.sendAuditMessage).toHaveBeenCalledWith({
        action: 'VIEW_PLAN_OVERVIEW',
        who: 'testuser',
        subjectId: 'CRN123',
        subjectType: 'CRN',
        service: 'test-app',
        correlationId: 'correlation-123',
        details: JSON.stringify({
          assessmentUuid: 'assessment-uuid-123',
          customField: 'custom-value',
        }),
      })
    })

    it('should handle missing optional fields gracefully', async () => {
      const message: AuditMessage = {
        action: AuditEvent.VIEW_PLAN_OVERVIEW,
        who: 'testuser',
      }

      await auditService.send(message)

      expect(mockAuditClient.sendAuditMessage).toHaveBeenCalledWith({
        action: 'VIEW_PLAN_OVERVIEW',
        who: 'testuser',
        subjectId: undefined,
        subjectType: undefined,
        correlationId: undefined,
        service: 'test-app',
        details: undefined,
      })
    })

    it('should handle audit client errors gracefully', async () => {
      const message: AuditMessage = {
        action: AuditEvent.VIEW_PLAN_OVERVIEW,
        who: 'testuser',
      }

      mockAuditClient.sendAuditMessage.mockRejectedValue(new Error('SQS unavailable'))

      // Should not throw
      await expect(auditService.send(message)).resolves.not.toThrow()
    })

    it('should stringify details object', async () => {
      const message: AuditMessage = {
        action: AuditEvent.CREATE_GOAL,
        who: 'testuser',
        correlationId: 'correlation-123',
        details: { key1: 'value1', key2: 'value2' },
      }

      await auditService.send(message)

      expect(mockAuditClient.sendAuditMessage).toHaveBeenCalledWith({
        action: 'CREATE_GOAL',
        who: 'testuser',
        subjectId: undefined,
        subjectType: undefined,
        service: 'test-app',
        correlationId: 'correlation-123',
        details: JSON.stringify({
          key1: 'value1',
          key2: 'value2',
        }),
      })
    })
  })
})
