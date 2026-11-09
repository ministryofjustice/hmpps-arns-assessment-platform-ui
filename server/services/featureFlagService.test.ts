import { FliptClient } from '@flipt-io/flipt-client-js'
import FeatureFlagService from './featureFlagService'
import { DOWNTIME_BANNER_CONTENT_FLAG, FeatureFlagsConfig } from '../utils/featureFlagsUtils'

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
  let mockEvaluateVariant: jest.Mock

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
    mockEvaluateVariant = jest.fn()
    mockFliptClientInit.mockResolvedValue({
      evaluateBoolean: mockEvaluateBoolean,
      evaluateVariant: mockEvaluateVariant,
    })

    featureFlagService = new FeatureFlagService()
  })

  describe('getDowntimeBannerContent', () => {
    const content = { heading: 'Planned downtime', message: 'Unavailable during maintenance.' }

    it('reads the variant attachment for the current user', async () => {
      mockEvaluateVariant.mockReturnValue({ variantAttachment: JSON.stringify(content) })

      expect(await featureFlagService.getDowntimeBannerContent('user123')).toEqual(content)
      expect(mockEvaluateVariant).toHaveBeenCalledWith({
        flagKey: DOWNTIME_BANNER_CONTENT_FLAG,
        entityId: 'user123',
        context: {},
      })
    })

    it('uses fallbackUser when no user is provided and accepts a default variant attachment', async () => {
      mockEvaluateVariant.mockReturnValue({ match: false, variantAttachment: JSON.stringify(content) })

      expect(await featureFlagService.getDowntimeBannerContent()).toEqual(content)
      expect(mockEvaluateVariant).toHaveBeenCalledWith(expect.objectContaining({ entityId: 'fallbackUser' }))
    })

    it('trims whitespace from the content', async () => {
      mockEvaluateVariant.mockReturnValue({
        variantAttachment: JSON.stringify({ heading: ' Planned downtime ', message: ' Maintenance. ' }),
      })

      expect(await featureFlagService.getDowntimeBannerContent()).toEqual({
        heading: 'Planned downtime',
        message: 'Maintenance.',
      })
    })

    it.each([
      {},
      { heading: 'Planned downtime' },
      { message: 'Maintenance.' },
      { heading: '', message: 'Maintenance.' },
      { heading: 'Planned downtime', message: ' \n ' },
      { heading: 123, message: 'Maintenance.' },
      { heading: 'Planned downtime', message: null },
      null,
      [],
    ])('logs and returns no content for an invalid attachment: %j', async attachment => {
      mockEvaluateVariant.mockReturnValue({ variantAttachment: JSON.stringify(attachment) })

      expect(await featureFlagService.getDowntimeBannerContent()).toBeUndefined()
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Invalid downtime banner content: heading and message must be non-empty strings',
      )
    })

    it.each(['not JSON', '', undefined])('logs and returns no content for unparseable JSON: %s', async attachment => {
      mockEvaluateVariant.mockReturnValue({ variantAttachment: attachment })

      expect(await featureFlagService.getDowntimeBannerContent()).toBeUndefined()
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Error evaluating downtime banner content flag ${DOWNTIME_BANNER_CONTENT_FLAG}:`,
        expect.any(Error),
      )
    })

    it('logs and returns no content when evaluation fails', async () => {
      const error = new Error('Flag not found')
      mockEvaluateVariant.mockImplementation(() => {
        throw error
      })

      expect(await featureFlagService.getDowntimeBannerContent()).toBeUndefined()
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Error evaluating downtime banner content flag ${DOWNTIME_BANNER_CONTENT_FLAG}:`,
        error,
      )
    })

    it('logs and returns no content when the client cannot initialise', async () => {
      mockFliptClientInit.mockRejectedValue(new Error('Flipt unavailable'))

      expect(await featureFlagService.getDowntimeBannerContent()).toBeUndefined()
      expect(mockLogger.error).toHaveBeenCalledWith('Unable to initialise Flipt client for downtime banner content')
      expect(mockEvaluateVariant).not.toHaveBeenCalled()
    })

    it('reuses the boolean flag client', async () => {
      mockEvaluateBoolean.mockReturnValue({ enabled: true })
      mockEvaluateVariant.mockReturnValue({ variantAttachment: JSON.stringify(content) })

      await featureFlagService.evaluateBooleanFlags(mockFeatureFlags)
      await featureFlagService.getDowntimeBannerContent()

      expect(mockFliptClientInit).toHaveBeenCalledTimes(1)
    })
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
