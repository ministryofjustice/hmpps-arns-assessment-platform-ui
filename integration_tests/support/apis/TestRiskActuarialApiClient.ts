import { RestClient, asSystem, AgentConfig } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type { TestInfo } from '@playwright/test'
import { RiskScoreInput, RiskScores } from '@server/interfaces/risk-actuarial-api/riskScores'
import { OffenceCodesResponse } from '@server/interfaces/risk-actuarial-api/offenceCodes'
import { noopLogger } from './noopLogger'

export interface TestRiskActuarialApiClientConfig {
  baseUrl: string
  authenticationClient: AuthenticationClient
  testInfo?: TestInfo
}

/**
 * API client for Risk Actuarial API test data setup.
 * Extends hmpps-rest-client for consistent HTTP handling and auth.
 * Optionally attaches request/response data to Playwright test reports.
 */
export class TestRiskActuarialApiClient extends RestClient {
  private readonly testInfo?: TestInfo

  constructor(config: TestRiskActuarialApiClientConfig) {
    super(
      'Test Risk Actuarial API Client',
      {
        url: config.baseUrl,
        timeout: { response: 30000, deadline: 30000 },
        agent: new AgentConfig(30000),
      },
      noopLogger,
      config.authenticationClient,
    )
    this.testInfo = config.testInfo
  }

  /**
   * Get risk scores
   */
  async getRiskScores(input: RiskScoreInput): Promise<RiskScores> {
    return this.request('getRiskScores', input, () =>
      this.post({ path: `/risk-scores/v1`, data: { ...input } }, asSystem()),
    )
  }

  async getOffenceCodes(): Promise<OffenceCodesResponse> {
    const offenceCodesResponse: OffenceCodesResponse = {
      offenceCodes: {
        '00000': {
          parentGroupDescription: 'Other summary offences',
          categoryDescription: 'Invalid Offence',
          subCategoryDescription: 'Invalid Offence',
          actuarialCategory: 'UNKNOWN',
          flags: {
            opdViolenceSex: false,
            isViolentSanction: false,
          },
        },
        '00100': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Murder',
          subCategoryDescription:
            'Murder    [Use this code only if you are unable to determine which subcoded Offence applies]',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00404': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Manslaughter etc',
          subCategoryDescription: 'Causing death by dangerous driving',
          actuarialCategory: 'MOTORING_OFFENCES',
          flags: {
            opdViolenceSex: false,
            isViolentSanction: false,
          },
        },
        '00406': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Manslaughter etc',
          subCategoryDescription: 'Causing death by careless driving when under the influence of drink or drugs',
          actuarialCategory: 'DRINK_DRIVING',
          flags: {
            opdViolenceSex: false,
            isViolentSanction: false,
          },
        },
        '00514': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription: 'Possession of firearms etc., with intent to endanger life (Group I)',
          actuarialCategory: 'FIREARMS_MOST_SERIOUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00811': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Malicious wounding and other like offences',
          subCategoryDescription: 'Possession of offensive weapons without lawful authority or reasonable excuse',
          actuarialCategory: 'WEAPONS_NON_FIREARM',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00829': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Malicious wounding and other like offences',
          subCategoryDescription:
            'Breach of the conditions of an injunction against harassment (was breach of molestation order)',
          actuarialCategory: 'PUBLIC_ORDER_AND_HARRASSMENT',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00832': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Malicious wounding and other like offences',
          subCategoryDescription:
            'Breach of Anti-Social Behaviour Order (order made to protect from alarm, distress or harassment)',
          actuarialCategory: 'OTHER_OFFENCES',
          flags: {
            opdViolenceSex: false,
            isViolentSanction: false,
          },
        },
        '01911': {
          parentGroupDescription: 'Sexual offences',
          categoryDescription: 'Rape',
          subCategoryDescription: 'Attempted rape of a female aged under 16',
          actuarialCategory: 'SEXUAL_AGAINST_CHILD',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: false,
          },
        },
        '00900': {
          parentGroupDescription: 'Criminal damage',
          categoryDescription: 'Threat and possession with intent to commit criminal damage',
          subCategoryDescription: 'Threat and possession with intent to commit criminal damage (00900)',
          actuarialCategory: 'CRIMINAL_DAMAGE',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: false,
          },
        },
        '01600': {
          parentGroupDescription: 'Sexual offences',
          categoryDescription: 'Buggery and Attempted Buggery',
          subCategoryDescription:
            'Buggery and Attempted Buggery    [Use this code only if you are unable to determine which subcoded Offence applies]',
          actuarialCategory: 'SEXUAL_NOT_AGAINST_CHILD',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: false,
          },
        },
        '02800': {
          parentGroupDescription: 'Burglary',
          categoryDescription: 'Burglary in a dwelling',
          subCategoryDescription:
            'Burglary in a dwelling    [Use this code only if you are unable to determine which subcoded Offence applies]',
          actuarialCategory: 'BURGLARY_DOMESTIC',
          flags: {
            opdViolenceSex: false,
            isViolentSanction: false,
          },
        },
        '02900': {
          parentGroupDescription: 'Burglary',
          categoryDescription: 'Aggravated burglary in a dwelling',
          subCategoryDescription: 'Aggravated burglary in a dwelling',
          actuarialCategory: 'ACQUISITIVE_VIOLENCE',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '03000': {
          parentGroupDescription: 'Burglary',
          categoryDescription: 'Burglary, other than in a dwelling',
          subCategoryDescription:
            'Burglary, other than in a dwelling    [Use this code only if you are unable to determine which subcoded Offence applies]',
          actuarialCategory: 'BURGLARY_OTHER',
          flags: {
            opdViolenceSex: false,
            isViolentSanction: false,
          },
        },
        '03700': {
          parentGroupDescription: 'Theft and handling',
          categoryDescription: 'Aggravated Taking of a Vehicle',
          subCategoryDescription:
            'Aggravated Taking of a Vehicle    [Use this code only if you are unable to determine which subcoded Offence applies]',
          actuarialCategory: 'VEHICLE_RELATED_THEFT',
          flags: {
            opdViolenceSex: false,
            isViolentSanction: false,
          },
        },
        '03800': {
          parentGroupDescription: 'Theft and handling',
          categoryDescription: 'Money Laundering offences (not drugs)',
          subCategoryDescription:
            'Money Laundering offences (not drugs)    [Use this code only if you are unable to determine which subcoded Offence applies]',
          actuarialCategory: 'FRAUD_AND_FORGERY',
          flags: {
            opdViolenceSex: false,
            isViolentSanction: false,
          },
        },
        '04000': {
          parentGroupDescription: 'Theft and handling',
          categoryDescription: 'Stealing in a dwelling other than from automatic machines and meters',
          subCategoryDescription: 'Stealing in a dwelling other than from automatic machines and meters',
          actuarialCategory: 'THEFT_NON_MOTOR',
          flags: {
            opdViolenceSex: false,
            isViolentSanction: false,
          },
        },
        '05336': {
          parentGroupDescription: 'Fraud forgery',
          categoryDescription: 'Other Frauds',
          subCategoryDescription: 'Knowingly concerned in fraudulent evasion of contributions',
          actuarialCategory: 'WELFARE_FRAUD',
          flags: {
            opdViolenceSex: false,
            isViolentSanction: false,
          },
        },
        '05400': {
          parentGroupDescription: 'Theft and handling',
          categoryDescription: 'Handling stolen goods',
          subCategoryDescription:
            'Handling stolen goods    [Use this code only if you are unable to determine which subcoded Offence applies]',
          actuarialCategory: 'HANDLING_STOLEN_GOODS',
          flags: {
            opdViolenceSex: false,
            isViolentSanction: false,
          },
        },
        '08100': {
          parentGroupDescription: 'Other indictable',
          categoryDescription: 'Firearms Act 1968 and other Firearms Acts',
          subCategoryDescription:
            'Firearms Act 1968 and other Firearms Acts    [Use this code only if you are unable to determine which subcoded Offence applies]',
          actuarialCategory: 'FIREARMS_OTHER',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '09259': {
          parentGroupDescription: 'Drug offences',
          categoryDescription: 'Misuse of Drugs',
          subCategoryDescription: 'Having possession of a controlled drug - Class A - Other Class A',
          actuarialCategory: 'DRUG_POSSESSION_OR_SUPPLY',
          flags: {
            opdViolenceSex: false,
            isViolentSanction: false,
          },
        },
        '09943': {
          parentGroupDescription: 'Other indictable',
          categoryDescription: 'Other indictable offences',
          subCategoryDescription: 'Drunkenness in aircraft (including drugs)',
          actuarialCategory: 'DRUNKENNESS',
          flags: {
            opdViolenceSex: false,
            isViolentSanction: true,
          },
        },
        '19301': {
          parentGroupDescription: 'Drug offences',
          categoryDescription: 'Misuse of Drugs, offences in relation to',
          subCategoryDescription: 'Production or being concerned in the production of a controlled drug',
          actuarialCategory: 'DRUG_IMPORT_EXPORT_OR_PRODUCTION',
          flags: {
            opdViolenceSex: false,
            isViolentSanction: false,
          },
        },
      },
    }

    return Promise.resolve(offenceCodesResponse)
    // TODO ACT-615 Remove hardcoded values and use the below once ACT-615 is implemented
    // return this.get({ path: `/ref-data/offence-codes` }, asSystem())
  }

  private async request<TRequest, TResponse>(
    operation: string,
    request: TRequest,
    fn: () => Promise<TResponse>,
  ): Promise<TResponse> {
    try {
      const response = await fn()

      if (this.testInfo) {
        await this.testInfo.attach(`TEST RISK ACTUARIAL API SUCCESS: ${operation}`, {
          body: JSON.stringify({ request, response }, null, 2),
          contentType: 'application/json',
        })
      }

      return response
    } catch (error) {
      if (this.testInfo) {
        await this.testInfo.attach(`TEST RISK ACTUARIAL API ERROR: ${operation}`, {
          body: JSON.stringify({ request, error }, null, 2),
          contentType: 'application/json',
        })
      }

      throw error
    }
  }
}
