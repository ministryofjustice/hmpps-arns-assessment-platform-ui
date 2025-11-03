import { Router } from 'express'

import type { Services } from '../services'

export default function routes(_services: Services): Router {
  const router = Router()

  router.get('/', async (_req, res) => {
    const currentTime = new Date().toLocaleString('en-GB', {
      dateStyle: 'full',
      timeStyle: 'long',
    })

    return res.render('pages/index', { currentTime })
  })

  router.get('/assessment', async (req, res, next) => {
    try {
      const { assessmentUuid, message } = await req.services.assessmentService.createAssessment()
      const assessment = await req.services.assessmentService.getAssessment(assessmentUuid)

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
