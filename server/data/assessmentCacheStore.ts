import { RedisClient, createRedisClient } from './redisClient'
import { AssessmentVersionQueryResult } from '../interfaces/aap-api/queryResult'
import logger from '../../logger'
import config from '../config'

export default class AssessmentCacheStore {
  private client: RedisClient

  private connectionPromise: Promise<unknown> | undefined

  constructor(client?: RedisClient) {
    this.client = client ?? createRedisClient()
  }

  private ensureConnected(): Promise<unknown> {
    if (!this.connectionPromise) {
      this.connectionPromise = this.client.connect()
    }

    return this.connectionPromise
  }

  async get(assessmentUuid: string): Promise<AssessmentVersionQueryResult | null> {
    if (!config.redis.enabled) {
      return null
    }

    try {
      await this.ensureConnected()

      const data = await this.client.get(`assessment:${assessmentUuid}:latest`)

      if (!data) {
        return null
      }

      return JSON.parse(data.toString()) as AssessmentVersionQueryResult
    } catch (error) {
      logger.error({ err: error, assessmentUuid }, 'Failed to get cached assessment')

      return null
    }
  }
}
