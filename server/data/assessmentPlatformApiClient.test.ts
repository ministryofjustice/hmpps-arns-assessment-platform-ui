import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import AssessmentPlatformApiClient from './assessmentPlatformApiClient'
import { CommandError } from '../errors/aap-api/CommandError'
import { QueryError } from '../errors/aap-api/QueryError'
import { CommandsResponse, QueriesResponse } from '../interfaces/aap-api/response'
import { CreateAssessmentCommand, UpdateAssessmentAnswersCommand } from '../interfaces/aap-api/command'
import { AssessmentVersionQuery, AssessmentTimelineQuery } from '../interfaces/aap-api/query'
import { CreateAssessmentCommandResult, CommandResult, CommandResults } from '../interfaces/aap-api/commandResult'
import { AssessmentVersionQueryResult, AssessmentTimelineQueryResult } from '../interfaces/aap-api/queryResult'
import { User } from '../interfaces/user'

jest.mock('../config', () => ({
  apis: {
    aapApi: {
      url: 'http://localhost:8080',
      timeout: { response: 10000, deadline: 10000 },
      agent: { maxSockets: 100, maxFreeSockets: 10, freeSocketTimeout: 30000 },
    },
  },
}))

jest.mock('../../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}))

describe('AssessmentPlatformApiClient', () => {
  let client: AssessmentPlatformApiClient
  let mockPost: jest.SpyInstance

  const mockAuthenticationClient = {} as AuthenticationClient

  const mockUser: User = {
    id: 'testuser',
    name: 'Test User',
  }

  beforeEach(() => {
    jest.clearAllMocks()

    client = new AssessmentPlatformApiClient(mockAuthenticationClient)
    mockPost = jest.spyOn(client as unknown as { post: jest.Mock }, 'post')
  })

  describe('executeCommand()', () => {
    const command: CreateAssessmentCommand = {
      type: 'CreateAssessmentCommand',
      assessmentType: 'TEST',
      formVersion: '1',
      user: mockUser,
    }

    it('should execute a single command and return its result', async () => {
      // Arrange
      const expectedResult: CreateAssessmentCommandResult = {
        type: 'CreateAssessmentCommandResult',
        assessmentUuid: 'uuid-123',
        message: 'Success',
        success: true,
      }

      const response: CommandsResponse = {
        commands: [{ request: command, result: expectedResult }],
      }

      mockPost.mockResolvedValue(response)

      // Act
      const result = await client.executeCommand(command)

      // Assert
      expect(result).toEqual(expectedResult)
      expect(mockPost).toHaveBeenCalledWith({ path: '/command', data: { commands: [command] } }, expect.anything())
    })

    it('should throw CommandError when command fails', async () => {
      // Arrange
      const failedResult: CommandResults = {
        type: 'CommandResult',
        message: 'Validation failed',
        success: false,
      }

      const response: CommandsResponse = {
        commands: [{ request: command, result: failedResult }],
      }

      mockPost.mockResolvedValue(response)

      // Act & Assert
      await expect(client.executeCommand(command)).rejects.toThrow(CommandError)
      await expect(client.executeCommand(command)).rejects.toThrow('CreateAssessmentCommand failed: Validation failed')
    })
  })

  describe('executeCommands()', () => {
    const command1: CreateAssessmentCommand = {
      type: 'CreateAssessmentCommand',
      assessmentType: 'TEST',
      formVersion: '1',
      user: mockUser,
    }

    const command2: UpdateAssessmentAnswersCommand = {
      type: 'UpdateAssessmentAnswersCommand',
      assessmentUuid: 'uuid-123',
      user: mockUser,
      added: { question1: { type: 'Single', value: 'answer1' } },
      removed: [],
    }

    it('should execute multiple commands and return all results', async () => {
      // Arrange
      const result1: CreateAssessmentCommandResult = {
        type: 'CreateAssessmentCommandResult',
        assessmentUuid: 'uuid-123',
        message: 'Created',
        success: true,
      }

      const result2: CommandResult = {
        type: 'CommandResult',
        message: 'Updated',
        success: true,
      }

      const response: CommandsResponse = {
        commands: [
          { request: command1, result: result1 },
          { request: command2, result: result2 },
        ],
      }

      mockPost.mockResolvedValue(response)

      // Act
      const [returnedResult1, returnedResult2] = await client.executeCommands(command1, command2)

      // Assert
      expect(returnedResult1).toEqual(result1)
      expect(returnedResult2).toEqual(result2)
      expect(mockPost).toHaveBeenCalledWith(
        { path: '/command', data: { commands: [command1, command2] } },
        expect.anything(),
      )
    })

    it('should throw CommandError when any command fails', async () => {
      // Arrange
      const result1: CreateAssessmentCommandResult = {
        type: 'CreateAssessmentCommandResult',
        assessmentUuid: 'uuid-123',
        message: 'Created',
        success: true,
      }

      const failedResult: CommandResult = {
        type: 'CommandResult',
        message: 'Update failed',
        success: false,
      }

      const response: CommandsResponse = {
        commands: [
          { request: command1, result: result1 },
          { request: command2, result: failedResult },
        ],
      }

      mockPost.mockResolvedValue(response)

      // Act & Assert
      await expect(client.executeCommands(command1, command2)).rejects.toThrow(CommandError)

      try {
        await client.executeCommands(command1, command2)
      } catch (error) {
        expect(error).toBeInstanceOf(CommandError)
        expect((error as CommandError).commandType).toBe('UpdateAssessmentAnswersCommand')
        expect((error as CommandError).resultIndex).toBe(1)
      }
    })

    it('should throw CommandError when result is undefined', async () => {
      // Arrange
      const response: CommandsResponse = {
        commands: [{ request: command1, result: undefined as unknown as CommandResults }],
      }

      mockPost.mockResolvedValue(response)

      // Act & Assert
      await expect(client.executeCommands(command1)).rejects.toThrow(CommandError)
      await expect(client.executeCommands(command1)).rejects.toThrow('CreateAssessmentCommand failed: Unknown error')
    })
  })

  describe('executeQuery()', () => {
    const query: AssessmentVersionQuery = {
      type: 'AssessmentVersionQuery',
      user: mockUser,
      assessmentIdentifier: { type: 'UUID', uuid: 'uuid-123' },
    }

    it('should execute a single query and return its result', async () => {
      // Arrange
      const expectedResult: AssessmentVersionQueryResult = {
        type: 'AssessmentVersionQueryResult',
        assessmentUuid: 'uuid-123',
        aggregateUuid: 'agg-123',
        assessmentType: 'TEST',
        formVersion: '1',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        answers: {},
        properties: {},
        collections: [],
        collaborators: [mockUser],
        identifiers: {},
      }

      const response: QueriesResponse = {
        queries: [{ request: query, result: expectedResult }],
      }

      mockPost.mockResolvedValue(response)

      // Act
      const result = await client.executeQuery(query)

      // Assert
      expect(result).toEqual(expectedResult)
      expect(mockPost).toHaveBeenCalledWith({ path: '/query', data: { queries: [query] } }, expect.anything())
    })

    it('should throw QueryError when query returns no result', async () => {
      // Arrange
      const response: QueriesResponse = {
        queries: [{ request: query, result: undefined as unknown as AssessmentVersionQueryResult }],
      }

      mockPost.mockResolvedValue(response)

      // Act & Assert
      await expect(client.executeQuery(query)).rejects.toThrow(QueryError)
      await expect(client.executeQuery(query)).rejects.toThrow('AssessmentVersionQuery failed')
    })
  })

  describe('executeQueries()', () => {
    const query1: AssessmentVersionQuery = {
      type: 'AssessmentVersionQuery',
      user: mockUser,
      assessmentIdentifier: { type: 'UUID', uuid: 'uuid-123' },
    }

    const query2: AssessmentTimelineQuery = {
      type: 'AssessmentTimelineQuery',
      user: mockUser,
      assessmentIdentifier: { type: 'UUID', uuid: 'uuid-123' },
    }

    it('should execute multiple queries and return all results', async () => {
      // Arrange
      const result1: AssessmentVersionQueryResult = {
        type: 'AssessmentVersionQueryResult',
        assessmentUuid: 'uuid-123',
        aggregateUuid: 'agg-123',
        assessmentType: 'TEST',
        formVersion: '1',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        answers: {},
        properties: {},
        collections: [],
        collaborators: [mockUser],
        identifiers: {},
      }

      const result2: AssessmentTimelineQueryResult = {
        type: 'AssessmentTimelineQueryResult',
        timeline: [],
      }

      const response: QueriesResponse = {
        queries: [
          { request: query1, result: result1 },
          { request: query2, result: result2 },
        ],
      }

      mockPost.mockResolvedValue(response)

      // Act
      const [returnedResult1, returnedResult2] = await client.executeQueries(query1, query2)

      // Assert
      expect(returnedResult1).toEqual(result1)
      expect(returnedResult2).toEqual(result2)
      expect(mockPost).toHaveBeenCalledWith({ path: '/query', data: { queries: [query1, query2] } }, expect.anything())
    })

    it('should throw QueryError when any query returns no result', async () => {
      // Arrange
      const result1: AssessmentVersionQueryResult = {
        type: 'AssessmentVersionQueryResult',
        assessmentUuid: 'uuid-123',
        aggregateUuid: 'agg-123',
        assessmentType: 'TEST',
        formVersion: '1',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        answers: {},
        properties: {},
        collections: [],
        collaborators: [mockUser],
        identifiers: {},
      }

      const response: QueriesResponse = {
        queries: [
          { request: query1, result: result1 },
          { request: query2, result: undefined as unknown as AssessmentTimelineQueryResult },
        ],
      }

      mockPost.mockResolvedValue(response)

      // Act & Assert
      await expect(client.executeQueries(query1, query2)).rejects.toThrow(QueryError)

      try {
        await client.executeQueries(query1, query2)
      } catch (error) {
        expect(error).toBeInstanceOf(QueryError)
        expect((error as QueryError).queryType).toBe('AssessmentTimelineQuery')
        expect((error as QueryError).resultIndex).toBe(1)
      }
    })
  })
})
