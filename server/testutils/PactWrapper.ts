import { PactV3, MatchersV3 } from '@pact-foundation/pact'
import { AssessmentVersionQueryResult } from '../interfaces/aap-api/queryResult'

const { eachLike, like, timestamp, uuid } = MatchersV3

export class PactWrapper {
  public provider: PactV3

  queryResponse: any

  constructor(provider: PactV3) {
    this.provider = provider
  }

  withQuery<T>(path: string, query: T): PactWrapper {
    this.queryResponse = query
    this.provider.withRequest({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      path,
      body: { queries: [query] },
    })
    return this
  }

  withAssessmentVersionQueryResult(status: number, result: AssessmentVersionQueryResult): PactWrapper {
    const pactResult = {
      type: like(result.type),
      assessmentType: like(result.assessmentType),
      formVersion: like(result.formVersion),
      answers: like(result.answers),
      properties: like(result.properties),
      identifiers: like(result.identifiers),
      flags: eachLike(result.flags),
      assessmentUuid: uuid('0cb5ffb3-2572-423d-97cd-4a05b681e6c0'),
      aggregateUuid: uuid('bd12ef70-5c20-4a01-8394-d71f8026a69b'),
      createdAt: timestamp("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", '2025-01-01T00:00:00.000Z'),
      updatedAt: timestamp("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", '2025-01-01T00:00:00.000Z'),
      collaborators: eachLike(result.collaborators),
      collections: eachLike(result.collections),
    }

    const queriesResponse: any = {
      queries: [{ request: like(this.queryResponse), result: pactResult }],
    }
    this.provider.willRespondWith({
      status,
      headers: { 'Content-Type': 'application/json' },
      body: queriesResponse,
    })
    return this
  }
}
