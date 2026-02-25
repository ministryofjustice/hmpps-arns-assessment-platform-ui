import { PactV3 } from "@pact-foundation/pact";
import { QueriesResponse, QueryResponse } from "../interfaces/aap-api/response"

export class PactWrapper {
    public provider: PactV3
    query: any

    constructor(provider: PactV3) {
        this.provider = provider
    }

    withQuery<T>(path: string, query: T): PactWrapper {
        this.query = { queries: [query] }
        this.provider.withRequest({
          method: 'POST',
          path: path,
          body: { queries: [query] },
        })
        return this
    }
    
    withResult<T>(status: number, result: T): PactWrapper {
        const queriesResponse: QueriesResponse = {
            queries: [{ request: this.query, result: result } as QueryResponse],
        }
        this.provider.willRespondWith({
            status: status,
            headers: { 'Content-Type': 'application/json' },
            body: queriesResponse
        })
        return this
    }
}
