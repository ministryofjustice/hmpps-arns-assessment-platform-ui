import { AsyncLocalStorage } from 'async_hooks'
import bunyan, { LogLevel } from 'bunyan'
import bunyanFormat from 'bunyan-format'
import config from './server/config'

type LogContext = Record<string, unknown>
type BunyanLogger = bunyan

const prettyStream = bunyanFormat({ outputMode: 'short', color: !config.production })

const rootLogger = bunyan.createLogger({
  name: 'HMPPS ARNS Assessment Platform UI',
  serializers: bunyan.stdSerializers,
  stream: config.production ? process.stdout : prettyStream,
  level: config.logLevel as LogLevel,
})

// AsyncLocalStorage lets us keep a request-specific child logger attached to the
// current async call chain, so existing `logger.info(...)` calls automatically
// gain request context without rewriting every call site.
const loggerStorage = new AsyncLocalStorage<BunyanLogger>()

const getActiveLogger = (): BunyanLogger => loggerStorage.getStore() ?? rootLogger

export const createChildLogger = (context: LogContext): BunyanLogger => getActiveLogger().child(context)

export const runWithLogger = <T>(childLogger: BunyanLogger, callback: () => T): T =>
  loggerStorage.run(childLogger, callback)

export const runWithLogContext = <T>(context: LogContext, callback: () => T): T =>
  runWithLogger(createChildLogger(context), callback)

// Expose the active request logger through the same shared import. This keeps
// library code and app code using a single logger API while still benefiting
// from request-scoped fields like requestId and traceId.
const logger = new Proxy(rootLogger, {
  get(_target, prop) {
    const activeLogger = getActiveLogger() as unknown as Record<PropertyKey, unknown>
    const value = activeLogger[prop]

    return typeof value === 'function' ? value.bind(activeLogger) : value
  },
}) as BunyanLogger

export default logger
