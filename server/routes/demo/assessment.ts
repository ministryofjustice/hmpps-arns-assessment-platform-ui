import { Router } from 'express'
import type { Services } from '../../services'

export default function routes({ assessmentService }: Services): Router {
  const router = Router()

  router.get('/assessment', async (req, res, next) => {
    try {
      const user = {
        id: res.locals.user.username,
        name: res.locals.user.displayName,
        authSource: res.locals.user.authSource,
      }

      const { assessmentUuid, message } = await assessmentService.command<'CreateAssessment'>({
        type: 'CreateAssessmentCommand',
        assessmentType: 'TEST',
        formVersion: '1',
        user,
      })

      const assessment = await assessmentService.query<'AssessmentVersion'>({
        type: 'AssessmentVersionQuery',
        assessmentIdentifier: { type: 'UUID', uuid: assessmentUuid },
        user,
      })

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
