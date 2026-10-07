import { Router } from 'express'
import { NotFound, Unauthorized } from 'http-errors'
import GotenbergClient from '../data/gotenbergClient'
import { SESSION_COOKIE_NAME } from '../middleware/setUpWebSession'
import {
  sentencePlanPrintPreviewPath,
  sentencePlanPrintPreviewPdfPath,
} from '../forms/sentence-plan/versions/v1.0/constants'

export const PRINT_PREVIEW_PATH = sentencePlanPrintPreviewPath
export const PRINT_PREVIEW_PDF_PATH = sentencePlanPrintPreviewPdfPath

const getSessionCookie = (cookieHeader?: string): string | undefined => {
  const cookieName = `${SESSION_COOKIE_NAME}=`
  return cookieHeader
      ?.split(';')
      .map(cookie => cookie.trim())
      .find(cookie => cookie.startsWith(cookieName))
}

export default function pdfRoutes(gotenbergClient: GotenbergClient): Router {
  const router = Router()

  router.get(PRINT_PREVIEW_PDF_PATH, async (req, res, next) => {
    const sessionCookie = getSessionCookie(req.headers.cookie)

    if (!sessionCookie) {
      return next(new Unauthorized('A valid session is required to export a sentence plan'))
    }

    if (!res.locals.featureFlags?.printAndShareEnabled) {
      return next(new NotFound('PDF export is not available'))
    }

    try {
      /*
       * The export is audited by the print preview page that Gotenberg loads, so auditing
       * here as well would record one download twice.
       */
      const pdf = await gotenbergClient.renderPdfFromUrl({
        path: PRINT_PREVIEW_PATH,
        sessionCookie,
        requestId: req.id,
      })

      res.attachment('sentence-plan.pdf')
      return res.send(pdf)
    } catch (error) {
      return next(error)
    }
  })

  return router
}
