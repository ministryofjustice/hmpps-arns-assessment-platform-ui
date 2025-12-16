import bunyan from 'bunyan'
import bunyanFormat from 'bunyan-format'
import cluster from 'cluster'
import config from './server/config'

const formatOut = bunyanFormat({ outputMode: 'short', color: !config.production })

const logger = bunyan.createLogger({
  name: 'HMPPS Arns Assessment Platform UI',
  stream: formatOut,
  level: 'debug',
  pid: process.pid,
  worker: cluster.isWorker ? cluster.worker?.id : 'primary',
})

export default logger
