import { RestClient, SanitisedError, type ApiConfig } from '@ministryofjustice/hmpps-rest-client'
import type superagent from 'superagent'
import logger from '../../logger'

export type GotenbergConfig = ApiConfig & {
  renderUrl: string
}

export type PdfRenderRequest = {
  path: string
  sessionCookie: string
  requestId?: string
}

const escapeRegularExpression = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const sanitiseError = (error: unknown): SanitisedError => {
  const sanitisedError = new SanitisedError()
  const responseError = error as superagent.ResponseError

  sanitisedError.message = error instanceof Error ? error.message : 'Unknown Gotenberg error'
  sanitisedError.stack = error instanceof Error ? error.stack : undefined

  if (responseError.response) {
    sanitisedError.text = responseError.response.text
    sanitisedError.responseStatus = responseError.response.status
    sanitisedError.headers = responseError.response.headers
    sanitisedError.data = responseError.response.body
  }

  return sanitisedError
}

const CONVERT_URL_PATH = '/forms/chromium/convert/url'

/**
 * Header sent by Gotenberg's headless Chromium when it loads a page to turn into a PDF.
 *
 * Pages use it to tell a PDF render apart from a person browsing. It only changes how a
 * request is labelled, so a faked header cannot hide anything.
 *
 * The value is scoped to the render origin (see renderPdfFromUrl) so Chromium never sends it
 * to third parties. Express lowercases header names, so read it in lowercase.
 */
export const GOTENBERG_RENDER_HEADER = 'x-gotenberg-render'
export const GOTENBERG_RENDER_HEADER_VALUE = 'true'

export default class GotenbergClient extends RestClient {
  constructor(private readonly gotenbergConfig: GotenbergConfig) {
    super('Gotenberg API', gotenbergConfig, logger)
  }

  async renderPdfFromUrl({ path, sessionCookie, requestId }: PdfRenderRequest): Promise<Buffer> {
    const renderUrl = new URL(path, this.gotenbergConfig.renderUrl)
    const headerScope = `^${escapeRegularExpression(renderUrl.origin)}/`

    this.logger.info(`${this.name} POST: ${CONVERT_URL_PATH}`)

    try {
      // RestClient 1.0 supports undefined for unauthenticated calls at runtime,
      // although its public type does not yet include undefined.
      return await this.makeRestClientCall<Buffer>(undefined as never, async ({ superagent: client, agent }) => {
        const request = client
          .post(`${this.gotenbergConfig.url}${CONVERT_URL_PATH}`)
          .agent(agent)
          .field('url', renderUrl.toString())
          .field(
            'extraHttpHeaders',
            JSON.stringify({
              Cookie: `${sessionCookie};scope=${headerScope}`,
              [GOTENBERG_RENDER_HEADER]: `${GOTENBERG_RENDER_HEADER_VALUE};scope=${headerScope}`,
            }),
          )
          .field('skipNetworkIdleEvent', false)
          .field('printBackground', true)
          .buffer(true)
          .responseType('blob')
          .timeout(this.gotenbergConfig.timeout)

        if (requestId) {
          request.set('Gotenberg-Trace', requestId)
        }

        const response = await request
        return response.body
      })
    } catch (error) {
      return this.handleError<Buffer, unknown>(CONVERT_URL_PATH, 'POST', sanitiseError(error))
    }
  }
}
