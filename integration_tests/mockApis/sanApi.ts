import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export default {
  stubGetAssessmentVersions: (entityUuid: string, versions: Record<string, any>[]): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/san-api/assessment/${entityUuid}/all`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        jsonBody: versions,
      },
      priority: 1,
    }),
}
