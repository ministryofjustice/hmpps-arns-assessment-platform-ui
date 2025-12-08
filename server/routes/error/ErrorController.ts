import { NextFunction, Request, Response } from 'express'
import { constants as http } from 'http2'
import { HttpError } from 'http-errors'
import logger from '../../../logger'

export default class ErrorController {
  any = async (error: HttpError, req: Request, res: Response, next: NextFunction) => {
    error.status ??= http.HTTP_STATUS_INTERNAL_SERVER_ERROR
    res.status(error.status)

    logger.error(error.stack)

    return res.render('pages/error', { error })
  }
}
