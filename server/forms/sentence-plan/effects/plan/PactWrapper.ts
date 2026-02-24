import { PactV3 } from "@pact-foundation/pact";
import { QueriesResponse } from "../../../../interfaces/aap-api/response"

interface ExpectedResult {
    status: number
    headers: Record<string, string>
    body: any
}

export class PactWrapper {
    public provider: PactV3
    query: any

    constructor(provider: PactV3) {
        this.provider = provider
    }

    withQuery(query: any) {
        this.query = { queries: [query] }
        this.provider.withRequest({
          method: 'POST',
          path: '/query',
          body: { queries: [query] },
        })
        return this
    }
    
    withResult(status: any, headers: any, result: any) {
        const body: QueriesResponse = {
            queries: [{ request: this.query, result: result }],
        }
        this.provider.willRespondWith({
            status: status,
            headers: headers,
            body: body
        })
        return this
    }
}