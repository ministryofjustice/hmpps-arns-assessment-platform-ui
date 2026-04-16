import { PactV3, MatchersV3 } from '@pact-foundation/pact'

const { string, like } = MatchersV3

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

  withResult<T>(status: number, result: T): PactWrapper {
    const pactResult: any = result
    pactResult.aggregateUuid = like('bd12ef70-5c20-4a01-8394-d71f8026a69b')
    pactResult.createdAt = like('2025-01-01T00:00:00Z')
    pactResult.updatedAt = like('2025-01-01T00:00:00Z')
    pactResult.collaborators = [
      {
        id: string('FOO_USER'),
        name: string('Foo User'),
      },
    ]
    const queriesResponse: any = {
      queries: [{ request: this.queryResponse, result: pactResult }],
    }
    this.provider.willRespondWith({
      status,
      headers: { 'Content-Type': 'application/json' },
      body: queriesResponse,
    })
    return this
  }
}
