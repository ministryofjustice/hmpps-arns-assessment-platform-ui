import { AuthConfig, AuthenticationClient, InMemoryTokenStore, TokenStore } from '@ministryofjustice/hmpps-auth-clients'
import * as restClient from '@ministryofjustice/hmpps-rest-client'
import path from 'path'
import { PactV3 } from '@pact-foundation/pact'
import nock from 'nock'
import AssessmentPlatformApiClient from '../../../../data/assessmentPlatformApiClient'
import { AssessmentVersionQuery } from '../../../../interfaces/aap-api/query'
import { AssessmentVersionQueryResult } from '../../../../interfaces/aap-api/queryResult'
import { User } from '../../../../interfaces/user'
import config from '../../../../config'
import { assessmentVersionQuery } from './loadPlan'
import { SentencePlanEffectsDeps } from '../types'
import { AssessmentIdentifiers } from '../../../../interfaces/aap-api/identifier'
import { PactWrapper } from '../../../../testutils/PactWrapper'

jest.mock('../../../../../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}))

jest.mock('../../../../config', () => ({
  apis: {
    aapApi: {
      url: 'http://localhost:8080',
      timeout: { response: 10000, deadline: 10000 },
      agent: { maxSockets: 100, maxFreeSockets: 10, freeSocketTimeout: 30000 },
    },
  },
}))

const provider = new PactV3({
  dir: path.resolve(process.cwd(), 'pacts'),
  consumer: 'hmpps-arns-assessment-platform-ui',
  provider: 'hmpps-arns-assessment-platform-api',
  logLevel: 'debug',
})

describe('AssessmentPlatformApiClient', () => {
  let fakeHmppsAuthApi: nock.Scope
  let hmppsAuthTokenClient: AuthenticationClient
  let tokenStore: jest.Mocked<TokenStore>

  const token = { access_token: 'token-1', expires_in: 300 }
  const authConfig: AuthConfig = {
    systemClientId: 'client_id',
    systemClientSecret: 'client_secret',
    agent: new restClient.AgentConfig(10000),
    timeout: { deadline: 1000, response: 1000 },
    url: 'http://localhost:9090/auth',
  }

  const mockUser: User = {
    id: 'FOO_USER',
    name: 'Foo User',
    authSource: 'HMPPS_AUTH',
  }

  beforeEach(() => {
    fakeHmppsAuthApi = nock(authConfig.url)
    tokenStore = new InMemoryTokenStore() as jest.Mocked<InMemoryTokenStore>
    jest.spyOn(tokenStore, 'getToken').mockResolvedValue(token.access_token)
    hmppsAuthTokenClient = new AuthenticationClient(authConfig, console, tokenStore)
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('GET plan', () => {
    const assessmentUuid = '0cb5ffb3-2572-423d-97cd-4a05b681e6c0'
    const aggregateUuid = 'bd12ef70-5c20-4a01-8394-d71f8026a69b'
    const planIdentifier = { type: 'UUID', uuid: assessmentUuid } as AssessmentIdentifiers
    const query: AssessmentVersionQuery = {
      type: 'AssessmentVersionQuery',
      user: mockUser,
      assessmentIdentifier: planIdentifier,
    }

    it('returns an HTTP 200 and a assessment version', () => {
      const queryResult: AssessmentVersionQueryResult = {
        type: 'AssessmentVersionQueryResult',
        assessmentUuid,
        aggregateUuid,
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

      const pactWrapper = new PactWrapper(provider)

      pactWrapper.provider
        .given('I have a sentence plan', { assessmentUuid, userId: mockUser.id })
        .uponReceiving('a request for plan by uuid')

      pactWrapper
        .withQuery<AssessmentVersionQuery>('/query', query)
        .withResult<AssessmentVersionQueryResult>(200, queryResult)

      return pactWrapper.provider.executeTest(async (mockserver: any) => {
        jest.doMock('../../../../config', () => ({
          apis: {
            aapApi: {
              url: mockserver.url,
              timeout: { response: 10000, deadline: 10000 },
              agent: { maxSockets: 100, maxFreeSockets: 10, freeSocketTimeout: 30000 },
            },
          },
        }))

        config.apis.aapApi.url = mockserver.url

        const pactClient: AssessmentPlatformApiClient = new AssessmentPlatformApiClient(hmppsAuthTokenClient)

        const deps = {
          api: pactClient,
        } as SentencePlanEffectsDeps

        const loadPlan = await assessmentVersionQuery(deps, mockUser, planIdentifier)

        expect(loadPlan.assessmentType).toBe('TEST')
      })
    })
  })
})
