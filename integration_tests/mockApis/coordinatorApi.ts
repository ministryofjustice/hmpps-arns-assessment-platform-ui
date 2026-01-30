import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

/**
 * OASys equivalent data structure - flat key-value pairs following naming convention:
 * {area}_section_complete
 * {area}_practitioner_analysis_risk_of_serious_harm
 * {area}_practitioner_analysis_risk_of_serious_harm_{yes|no}_details
 * {area}_practitioner_analysis_risk_of_reoffending
 * {area}_practitioner_analysis_risk_of_reoffending_{yes|no}_details
 * {area}_practitioner_analysis_strengths_or_protective_factors
 * {area}_practitioner_analysis_strengths_or_protective_factors_{yes|no}_details
 * {area}_practitioner_analysis_motivation_to_make_changes
 */
export type OasysEquivalent = Record<string, string | string[]>

export interface EntityAssessmentResponse {
  sanAssessmentId: string
  sanAssessmentVersion: number
  sanAssessmentData: Record<string, unknown>
  sanOasysEquivalent: OasysEquivalent
  lastUpdatedTimestampSAN: string
  sentencePlanId: string
  sentencePlanVersion: number
  planComplete: 'COMPLETE' | 'INCOMPLETE'
  planType: 'INITIAL' | 'REVIEW'
  lastUpdatedTimestampSP: string
}

const defaultSanOasysEquivalent: OasysEquivalent = {
  // Accommodation
  accommodation_section_complete: 'YES',
  accommodation_practitioner_analysis_risk_of_serious_harm: 'YES',
  accommodation_practitioner_analysis_risk_of_serious_harm_yes_details:
    'Risk of serious harm related to accommodation instability. The individual has a history of rough sleeping.',
  accommodation_practitioner_analysis_risk_of_reoffending: 'YES',
  accommodation_practitioner_analysis_risk_of_reoffending_yes_details:
    'Accommodation instability is linked to reoffending. Previous offences occurred during periods of homelessness.',
  accommodation_practitioner_analysis_strengths_or_protective_factors: 'YES',
  accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details:
    'Has maintained tenancy previously for 2 years. Eligible for housing support.',
  accommodation_practitioner_analysis_motivation_to_make_changes: 'READY_TO_MAKE_CHANGES',

  // Thinking, behaviours and attitudes
  thinking_behaviours_attitudes_section_complete: 'YES',
  thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm: 'YES',
  thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm_yes_details:
    'Impulsive decision-making and poor anger management have led to violent incidents.',
  thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending: 'YES',
  thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending_yes_details:
    'Pattern of acting impulsively without considering consequences.',
  thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors: 'YES',
  thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors_yes_details:
    'Shows genuine remorse and insight into offending behaviour.',
  thinking_behaviours_attitudes_practitioner_analysis_motivation_to_make_changes: 'READY_TO_MAKE_CHANGES',

  // Alcohol use
  alcohol_use_section_complete: 'YES',
  alcohol_use_practitioner_analysis_risk_of_serious_harm: 'YES',
  alcohol_use_practitioner_analysis_risk_of_serious_harm_yes_details:
    'All index offences occurred while under the influence of alcohol.',
  alcohol_use_practitioner_analysis_risk_of_reoffending: 'YES',
  alcohol_use_practitioner_analysis_risk_of_reoffending_yes_details:
    'Strong correlation between alcohol use and offending.',
  alcohol_use_practitioner_analysis_strengths_or_protective_factors: 'YES',
  alcohol_use_practitioner_analysis_strengths_or_protective_factors_yes_details:
    'Periods of abstinence in the past. Family support for recovery.',
  alcohol_use_practitioner_analysis_motivation_to_make_changes: 'READY_TO_MAKE_CHANGES',

  // Personal relationships
  personal_relationships_community_section_complete: 'YES',
  personal_relationships_community_practitioner_analysis_risk_of_serious_harm: 'YES',
  personal_relationships_community_practitioner_analysis_risk_of_serious_harm_yes_details:
    'History of domestic abuse towards intimate partners.',
  personal_relationships_community_practitioner_analysis_risk_of_reoffending: 'YES',
  personal_relationships_community_practitioner_analysis_risk_of_reoffending_yes_details:
    'Negative peer associations continue to influence behaviour.',
  personal_relationships_community_practitioner_analysis_strengths_or_protective_factors: 'YES',
  personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_yes_details:
    'Strong family support from parents. Positive relationship with children.',
  personal_relationships_community_practitioner_analysis_motivation_to_make_changes: 'READY_TO_MAKE_CHANGES',
}

const defaultEntityAssessmentResponse: EntityAssessmentResponse = {
  sanAssessmentId: '90a71d16-fecd-4e1a-85b9-98178bf0f8d0',
  sanAssessmentVersion: 1,
  sanAssessmentData: {},
  sanOasysEquivalent: defaultSanOasysEquivalent,
  lastUpdatedTimestampSAN: new Date().toISOString(),
  sentencePlanId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  sentencePlanVersion: 1,
  planComplete: 'INCOMPLETE',
  planType: 'INITIAL',
  lastUpdatedTimestampSP: new Date().toISOString(),
}

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
}
