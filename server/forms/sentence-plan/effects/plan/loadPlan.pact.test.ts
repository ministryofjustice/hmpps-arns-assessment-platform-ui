import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import path from 'path'
import { PactV3 } from '@pact-foundation/pact'
import nock from 'nock'
import AssessmentPlatformApiClient from '../../../../data/assessmentPlatformApiClient'
import { AssessmentVersionQuery } from '../../../../interfaces/aap-api/query'
import { AssessmentVersionQueryResult } from '../../../../interfaces/aap-api/queryResult'
import config from '../../../../config'
import { assessmentVersionQuery } from './loadPlan'
import { SentencePlanEffectsDeps } from '../types'
import { AssessmentIdentifiers } from '../../../../interfaces/aap-api/identifier'
import { PactWrapper } from '../../../../testutils/PactWrapper'
import { createMockAuthClient, MOCK_USER } from '../../../../testutils/mockAuth'

const provider = new PactV3({
  dir: path.resolve(process.cwd(), 'pacts'),
  consumer: 'hmpps-arns-assessment-platform-ui',
  provider: 'hmpps-arns-assessment-platform-api',
  logLevel: 'info',
})

describe('Assessment Platform Api Client', () => {
  let hmppsAuthTokenClient: AuthenticationClient

  beforeEach(() => {
    jest.clearAllMocks()
    hmppsAuthTokenClient = createMockAuthClient()
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
      user: MOCK_USER,
      assessmentIdentifier: planIdentifier,
    }

    it('returns an HTTP 200 and a assessment version', () => {
      const queryResult: AssessmentVersionQueryResult = {
        type: 'AssessmentVersionQueryResult',
        assessmentUuid,
        aggregateUuid,
        assessmentType: 'SENTENCE_PLAN',
        formVersion: '1',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        answers: {},
        properties: {
          PLAN_TYPE: {
            type: 'Single',
            value: 'INITIAL',
          },
        },
        collections: [
          {
            uuid: '2dd06187-f575-4ba6-bfd1-04ae692fccea',
            createdAt: '2026-10-07T14:32:53.893657',
            updatedAt: '2026-10-07T14:32:53.893657',
            name: 'GOALS',
            items: [
              {
                uuid: '49c3f7ab-50e0-4427-a122-35f44b783851',
                createdAt: '2026-10-07T14:32:53.963434',
                updatedAt: '2026-10-07T14:32:53.963434',
                answers: {
                  title: {
                    type: 'Single',
                    value: 'I will work towards finding accommodation, so that I am no longer homeless',
                  },
                  target_date: {
                    type: 'Single',
                    value: '2026-05-23T16:30:11.151Z',
                  },
                  area_of_need: {
                    type: 'Single',
                    value: 'accommodation',
                  },
                  related_areas_of_need: {
                    type: 'Multi',
                    values: ['alcohol-use'],
                  },
                },
                properties: {
                  status: {
                    type: 'Single',
                    value: 'ACTIVE',
                  },
                  status_date: {
                    type: 'Single',
                    value: '2026-02-23T17:30:11.179Z',
                  },
                },
                collections: [
                  {
                    uuid: '4ca52e81-b789-4f06-a803-4ab1022223a1',
                    createdAt: '2026-10-07T14:32:54.036876',
                    updatedAt: '2026-10-07T14:32:54.036876',
                    name: 'STEPS',
                    items: [
                      {
                        uuid: '0e8217a5-8659-4a2b-a806-34cb1dd83edb',
                        createdAt: '2026-10-07T14:32:54.102556',
                        updatedAt: '2026-10-07T14:32:54.102556',
                        answers: {
                          actor: {
                            type: 'Single',
                            value: 'probation_practitioner',
                          },
                          status: {
                            type: 'Single',
                            value: 'NOT_STARTED',
                          },
                          description: {
                            type: 'Single',
                            value: 'Step 1',
                          },
                        },
                        properties: {
                          status_date: {
                            type: 'Single',
                            value: '2026-02-23T17:30:11.850Z',
                          },
                        },
                        collections: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        collaborators: [
          {
            id: MOCK_USER.id,
            name: MOCK_USER.name,
            authSource: MOCK_USER.authSource,
          },
        ],
        identifiers: {
          CRN: '21256',
        },
        flags: ['SAN_BETA'],
      }

      const pactWrapper = new PactWrapper(provider)

      pactWrapper.provider
        .given('I have a sentence plan', { assessmentUuid, userId: MOCK_USER.id })
        .uponReceiving('a request for plan by uuid')

      pactWrapper.withQuery<AssessmentVersionQuery>('/query', query)
        .withAssessmentVersionQueryResult(200, queryResult)

      return pactWrapper.provider.executeTest(async (mockserver: any) => {
        config.apis.aapApi.url = mockserver.url

        const pactClient: AssessmentPlatformApiClient = new AssessmentPlatformApiClient(hmppsAuthTokenClient)

        const deps = {
          api: pactClient,
        } as SentencePlanEffectsDeps

        const loadPlan = await assessmentVersionQuery(deps, MOCK_USER, planIdentifier)

        expect(loadPlan.assessmentType).toBe('SENTENCE_PLAN')
      })
    })
  })
})
