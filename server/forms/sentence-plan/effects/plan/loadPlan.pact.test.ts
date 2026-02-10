import { AuthConfig, AuthenticationClient, InMemoryTokenStore, TokenStore } from '@ministryofjustice/hmpps-auth-clients'
import * as restClient from '@ministryofjustice/hmpps-rest-client'
import AssessmentPlatformApiClient from '../../../../data/assessmentPlatformApiClient'
import { CommandsResponse, QueriesResponse } from '../../../../interfaces/aap-api/response'
import { AssessmentVersionQuery, TimelineQuery } from '../../../../interfaces/aap-api/query'
import { AssessmentVersionQueryResult, TimelineQueryResult } from '../../../../interfaces/aap-api/queryResult'
import { User } from '../../../../interfaces/user'
import path from 'path'
import { PactV3, MatchersV3 } from '@pact-foundation/pact'
import logger from '../../../../../logger'
import config from '../../../../config'
import nock from 'nock'
import { assessmentVersionQuery } from './loadPlan'
import { SentencePlanEffectsDeps } from '../types'
import { AssessmentIdentifiers } from '../../../../interfaces/aap-api/identifier'

jest.mock('../../../../../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}))

jest.mock('../../../../config', () => ({ apis: {
    aapApi: {
      url: 'http://localhost:8080',
      timeout: { response: 10000, deadline: 10000 },
      agent: { maxSockets: 100, maxFreeSockets: 10, freeSocketTimeout: 30000 },
    },
  }, 
}))

// Create a 'pact' between the two applications in the integration we are testing
const provider = new PactV3({
  dir: path.resolve(process.cwd(), 'pacts'),
  consumer: 'MyConsumer',
  provider: 'MyProvider',
  logLevel: "debug"
})

const dogExample = { dog: 1 }
const EXPECTED_BODY = MatchersV3.eachLike(dogExample)

//jest.mock('./tokenStores/InMemoryTokenStore')

describe('AssessmentPlatformApiClient', () => {
  let client: AssessmentPlatformApiClient
  let fakeHmppsAuthApi: nock.Scope
  let hmppsAuthTokenClient: AuthenticationClient
  let tokenStore: jest.Mocked<TokenStore>

  const username = 'Bob'
  const token = { access_token: 'token-1', expires_in: 300 }
  const authConfig: AuthConfig = {
    systemClientId: 'client_id',
    systemClientSecret: 'client_secret',
    agent: new restClient.AgentConfig(10000),
    timeout: { deadline: 1000, response: 1000 },
    url: 'http://localhost:9090/auth',
  }

  const mockUser: User = {
    id: 'testuser',
    name: 'Test User',
    authSource: 'HMPPS_AUTH',
  }

  beforeEach(() => {
    fakeHmppsAuthApi = nock(authConfig.url)
    tokenStore = new InMemoryTokenStore() as jest.Mocked<InMemoryTokenStore>
    console.log("Token store " + JSON.stringify(tokenStore))
    jest.spyOn(tokenStore, 'getToken').mockResolvedValue(token.access_token)
    //tokenStore.getToken.mockResolvedValue(token.access_token)
    hmppsAuthTokenClient = new AuthenticationClient(authConfig, console, tokenStore)
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

describe('GET plan', () => {
  const planIdentifier = { type: 'UUID', uuid: 'uuid-123' } as AssessmentIdentifiers
  const query: AssessmentVersionQuery = {
    type: 'AssessmentVersionQuery',
    user: mockUser,
    assessmentIdentifier: planIdentifier,
  }

  it('returns an HTTP 200 and a assessment version', () => {
    const expectedResult: AssessmentVersionQueryResult = {
        type: 'AssessmentVersionQueryResult',
        assessmentUuid: 'uuid-123',
        aggregateUuid: 'agg-123',
        assessmentType: 'TEST',
        formVersion: '1',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        answers: {},
        properties: {},
        collections: [],
        collaborators: [mockUser],
        identifiers: {},
      }

    const response: QueriesResponse = {
      queries: [{ request: query, result: expectedResult }],
    }
    // Arrange: Setup our expected interactions
    //
    // We use Pact to mock out the backend API
    provider
      .given('I have a sentence plan')
      .uponReceiving('a request for plan by uuid')
      .withRequest({
        method: 'POST',
        path: '/query',
        body: { queries: [query] },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: response,
      })

    return provider.executeTest(async (mockserver) => {
      
      jest.doMock('../../../../config', () => ({ apis: {
          aapApi: {
            url: mockserver.url,
            timeout: { response: 10000, deadline: 10000 },
            agent: { maxSockets: 100, maxFreeSockets: 10, freeSocketTimeout: 30000 },
          },
        }, 
      }))

      //mockPost.mockResolvedValue(response)

      let pactClient: AssessmentPlatformApiClient

      //var tokenStore = new InMemoryTokenStore()

      config.apis.aapApi.url = mockserver.url

      //jest.spyOn(tokenStore, 'getToken').mockResolvedValue('user-token')

      // jest.spyOn(restClient, 'asSystem').mockReturnValue({
      //   tokenType: 'USER_TOKEN',
      //   user: mockUser
      // } as restClient.AuthOptions)

      pactClient = new AssessmentPlatformApiClient(hmppsAuthTokenClient)

      const deps = {
        api: pactClient
      } as SentencePlanEffectsDeps

      const loadPlan = await assessmentVersionQuery(deps, mockUser, planIdentifier)

      // Act
      //const result = await pactClient.executeQuery(query)
      // Act: test our API client behaves correctly
      //
      // Note we configure the DogService API client dynamically to
      // point to the mock service Pact created for us, instead of
      // the real one

      // Assert: check the result
      expect(loadPlan.assessmentType).toBe('TEST')
    })
  })
})
})
