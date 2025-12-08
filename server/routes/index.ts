import { Router } from 'express'
import { NotFound } from 'http-errors'

import type { Services } from '../services'
import { createNavigation, htmlBlocks } from '../utils/journeyUtils'
import demo from './demo'
import ErrorController from './error/ErrorController'

export default function routes(services: Services): Router {
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

  router.use(demo(services))

  const errorController = new ErrorController()
  router.use((req, res, next) => next(new NotFound(req.path)))
  router.use(errorController.any)

  return router
}
