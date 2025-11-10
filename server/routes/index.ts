import { Router } from 'express'

import type { Services } from '../services'
import { AuditEvent } from '../services/auditService'
import { createNavigation, htmlBlocks } from '../utils/journeyUtils'

export default function routes({ exampleService }: Services): Router {
  const router = Router()

  router.get('/', async (req, res, next) => {
    await req.services.auditService.send(AuditEvent.VIEW_ASSESSMENT)

    res.locals.form = { backLink: '/', navigation: createNavigation() }

    const currentTime = await exampleService.getCurrentTime()
    return res.render('pages/index', {
      currentTime,
      htmlBlocks,
    })
  })

  return router
}
