import cluster from 'cluster'
import os from 'os'
import { initialiseTelemetry, flushTelemetry, telemetry } from './server/utils/telemetry'
import logger from './logger'

initialiseTelemetry({
  serviceName: 'hmpps-arns-assessment-platform-ui',
  serviceVersion: process.env.BUILD_NUMBER || 'unknown',
  logger,
  connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
  debug: process.env.DEBUG_TELEMETRY === 'true',
})
  .addSpanProcessor(telemetry.helpers.filterSpanByPath(['/health', '/ping', '/assets/*', '/favicon.ico']))
  .addSpanProcessor(telemetry.helpers.filterSpanWhereClient)
  .addSpanProcessor(telemetry.helpers.renameSpanToHttpRoute)
  .startRecording()

const shutdown = async (signal: string) => {
  logger.info(`${signal} received, shutting down...`)
  await flushTelemetry()
  process.exit(0)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

const clusterEnabled = process.env.NODE_CLUSTER_ENABLED === 'true'
const workerCount = Number(process.env.NODE_CLUSTER_WORKERS) || Math.min(os.cpus().length, 2)

if (clusterEnabled && cluster.isPrimary) {
  logger.info(`Primary ${process.pid} starting ${workerCount} workers`)

  Array.from({ length: workerCount }).forEach(() => cluster.fork())

  cluster.on('exit', (worker, code) => {
    logger.warn(`Worker ${worker.process.pid} exited with code ${code}, spawning replacement`)
    cluster.fork()
  })
} else {
  // Single process mode, or we're a cluster worker
  // eslint-disable-next-line @typescript-eslint/no-require-imports, global-require
  const app = require('./server/index').default

  app.listen(app.get('port'), () => {
    const mode = clusterEnabled ? `worker ${process.pid}` : 'single process'
    logger.info(`Server (${mode}) listening on port ${app.get('port')}`)
  })
}
