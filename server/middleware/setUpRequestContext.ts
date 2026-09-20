import express, { Router } from 'express'
import { requestContext } from '../utils/requestContext'

const setUpRequestContext = (): Router => {
  const router = express.Router()

  router.use((req, _res, next) => {
    requestContext.run(
      {
        getServiceName: () => req.session?.targetService,
        getRequestUrl: () => `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      },
      next,
    )
  })

  return router
}

export default setUpRequestContext
