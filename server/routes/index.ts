import { Router } from 'express'

import type { Services } from '../services'
import { AuditEvent } from '../services/auditService'

export default function routes({ exampleService }: Services): Router {
  const router = Router()

  router.get('/', async (req, res, next) => {
    await req.services.auditService.send(AuditEvent.VIEW_ASSESSMENT)

    const currentTime = await exampleService.getCurrentTime()
    return res.render('pages/index', { currentTime })
  })

  return router
}
