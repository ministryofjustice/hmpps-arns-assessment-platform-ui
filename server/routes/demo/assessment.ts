import { Router } from 'express'
import type { Services } from '../../services'
import { AuditEvent } from '../../services/auditService'

export default function routes({ assessmentService, auditService }: Services): Router {
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

      await auditService.send(AuditEvent.CREATE_ASSESSMENT, {
        username: user.id,
        correlationId: req.id,
        assessmentUuid,
      })

      await auditService.send(AuditEvent.VIEW_ASSESSMENT, {
        username: user.id,
        correlationId: req.id,
        assessmentUuid,
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
