import { SuperAgentRequest } from 'superagent'
import { PreviousVersionsResponse } from '@server/interfaces/coordinator-api/previousVersions'
import { stubFor } from './wiremock'

export interface AnswerDto {
  value?: string
  values?: string[]
  collection?: Record<string, AnswerDto>[]
}

export type SanAssessmentData = Record<string, AnswerDto>

export interface EntityAssessmentResponse {
  sanAssessmentId: string
  sanAssessmentVersion: number
  sanAssessmentData: SanAssessmentData
  sanOasysEquivalent: Record<string, string | string[]>
  lastUpdatedTimestampSAN: string
  sentencePlanId: string
  sentencePlanVersion: number
  planComplete: 'COMPLETE' | 'INCOMPLETE'
  planType: 'INITIAL' | 'REVIEW'
  lastUpdatedTimestampSP: string
}

const defaultSanAssessmentData: SanAssessmentData = {
  accommodation_section_complete: { value: 'YES' },
  accommodation_practitioner_analysis_risk_of_serious_harm: { value: 'YES' },
  accommodation_practitioner_analysis_risk_of_serious_harm_yes_details: {
    value: 'Risk of serious harm related to accommodation instability. The individual has a history of rough sleeping.',
  },
  accommodation_practitioner_analysis_risk_of_reoffending: { value: 'YES' },
  accommodation_practitioner_analysis_risk_of_reoffending_yes_details: {
    value:
      'Accommodation instability is linked to reoffending. Previous offences occurred during periods of homelessness.',
  },
  accommodation_practitioner_analysis_strengths_or_protective_factors: { value: 'YES' },
  accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details: {
    value: 'Has maintained tenancy previously for 2 years. Eligible for housing support.',
  },
  accommodation_changes: { value: 'WANT_TO_MAKE_CHANGES' },

  finance_section_complete: { value: 'NO' },
  finance_practitioner_analysis_risk_of_reoffending: { value: 'NO' },
  finance_practitioner_analysis_strengths_or_protective_factors: { value: 'YES' },
  finance_practitioner_analysis_strengths_or_protective_factors_yes_details: {
    value: 'Has managed finances responsibly in the past when employed.',
  },

  drug_use_section_complete: { value: 'NO' },
  drug_use_practitioner_analysis_risk_of_serious_harm: { value: 'NO' },
  drug_use_practitioner_analysis_risk_of_reoffending: { value: 'YES' },
  drug_use_practitioner_analysis_risk_of_reoffending_yes_details: {
    value: 'Previous offences were committed to fund drug habit.',
  },
  drug_use_practitioner_analysis_strengths_or_protective_factors: { value: 'NO' },
  drug_use_changes: { value: 'NEEDS_HELP_TO_MAKE_CHANGES' },

  alcohol_use_section_complete: { value: 'YES' },
  alcohol_use_practitioner_analysis_risk_of_serious_harm: { value: 'YES' },
  alcohol_use_practitioner_analysis_risk_of_serious_harm_yes_details: {
    value: 'All index offences occurred while under the influence of alcohol.',
  },
  alcohol_use_practitioner_analysis_risk_of_reoffending: { value: 'YES' },
  alcohol_use_practitioner_analysis_risk_of_reoffending_yes_details: {
    value: 'Strong correlation between alcohol use and offending.',
  },
  alcohol_use_practitioner_analysis_strengths_or_protective_factors: { value: 'YES' },
  alcohol_use_practitioner_analysis_strengths_or_protective_factors_yes_details: {
    value: 'Periods of abstinence in the past. Family support for recovery.',
  },
  alcohol_use_changes: { value: 'MADE_CHANGES' },

  personal_relationships_community_section_complete: { value: 'YES' },
  personal_relationships_community_practitioner_analysis_risk_of_serious_harm: { value: 'YES' },
  personal_relationships_community_practitioner_analysis_risk_of_serious_harm_yes_details: {
    value: 'History of domestic abuse towards intimate partners.',
  },
  personal_relationships_community_practitioner_analysis_risk_of_reoffending: { value: 'YES' },
  personal_relationships_community_practitioner_analysis_risk_of_reoffending_yes_details: {
    value: 'Negative peer associations continue to influence behaviour.',
  },
  personal_relationships_community_practitioner_analysis_strengths_or_protective_factors: { value: 'YES' },
  personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_yes_details: {
    value: 'Strong family support from parents. Positive relationship with children.',
  },
  personal_relationships_community_changes: { value: 'MAKING_CHANGES' },

  thinking_behaviours_attitudes_section_complete: { value: 'NO' },
  thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm: { value: 'YES' },
  thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm_yes_details: {
    value: 'Impulsive decision-making and poor anger management have led to violent incidents.',
  },
  thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending: { value: 'YES' },
  thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending_yes_details: {
    value: 'Pattern of acting impulsively without considering consequences.',
  },
  thinking_behaviours_attitudes_changes: { value: 'THINKING_ABOUT_MAKING_CHANGES' },
}

const defaultEntityAssessmentResponse: EntityAssessmentResponse = {
  sanAssessmentId: '90a71d16-fecd-4e1a-85b9-98178bf0f8d0',
  sanAssessmentVersion: 1,
  sanAssessmentData: defaultSanAssessmentData,
  sanOasysEquivalent: {},
  lastUpdatedTimestampSAN: new Date().toISOString(),
  sentencePlanId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  sentencePlanVersion: 1,
  planComplete: 'INCOMPLETE',
  planType: 'INITIAL',
  lastUpdatedTimestampSP: new Date().toISOString(),
}

// Always use unique UUIDs from createSession() - hardcoded UUIDs cause flaky parallel tests
export default {
  stubGetEntityAssessment: (entityUuid: string, response: Partial<EntityAssessmentResponse> = {}): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/coordinator-api/entity/${entityUuid}/ASSESSMENT`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: { ...defaultEntityAssessmentResponse, ...response },
      },
      priority: 1,
    }),

  stubGetEntityAssessmentNotFound: (entityUuid: string): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/coordinator-api/entity/${entityUuid}/ASSESSMENT`,
      },
      response: {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: {
          status: 404,
          errorCode: null,
          userMessage: 'No associated entities were found',
          developerMessage: `No entities found for UUID: ${entityUuid}`,
          moreInfo: null,
        },
      },
      priority: 1,
    }),

  stubGetEntityAssessmentError: (entityUuid: string): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/coordinator-api/entity/${entityUuid}/ASSESSMENT`,
      },
      response: {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: {
          status: 500,
          errorCode: null,
          userMessage: 'Unexpected error',
          developerMessage: 'An unexpected error occurred',
          moreInfo: null,
        },
      },
      priority: 1,
    }),

  stubGetEntityVersions: (entityUuid: string, versions: PreviousVersionsResponse): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        // Versions endpoint can include optional authType suffix (e.g. /HMPPS_AUTH)
        urlPattern: `/coordinator-api/entity/versions/${entityUuid}(/HMPPS_AUTH)?`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: versions,
      },
      priority: 1,
    }),
}
