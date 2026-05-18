import type { Request, Response, NextFunction } from 'express'
import type { HTTPError } from 'superagent'
import logger from '../../../logger'

export default function createErrorHandler(production: boolean) {
  return (error: HTTPError, req: Request, res: Response, next: NextFunction): void => {
    logger.error(
      {
        err: error,
        originalUrl: req.originalUrl,
        username: res.locals.user?.username,
      },
      'Error handling request',
    )

    if (error.status === 401 || error.status === 403) {
      logger.info({ statusCode: error.status }, 'Logging user out after authentication error')
      return res.redirect('/sign-out')
    }

    res.locals.message = production
      ? 'Something went wrong. The error has been logged. Please try again'
      : error.message
    res.locals.status = error.status
    res.locals.stack = production ? null : error.stack

    res.status(error.status || 500)

    return res.render('pages/error')
  }
}
