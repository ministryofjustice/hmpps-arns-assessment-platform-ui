import { Router } from 'express'

import type { Services } from '../services'
import { createNavigation, htmlBlocks } from '../utils/journeyUtils'

export default function routes({ assessmentService }: Services): Router {
  const router = Router()

  router.get('/', async (_req, res) => {
    const currentTime = new Date().toLocaleString('en-GB', {
      dateStyle: 'full',
      timeStyle: 'long',
    })

    res.locals.form = { backLink: '/', navigation: createNavigation() }

    return res.render('pages/index', {
      currentTime,
      htmlBlocks,
    })
  })

  router.get('/assessment', async (req, res, next) => {
    try {
      const { assessmentUuid, message } = await assessmentService.createAssessment(res.locals.user, req.id)
      const assessment = await assessmentService.getAssessment(res.locals.user, assessmentUuid, req.id)

      const currentTime = new Date().toLocaleString('en-GB', {
        dateStyle: 'full',
        timeStyle: 'long',
      })

      return res.render('pages/assessment', {
        assessmentUuid,
        message,
        assessment,
        currentTime,
      })
    } catch (error) {
      return next(error)
    }
  })

  return router
}
