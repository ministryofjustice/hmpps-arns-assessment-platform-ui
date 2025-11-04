import AuditService, { AuditEvent } from './auditService'
import SessionService from './sessionService'
import { ApplicationInfo } from '../applicationInfo'

jest.mock('@ministryofjustice/hmpps-audit-client', () => ({
  auditService: {
    sendAuditMessage: jest.fn(),
  },
}))

const { auditService: mockAuditClient } = jest.requireMock('@ministryofjustice/hmpps-audit-client')

describe('AuditService', () => {
  let auditService: AuditService
  let mockSessionService: jest.Mocked<SessionService>
  let mockApplicationInfo: ApplicationInfo

  beforeEach(() => {
    jest.clearAllMocks()

    mockSessionService = {
      getPrincipalDetails: jest.fn(),
      getSubjectDetails: jest.fn(),
      getAssessmentUuid: jest.fn(),
      getAssessmentVersion: jest.fn(),
    } as unknown as jest.Mocked<SessionService>

    mockApplicationInfo = {
      applicationName: 'test-app',
      buildNumber: '1.0.0',
      gitRef: 'abc123',
      gitShortHash: 'abc',
      branchName: 'main',
      productId: 'TEST001',
    }

    auditService = new AuditService(mockApplicationInfo, mockSessionService, 'correlation-123')
  })

  describe('send', () => {
    it('should send audit event with all fields populated from session', async () => {
      mockSessionService.getPrincipalDetails.mockReturnValue({
        identifier: 'user123',
        username: 'testuser',
        displayName: 'Test User',
      })
      mockSessionService.getSubjectDetails.mockReturnValue({
        crn: 'CRN123',
      })
      mockSessionService.getAssessmentUuid.mockReturnValue('assessment-uuid-123')
      mockSessionService.getAssessmentVersion.mockReturnValue(5)

      await auditService.send(AuditEvent.VIEW_ASSESSMENT, { customField: 'custom-value' })

      expect(mockAuditClient.sendAuditMessage).toHaveBeenCalledWith({
        action: 'VIEW_ASSESSMENT',
        who: 'user123',
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

    it('should handle missing session data gracefully', async () => {
      mockSessionService.getPrincipalDetails.mockReturnValue(undefined)
      mockSessionService.getSubjectDetails.mockReturnValue(undefined)
      mockSessionService.getAssessmentUuid.mockReturnValue(undefined)
      mockSessionService.getAssessmentVersion.mockReturnValue(undefined)

      await auditService.send(AuditEvent.VIEW_ASSESSMENT)

      expect(mockAuditClient.sendAuditMessage).toHaveBeenCalledWith({
        action: 'VIEW_ASSESSMENT',
        who: undefined,
        subjectId: undefined,
        subjectType: 'CRN',
        service: 'test-app',
        correlationId: 'correlation-123',
        details: JSON.stringify({
          assessmentUuid: undefined,
          assessmentVersion: undefined,
        }),
      })
    })

    it('should handle audit client errors gracefully', async () => {
      mockSessionService.getPrincipalDetails.mockReturnValue({
        identifier: 'user123',
        username: 'testuser',
        displayName: 'Test User',
      })
      mockAuditClient.sendAuditMessage.mockRejectedValue(new Error('SQS unavailable'))

      // Should not throw
      await expect(auditService.send(AuditEvent.VIEW_ASSESSMENT)).resolves.not.toThrow()
    })

    it('should merge custom details with session context', async () => {
      mockSessionService.getPrincipalDetails.mockReturnValue({
        identifier: 'user123',
        username: 'testuser',
        displayName: 'Test User',
      })
      mockSessionService.getAssessmentUuid.mockReturnValue('uuid-123')

      await auditService.send(AuditEvent.VIEW_ASSESSMENT, {
        field1: 'value1',
        field2: 123,
        nested: { data: 'example' },
      })

      const call = mockAuditClient.sendAuditMessage.mock.calls[0][0]
      const details = JSON.parse(call.details)

      expect(details).toEqual({
        assessmentUuid: 'uuid-123',
        assessmentVersion: undefined,
        field1: 'value1',
        field2: 123,
        nested: { data: 'example' },
      })
    })
  })
})
