import { User } from '@ministryofjustice/hmpps-aap-sdk/types/authentication/User.type'
import { HmppsUser } from '@ministryofjustice/hmpps-aap-sdk/types/authentication/HmppsUser.type'
import { CreateAssessmentCommand } from '@ministryofjustice/hmpps-aap-sdk/dependencies/assessment-platform/AssessmentCommand.type'
import { AssessmentVersionQuery } from '@ministryofjustice/hmpps-aap-sdk/dependencies/assessment-platform/AssessmentQuery.type'
import { AssessmentVersionQueryResult } from '@ministryofjustice/hmpps-aap-sdk/dependencies/assessment-platform/AssessmentQueryResult.type'
import { CreateAssessmentCommandResult } from '@ministryofjustice/hmpps-aap-sdk/dependencies/assessment-platform/AssessmentCommandResult.type'
import type { AssessmentPlatformApi } from '@ministryofjustice/hmpps-aap-sdk/dependencies/assessment-platform/AssessmentPlatformApi.type'
import AssessmentService from './assessmentService'

describe('AssessmentService', () => {
  let assessmentService: AssessmentService
  let mockAssessmentPlatformApi: jest.Mocked<AssessmentPlatformApi>

  const mockHmppsUser: HmppsUser = {
    name: 'Test User',
    userId: 'user123',
    username: 'testuser',
    displayName: 'Test User',
    token: 'token',
    authSource: 'HMPPS_AUTH',
    staffId: 12345,
    userRoles: [],
  }

  const mockUser: User = {
    id: mockHmppsUser.username,
    name: mockHmppsUser.displayName,
    authSource: mockHmppsUser.authSource,
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockAssessmentPlatformApi = {
      executeCommand: jest.fn(),
      executeCommands: jest.fn(),
      executeQuery: jest.fn(),
      getDataDeletionData: jest.fn(),
      postDataDeletionRequest: jest.fn(),
    }

    assessmentService = new AssessmentService(mockAssessmentPlatformApi)
  })

  describe('command', () => {
    const command: CreateAssessmentCommand = {
      type: 'CreateAssessmentCommand',
      assessmentType: 'TEST',
      formVersion: '1',
      user: mockUser,
    }

    it('should execute a command and return its result', async () => {
      // Arrange
      const expectedResult: CreateAssessmentCommandResult = {
        type: 'CreateAssessmentCommandResult',
        assessmentUuid: 'assessment-uuid-123',
        message: 'Assessment created successfully',
        success: true,
      }

      mockAssessmentPlatformApi.executeCommands.mockResolvedValue([expectedResult])

      // Act
      const result = await assessmentService.command(command)

      // Assert
      expect(result).toEqual(expectedResult)
      expect(mockAssessmentPlatformApi.executeCommands).toHaveBeenCalledWith(command)
    })

    it('should throw error when API call fails', async () => {
      mockAssessmentPlatformApi.executeCommands.mockRejectedValue(new Error('API Error'))

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
      // Arrange
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
        flags: [],
      }

      mockAssessmentPlatformApi.executeQuery.mockResolvedValue(expectedResult)

      // Act
      const result = await assessmentService.query(query)

      // Assert
      expect(result).toEqual(expectedResult)
      expect(mockAssessmentPlatformApi.executeQuery).toHaveBeenCalledWith(query)
    })

    it('should throw error when API call fails', async () => {
      mockAssessmentPlatformApi.executeQuery.mockRejectedValue(new Error('API Error'))

      await expect(assessmentService.query(query)).rejects.toThrow('API Error')
    })
  })
})
