import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import { asUser } from '@ministryofjustice/hmpps-rest-client'
import ArnsApiClient from './arnsApiClient'
import { AssessmentNeedsDto } from '../interfaces/arns-api/assessmentNeeds'

jest.mock('../config', () => ({
  apis: {
    arnsApi: {
      url: 'http://localhost:9091',
      timeout: { response: 5000, deadline: 5000 },
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

describe('ArnsApiClient', () => {
  let client: ArnsApiClient
  let mockGet: jest.SpyInstance

  const mockAuthenticationClient = {} as AuthenticationClient

  beforeEach(() => {
    jest.clearAllMocks()

    client = new ArnsApiClient(mockAuthenticationClient)
    mockGet = jest.spyOn(client as unknown as { get: jest.Mock }, 'get')
  })

  describe('getCriminogenicNeeds()', () => {
    it('should fetch criminogenic needs by CRN with the user token', async () => {
      // Arrange
      const crn = 'X123456'
      const userToken = 'user-jwt-token'
      const expectedNeeds: AssessmentNeedsDto = {
        identifiedNeeds: [],
        notIdentifiedNeeds: [],
        unansweredNeeds: [],
        assessmentVersion: 'SAN',
      }

      mockGet.mockResolvedValue(expectedNeeds)

      // Act
      const result = await client.getCriminogenicNeeds(crn, userToken)

      // Assert
      expect(result).toEqual(expectedNeeds)
      expect(mockGet).toHaveBeenCalledWith({ path: `/needs/crn/${crn}` }, asUser(userToken))
    })
  })
})
