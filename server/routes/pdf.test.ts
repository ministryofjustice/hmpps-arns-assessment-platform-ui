import express from 'express'
import request from 'supertest'
import GotenbergClient from '../data/gotenbergClient'
import pdfRoutes, { PRINT_PREVIEW_PATH, PRINT_PREVIEW_PDF_PATH } from './pdf'
import { SESSION_COOKIE_NAME } from '../middleware/setUpWebSession'
import AuditService, { AuditEvent } from '../services/auditService'

describe(`GET ${PRINT_PREVIEW_PDF_PATH}`, () => {
  const renderPdfFromUrl = jest.fn()
  const gotenbergClient = { renderPdfFromUrl } as unknown as GotenbergClient
  const sendAuditEvent = jest.fn()
  const auditService = { send: sendAuditEvent } as unknown as AuditService

  const createApp = ({ printAndShareEnabled = true } = {}) => {
    const app = express()
    app.use((req, res, next) => {
      req.id = 'request-id'
      Object.defineProperty(req, 'session', {
        value: {
          principal: { identifier: 'user-id' },
          caseDetails: { crn: 'X000001' },
          sessionDetails: { planIdentifier: { type: 'UUID', uuid: 'assessment-id' } },
        },
      })
      res.locals.featureFlags = { printAndShareEnabled }
      next()
    })
    app.use(pdfRoutes(gotenbergClient, auditService))
    app.use(
      (
        error: { status?: number; message: string },
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
      ) => res.status(error.status ?? 500).send(error.message),
    )
    return app
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('downloads the print preview as a PDF', async () => {
    const pdf = Buffer.from('%PDF-1.7')
    renderPdfFromUrl.mockResolvedValue(pdf)

    const response = await request(createApp())
      .get(PRINT_PREVIEW_PDF_PATH)
      .set('Cookie', [`${SESSION_COOKIE_NAME}=session-value`, 'other-cookie=not-forwarded'])
      .expect(200)
      .expect('Content-Type', 'application/pdf')
      .expect('Content-Disposition', 'attachment; filename="sentence-plan.pdf"')

    expect(response.body).toEqual(pdf)
    expect(renderPdfFromUrl).toHaveBeenCalledWith({
      path: PRINT_PREVIEW_PATH,
      sessionCookie: `${SESSION_COOKIE_NAME}=session-value`,
      requestId: 'request-id',
    })
    expect(sendAuditEvent).toHaveBeenCalledWith({
      action: AuditEvent.EXPORT_PLAN_PDF,
      who: 'user-id',
      subjectId: 'X000001',
      subjectType: 'CRN',
      correlationId: 'request-id',
      details: {
        formVersion: 'v1.0',
        planIdentifier: { type: 'UUID', uuid: 'assessment-id' },
      },
    })
  })

  it('rejects a request without a session cookie', async () => {
    await request(createApp())
      .get(PRINT_PREVIEW_PDF_PATH)
      .expect(401)
      .expect('A valid session is required to export a sentence plan')

    expect(renderPdfFromUrl).not.toHaveBeenCalled()
    expect(sendAuditEvent).not.toHaveBeenCalled()
  })

  it('rejects a request when print and share is disabled', async () => {
    await request(createApp({ printAndShareEnabled: false }))
      .get(PRINT_PREVIEW_PDF_PATH)
      .set('Cookie', `${SESSION_COOKIE_NAME}=session-value`)
      .expect(404)
      .expect('PDF export is not available')

    expect(renderPdfFromUrl).not.toHaveBeenCalled()
    expect(sendAuditEvent).not.toHaveBeenCalled()
  })

  it('passes a Gotenberg failure to the error handler', async () => {
    renderPdfFromUrl.mockRejectedValue(new Error('Gotenberg failed'))

    await request(createApp())
      .get(PRINT_PREVIEW_PDF_PATH)
      .set('Cookie', `${SESSION_COOKIE_NAME}=session-value`)
      .expect(500)
      .expect('Gotenberg failed')

    expect(sendAuditEvent).not.toHaveBeenCalled()
  })
})
