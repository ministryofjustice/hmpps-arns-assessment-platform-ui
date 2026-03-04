import bunyan, { LogLevel } from 'bunyan'
import bunyanFormat from 'bunyan-format'
import config from './server/config'

const formatOut = bunyanFormat({ outputMode: 'short', color: !config.production })

const logger = bunyan.createLogger({
  name: 'HMPPS ARNS Assessment Platform UI',
  stream: formatOut,
  level: config.logLevel as LogLevel,
})

export default logger
