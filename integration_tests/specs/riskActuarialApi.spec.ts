import { RiskScores } from '@server/interfaces/risk-actuarial-api/riskScores'
import { OffenceCodesResponse } from '@server/interfaces/risk-actuarial-api/offenceCodes'
import { test, expect } from '../support/fixtures'

test.describe('Risk Actuarial API', () => {
  test('can get scores via the Risk Actuarial API', async ({ riskActuarialApiBuilder }) => {
    // Arrange
    const builder = riskActuarialApiBuilder
      .create()
      .withGender('MALE')
      .withDateOfBirth('1980-01-01')
      .withAssessmentDate('2025-01-01')
      .withDateOfCurrentConviction('2020-01-01')
      .withCurrentOffenceCode('02700')
      .withTotalNumberOfSanctionsForAllOffences(21)
      .withAgeAtFirstSanction(40)
      .withSupervisionStatus('COMMUNITY')
      .withDateAtStartOfFollowup('2040-01-01')
      .withTotalNumberOfViolentSanctions(1)
      .withDidOffenceInvolveCarryingOrUsingWeapon(false)
      .withSuitabilityOfAccommodation('NO_PROBLEMS')
      .withIsUnemployed(false)
      .withCurrentRelationshipWithPartner('NO_PROBLEMS')
      .withCurrentAlcoholUseProblems('NO_PROBLEMS')
      .withExcessiveAlcoholUse('NO_PROBLEMS')
      .withImpulsivityProblems('NO_PROBLEMS')
      .withTemperControl('NO_PROBLEMS')
      .withProCriminalAttitudes('NO_PROBLEMS')
      .withEvidenceOfDomesticAbuse(true)
      .withPreviousConvictions(['WOUNDING_GBH'])
      .withHasEverCommittedSexualOffence(true)
      .withIsCurrentOffenceSexuallyMotivated(false)
      .withTotalContactAdultSexualSanctions(5)
      .withTotalContactChildSexualSanctions(5)
      .withTotalNonContactSexualOffences(5)
      .withTotalIndecentImageSanctions(5)
      .withDateOfMostRecentSexualOffence('1994-01-01')
      .withRegularOffendingActivities('SOME_PROBLEMS')
      .withHasCurrentDrugMisuse(true)
      .withMotivationToTackleDrugMisuse('FULL_MOTIVATION')
      .withCurrentRelationshipStatus('NOT_IN_RELATIONSHIP')
      .withHasHeroinUsage(false)
      .withHasMethadoneUsage(true)
      .withHasOtherOpiateUsage(false)
      .withHasCrackCocaineUsage(false)
      .withHasPowderCocaineUsage(false)
      .withHasMisusedPrescriptionDrugUsage(false)
      .withHasBenzodiazepinesUsage(false)
      .withHasCannabisUsage(false)
      .withHasSteroidsUsage(false)
      .withHasOtherDrugsUsage(false)
      .withHasKetamineUsage(false)
      .withHasSpiceUsage(false)
      .withHasHallucinogensUsage(false)
      .withHasSolventsUsage(false)

    const expectedResponse: Partial<RiskScores> = {
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
            offenceGroupWeight: 0.097115717952529,
            firstSanctionWeight: 0.0,
            secondSanctionWeight: 0.0,
            totalNumberOfSanctionsForAllOffencesWeight: -0.063552038858291,
            secondSanctionGapWeight: 0.0,
            offenceFreeMonthsWeight: 0.0,
            copasScore: -0.265986301599206,
            copasScoreSquared: 0.003657752176394,
            suitableAccommodationWeight: 0.0,
            unemployedWeight: 0.0,
            liveInRelationshipWeight: 0.0,
            relationshipQualityWeight: 0.0,
            multiplicativeRelationshipWeight: 0.0,
            domesticViolenceWeight: 0.063566919683395,
            regularOffendingActivitiesWeight: 0.126491602592029,
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
            score: 26.54,
          },
          featureValues: {
            twoYearInterceptWeight: 1.81687448362791,
            ageGenderPolynomialWeight: -2.199328548760002,
            genderWeight: 0.0,
            offenceGroupWeight: 0.186300883246964,
            firstSanctionWeight: 0.0,
            secondSanctionWeight: 0.0,
            totalNumberOfSanctionsForAllOffencesWeight: -0.143510400457456,
            neverViolentWeight: 0.0,
            onceViolentWeight: 0.158357795142317,
            totalNumberOfViolentSanctionsWeight: 0.014378095759978,
            secondSanctionGapWeight: 0.0,
            offenceFreeMonthsWeight: 0.0,
            copasScore: 0.335352892593047,
            copasViolentOffencesScore: -1.418428887379504,
            suitableAccommodationWeight: 0.0,
            unemployedWeight: 0.0,
            liveInRelationshipWeight: 0.0,
            relationshipQualityWeight: 0.0,
            multiplicativeRelationshipWeight: 0.0,
            domesticViolenceWeight: 0.108473730672409,
            regularOffendingActivitiesWeight: 0.065549130458426,
            drugMotivationWeight: 0.0,
            chronicDrinkingProblemsWeight: 0.0,
            bingeDrinkingProblemsWeight: 0.0,
            impulsivityProblemsWeight: 0.0,
            temperControlWeight: 0.0,
            methadoneUsageWeight: 0.057690684554484,
            otherOpiateUsageWeight: 0.0,
            crackCocaineUsageWeight: 0.0,
            powderCocaineUsageWeight: 0.0,
            misusedPrescriptionDrugUsageWeight: 0.0,
            benzodiazepinesUsageWeight: 0.0,
            cannabisUsageWeight: 0.0,
            steroidUsageWeight: 0.0,
            otherDrugUsageWeight: 0.0,
            totalWeight: -1.018290140541427,
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
            ageGenderPolynomialWeight: -2.805016568425146,
            genderWeight: 0.0,
            offenceGroupWeight: 0.135286411622716,
            firstSanctionWeight: 0.0,
            secondSanctionWeight: 0.0,
            totalNumberOfSanctionsForAllOffencesWeight: -0.545833591429308,
            secondSanctionGapWeight: 0.0,
            offenceFreeMonthsWeight: 0.0,
            copasScore: 0.480207029074203,
            neverViolentWeight: 0.0,
            onceViolentWeight: 0.077746849480619,
            violentSanctionsWeight: 0.006532999224634,
            violenceRateWeight: -0.561663717540858,
            offenceInvolveCarryingOrUsingWeaponsWeight: 0.0,
            suitableAccommodationWeight: 0.0,
            unemployedWeight: 0.0,
            chronicDrinkingProblemsWeight: 0.0,
            temperControlWeight: 0.0,
            proCriminalAttitudesWeight: 0.0,
            pastHomicideOffenceWeight: 0.0,
            pastWoundingGrievousBodilyHarmOffenceWeight: 0.399845826788494,
            pastKidnappingOffenceWeight: 0.0,
            pastFirearmsOffenceWeight: 0.0,
            pastRobberyOffenceWeight: 0.0,
            pastAggravatedBurglaryOffenceWeight: 0.0,
            pastNonFirearmWeaponOffenceWeight: 0.0,
            pastCriminalDamageOffenceWeight: 0.0,
            pastArsonOffenceWeight: 0.0,
            totalWeight: -4.518781730270716,
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
                  ageGenderPolynomialWeight: -2.805016568425146,
                  genderWeight: 0.0,
                  offenceGroupWeight: 0.135286411622716,
                  firstSanctionWeight: 0.0,
                  secondSanctionWeight: 0.0,
                  totalNumberOfSanctionsForAllOffencesWeight: -0.545833591429308,
                  secondSanctionGapWeight: 0.0,
                  offenceFreeMonthsWeight: 0.0,
                  copasScore: 0.480207029074203,
                  neverViolentWeight: 0.0,
                  onceViolentWeight: 0.077746849480619,
                  violentSanctionsWeight: 0.006532999224634,
                  violenceRateWeight: -0.561663717540858,
                  offenceInvolveCarryingOrUsingWeaponsWeight: 0.0,
                  suitableAccommodationWeight: 0.0,
                  unemployedWeight: 0.0,
                  chronicDrinkingProblemsWeight: 0.0,
                  temperControlWeight: 0.0,
                  proCriminalAttitudesWeight: 0.0,
                  pastHomicideOffenceWeight: 0.0,
                  pastWoundingGrievousBodilyHarmOffenceWeight: 0.399845826788494,
                  pastKidnappingOffenceWeight: 0.0,
                  pastFirearmsOffenceWeight: 0.0,
                  pastRobberyOffenceWeight: 0.0,
                  pastAggravatedBurglaryOffenceWeight: 0.0,
                  pastNonFirearmWeaponOffenceWeight: 0.0,
                  pastCriminalDamageOffenceWeight: 0.0,
                  pastArsonOffenceWeight: 0.0,
                  totalWeight: -4.518781730270716,
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

    // Act
    const riskScores = await builder.getRiskScores()

    // Assert
    expect(riskScores).toMatchObject(expectedResponse)
  })

  test('can get offence codes via the Risk Actuarial API', async ({ riskActuarialApiBuilder }) => {
    // Arrange

    // TODO ACT-615 Update the expected response when ACT-615 is implemented
    const expectedResponse: OffenceCodesResponse = {
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

    // Act
    const offenceCodes = await riskActuarialApiBuilder.create().getOffenceCodes()

    // Assert
    expect(offenceCodes).toEqual(expectedResponse)
  })
})
