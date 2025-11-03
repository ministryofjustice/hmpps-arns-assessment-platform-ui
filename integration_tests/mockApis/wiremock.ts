import superagent, { SuperAgentRequest, Response } from 'superagent'
import { wiremockUrl } from '../../playwright.config'

const stubFor = (mapping: Record<string, unknown>): SuperAgentRequest =>
  superagent.post(`${wiremockUrl}/mappings`).send(mapping)

const getMatchingRequests = (body: string | object) => superagent.post(`${wiremockUrl}/requests/find`).send(body)

const resetStubs = (): Promise<Array<Response>> =>
  Promise.all([superagent.delete(`${wiremockUrl}/mappings`), superagent.delete(`${wiremockUrl}/requests`)])

export { stubFor, getMatchingRequests, resetStubs }
