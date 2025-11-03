import superagent, { SuperAgentRequest } from 'superagent'

const wiremockUrl = process.env.WIREMOCK_URL || 'http://localhost:9091/__admin'

const stubFor = (mapping: Record<string, unknown>): SuperAgentRequest =>
  superagent.post(`${wiremockUrl}/mappings`).send(mapping)

export { stubFor }
