import { Router } from 'express'

import sessionRoutes from './session'
import pdfRoutes from './pdf'
import accessRoutes from './access'
import type { Services } from '../services'

export default function routes(
  services: Pick<Services, 'deliusApiClient' | 'gotenbergClient' | 'handoverApiClient'>,
): Router {
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
  router.use('/access', accessRoutes(services.deliusApiClient, services.handoverApiClient))
  router.use(pdfRoutes(services.gotenbergClient))

  return router
}
