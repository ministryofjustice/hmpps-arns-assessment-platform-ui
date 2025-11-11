import AuditService, { AuditEvent, AuditContext } from './auditService'
import { ApplicationInfo } from '../applicationInfo'

jest.mock('@ministryofjustice/hmpps-audit-client', () => ({
  auditService: {
    sendAuditMessage: jest.fn(),
  },
}))

const { auditService: mockAuditClient } = jest.requireMock('@ministryofjustice/hmpps-audit-client')

describe('AuditService', () => {
  let auditService: AuditService
  let mockApplicationInfo: ApplicationInfo

  beforeEach(() => {
    jest.clearAllMocks()

    mockApplicationInfo = {
      applicationName: 'test-app',
      buildNumber: '1.0.0',
      gitRef: 'abc123',
      gitShortHash: 'abc',
      branchName: 'main',
      productId: 'TEST001',
    }

    auditService = new AuditService(mockApplicationInfo)
  })

  describe('send', () => {
    it('should send audit event with all fields populated', async () => {
      const context: AuditContext = {
        username: 'testuser',
        correlationId: 'correlation-123',
        crn: 'CRN123',
        assessmentUuid: 'assessment-uuid-123',
        assessmentVersion: 5,
        details: { customField: 'custom-value' },
      }

      await auditService.send(AuditEvent.VIEW_ASSESSMENT, context)

      expect(mockAuditClient.sendAuditMessage).toHaveBeenCalledWith({
        action: 'VIEW_ASSESSMENT',
        who: 'testuser',
        subjectId: 'CRN123',
        subjectType: 'CRN',
        service: 'test-app',
        correlationId: 'correlation-123',
        details: JSON.stringify({
          assessmentUuid: 'assessment-uuid-123',
          assessmentVersion: 5,
          customField: 'custom-value',
        }),
      })
    })

    it('should handle missing optional fields gracefully', async () => {
      const context: AuditContext = {
        username: 'testuser',
        correlationId: 'correlation-123',
      }

      await auditService.send(AuditEvent.VIEW_ASSESSMENT, context)

      expect(mockAuditClient.sendAuditMessage).toHaveBeenCalledWith({
        action: 'VIEW_ASSESSMENT',
        who: 'testuser',
        subjectId: undefined,
        subjectType: undefined,
        service: 'test-app',
        correlationId: 'correlation-123',
        details: JSON.stringify({
          assessmentUuid: undefined,
          assessmentVersion: undefined,
        }),
      })
    })

    it('should handle audit client errors gracefully', async () => {
      const context: AuditContext = {
        username: 'testuser',
        correlationId: 'correlation-123',
      }

      mockAuditClient.sendAuditMessage.mockRejectedValue(new Error('SQS unavailable'))

      // Should not throw
      await expect(auditService.send(AuditEvent.VIEW_ASSESSMENT, context)).resolves.not.toThrow()
    })

    it('should merge custom details with context', async () => {
      const context: AuditContext = {
        username: 'testuser',
        correlationId: 'correlation-123',
        details: { key1: 'value1', key2: 'value2' },
      }

      await auditService.send(AuditEvent.CREATE_ASSESSMENT, context)

      expect(mockAuditClient.sendAuditMessage).toHaveBeenCalledWith({
        action: 'CREATE_ASSESSMENT',
        who: 'testuser',
        subjectId: undefined,
        subjectType: undefined,
        service: 'test-app',
        correlationId: 'correlation-123',
        details: JSON.stringify({
          assessmentUuid: undefined,
          assessmentVersion: undefined,
          key1: 'value1',
          key2: 'value2',
        }),
      })
    })

    it('should send audit event without CRN subjectType when no CRN provided', async () => {
      const context: AuditContext = {
        username: 'testuser',
        correlationId: 'correlation-123',
        assessmentUuid: 'assessment-uuid-123',
      }

      await auditService.send(AuditEvent.VIEW_ASSESSMENT, context)

      expect(mockAuditClient.sendAuditMessage).toHaveBeenCalledWith({
        action: 'VIEW_ASSESSMENT',
        who: 'testuser',
        subjectId: undefined,
        subjectType: undefined,
        service: 'test-app',
        correlationId: 'correlation-123',
        details: JSON.stringify({
          assessmentUuid: 'assessment-uuid-123',
          assessmentVersion: undefined,
        }),
      })
    })
  })
})
