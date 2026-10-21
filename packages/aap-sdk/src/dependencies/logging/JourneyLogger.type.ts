import type Logger from 'bunyan'

export type JourneyLogger = Pick<Logger, 'debug' | 'error' | 'info' | 'warn'>
