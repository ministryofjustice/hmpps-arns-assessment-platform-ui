import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export interface TestAssessment {
  assessmentUuid: string
  assessmentType: string
  formVersion: string
  identifiers: Record<string, string>
  properties: Record<string, { type: string; value: string }>
  collections?: TestCollection[]
}

export interface TestCollection {
  uuid: string
  name: string
  items?: TestCollectionItem[]
}

export interface TestCollectionItem {
  uuid: string
  properties: Record<string, { type: string; value: string }>
  answers: Record<string, { type: string; value: unknown }>
}

export interface TestPerson {
  crn: string
  forename: string
  middleName?: string
  surname: string
  dateOfBirth?: string
  tier?: string
  nomisId?: string
  region?: string
  location?: string
}

export const defaultTestPerson: TestPerson = {
  crn: 'X123456',
  forename: 'John',
  middleName: '',
  surname: 'Smith',
  dateOfBirth: '1990-01-15',
  tier: 'A1',
  nomisId: 'A1234BC',
  region: 'London',
  location: 'Office',
}

export const createTestAssessment = (overrides: Partial<TestAssessment> = {}): TestAssessment => ({
  assessmentUuid: 'test-assessment-uuid',
  assessmentType: 'SENTENCE_PLAN',
  formVersion: '1.0',
  identifiers: { CRN: defaultTestPerson.crn },
  properties: {
    AGREEMENT_STATUS: { type: 'Single', value: 'DRAFT' },
  },
  collections: [
    {
      uuid: 'test-collection-uuid',
      name: 'GOALS',
      items: [
        {
          uuid: 'test-item-uuid',
          properties: {
            status: { type: 'Single', value: 'ACTIVE' },
            status_date: { type: 'Single', value: new Date().toISOString() },
          },
          answers: {
            title: { type: 'Single', value: 'Test Goal' },
            area_of_need: { type: 'Single', value: 'accommodation' },
            related_areas_of_need: { type: 'Array', value: [] },
            target_date: { type: 'Single', value: null },
          },
        },
      ],
    },
  ],
  ...overrides,
})

export default {
  stubPing: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/aap-api/health/ping',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
      },
    }),

  /**
   * Stub the query endpoint to return assessment data
   * Matches any POST to /query and returns the provided assessment
   */
  stubAssessmentQuery: (assessment: TestAssessment = createTestAssessment()): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        urlPath: '/aap-api/query',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          queries: [
            {
              result: {
                assessmentUuid: assessment.assessmentUuid,
                assessmentType: assessment.assessmentType,
                formVersion: assessment.formVersion,
                identifiers: assessment.identifiers,
                properties: assessment.properties,
                collections: assessment.collections || [],
              },
            },
          ],
        },
      },
    }),

  /**
   * Stub the query endpoint to return 404 (assessment not found)
   */
  stubAssessmentQueryNotFound: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        urlPath: '/aap-api/query',
      },
      response: {
        status: 404,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          queries: [{ result: null }],
        },
      },
    }),

  /**
   * Stub the command endpoint to handle create/update operations
   * Returns success for any command
   */
  stubCommandSuccess: (resultOverrides: Record<string, unknown> = {}): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        urlPath: '/aap-api/command',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          commands: [
            {
              result: {
                success: true,
                assessmentUuid: 'test-assessment-uuid',
                collectionUuid: 'test-collection-uuid',
                collectionItemUuid: `test-item-${Date.now()}`,
                ...resultOverrides,
              },
            },
          ],
        },
      },
    }),

  /**
   * Stub Delius case details lookup by CRN
   * This is the Delius API endpoint, not AAP API
   */
  stubDeliusCaseDetails: (person: TestPerson = defaultTestPerson): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: `/case-details/${person.crn}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn: person.crn,
          name: {
            forename: person.forename,
            middleName: person.middleName || '',
            surname: person.surname,
          },
          dateOfBirth: person.dateOfBirth,
          tier: person.tier || 'A1',
          nomisId: person.nomisId || 'A1234BC',
          region: person.region || 'London',
          location: person.location || 'Office',
          sexuallyMotivatedOffenceHistory: 'No',
          sentences: [],
        },
      },
    }),

  /**
   * Stub all common API calls needed for sentence plan tests
   */
  stubSentencePlanApis: (assessment: TestAssessment = createTestAssessment(), person: TestPerson = defaultTestPerson) =>
    Promise.all([
      // AAP API: Assessment query
      stubFor({
        request: {
          method: 'POST',
          urlPath: '/aap-api/query',
        },
        response: {
          status: 200,
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          jsonBody: {
            queries: [
              {
                result: {
                  assessmentUuid: assessment.assessmentUuid,
                  assessmentType: assessment.assessmentType,
                  formVersion: assessment.formVersion,
                  identifiers: assessment.identifiers,
                  properties: assessment.properties,
                  collections: assessment.collections || [],
                },
              },
            ],
          },
        },
      }),
      // AAP API: Commands
      stubFor({
        request: {
          method: 'POST',
          urlPath: '/aap-api/command',
        },
        response: {
          status: 200,
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          jsonBody: {
            commands: [
              {
                result: {
                  success: true,
                  assessmentUuid: assessment.assessmentUuid,
                  collectionUuid: 'test-collection-uuid',
                  collectionItemUuid: 'test-item-uuid',
                },
              },
            ],
          },
        },
      }),
      // Delius API: Case details
      stubFor({
        request: {
          method: 'GET',
          urlPathPattern: `/case-details/.*`,
        },
        response: {
          status: 200,
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          jsonBody: {
            crn: person.crn,
            name: {
              forename: person.forename,
              middleName: person.middleName || '',
              surname: person.surname,
            },
            dateOfBirth: person.dateOfBirth,
            tier: person.tier || 'A1',
            nomisId: person.nomisId || 'A1234BC',
            region: person.region || 'London',
            location: person.location || 'Office',
            sexuallyMotivatedOffenceHistory: 'No',
            sentences: [],
          },
        },
      }),
    ]),
}
