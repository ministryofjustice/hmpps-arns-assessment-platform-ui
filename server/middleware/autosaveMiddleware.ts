import type { RequestHandler } from 'express'
import logger from '../../logger'

export function transformFormDataToAnswers(body: Record<string, unknown>): Record<string, string[]> {
  const answers: Record<string, string[]> = {}

  for (const [key, value] of Object.entries(body)) {
    if (key !== '_csrf' && key !== 'action') {
      if (Array.isArray(value)) {
        answers[key] = value.map(String)
      } else if (value !== undefined && value !== null && value !== '') {
        answers[key] = [String(value)]
      }
    }
  }

  return answers
}

/**
 * Prefetch saved answers for form population.
 * On GET requests with an assessmentId, fetches answers from the API
 * and makes them available in res.locals.savedAnswers for form rendering.
 */
export function prefetchAnswersMiddleware(): RequestHandler {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next()
    }

    const { assessmentService } = res.locals
    const assessmentId = req.params.assessmentId

    res.locals.savedAnswers = {}

    if (!assessmentService || !assessmentId) {
      return next()
    }

    try {
      logger.debug(`Prefetching answers for assessment ${assessmentId}`)
      const assessment = await assessmentService.query({
        type: 'AssessmentVersionQuery',
        assessmentUuid: assessmentId,
      })
      res.locals.savedAnswers = assessment?.answers || {}
    } catch (error) {
      logger.warn(`Failed to prefetch answers for assessment ${assessmentId}`, error)
    }

    return next()
  }
}

/**
 * Intercepts POST requests with X-AAP-Autosave header and persists form data
 * without validation.
 */
export function autosaveMiddleware(): RequestHandler {
  return async (req, res, next) => {
    if (req.method !== 'POST' || req.get('X-AAP-Autosave') !== 'true') {
      return next()
    }

    logger.debug(`Autosave request detected for path ${req.path}`)

    const { assessmentService, user } = res.locals
    const assessmentId = req.params.assessmentId

    if (!assessmentService || !assessmentId) {
      return next()
    }

    try {
      const answers = transformFormDataToAnswers(req.body)

      await assessmentService.command({
        type: 'UpdateAssessmentAnswersCommand',
        assessmentUuid: assessmentId,
        added: answers,
        removed: [],
        autosave: true,
        user: {
          id: user?.username || 'unknown',
          name: user?.displayName || 'Unknown User',
        },
      })

      return res.status(204).end()
    } catch (error) {
      logger.error(`Autosave failed for path ${req.path}`, error)
      return res.status(500).end()
    }
  }
}
