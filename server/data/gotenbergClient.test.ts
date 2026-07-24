import nock from 'nock'
import { AgentConfig, RestClient, SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import GotenbergClient, { GotenbergConfig } from './gotenbergClient'

const config: GotenbergConfig = {
  url: 'http://gotenberg',
  renderUrl: 'http://assessment-ui',
  timeout: {
    response: 1_000,
    deadline: 2_000,
  },
  agent: new AgentConfig(1_000),
}

describe('GotenbergClient', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('renders the authenticated print preview as a PDF', async () => {
    const pdf = Buffer.from('%PDF-1.7')
    const gotenberg = nock(config.url)
      .post('/forms/chromium/convert/url', body => {
        const multipartBody = body.toString()

        expect(multipartBody).toContain('http://assessment-ui/sentence-plan/v1.0/plan/print-preview')
        expect(multipartBody).toContain(
          'hmpps-arns-assessment-platform-ui.session=session-value;scope=^http://assessment-ui/',
        )
        expect(multipartBody).toContain('skipNetworkIdleEvent')
        expect(multipartBody).toContain('printBackground')
        return true
      })
      .matchHeader('Gotenberg-Trace', 'request-id')
      .reply(200, pdf, { 'Content-Type': 'application/pdf' })

    const client = new GotenbergClient(config)
    expect(client).toBeInstanceOf(RestClient)

    const result = await client.renderPdfFromUrl({
      path: '/sentence-plan/v1.0/plan/print-preview',
      sessionCookie: 'hmpps-arns-assessment-platform-ui.session=session-value',
      requestId: 'request-id',
    })

    expect(result).toEqual(pdf)
    expect(gotenberg.isDone()).toBe(true)
  })

  it('rejects when Gotenberg cannot create the PDF', async () => {
    nock(config.url).post('/forms/chromium/convert/url').reply(503, 'Service unavailable')

    const client = new GotenbergClient(config)

    const render = client.renderPdfFromUrl({
      path: '/sentence-plan/v1.0/plan/print-preview',
      sessionCookie: 'hmpps-arns-assessment-platform-ui.session=session-value',
    })

    await expect(render).rejects.toBeInstanceOf(SanitisedError)
    await expect(render).rejects.toMatchObject({ responseStatus: 503 })
    await expect(render).rejects.not.toHaveProperty('request')
  })
})
