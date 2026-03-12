import { FliptClient, type ClientOptions } from '@flipt-io/flipt-client-js'
import config from '../config'
import logger from '../../logger'
import {
  BooleanFeatureFlagsResult,
  FEATURE_FLAG_NAMESPACE,
  FeatureFlagConfig,
  FeatureFlagsConfig,
  UPDATE_INTERVAL_SECONDS,
  getFallbackFeatureFlags,
} from '../utils/featureFlagsUtils'

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

  private async getClient(): Promise<FliptClient> | undefined {
    if (this.client) {
      return this.client
    }

    if (!this.clientPromise) {
      this.clientPromise = this.initClient().then(client => {
        this.client = client
        return client
      })
    }

    this.client = this.initClient()
    return this.clientPromise
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
