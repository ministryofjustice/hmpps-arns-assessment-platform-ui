import { RedisClient, createRedisClient } from './redisClient'
import logger from '../../logger'
import config from '../config'

const KEY_PREFIX = 'preferences:'
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 365 // 1 year

/**
 * Generic preferences data structure.
 * Can be extended to store any user preferences keyed by preferencesId.
 */
export interface PreferencesData {
  [key: string]: unknown
}

/**
 * Store for persisting user preferences to Redis.
 * Uses a long-lived TTL (1 year) to maintain preferences across sessions.
 */
export default class PreferencesStore {
  private client: RedisClient

  private connected = false

  constructor(client?: RedisClient) {
    this.client = client ?? createRedisClient()
  }

  private async ensureConnected(): Promise<void> {
    if (!this.connected) {
      await this.client.connect()
      this.connected = true
    }
  }

  private getKey(preferencesId: string): string {
    return `${KEY_PREFIX}${preferencesId}`
  }

  async get<T extends PreferencesData>(preferencesId: string): Promise<T | null> {
    if (!config.redis.enabled) {
      logger.warn('Redis not enabled, returning null for preferences')

      return null
    }

    try {
      await this.ensureConnected()

      const data = await this.client.get(this.getKey(preferencesId))

      if (!data) {
        return null
      }

      return JSON.parse(data.toString()) as T
    } catch (error) {
      logger.error('Failed to get preferences data', error)

      return null
    }
  }

  async set<T extends PreferencesData>(preferencesId: string, data: T): Promise<void> {
    if (!config.redis.enabled) {
      logger.warn('Redis not enabled, preferences data not persisted')

      return
    }

    try {
      await this.ensureConnected()

      await this.client.set(this.getKey(preferencesId), JSON.stringify(data), {
        EX: DEFAULT_TTL_SECONDS,
      })
    } catch (error) {
      logger.error('Failed to set preferences data', error)
    }
  }

  async delete(preferencesId: string): Promise<void> {
    if (!config.redis.enabled) {
      return
    }

    try {
      await this.ensureConnected()

      await this.client.del(this.getKey(preferencesId))
    } catch (error) {
      logger.error('Failed to delete preferences data', error)
    }
  }

  async update<T extends PreferencesData>(preferencesId: string, updater: (current: T | null) => T): Promise<void> {
    const current = await this.get<T>(preferencesId)
    const updated = updater(current)

    await this.set(preferencesId, updated)
  }
}
