import { FliptClient } from '@flipt-io/flipt-client-js'
import FeatureFlagService from './featureFlagService'
import { FeatureFlagsConfig } from '../utils/featureFlagsUtils'

jest.mock('@flipt-io/flipt-client-js')
jest.mock('../config', () => ({
  default: {
    featureFlagUrl: 'mock-url',
  },
}))
jest.mock('../../logger', () => ({
  error: jest.fn(),
}))

const mockLogger = jest.requireMock('../../logger')
const mockFliptClientInit = FliptClient.init as jest.Mock

describe('FeatureFlagService', () => {
  let featureFlagService: FeatureFlagService
  let mockEvaluateBoolean: jest.Mock

  const mockFeatureFlags: FeatureFlagsConfig = {
    TEST_FLAG_ONE: {
      fliptKey: 'test-flag-one',
      nunjucksKey: 'testFlagOneEnabled',
      fallbackState: true,
    },
    TEST_FLAG_TWO: {
      fliptKey: 'test-flag-two',
      nunjucksKey: 'testFlagTwoEnabled',
      fallbackState: false,
    },
  }

  const getExpectedFallbackResult = () => ({
    [mockFeatureFlags.TEST_FLAG_ONE.nunjucksKey]: mockFeatureFlags.TEST_FLAG_ONE.fallbackState,
    [mockFeatureFlags.TEST_FLAG_TWO.nunjucksKey]: mockFeatureFlags.TEST_FLAG_TWO.fallbackState,
  })

  beforeEach(() => {
    jest.clearAllMocks()

    mockEvaluateBoolean = jest.fn()
    mockFliptClientInit.mockResolvedValue({ evaluateBoolean: mockEvaluateBoolean })

    featureFlagService = new FeatureFlagService()
  })

  describe('evaluateBooleanFlags', () => {
    it('should evaluate flags successfully and return their values', async () => {
      const flagResults: Record<string, boolean> = {
        [mockFeatureFlags.TEST_FLAG_ONE.fliptKey]: false,
        [mockFeatureFlags.TEST_FLAG_TWO.fliptKey]: true,
      }
      mockEvaluateBoolean.mockImplementation(({ flagKey }) => ({
        enabled: flagResults[flagKey],
        flagKey,
        reason: 'MATCH',
        requestId: '1',
      }))

      const result = await featureFlagService.evaluateBooleanFlags(mockFeatureFlags, 'user123')

      expect(result.booleanFeatureFlags).toEqual({
        [mockFeatureFlags.TEST_FLAG_ONE.nunjucksKey]: false,
        [mockFeatureFlags.TEST_FLAG_TWO.nunjucksKey]: true,
      })
      expect(mockEvaluateBoolean).toHaveBeenCalledWith({
        flagKey: mockFeatureFlags.TEST_FLAG_ONE.fliptKey,
        entityId: 'user123',
        context: {},
      })
    })

    it('should use fallbackUser when userId is not provided', async () => {
      mockEvaluateBoolean.mockImplementation(({ flagKey }) => ({
        enabled: true,
        flagKey,
        reason: 'MATCH',
        requestId: '1',
      }))

      await featureFlagService.evaluateBooleanFlags(mockFeatureFlags)

      expect(mockEvaluateBoolean).toHaveBeenCalledWith(expect.objectContaining({ entityId: 'fallbackUser' }))
    })

    it('should return fallback values when client fails to initialise', async () => {
      mockFliptClientInit.mockResolvedValue(undefined)
      featureFlagService = new FeatureFlagService()

      const result = await featureFlagService.evaluateBooleanFlags(mockFeatureFlags, 'user123')

      expect(result.booleanFeatureFlags).toEqual(getExpectedFallbackResult())
      expect(mockLogger.error).toHaveBeenCalledWith('Unable to initialise Flipt client for feature flag evaluation')
    })

    it('should return fallback value for a flag when its evaluation throws an error', async () => {
      const failingFlag = mockFeatureFlags.TEST_FLAG_ONE
      const testError = new Error('Flag evaluation failed')
      mockEvaluateBoolean.mockImplementation(({ flagKey }) => {
        if (flagKey === failingFlag.fliptKey) {
          throw testError
        }
        return { enabled: true, flagKey, reason: 'MATCH', requestId: '1' }
      })

      const result = await featureFlagService.evaluateBooleanFlags(mockFeatureFlags, 'user123')

      expect(result.booleanFeatureFlags).toEqual({
        [mockFeatureFlags.TEST_FLAG_ONE.nunjucksKey]: failingFlag.fallbackState,
        [mockFeatureFlags.TEST_FLAG_TWO.nunjucksKey]: true,
      })
      expect(mockLogger.error).toHaveBeenCalledWith(`Error evaluating feature flag ${failingFlag.fliptKey}:`, testError)
    })
  })
})
