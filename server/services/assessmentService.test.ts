import AssessmentService from './assessmentService'
import AssessmentPlatformApiClient from '../data/assessmentPlatformApiClient'
import AuditService from './auditService'
import {
  CommandsRequest,
  CommandsResponse,
  QueriesRequest,
  QueriesResponse,
  AssessmentVersionQueryResult,
  CreateAssessmentCommandResult,
} from '../interfaces/assessment'
import { User } from '../interfaces/user'
import { HmppsUser } from '../interfaces/hmppsUser'

describe('AssessmentService', () => {
  let assessmentService: AssessmentService
  let mockAssessmentPlatformApiClient: jest.Mocked<AssessmentPlatformApiClient>
  let mockAuditService: jest.Mocked<AuditService>

  const mockHmppsUser: HmppsUser = {
    name: 'Test User',
    userId: 'user123',
    username: 'testuser',
    displayName: 'Test User',
    token: 'token',
    authSource: 'nomis',
    staffId: 12345,
    userRoles: [],
  }

  const mockUser: User = {
    id: 'user123',
    name: 'Test User',
  }

  const correlationId = 'test-correlation-id'

  beforeEach(() => {
    jest.clearAllMocks()

    mockAssessmentPlatformApiClient = {
      executeCommand: jest.fn(),
      executeQuery: jest.fn(),
    } as unknown as jest.Mocked<AssessmentPlatformApiClient>

    mockAuditService = {
      send: jest.fn(),
    } as unknown as jest.Mocked<AuditService>

    assessmentService = new AssessmentService(mockAssessmentPlatformApiClient, mockAuditService)
  })

  describe('createAssessment', () => {
    it('should create an assessment successfully', async () => {
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

      const result = await assessmentService.createAssessment(mockHmppsUser, correlationId)

      expect(result).toEqual({
        assessmentUuid: 'assessment-uuid-123',
        message: 'Assessment created successfully',
      })
    })

    it('should call executeCommand with correct request structure', async () => {
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

      await assessmentService.createAssessment(mockHmppsUser, correlationId)

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

    it('should throw error when API call fails', async () => {
      mockAssessmentPlatformApiClient.executeCommand.mockRejectedValue(new Error('API Error'))

      await expect(assessmentService.createAssessment(mockHmppsUser, correlationId)).rejects.toThrow('API Error')
    })
  })

  describe('getAssessment', () => {
    it('should get an assessment successfully', async () => {
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

      const result = await assessmentService.getAssessment(mockHmppsUser, 'assessment-uuid-123', correlationId)

      expect(result).toEqual(mockQueryResult)
    })

    it('should call executeQuery with correct request structure without timestamp', async () => {
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

      await assessmentService.getAssessment(mockHmppsUser, 'assessment-uuid-123', correlationId)

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

      await assessmentService.getAssessment(mockHmppsUser, 'assessment-uuid-123', correlationId, '2024-01-01T12:00:00Z')

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

    it('should throw error when API call fails', async () => {
      mockAssessmentPlatformApiClient.executeQuery.mockRejectedValue(new Error('API Error'))

      await expect(
        assessmentService.getAssessment(mockHmppsUser, 'assessment-uuid-123', correlationId),
      ).rejects.toThrow('API Error')
    })

    it('should handle different assessment data structures', async () => {
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

      const result = await assessmentService.getAssessment(mockHmppsUser, 'assessment-uuid-456', correlationId)

      expect(result).toEqual(mockQueryResult)
      expect(result.answers).toHaveProperty('question1')
      expect(result.answers.question1).toHaveLength(2)
      expect(result.collaborators).toHaveLength(2)
    })
  })
})
