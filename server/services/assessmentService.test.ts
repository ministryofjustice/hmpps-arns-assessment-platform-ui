import AssessmentService from './assessmentService'
import AssessmentPlatformApiClient from '../data/assessmentPlatformApiClient'
import { User } from '../interfaces/user'
import { HmppsUser } from '../interfaces/hmppsUser'
import { CommandsResponse, QueriesResponse } from '../interfaces/aap-api/response'
import { CreateAssessmentCommand } from '../interfaces/aap-api/command'
import { AssessmentVersionQuery } from '../interfaces/aap-api/query'
import { AssessmentVersionQueryResult } from '../interfaces/aap-api/queryResult'

describe('AssessmentService', () => {
  let assessmentService: AssessmentService
  let mockAssessmentPlatformApiClient: jest.Mocked<AssessmentPlatformApiClient>

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
    id: mockHmppsUser.username,
    name: mockHmppsUser.displayName,
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockAssessmentPlatformApiClient = {
      executeCommands: jest.fn(),
      executeQueries: jest.fn(),
    } as unknown as jest.Mocked<AssessmentPlatformApiClient>

    assessmentService = new AssessmentService(mockAssessmentPlatformApiClient)
  })

  describe('command', () => {
    const command: CreateAssessmentCommand = {
      type: 'CreateAssessmentCommand',
      assessmentType: 'TEST',
      formVersion: '1',
      user: mockUser,
    }

    it('should execute a command and return its result', async () => {
      const expectedRequest = {
        commands: [command],
      }

      const expectedResult = {
        type: 'CreateAssessmentCommandResult',
        assessmentUuid: 'assessment-uuid-123',
        message: 'Assessment created successfully',
        success: true,
      }

      const mockResponse: CommandsResponse = {
        commands: [
          {
            request: command,
            result: expectedResult,
          },
        ],
      }

      mockAssessmentPlatformApiClient.executeCommands.mockResolvedValue(mockResponse)

      const result = await assessmentService.command(command)

      expect(result).toEqual(expectedResult)
      expect(mockAssessmentPlatformApiClient.executeCommands).toHaveBeenCalledWith(expectedRequest)
    })

    it('should throw error when API call fails', async () => {
      mockAssessmentPlatformApiClient.executeCommands.mockRejectedValue(new Error('API Error'))

      await expect(assessmentService.command(command)).rejects.toThrow('API Error')
    })
  })

  describe('query', () => {
    const query: AssessmentVersionQuery = {
      type: 'AssessmentVersionQuery',
      user: mockUser,
      assessmentIdentifier: { type: 'UUID', uuid: 'assessment-uuid-123' },
    }

    it('should execute a query and return its result', async () => {
      const expectedRequest = {
        queries: [query],
      }

      const expectedResult: AssessmentVersionQueryResult = {
        type: 'AssessmentVersionQueryResult',
        assessmentUuid: '',
        aggregateUuid: '',
        assessmentType: '',
        formVersion: '1',
        createdAt: '2025-02-11T00:00:00',
        updatedAt: '2025-02-11T00:00:00',
        answers: {
          question1: { type: 'Single', value: 'answer1' },
          question2: { type: 'Multi', values: ['answer2-a', 'answer2-b'] },
        },
        properties: {},
        collections: [],
        collaborators: [mockUser],
        identifiers: {},
      }

      const mockResponse: QueriesResponse = {
        queries: [
          {
            request: query,
            result: expectedResult,
          },
        ],
      }

      mockAssessmentPlatformApiClient.executeQueries.mockResolvedValue(mockResponse)

      const result = await assessmentService.query(query)

      expect(result).toEqual(expectedResult)
      expect(mockAssessmentPlatformApiClient.executeQueries).toHaveBeenCalledWith(expectedRequest)
    })

    it('should throw error when API call fails', async () => {
      mockAssessmentPlatformApiClient.executeQueries.mockRejectedValue(new Error('API Error'))

      await expect(assessmentService.query(query)).rejects.toThrow('API Error')
    })
  })
})
