import { Router } from 'express'

import type { Services } from '../services'
import demo from './demo'
import sessionRoutes from './session'

export default function routes(services: Services): Router {
  const router = Router()

  router.get('/', async (_req, res) => {
    const currentTime = new Date().toLocaleString('en-GB', {
      dateStyle: 'full',
      timeStyle: 'long',
    })

    return res.render('pages/index', {
      currentTime,
    })
  })

  router.use(demo(services))
  router.use('/session', sessionRoutes())

  return router
}
