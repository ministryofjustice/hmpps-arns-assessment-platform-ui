import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import path from 'path'
import { PactV3, MatchersV3 } from '@pact-foundation/pact'
import nock from 'nock'
import config from '../../../../config'
import { getCriminogenicNeeds } from './criminogenicNeeds'
import { SentencePlanEffectsDeps } from '../types'
import ArnsApiClient from '../../../../data/arnsApiClient'
import { createMockAuthClient, MOCK_USER } from '../../../../testutils/mockAuth'

const { eachLike, fromProviderState, regex, string, timestamp } = MatchersV3

const provider = new PactV3({
  dir: path.resolve(process.cwd(), 'pacts'),
  consumer: 'hmpps-arns-assessment-platform-ui',
  provider: 'hmpps-assess-risks-and-needs',
  logLevel: 'info',
})

describe('Arns Api Client', () => {
  let hmppsAuthTokenClient: AuthenticationClient

  beforeEach(() => {
    jest.clearAllMocks()
    hmppsAuthTokenClient = createMockAuthClient()
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('GET criminogenic needs', () => {
    const crn = 'X99999'

    it('returns an HTTP 200 and a assessment version', () => {
      const assessmentNeeds = {
        identifiedNeeds: eachLike([
          {
            name: 'Drug Misuse',
            section: 'DRUG_MISUSE',
            oasysThreshold: {
              standard: 2,
            },
            riskOfHarm: true,
            riskOfReoffending: true,
            score: 8,
          },
        ]),
        notIdentifiedNeeds: eachLike([
          {
            name: 'Accommodation',
            section: 'ACCOMMODATION',
            oasysThreshold: {
              standard: 2,
            },
            riskOfHarm: false,
            riskOfReoffending: false,
            score: 0,
          },
        ]),
        unansweredNeeds: eachLike([
          {
            name: 'Alcohol Misuse',
            section: 'ALCOHOL_MISUSE',
            oasysThreshold: {
              standard: 2,
            },
          },
        ]),
        assessmentVersion: string('SAN'),
        assessedOn: timestamp("yyyy-MM-dd'T'HH:mm:ss", '2025-09-10T09:58:12'),
      }

      provider
        .given('I have identified needs', { crn, userId: MOCK_USER.id })
        .uponReceiving('a request for criminogenic needs by crn')
        .withRequest({
          method: 'GET',
          headers: { Authorization: regex('^Bearer [A-Za-z0-9\\-\\_\\=\\.\\+\\/]+$', `Bearer ${MOCK_USER.token}`) },
          path: fromProviderState(`/needs/crn/${crn}`, `/needs/crn/${crn}`),
          query: { excludeIncomplete: 'false' },
        })
        .willRespondWith({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: assessmentNeeds,
        })

      return provider.executeTest(async (mockserver: any) => {
        config.apis.arnsApi.url = mockserver.url

        const pactClient: ArnsApiClient = new ArnsApiClient(hmppsAuthTokenClient)

        const deps = {
          arnsApi: pactClient,
        } as SentencePlanEffectsDeps

        const criminogenicNeeds = await getCriminogenicNeeds(deps.arnsApi, crn, MOCK_USER.token)

        expect(criminogenicNeeds.assessmentVersion).toBe('SAN')
      })
    })
  })
})
