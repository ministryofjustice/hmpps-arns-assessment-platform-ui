import AssessmentService from './assessmentService'
import AssessmentPlatformApiClient from '../data/assessmentPlatformApiClient'
import SessionService, { PrincipalDetails } from './sessionService'
import AuditService, { AuditEvent } from './auditService'
import {
  CommandsRequest,
  CommandsResponse,
  QueriesRequest,
  QueriesResponse,
  AssessmentVersionQueryResult,
  CreateAssessmentCommandResult,
} from '../@types/Assessment'
import { User } from '../@types/User'

describe('AssessmentService', () => {
  let assessmentService: AssessmentService
  let mockAssessmentPlatformApiClient: jest.Mocked<AssessmentPlatformApiClient>
  let mockSessionService: jest.Mocked<SessionService>
  let mockAuditService: jest.Mocked<AuditService>

  const mockPrincipal: PrincipalDetails = {
    identifier: 'user123',
    username: 'testuser',
    displayName: 'Test User',
  }

  const mockUser: User = {
    id: 'user123',
    name: 'Test User',
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockAssessmentPlatformApiClient = {
      executeCommand: jest.fn(),
      executeQuery: jest.fn(),
    } as unknown as jest.Mocked<AssessmentPlatformApiClient>

    mockSessionService = {
      getPrincipalDetails: jest.fn(),
      getSubjectDetails: jest.fn(),
      getAssessmentUuid: jest.fn(),
      getAssessmentVersion: jest.fn(),
    } as unknown as jest.Mocked<SessionService>

    mockAuditService = {
      send: jest.fn(),
    } as unknown as jest.Mocked<AuditService>

    assessmentService = new AssessmentService(mockAssessmentPlatformApiClient, mockSessionService, mockAuditService)
  })

  describe('createAssessment', () => {
    it('should create an assessment successfully', async () => {
      mockSessionService.getPrincipalDetails.mockReturnValue(mockPrincipal)

      const mockResponse: CommandsResponse = {
        commands: [
          {
            request: {
              type: 'CreateAssessmentCommand',
              user: mockUser,
            },
            result: {
              assessmentUuid: 'assessment-uuid-123',
              message: 'Assessment created successfully',
              success: true,
            } as CreateAssessmentCommandResult,
          },
        ],
      }

      mockAssessmentPlatformApiClient.executeCommand.mockResolvedValue(mockResponse)

      const result = await assessmentService.createAssessment()

      expect(result).toEqual({
        assessmentUuid: 'assessment-uuid-123',
        message: 'Assessment created successfully',
      })
    })

    it('should send audit event when creating assessment', async () => {
      mockSessionService.getPrincipalDetails.mockReturnValue(mockPrincipal)

      const mockResponse: CommandsResponse = {
        commands: [
          {
            request: {
              type: 'CreateAssessmentCommand',
              user: mockUser,
            },
            result: {
              assessmentUuid: 'assessment-uuid-123',
              message: 'Assessment created successfully',
              success: true,
            } as CreateAssessmentCommandResult,
          },
        ],
      }

      mockAssessmentPlatformApiClient.executeCommand.mockResolvedValue(mockResponse)

      await assessmentService.createAssessment()

      expect(mockAuditService.send).toHaveBeenCalledWith(AuditEvent.CREATE_ASSESSMENT)
    })

    it('should call executeCommand with correct request structure', async () => {
      mockSessionService.getPrincipalDetails.mockReturnValue(mockPrincipal)

      const mockResponse: CommandsResponse = {
        commands: [
          {
            request: {
              type: 'CreateAssessmentCommand',
              user: mockUser,
            },
            result: {
              assessmentUuid: 'assessment-uuid-123',
              message: 'Assessment created successfully',
              success: true,
            } as CreateAssessmentCommandResult,
          },
        ],
      }

      mockAssessmentPlatformApiClient.executeCommand.mockResolvedValue(mockResponse)

      await assessmentService.createAssessment()

      const expectedRequest: CommandsRequest = {
        commands: [
          {
            type: 'CreateAssessmentCommand',
            user: mockUser,
          },
        ],
      }

      expect(mockAssessmentPlatformApiClient.executeCommand).toHaveBeenCalledWith(expectedRequest)
    })

    it('should throw error when user is not found in session', async () => {
      mockSessionService.getPrincipalDetails.mockReturnValue(undefined)

      await expect(assessmentService.createAssessment()).rejects.toThrow('User not found in session')

      expect(mockAssessmentPlatformApiClient.executeCommand).not.toHaveBeenCalled()
    })

    it('should throw error when API call fails', async () => {
      mockSessionService.getPrincipalDetails.mockReturnValue(mockPrincipal)
      mockAssessmentPlatformApiClient.executeCommand.mockRejectedValue(new Error('API Error'))

      await expect(assessmentService.createAssessment()).rejects.toThrow('API Error')
    })
  })

  describe('getAssessment', () => {
    it('should get an assessment successfully', async () => {
      mockSessionService.getPrincipalDetails.mockReturnValue(mockPrincipal)

      const mockQueryResult: AssessmentVersionQueryResult = {
        answers: { question1: ['answer1'], question2: ['answer2'] },
        collaborators: [mockUser],
        formVersion: 'v1.0',
      }

      const mockResponse: QueriesResponse = {
        queries: [
          {
            request: {
              type: 'AssessmentVersionQuery',
              user: mockUser,
              assessmentUuid: 'assessment-uuid-123',
            },
            result: mockQueryResult,
          },
        ],
      }

      mockAssessmentPlatformApiClient.executeQuery.mockResolvedValue(mockResponse)

      const result = await assessmentService.getAssessment('assessment-uuid-123')

      expect(result).toEqual(mockQueryResult)
    })

    it('should send audit event when getting assessment', async () => {
      mockSessionService.getPrincipalDetails.mockReturnValue(mockPrincipal)

      const mockQueryResult: AssessmentVersionQueryResult = {
        answers: {},
        collaborators: [],
        formVersion: 'v1.0',
      }

      const mockResponse: QueriesResponse = {
        queries: [
          {
            request: {
              type: 'AssessmentVersionQuery',
              user: mockUser,
              assessmentUuid: 'assessment-uuid-123',
            },
            result: mockQueryResult,
          },
        ],
      }

      mockAssessmentPlatformApiClient.executeQuery.mockResolvedValue(mockResponse)

      await assessmentService.getAssessment('assessment-uuid-123')

      expect(mockAuditService.send).toHaveBeenCalledWith(AuditEvent.VIEW_ASSESSMENT)
    })

    it('should call executeQuery with correct request structure without timestamp', async () => {
      mockSessionService.getPrincipalDetails.mockReturnValue(mockPrincipal)

      const mockQueryResult: AssessmentVersionQueryResult = {
        answers: {},
        collaborators: [],
        formVersion: 'v1.0',
      }

      const mockResponse: QueriesResponse = {
        queries: [
          {
            request: {
              type: 'AssessmentVersionQuery',
              user: mockUser,
              assessmentUuid: 'assessment-uuid-123',
            },
            result: mockQueryResult,
          },
        ],
      }

      mockAssessmentPlatformApiClient.executeQuery.mockResolvedValue(mockResponse)

      await assessmentService.getAssessment('assessment-uuid-123')

      const expectedRequest: QueriesRequest = {
        queries: [
          {
            type: 'AssessmentVersionQuery',
            user: mockUser,
            assessmentUuid: 'assessment-uuid-123',
          },
        ],
      }

      expect(mockAssessmentPlatformApiClient.executeQuery).toHaveBeenCalledWith(expectedRequest)
    })

    it('should call executeQuery with correct request structure with timestamp', async () => {
      mockSessionService.getPrincipalDetails.mockReturnValue(mockPrincipal)

      const mockQueryResult: AssessmentVersionQueryResult = {
        answers: {},
        collaborators: [],
        formVersion: 'v1.0',
      }

      const mockResponse: QueriesResponse = {
        queries: [
          {
            request: {
              type: 'AssessmentVersionQuery',
              user: mockUser,
              assessmentUuid: 'assessment-uuid-123',
              timestamp: '2024-01-01T12:00:00Z',
            },
            result: mockQueryResult,
          },
        ],
      }

      mockAssessmentPlatformApiClient.executeQuery.mockResolvedValue(mockResponse)

      await assessmentService.getAssessment('assessment-uuid-123', '2024-01-01T12:00:00Z')

      const expectedRequest: QueriesRequest = {
        queries: [
          {
            type: 'AssessmentVersionQuery',
            user: mockUser,
            assessmentUuid: 'assessment-uuid-123',
            timestamp: '2024-01-01T12:00:00Z',
          },
        ],
      }

      expect(mockAssessmentPlatformApiClient.executeQuery).toHaveBeenCalledWith(expectedRequest)
    })

    it('should throw error when user is not found in session', async () => {
      mockSessionService.getPrincipalDetails.mockReturnValue(undefined)

      await expect(assessmentService.getAssessment('assessment-uuid-123')).rejects.toThrow('User not found in session')

      expect(mockAssessmentPlatformApiClient.executeQuery).not.toHaveBeenCalled()
    })

    it('should throw error when API call fails', async () => {
      mockSessionService.getPrincipalDetails.mockReturnValue(mockPrincipal)
      mockAssessmentPlatformApiClient.executeQuery.mockRejectedValue(new Error('API Error'))

      await expect(assessmentService.getAssessment('assessment-uuid-123')).rejects.toThrow('API Error')
    })

    it('should handle different assessment data structures', async () => {
      mockSessionService.getPrincipalDetails.mockReturnValue(mockPrincipal)

      const mockQueryResult: AssessmentVersionQueryResult = {
        answers: {
          question1: ['answer1', 'answer2'],
          question2: ['answer3'],
          question3: [],
        },
        collaborators: [
          { id: 'user1', name: 'User One' },
          { id: 'user2', name: 'User Two' },
        ],
        formVersion: 'v2.1',
      }

      const mockResponse: QueriesResponse = {
        queries: [
          {
            request: {
              type: 'AssessmentVersionQuery',
              user: mockUser,
              assessmentUuid: 'assessment-uuid-456',
            },
            result: mockQueryResult,
          },
        ],
      }

      mockAssessmentPlatformApiClient.executeQuery.mockResolvedValue(mockResponse)

      const result = await assessmentService.getAssessment('assessment-uuid-456')

      expect(result).toEqual(mockQueryResult)
      expect(result.answers).toHaveProperty('question1')
      expect(result.answers.question1).toHaveLength(2)
      expect(result.collaborators).toHaveLength(2)
    })
  })
})
