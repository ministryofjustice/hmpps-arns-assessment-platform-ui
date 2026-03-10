import { FliptClient, type ClientOptions } from '@flipt-io/flipt-client-js'
import config from '../config'
import logger from '../../logger'
import {
  BooleanFeatureFlagsResult,
  FEATURE_FLAG_NAMESPACE,
  FeatureFlagConfig,
  FeatureFlagsConfig,
  UPDATE_INTERVAL_SECONDS,
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

  constructor() {
    this.clientConfig = getConfig()
  }

  private async initClient(): Promise<void> {
    if (!this.clientConfig) {
      logger.error('Unable to initiate FliptClient: config is missing')
      return undefined
    }

    return await FliptClient.init(this.clientConfig)
  }

  private async getClient(): Promise<FliptClient | undefined> {
    if (this.client) {
      return this.client
    }
    this.client = this.initClient()
    return this.client
  }

  async evaluateBooleanFlags(featureFlags: FeatureFlagsConfig, userId?: string): Promise<BooleanFeatureFlagsResult> {
    const client = await this.getClient()
    const booleanFeatureFlags: Record<string, boolean> = {}

    if (!client) {
      logger.error('Unable to initialise Flipt client for feature flag evaluation')
      // TODO: check if we need a default state for each flag
      for (const flag of Object.values(featureFlags)) {
        booleanFeatureFlags[flag.nunjucksKey] = false
      }
      return { booleanFeatureFlags }
    }

    const entityId = userId || 'fallbackUser'
    const context = {}

    for (const flag of Object.values(featureFlags)) {
      try {
        const result = client.evaluateBoolean({ flagKey: flag.fliptKey, entityId, context })
        booleanFeatureFlags[flag.nunjucksKey] = result.enabled
      } catch (error) {
        logger.error(`Error evaluating feature flag ${flag.fliptKey}:`, error)
        booleanFeatureFlags[flag.nunjucksKey] = false
      }
    }

    return { booleanFeatureFlags }
  }
}
