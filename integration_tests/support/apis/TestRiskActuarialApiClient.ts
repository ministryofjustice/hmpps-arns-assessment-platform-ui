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
        '00302': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Threats, conspiracy or incitement to murder',
          subCategoryDescription:
            'Conspiracy or soliciting, etc., to commit murder. Conspiracy or soliciting to commit murder abroad by UK citizen. Conspiring, aiding, abetting, counselling, procuring or inciting commission of genocide or crime against humanity',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00303': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Threats, conspiracy or incitement to murder',
          subCategoryDescription:
            'Assisting offender by impeding his apprehension or prosecution in a case of murder. Concealing commission of genocide or crime against humanity',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00304': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Threats, conspiracy or incitement to murder',
          subCategoryDescription: 'Intentionally encouraging or assisting commission of Murder',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00305': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Threats, conspiracy or incitement to murder',
          subCategoryDescription: 'Encouraging or assisting in the commission of Murder believing it will be committed',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00306': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Threats, conspiracy or incitement to murder',
          subCategoryDescription:
            'Encouraging or assisting in the commission of one or more offences of Murder believing one or more will be committed',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00400': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Manslaughter etc',
          subCategoryDescription:
            'Manslaughter etc    [Use this code only if you are unable to determine which subcoded Offence applies]',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00401': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Manslaughter etc',
          subCategoryDescription: 'Manslaughter. Manslaughter abroad by UK citizen. Manslaughter by driving',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00402': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Manslaughter etc',
          subCategoryDescription: 'Infanticide',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00403': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Manslaughter etc',
          subCategoryDescription: 'Child destruction',
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
        '00405': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Manslaughter etc',
          subCategoryDescription: 'Manslaughter: Diminished responsibility',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
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
        '00407': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Manslaughter etc',
          subCategoryDescription: 'Causing or allowing the death of a child or vulnerable person',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00408': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Manslaughter etc',
          subCategoryDescription: 'Causing death by careless or inconsiderate driving',
          actuarialCategory: 'MOTORING_OFFENCES',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: false,
          },
        },
        '00409': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Manslaughter etc',
          subCategoryDescription: 'Causing death by driving - unlicensed, disqualified or uninsured drivers',
          actuarialCategory: 'MOTORING_OFFENCES',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: false,
          },
        },
        '00410': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Manslaughter etc',
          subCategoryDescription:
            'Applicable organisation by way of management or organisation of its activities causing death by gross breach of duty of care',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00411': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Manslaughter etc',
          subCategoryDescription: 'Causing or allowing child or vulnerable adult to suffer serious physical harm',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: false,
            isViolentSanction: true,
          },
        },
        '00412': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Manslaughter etc',
          subCategoryDescription: 'Cause serious injury by dangerous driving',
          actuarialCategory: 'MOTORING_OFFENCES',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: false,
          },
        },
        '00418': {
          parentGroupDescription: 'Summary motoring offences',
          categoryDescription: 'Manslaughter etc',
          subCategoryDescription: 'Cause serious injury by driving whilst disqualified',
          actuarialCategory: 'MOTORING_OFFENCES',
          flags: {
            opdViolenceSex: false,
            isViolentSanction: false,
          },
        },
        '00419': {
          parentGroupDescription: 'Summary motoring offences',
          categoryDescription: 'Manslaughter etc',
          subCategoryDescription: 'Cause serious injury by careless driving',
          actuarialCategory: 'MOTORING_OFFENCES',
          flags: {
            opdViolenceSex: false,
            isViolentSanction: false,
          },
        },
        '00500': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription:
            'Wounding and other acts endangering life    [Use this code only if you are unable to determine which subcoded Offence applies]',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00501': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription:
            'Wounding, etc, with intent to do grievous bodily harm, etc., or to resist apprehension',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00502': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription: 'Shooting at naval or revenue vessels',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00504': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription:
            'Attempting to choke, suffocate etc with intent to commit an indictable offence (garrotting)',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00505': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription: 'Using chloroform, etc., to commit or assist in committing an indictable offence',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00506': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription: 'Burning, maiming, etc. by explosion',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00507': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription:
            'Causing, explosions or casting corrosive fluids with intent to do grievous bodily harm',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00508': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription: 'Impeding the saving of life from shipwreck',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00509': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription:
            'Placing, etc. explosives in or near ships or buildings with intent to do bodily harm, etc.',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00510': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription: 'Endangering life or causing harm by administering poison',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00511': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription:
            'Causing danger by causing anything to be on a road, interfering with a vehicle or traffic equipment',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00513': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription: 'Possession etc. of explosives with intent to endanger life',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
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
        '00515': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription: 'Possession of firearms etc. with intent to endanger life (Group II)',
          actuarialCategory: 'FIREARMS_MOST_SERIOUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00516': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription: 'Possession of firearms etc. with intent to endanger life (Group III)',
          actuarialCategory: 'FIREARMS_MOST_SERIOUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00807': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Malicious wounding and other like offences',
          subCategoryDescription: '*Assault PC (Indictable/Either way)',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00517': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription:
            'Using etc. firearms or imitation firearms with intent to resist arrest etc. (Group I)',
          actuarialCategory: 'FIREARMS_MOST_SERIOUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00518': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription:
            'Using etc. firearms or imitation firearms with intent to resist arrest etc. (Group II)',
          actuarialCategory: 'FIREARMS_MOST_SERIOUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00519': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription:
            'Using etc. firearms or imitation firearms with intent to resist arrest etc. (Group III)',
          actuarialCategory: 'FIREARMS_MOST_SERIOUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00520': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription: 'Use etc. of chemical weapons',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00521': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription: 'Use of premises or equipment for producing chemical weapons',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00522': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription: 'Use, threat of use, production or possession of a nuclear weapon',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00523': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription: 'Weapons related acts overseas',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00524': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription: 'Use of noxious substances or things to cause harm or intimidate',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00525': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription:
            'Performing an aviation function or ancillary function when ability to carry out function is impaired because of drink or drugs',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00526': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription: 'Endangering safety at aerodromes',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
          },
        },
        '00527': {
          parentGroupDescription: 'Violence against the person',
          categoryDescription: 'Wounding and other acts endangering life',
          subCategoryDescription: 'Torture',
          actuarialCategory: 'VIOLENCE_AGAINST_THE_PERSON_ABH_PLUS',
          flags: {
            opdViolenceSex: true,
            isViolentSanction: true,
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
