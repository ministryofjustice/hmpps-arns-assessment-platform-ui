import { FliptClient, type ClientOptions } from '@flipt-io/flipt-client-js'
import { z } from 'zod'
import config from '../config'
import logger from '../../logger'
import {
  BooleanFeatureFlagsResult,
  DOWNTIME_BANNER_CONTENT_FLAG,
  DowntimeBannerContent,
  FEATURE_FLAG_NAMESPACE,
  FeatureFlagConfig,
  FeatureFlagsConfig,
  UPDATE_INTERVAL_SECONDS,
  getFallbackFeatureFlags,
} from '../utils/featureFlagsUtils'

const downtimeBannerContentSchema = z.object({
  heading: z.string().trim().min(1),
  message: z.string().trim().min(1),
})

const getConfig = (): FeatureFlagConfig => {
  return {
    url: config.featureFlagUrl,
    namespace: FEATURE_FLAG_NAMESPACE,
    updateInterval: UPDATE_INTERVAL_SECONDS,
  }
}

export default class FeatureFlagService {
  private readonly clientConfig: ClientOptions | undefined

  private client: FliptClient

  private clientPromise: Promise<FliptClient> | undefined

  constructor() {
    this.clientConfig = getConfig()
  }

  private async initClient(): Promise<FliptClient> | undefined {
    if (!this.clientConfig) {
      logger.error('Unable to initiate FliptClient: config is missing')
      return undefined
    }

    return FliptClient.init(this.clientConfig)
  }

  private async getClient(): Promise<FliptClient | undefined> {
    if (this.client) {
      return this.client
    }

    if (!this.clientPromise) {
      this.clientPromise = this.initClient()
        .then(client => {
          this.client = client
          return client
        })
        .catch((error): undefined => {
          logger.error('Failed to initialise Flipt client:', error)
          return undefined
        })
    }

    return this.clientPromise
  }

  async getDowntimeBannerContent(userId?: string): Promise<DowntimeBannerContent | undefined> {
    const client = await this.getClient()

    if (!client) {
      logger.error('Unable to initialise Flipt client for downtime banner content')
      return undefined
    }

    try {
      const result = client.evaluateVariant({
        flagKey: DOWNTIME_BANNER_CONTENT_FLAG,
        entityId: userId || 'fallbackUser',
        context: {},
      })
      if (result.reason === 'FLAG_DISABLED_EVALUATION_REASON') {
        return undefined
      }

      const attachment: unknown = JSON.parse(result.variantAttachment)
      const content = downtimeBannerContentSchema.safeParse(attachment)

      if (!content.success) {
        logger.error('Invalid downtime banner content: heading and message must be non-empty strings')
        return undefined
      }

      return content.data
    } catch (error) {
      logger.error(`Error evaluating downtime banner content flag ${DOWNTIME_BANNER_CONTENT_FLAG}:`, error)
      return undefined
    }
  }

  async evaluateBooleanFlags(featureFlags: FeatureFlagsConfig, userId?: string): Promise<BooleanFeatureFlagsResult> {
    const client = await this.getClient()
    const booleanFeatureFlags: Record<string, boolean> = {}

    if (!client) {
      logger.error('Unable to initialise Flipt client for feature flag evaluation')
      return { booleanFeatureFlags: getFallbackFeatureFlags(featureFlags) }
    }

    const entityId = userId || 'fallbackUser'
    const context = {}

    for (const flag of Object.values(featureFlags)) {
      try {
        const result = client.evaluateBoolean({ flagKey: flag.fliptKey, entityId, context })
        booleanFeatureFlags[flag.nunjucksKey] = result.enabled
      } catch (error) {
        logger.error(`Error evaluating feature flag ${flag.fliptKey}:`, error)
        booleanFeatureFlags[flag.nunjucksKey] = flag.fallbackState
      }
    }

    return { booleanFeatureFlags }
  }
}
