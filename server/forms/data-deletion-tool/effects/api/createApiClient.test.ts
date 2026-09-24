import type { AssessmentPlatformApi } from '@ministryofjustice/hmpps-aap-sdk/dependencies/assessment-platform/AssessmentPlatformApi.type'
import { createApiClient } from './createApiClient'
import type { DataDeletionToolContext, DataDeletionToolEffectsDeps } from '../types'

describe('createApiClient', () => {
  const api = {} as AssessmentPlatformApi
  const create = jest.fn(() => api)
  const deps: DataDeletionToolEffectsDeps = {
    assessmentPlatformApiFactory: { create },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should request an API client for the selected environment', () => {
    // Arrange
    const context = {
      getSession: jest.fn(() => ({
        answers: {
          environment: 'test',
          clientId: 'data-deletion-client',
          clientSecret: 'secret',
        },
      })),
    } as unknown as DataDeletionToolContext

    // Act
    const result = createApiClient(deps, context)

    // Assert
    expect(result).toBe(api)
    expect(create).toHaveBeenCalledWith({
      apiUrl: 'https://arns-assessment-platform-api-test.hmpps.service.justice.gov.uk',
      authenticationUrl: 'https://sign-in-dev.hmpps.service.justice.gov.uk/auth',
      clientId: 'data-deletion-client',
      clientSecret: 'secret',
    })
  })

  it('should reject an unknown environment', () => {
    // Arrange
    const context = {
      getSession: jest.fn(() => ({
        answers: {
          environment: 'unknown',
          clientId: 'data-deletion-client',
          clientSecret: 'secret',
        },
      })),
    } as unknown as DataDeletionToolContext

    // Act
    const createForUnknownEnvironment = () => createApiClient(deps, context)

    // Assert
    expect(createForUnknownEnvironment).toThrow('A valid environment is required')
    expect(create).not.toHaveBeenCalled()
  })
})
