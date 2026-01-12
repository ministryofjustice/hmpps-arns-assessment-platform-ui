import type Logger from 'bunyan'

export const noopLogger = {
  log: () => {},
  info: () => {},
  warn: () => {},
  debug: () => {},
} as unknown as Logger
