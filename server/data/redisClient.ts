import { createClient } from 'redis'

import logger from '../../logger'
import config from '../config'

export type RedisClient = ReturnType<typeof createClient>

interface RedisConfig {
  host: string
  port: number
  password?: string
  tls_enabled: string
}

const buildUrl = (redisConfig: RedisConfig): string =>
  redisConfig.tls_enabled === 'true'
    ? `rediss://${redisConfig.host}:${redisConfig.port}`
    : `redis://${redisConfig.host}:${redisConfig.port}`

export const createRedisClient = (redisConfig?: RedisConfig): RedisClient => {
  const resolvedConfig = redisConfig ?? config.redis

  const client = createClient({
    url: buildUrl(resolvedConfig),
    password: resolvedConfig.password,
    socket: {
      reconnectStrategy: (attempts: number) => {
        // Exponential back off: 20ms, 40ms, 80ms..., capped to retry every 30 seconds
        const nextDelay = Math.min(2 ** attempts * 20, 30000)
        logger.info({ attempts, nextDelay }, 'Retrying Redis connection')
        return nextDelay
      },
    },
  })

  client.on('error', (e: Error) => logger.error({ err: e }, 'Redis client error'))

  return client
}
