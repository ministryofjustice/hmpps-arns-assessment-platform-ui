import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import { asSystem, asUser } from '@ministryofjustice/hmpps-rest-client'
import HandoverApiClient from './handoverApiClient'
import { CreateHandoverLinkRequest, UpdateHandoverContextRequest } from '../interfaces/handover-api/request'
import { CreateHandoverLinkResponse, HandoverContext } from '../interfaces/handover-api/response'
import { HandoverPrincipalDetails, HandoverSubjectDetails } from '../interfaces/handover-api/shared'

jest.mock('../config', () => ({
  apis: {
    arnsHandover: {
      url: 'http://localhost:7070',
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

describe('HandoverApiClient', () => {
  let client: HandoverApiClient
  let mockGet: jest.SpyInstance
  let mockPost: jest.SpyInstance

  const mockAuthenticationClient = {} as AuthenticationClient

  const mockPrincipal: HandoverPrincipalDetails = {
    identifier: 'user-123',
    displayName: 'Test User',
    accessMode: 'READ_WRITE',
    returnUrl: 'http://localhost:3000',
  }

  const mockSubject: HandoverSubjectDetails = {
    crn: 'X123456',
    pnc: '01/12345678A',
    givenName: 'John',
    familyName: 'Doe',
    dateOfBirth: '1990-01-01',
    gender: '1',
    location: 'COMMUNITY',
  }

  beforeEach(() => {
    jest.clearAllMocks()

    client = new HandoverApiClient(mockAuthenticationClient)
    mockGet = jest.spyOn(client as unknown as { get: jest.Mock }, 'get')
    mockPost = jest.spyOn(client as unknown as { post: jest.Mock }, 'post')
  })

  describe('getContext()', () => {
    it('should fetch context by session ID with system auth', async () => {
      // Arrange
      const sessionId = 'session-uuid-123'
      const expectedContext: HandoverContext = {
        handoverSessionId: sessionId,
        principal: mockPrincipal,
        subject: mockSubject,
      }

      mockGet.mockResolvedValue(expectedContext)

      // Act
      const result = await client.getContext(sessionId)

      // Assert
      expect(result).toEqual(expectedContext)
      expect(mockGet).toHaveBeenCalledWith({ path: `/context/${sessionId}` }, asSystem())
    })
  })

  describe('getCurrentContext()', () => {
    it('should fetch context for authenticated user with user token', async () => {
      // Arrange
      const userToken = 'user-jwt-token'
      const expectedContext: HandoverContext = {
        handoverSessionId: 'session-uuid-456',
        principal: mockPrincipal,
        subject: mockSubject,
      }

      mockGet.mockResolvedValue(expectedContext)

      // Act
      const result = await client.getCurrentContext(userToken)

      // Assert
      expect(result).toEqual(expectedContext)
      expect(mockGet).toHaveBeenCalledWith({ path: '/context' }, asUser(userToken))
    })
  })

  describe('createHandoverLink()', () => {
    it('should create handover link with system auth', async () => {
      // Arrange
      const request: CreateHandoverLinkRequest = {
        user: mockPrincipal,
        subjectDetails: mockSubject,
        oasysAssessmentPk: 123456,
        assessmentVersion: 1,
        planVersion: 2,
      }

      const expectedResponse: CreateHandoverLinkResponse = {
        handoverSessionId: 'new-session-uuid',
        handoverLink: 'http://localhost:7070/handover/abc123',
      }

      mockPost.mockResolvedValue(expectedResponse)

      // Act
      const result = await client.createHandoverLink(request)

      // Assert
      expect(result).toEqual(expectedResponse)
      expect(mockPost).toHaveBeenCalledWith({ path: '/handover', data: { ...request } }, asSystem())
    })

    it('should include criminogenic needs data when provided', async () => {
      // Arrange
      const request: CreateHandoverLinkRequest = {
        user: mockPrincipal,
        subjectDetails: mockSubject,
        oasysAssessmentPk: 123456,
        criminogenicNeedsData: {
          accommodation: {
            accLinkedToHarm: 'YES',
            accLinkedToReoffending: 'NO',
            accStrengths: 'NULL',
          },
        },
      }

      const expectedResponse: CreateHandoverLinkResponse = {
        handoverSessionId: 'new-session-uuid',
        handoverLink: 'http://localhost:7070/handover/abc123',
      }

      mockPost.mockResolvedValue(expectedResponse)

      // Act
      const result = await client.createHandoverLink(request)

      // Assert
      expect(result).toEqual(expectedResponse)
      expect(mockPost).toHaveBeenCalledWith({ path: '/handover', data: { ...request } }, asSystem())
    })
  })

  describe('updateContext()', () => {
    it('should update context with system auth', async () => {
      // Arrange
      const sessionId = 'session-uuid-789'
      const request: UpdateHandoverContextRequest = {
        principal: mockPrincipal,
        subject: mockSubject,
        assessmentContext: {
          oasysAssessmentPk: '123456',
          assessmentVersion: 1,
        },
      }

      const expectedContext: HandoverContext = {
        handoverSessionId: sessionId,
        principal: mockPrincipal,
        subject: mockSubject,
        assessmentContext: request.assessmentContext,
      }

      mockPost.mockResolvedValue(expectedContext)

      // Act
      const result = await client.updateContext(sessionId, request)

      // Assert
      expect(result).toEqual(expectedContext)
      expect(mockPost).toHaveBeenCalledWith({ path: `/context/${sessionId}`, data: { ...request } }, asSystem())
    })
  })
})
