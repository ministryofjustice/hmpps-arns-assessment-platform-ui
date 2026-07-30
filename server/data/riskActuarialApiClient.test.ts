import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import { asSystem } from '@ministryofjustice/hmpps-rest-client'
import RiskActuarialApiClient from './riskActuarialApiClient'
import { RiskScoreInput, RiskScores } from '../interfaces/risk-actuarial-api/riskScores'
import { OffenceCodesResponse } from '../interfaces/risk-actuarial-api/offenceCodes'

jest.mock('../config', () => ({
  apis: {
    riskActuarialApi: {
      url: 'http://localhost:8080',
      timeout: { response: 10000, deadline: 10000 },
      agent: { maxSockets: 100, maxFreeSockets: 10, freeSocketTimeout: 30000 },
    },
  },
}))

jest.mock('../../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}))

describe('RiskActuarialApiClient', () => {
  let client: RiskActuarialApiClient
  let mockPost: jest.SpyInstance
  let mockGet: jest.SpyInstance

  const mockAuthenticationClient = {} as AuthenticationClient

  beforeEach(() => {
    jest.clearAllMocks()

    client = new RiskActuarialApiClient(mockAuthenticationClient)
    mockPost = jest.spyOn(client as unknown as { post: jest.Mock }, 'post')
    mockGet = jest.spyOn(client as unknown as { get: jest.Mock }, 'get')
  })

  describe('getRiskScores()', () => {
    it('should get risk scores back', async () => {
      // Arrange
      const request: RiskScoreInput = {
        gender: 'MALE',
        assessmentDate: '1999-01-01',
        dateOfBirth: '1980-01-01',
        dateOfCurrentConviction: '2020-01-01',
        currentOffenceCode: '02700',
        totalNumberOfSanctionsForAllOffences: 21,
        ageAtFirstSanction: 40,
        supervisionStatus: 'COMMUNITY',
        dateAtStartOfFollowup: '2040-01-01',
        totalNumberOfViolentSanctions: 1,
        didOffenceInvolveCarryingOrUsingWeapon: false,
        suitabilityOfAccommodation: 'NO_PROBLEMS',
        isUnemployed: false,
        currentRelationshipWithPartner: 'NO_PROBLEMS',
        currentAlcoholUseProblems: 'NO_PROBLEMS',
        excessiveAlcoholUse: 'NO_PROBLEMS',
        impulsivityProblems: 'NO_PROBLEMS',
        temperControl: 'NO_PROBLEMS',
        proCriminalAttitudes: 'NO_PROBLEMS',
        evidenceOfDomesticAbuse: true,
        previousConvictions: ['WOUNDING_GBH'],
        hasEverCommittedSexualOffence: true,
        isCurrentOffenceSexuallyMotivated: false,
        mostRecentOffenceDate: '1994-01-01',
        totalContactAdultSexualSanctions: 5,
        totalContactChildSexualSanctions: 5,
        totalNonContactSexualOffences: 5,
        totalIndecentImageSanctions: 5,
        dateOfMostRecentSexualOffence: '1994-01-01',
        isCurrentOffenceAgainstVictimStranger: false,
        regularOffendingActivities: 'SOME_PROBLEMS',
        motivationToTackleDrugMisuse: 'FULL_MOTIVATION',
        currentRelationshipStatus: 'NOT_IN_RELATIONSHIP',
        hasHeroinUsage: false,
        hasMethadoneUsage: false,
        hasOtherOpiateUsage: false,
        hasCrackCocaineUsage: false,
        hasPowderCocaineUsage: false,
        hasMisusedPrescriptionDrugUsage: false,
        hasBenzodiazepinesUsage: false,
        hasCannabisUsage: false,
        hasSteroidsUsage: false,
        hasOtherDrugsUsage: false,
        hasKetamineUsage: false,
        hasSpiceUsage: false,
        hasHallucinogensUsage: false,
        hasSolventsUsage: false,
      }

      const expectedResponse: RiskScores = {
        actuarialPredictors: {
          allPredictor: {
            algorithm: 'ALL_REOFFENDING_PREDICTOR',
            type: 'DYNAMIC',
            modelVersion: '1.0',
            thresholdsVersion: '1.0',
            output: {
              band: 'MEDIUM',
              score: 62.62,
            },
            featureValues: {
              twoYearInterceptWeight: 3.83654148692014,
              ageGenderPolynomialWeight: -3.28173525216702,
              genderWeight: 0.0,
              offenceGroupWeight: 0.09711571795253,
              firstSanctionWeight: 0.0,
              secondSanctionWeight: 0.0,
              totalNumberOfSanctionsForAllOffencesWeight: -0.06355203885829,
              secondSanctionGapWeight: 0.0,
              offenceFreeMonthsWeight: 0.0,
              copasScore: -0.26598630159921,
              copasScoreSquared: 0.00365775217639,
              suitableAccommodationWeight: 0.0,
              unemployedWeight: 0.0,
              liveInRelationshipWeight: 0.0,
              relationshipQualityWeight: 0.0,
              multiplicativeRelationshipWeight: 0.0,
              domesticViolenceWeight: 0.06356691968339,
              regularOffendingActivitiesWeight: 0.12649160259203,
              drugMotivationWeight: 0.0,
              chronicDrinkingProblemsWeight: 0.0,
              bingeDrinkingProblemsWeight: 0.0,
              impulsivityProblemsWeight: 0.0,
              proCriminalAttitudesWeight: 0.0,
              heroinUsageWeight: 0.0,
              otherOpiateUsageWeight: 0.0,
              crackCocaineUsageWeight: 0.0,
              powderCocaineUsageWeight: 0.0,
              misusedPrescriptionDrugUsageWeight: 0.0,
              benzodiazepinesUsageWeight: 0.0,
              cannabisUsageWeight: 0.0,
              steroidUsageWeight: 0.0,
              otherDrugUsageWeight: 0.0,
              totalWeight: 0.51609988669997,
            },
            validationErrors: [],
          },
          violentPredictor: {
            algorithm: 'VIOLENT_REOFFENDING_PREDICTOR',
            type: 'DYNAMIC',
            modelVersion: '1.0',
            thresholdsVersion: '1.0',
            output: {
              band: 'LOW',
              score: 25.43,
            },
            featureValues: {
              twoYearInterceptWeight: 1.81687448362791,
              ageGenderPolynomialWeight: -2.19932854876,
              genderWeight: 0.0,
              offenceGroupWeight: 0.18630088324696,
              firstSanctionWeight: 0.0,
              secondSanctionWeight: 0.0,
              totalNumberOfSanctionsForAllOffencesWeight: -0.14351040045746,
              neverViolentWeight: 0.0,
              onceViolentWeight: 0.15835779514232,
              totalNumberOfViolentSanctionsWeight: 0.01437809575998,
              secondSanctionGapWeight: 0.0,
              offenceFreeMonthsWeight: 0.0,
              copasScore: 0.33535289259305,
              copasViolentOffencesScore: -1.4184288873795,
              suitableAccommodationWeight: 0.0,
              unemployedWeight: 0.0,
              liveInRelationshipWeight: 0.0,
              relationshipQualityWeight: 0.0,
              multiplicativeRelationshipWeight: 0.0,
              domesticViolenceWeight: 0.10847373067241,
              regularOffendingActivitiesWeight: 0.06554913045843,
              drugMotivationWeight: 0.0,
              chronicDrinkingProblemsWeight: 0.0,
              bingeDrinkingProblemsWeight: 0.0,
              impulsivityProblemsWeight: 0.0,
              temperControlWeight: 0.0,
              methadoneUsageWeight: 0.0,
              otherOpiateUsageWeight: 0.0,
              crackCocaineUsageWeight: 0.0,
              powderCocaineUsageWeight: 0.0,
              misusedPrescriptionDrugUsageWeight: 0.0,
              benzodiazepinesUsageWeight: 0.0,
              cannabisUsageWeight: 0.0,
              steroidUsageWeight: 0.0,
              otherDrugUsageWeight: 0.0,
              totalWeight: -1.07598082509591,
            },
            validationErrors: [],
          },
          directContactSexualPredictor: {
            algorithm: 'DIRECT_CONTACT_SEXUAL_REOFFENDING_PREDICTOR',
            type: 'STATIC',
            modelVersion: '1.0',
            thresholdsVersion: '1.0',
            output: {
              band: 'VERY_HIGH',
              pointScore: 36,
              score: 5.31,
              femaleVersion: false,
              hasSexualOffenceHistory: true,
              riskBandReductionApplied: false,
            },
            featureValues: {
              totalContactAdultSexualSanctionsWeight: 15.0,
              totalContactChildSexualSanctionsWeight: 9.0,
              totalNonContactSexualOffencesWeight: 6.0,
              ageAtStartOfFollowUpWeight: 0.0,
              ageAtLastSanctionForSexualOffenceWeight: 0.0,
              totalNumberOfSanctionsForAllOffencesWeight: 6.0,
              currentOffenceAgainstVictimStrangerWeight: 0.0,
              totalWeight: 36.0,
            },
            validationErrors: [],
          },
          indirectContactSexualPredictor: {
            algorithm: 'IMAGES_AND_INDIRECT_CONTACT_SEXUAL_REOFFENDING_PREDICTOR',
            type: 'STATIC',
            modelVersion: '1.0',
            thresholdsVersion: '1.0',
            output: {
              band: 'HIGH',
              score: 10.31,
              femaleVersion: false,
              hasSexualOffenceHistory: true,
            },
            featureValues: {
              imagesAndIndirectContactWeight: 0.1031,
            },
            validationErrors: [],
          },
          seriousViolentPredictor: {
            algorithm: 'SERIOUS_VIOLENT_REOFFENDING_PREDICTOR',
            type: 'DYNAMIC',
            modelVersion: '1.0',
            thresholdsVersion: '1.0',
            output: {
              band: 'MEDIUM',
              score: 1.08,
            },
            featureValues: {
              twoYearInterceptWeight: -1.70588696906607,
              ageGenderPolynomialWeight: -2.80501656842515,
              genderWeight: 0.0,
              offenceGroupWeight: 0.13528641162272,
              firstSanctionWeight: 0.0,
              secondSanctionWeight: 0.0,
              totalNumberOfSanctionsForAllOffencesWeight: -0.54583359142931,
              secondSanctionGapWeight: 0.0,
              offenceFreeMonthsWeight: 0.0,
              copasScore: 0.4802070290742,
              neverViolentWeight: 0.0,
              onceViolentWeight: 0.07774684948062,
              violentSanctionsWeight: 0.00653299922463,
              violenceRateWeight: -0.56166371754086,
              offenceInvolveCarryingOrUsingWeaponsWeight: 0.0,
              suitableAccommodationWeight: 0.0,
              unemployedWeight: 0.0,
              chronicDrinkingProblemsWeight: 0.0,
              temperControlWeight: 0.0,
              proCriminalAttitudesWeight: 0.0,
              pastHomicideOffenceWeight: 0.0,
              pastWoundingGrievousBodilyHarmOffenceWeight: 0.39984582678849,
              pastKidnappingOffenceWeight: 0.0,
              pastFirearmsOffenceWeight: 0.0,
              pastRobberyOffenceWeight: 0.0,
              pastAggravatedBurglaryOffenceWeight: 0.0,
              pastNonFirearmWeaponOffenceWeight: 0.0,
              pastCriminalDamageOffenceWeight: 0.0,
              pastArsonOffenceWeight: 0.0,
              totalWeight: -4.51878173027072,
            },
            validationErrors: [],
          },
          seriousPredictor: {
            algorithm: 'COMBINED_SERIOUS_REOFFENDING_PREDICTOR',
            type: 'COMBINED',
            modelVersion: '1.0',
            thresholdsVersion: '1.0',
            output: {
              band: 'VERY_HIGH',
              overallScore: 16.7,
              femaleVersion: false,
              hasSexualOffenceHistory: true,
              componentScores: {
                directContactSexualPredictorScore: {
                  algorithm: 'DIRECT_CONTACT_SEXUAL_REOFFENDING_PREDICTOR',
                  type: 'STATIC',
                  modelVersion: '1.0',
                  thresholdsVersion: '1.0',
                  output: {
                    band: 'VERY_HIGH',
                    pointScore: 36,
                    score: 5.31,
                    femaleVersion: false,
                    hasSexualOffenceHistory: true,
                    riskBandReductionApplied: false,
                  },
                  featureValues: {
                    totalContactAdultSexualSanctionsWeight: 15.0,
                    totalContactChildSexualSanctionsWeight: 9.0,
                    totalNonContactSexualOffencesWeight: 6.0,
                    ageAtStartOfFollowUpWeight: 0.0,
                    ageAtLastSanctionForSexualOffenceWeight: 0.0,
                    totalNumberOfSanctionsForAllOffencesWeight: 6.0,
                    currentOffenceAgainstVictimStrangerWeight: 0.0,
                    totalWeight: 36.0,
                  },
                  validationErrors: [],
                },
                indirectContactSexualPredictorScore: {
                  algorithm: 'IMAGES_AND_INDIRECT_CONTACT_SEXUAL_REOFFENDING_PREDICTOR',
                  type: 'STATIC',
                  modelVersion: '1.0',
                  thresholdsVersion: '1.0',
                  output: {
                    band: 'HIGH',
                    score: 10.31,
                    femaleVersion: false,
                    hasSexualOffenceHistory: true,
                  },
                  featureValues: {
                    imagesAndIndirectContactWeight: 0.1031,
                  },
                  validationErrors: [],
                },
                seriousViolentPredictorScore: {
                  algorithm: 'SERIOUS_VIOLENT_REOFFENDING_PREDICTOR',
                  type: 'DYNAMIC',
                  modelVersion: '1.0',
                  thresholdsVersion: '1.0',
                  output: {
                    band: 'MEDIUM',
                    score: 1.08,
                  },
                  featureValues: {
                    twoYearInterceptWeight: -1.70588696906607,
                    ageGenderPolynomialWeight: -2.80501656842515,
                    genderWeight: 0.0,
                    offenceGroupWeight: 0.13528641162272,
                    firstSanctionWeight: 0.0,
                    secondSanctionWeight: 0.0,
                    totalNumberOfSanctionsForAllOffencesWeight: -0.54583359142931,
                    secondSanctionGapWeight: 0.0,
                    offenceFreeMonthsWeight: 0.0,
                    copasScore: 0.4802070290742,
                    neverViolentWeight: 0.0,
                    onceViolentWeight: 0.07774684948062,
                    violentSanctionsWeight: 0.00653299922463,
                    violenceRateWeight: -0.56166371754086,
                    offenceInvolveCarryingOrUsingWeaponsWeight: 0.0,
                    suitableAccommodationWeight: 0.0,
                    unemployedWeight: 0.0,
                    chronicDrinkingProblemsWeight: 0.0,
                    temperControlWeight: 0.0,
                    proCriminalAttitudesWeight: 0.0,
                    pastHomicideOffenceWeight: 0.0,
                    pastWoundingGrievousBodilyHarmOffenceWeight: 0.39984582678849,
                    pastKidnappingOffenceWeight: 0.0,
                    pastFirearmsOffenceWeight: 0.0,
                    pastRobberyOffenceWeight: 0.0,
                    pastAggravatedBurglaryOffenceWeight: 0.0,
                    pastNonFirearmWeaponOffenceWeight: 0.0,
                    pastCriminalDamageOffenceWeight: 0.0,
                    pastArsonOffenceWeight: 0.0,
                    totalWeight: -4.51878173027072,
                  },
                  validationErrors: [],
                },
              },
            },
            featureValues: {},
            validationErrors: [],
          },
        },
      }

      mockPost.mockResolvedValue(expectedResponse)

      // Act
      const result = await client.getRiskScores(request)

      // Assert
      expect(result).toEqual(expectedResponse)
      expect(mockPost).toHaveBeenCalledWith({ path: '/risk-scores/v1', data: { ...request } }, asSystem())
    })
  })

  describe('getOffenceCodes()', () => {
    it('should get offence codes back', async () => {
      // Arrange
      const expectedResponse: OffenceCodesResponse = {
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
            subCategoryDescription:
              'Encouraging or assisting in the commission of Murder believing it will be committed',
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

      mockGet.mockResolvedValue(expectedResponse)

      // Act
      const result = await client.getOffenceCodes()

      // Assert
      expect(result).toEqual(expectedResponse)
      // TODO ACT-615 Uncomment this when ACT-615 is implemented and update expected response above
      // expect(mockGet).toHaveBeenCalledWith({ path: '/ref-data/offence-codes' }, asSystem())
    })
  })
})
