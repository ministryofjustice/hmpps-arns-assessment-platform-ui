import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import { asSystem } from '@ministryofjustice/hmpps-rest-client'
import CoordinatorApiClient from './coordinatorApiClient'
import { OasysCreateRequest, OasysCreateResponse } from '../interfaces/coordinator-api/oasysCreate'
import { EntityAssessmentResponse } from '../interfaces/coordinator-api/entityAssessment'
import { PreviousVersionsResponse } from '../interfaces/coordinator-api/previousVersions'

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
  let mockGet: jest.SpyInstance

  const mockAuthenticationClient = {} as AuthenticationClient

  beforeEach(() => {
    jest.clearAllMocks()

    client = new CoordinatorApiClient(mockAuthenticationClient)
    mockPost = jest.spyOn(client as unknown as { post: jest.Mock }, 'post')
    mockGet = jest.spyOn(client as unknown as { get: jest.Mock }, 'get')
  })

  describe('createOasysAssociation()', () => {
    it('should create association with system auth', async () => {
      // Arrange
      const request: OasysCreateRequest = {
        oasysAssessmentPk: '123456',
        planType: 'INITIAL',
        assessmentType: 'SAN_SP',
        userDetails: {
          id: 'user-123',
          name: 'Test User',
        },
        newPeriodOfSupervision: 'N',
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
        previousOasysSanPk: '123455',
        previousOasysSpPk: '123454',
        regionPrisonCode: 'MDI',
        planType: 'REVIEW',
        assessmentType: 'SAN_SP',
        userDetails: {
          id: 'user-123',
          name: 'Test User',
          location: 'PRISON',
        },
        subjectDetails: {
          crn: 'X123456',
          nomisId: 'A1234BC',
        },
        newPeriodOfSupervision: 'Y',
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

  describe('getEntityAssessment()', () => {
    it('should fetch assessment data with system auth', async () => {
      // Arrange
      const entityUuid = '90a71d16-fecd-4e1a-85b9-98178bf0f8d0'
      const expectedResponse: EntityAssessmentResponse = {
        sanAssessmentId: entityUuid,
        sanAssessmentVersion: 1,
        sanAssessmentData: {
          accommodation_section_complete: { value: 'YES' },
          accommodation_practitioner_analysis_risk_of_serious_harm: { value: 'YES' },
          accommodation_practitioner_analysis_risk_of_serious_harm_yes_details: { value: 'Risk details' },
        },
        sanOasysEquivalent: {},
        lastUpdatedTimestampSAN: '2024-01-01T10:00:00Z',
        sentencePlanId: 'sp-uuid-123',
        sentencePlanVersion: 1,
        planComplete: 'INCOMPLETE',
        planType: 'INITIAL',
        lastUpdatedTimestampSP: '2024-01-01T10:00:00Z',
      }

      mockGet.mockResolvedValue(expectedResponse)

      // Act
      const result = await client.getEntityAssessment(entityUuid)

      // Assert
      expect(result).toEqual(expectedResponse)
      expect(mockGet).toHaveBeenCalledWith({ path: `/entity/${entityUuid}/ASSESSMENT` }, asSystem())
    })

    it('should propagate 404 errors', async () => {
      // Arrange
      const entityUuid = 'non-existent-uuid'
      const error = new Error('Not found')
      mockGet.mockRejectedValue(error)

      // Act & Assert
      await expect(client.getEntityAssessment(entityUuid)).rejects.toThrow('Not found')
    })
  })

  describe('getVersionsByEntityId()', () => {
    it('should fetch assessment versions with system auth', async () => {
      // Arrange
      const entityUuid = '90a71d16-fecd-4e1a-85b9-98178bf0f8d0'
      const expectedResponse: PreviousVersionsResponse = {
        allVersions: {
          '2024-01-01': {
            description: 'Assessment and plan updated',
            assessmentVersion: {
              uuid: 'san-version-uuid',
              version: 0,
              createdAt: '2024-01-01T10:00:00Z',
              updatedAt: '2024-01-01T10:00:00Z',
              status: 'UNSIGNED',
              planAgreementStatus: null,
              entityType: 'ASSESSMENT',
            },
            planVersion: {
              uuid: 'sp-version-uuid',
              version: 123456789,
              createdAt: '2024-01-01T10:00:00Z',
              updatedAt: '2024-01-01T10:00:00Z',
              status: 'UNSIGNED',
              planAgreementStatus: 'AGREED',
              entityType: 'AAP_PLAN',
            },
          },
        },
        countersignedVersions: {},
      }

      mockGet.mockResolvedValue(expectedResponse)

      // Act
      const result = await client.getVersionsByEntityId(entityUuid)

      // Assert
      expect(result).toEqual(expectedResponse)
      expect(mockGet).toHaveBeenCalledWith({ path: `/entity/versions/${entityUuid}` }, asSystem())
    })

    it('should propagate 404 errors', async () => {
      // Arrange
      const entityUuid = 'non-existent-uuid'
      const error = new Error('Not found')
      mockGet.mockRejectedValue(error)

      // Act & Assert
      await expect(client.getVersionsByEntityId(entityUuid)).rejects.toThrow('Not found')
    })
  })
})
