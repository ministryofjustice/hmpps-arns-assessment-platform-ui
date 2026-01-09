import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import { asSystem } from '@ministryofjustice/hmpps-rest-client'
import CoordinatorApiClient from './coordinatorApiClient'
import { OasysCreateRequest, OasysCreateResponse } from '../interfaces/coordinator-api/oasysCreate'

jest.mock('../config', () => ({
  apis: {
    coordinatorApi: {
      url: 'http://localhost:8070',
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

describe('CoordinatorApiClient', () => {
  let client: CoordinatorApiClient
  let mockPost: jest.SpyInstance

  const mockAuthenticationClient = {} as AuthenticationClient

  beforeEach(() => {
    jest.clearAllMocks()

    client = new CoordinatorApiClient(mockAuthenticationClient)
    mockPost = jest.spyOn(client as unknown as { post: jest.Mock }, 'post')
  })

  describe('createOasysAssociation()', () => {
    it('should create association with system auth', async () => {
      // Arrange
      const request: OasysCreateRequest = {
        oasysAssessmentPk: '123456',
        planType: 'INITIAL',
        userDetails: {
          id: 'user-123',
          name: 'Test User',
        },
      }

      const expectedResponse: OasysCreateResponse = {
        sanAssessmentId: 'san-uuid-123',
        sanAssessmentVersion: 1,
        sentencePlanId: 'sp-uuid-456',
        sentencePlanVersion: 1,
      }

      mockPost.mockResolvedValue(expectedResponse)

      // Act
      const result = await client.createOasysAssociation(request)

      // Assert
      expect(result).toEqual(expectedResponse)
      expect(mockPost).toHaveBeenCalledWith({ path: '/oasys/create', data: { ...request } }, asSystem())
    })

    it('should include optional fields when provided', async () => {
      // Arrange
      const request: OasysCreateRequest = {
        oasysAssessmentPk: '123456',
        previousOasysAssessmentPk: '123455',
        regionPrisonCode: 'MDI',
        planType: 'REVIEW',
        userDetails: {
          id: 'user-123',
          name: 'Test User',
          location: 'PRISON',
        },
      }

      const expectedResponse: OasysCreateResponse = {
        sanAssessmentId: 'san-uuid-789',
        sanAssessmentVersion: 2,
        sentencePlanId: 'sp-uuid-012',
        sentencePlanVersion: 2,
      }

      mockPost.mockResolvedValue(expectedResponse)

      // Act
      const result = await client.createOasysAssociation(request)

      // Assert
      expect(result).toEqual(expectedResponse)
      expect(mockPost).toHaveBeenCalledWith({ path: '/oasys/create', data: { ...request } }, asSystem())
    })
  })
})
