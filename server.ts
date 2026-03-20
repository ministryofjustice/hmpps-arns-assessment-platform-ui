import './server/utils/azureAppInsights'
import cluster from 'cluster'
import os from 'os'
import logger from './logger'

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
  // eslint-disable-next-line @typescript-eslint/no-require-imports, n/global-require
  const app = require('./server/index').default

  app.listen(app.get('port'), () => {
    const mode = clusterEnabled ? `worker ${process.pid}` : 'single process'
    logger.info(`Server (${mode}) listening on port ${app.get('port')}`)
  })
}
