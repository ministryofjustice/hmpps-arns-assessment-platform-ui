import { Router } from 'express'

import sessionRoutes from './session'

export default function routes(): Router {
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

  router.use('/session', sessionRoutes())

  return router
}
