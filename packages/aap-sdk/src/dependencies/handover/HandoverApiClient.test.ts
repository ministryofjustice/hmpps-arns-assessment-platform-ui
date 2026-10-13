import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import { AgentConfig, asSystem, asUser, type ApiConfig } from '@ministryofjustice/hmpps-rest-client'
import type { CreateHandoverLinkRequest, UpdateHandoverContextRequest } from './HandoverRequest.type'
import type { CreateHandoverLinkResponse, HandoverContext } from './HandoverResponse.type'
import type { HandoverPrincipalDetails, HandoverSubjectDetails } from './HandoverShared.type'
import HandoverApiClient from './HandoverApiClient'

describe('HandoverApiClient', () => {
  let client: HandoverApiClient
  let mockGet: jest.SpyInstance
  let mockPost: jest.SpyInstance

  const mockAuthenticationClient = {} as AuthenticationClient
  const apiConfig: ApiConfig = {
    url: 'http://localhost:7070',
    timeout: { response: 10000, deadline: 10000 },
    agent: new AgentConfig(),
  }

  const mockPrincipal: HandoverPrincipalDetails = {
    identifier: 'user-123',
    displayName: 'Test User',
    accessMode: 'READ_WRITE',
    planAccessMode: 'READ_WRITE',
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

    client = new HandoverApiClient(apiConfig, mockAuthenticationClient, console)
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
        oasysAssessmentPk: '123456',
        assessmentVersion: 1,
        sentencePlanVersion: 2,
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
        oasysAssessmentPk: '123456',
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
