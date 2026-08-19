import { RiskActuarialService } from './RiskActuarialService'
import RiskActuarialApiClient from '../../../data/riskActuarialApiClient'
import { TieringAssessmentEffectContext } from '../@types/TieringAssessmentEffectContext'
import {
  CurrentRelationshipStatus,
  MotivationLevel,
  ProblemLevel,
  RiskScores,
  SupervisionStatus,
} from '../../../interfaces/risk-actuarial-api/riskScores'

describe('RiskActuarialService', () => {
  let service: RiskActuarialService
  let mockApiClient: jest.Mocked<RiskActuarialApiClient>
  let mockContext: jest.Mocked<TieringAssessmentEffectContext>

  const mockApiStaticResponse: RiskScores = {
    actuarialPredictors: {
      allPredictor: {
        output: { score: 0.45, band: 'MEDIUM' },
        validationErrors: [
          {
            type: 'MISSING_DYNAMIC_INPUT',
            message: 'Dynamic input field(s) missing',
            fields: [
              'suitabilityOfAccommodation',
              'isUnemployed',
              'currentRelationshipWithPartner',
              'evidenceOfDomesticAbuse',
              'currentRelationshipStatus',
              'regularOffendingActivities',
              'currentAlcoholUseProblems',
              'excessiveAlcoholUse',
              'impulsivityProblems',
              'proCriminalAttitudes',
            ],
          },
        ],
        algorithm: '',
        modelVersion: '',
        thresholdsVersion: '',
        featureValues: undefined,
      },
      violentPredictor: {
        output: { score: 0.12, band: 'LOW' },
        validationErrors: [
          {
            type: 'MISSING_DYNAMIC_INPUT',
            message: 'Dynamic input field(s) missing',
            fields: [
              'suitabilityOfAccommodation',
              'isUnemployed',
              'currentRelationshipWithPartner',
              'evidenceOfDomesticAbuse',
              'currentRelationshipStatus',
              'regularOffendingActivities',
              'motivationToTackleDrugMisuse',
              'currentAlcoholUseProblems',
              'excessiveAlcoholUse',
              'impulsivityProblems',
              'temperControl',
            ],
          },
        ],
        algorithm: '',
        modelVersion: '',
        thresholdsVersion: '',
        featureValues: undefined,
      },
      directContactSexualPredictor: {
        output: { score: 0.02, band: 'LOW' },
        validationErrors: [],
        algorithm: '',
        modelVersion: '',
        thresholdsVersion: '',
        featureValues: undefined,
      },
      indirectContactSexualPredictor: {
        output: { score: 0.01, band: 'LOW' },
        validationErrors: [],
        algorithm: '',
        modelVersion: '',
        thresholdsVersion: '',
        featureValues: undefined,
      },
      seriousViolentPredictor: {
        output: { score: 0.08, band: 'LOW' },
        validationErrors: [
          {
            type: 'MISSING_DYNAMIC_INPUT',
            message: 'Dynamic input field(s) missing',
            fields: [
              'didOffenceInvolveCarryingOrUsingWeapon',
              'suitabilityOfAccommodation',
              'isUnemployed',
              'currentAlcoholUseProblems',
              'temperControl',
              'proCriminalAttitudes',
              'previousConvictions',
            ],
          },
        ],
        algorithm: '',
        modelVersion: '',
        thresholdsVersion: '',
        featureValues: undefined,
      },
      seriousPredictor: {
        output: {
          overallScore: 0.15,
          band: 'MEDIUM',
          componentScores: undefined,
        },
        validationErrors: [],
        algorithm: '',
        modelVersion: '',
        thresholdsVersion: '',
        featureValues: undefined,
      },
    },
  }

  beforeEach(() => {
    mockApiClient = {
      getRiskScores: jest.fn().mockResolvedValue(mockApiStaticResponse),
    } as unknown as jest.Mocked<RiskActuarialApiClient>

    mockContext = {
      getAnswer: jest.fn(),
      setAnswer: jest.fn(),
    } as unknown as jest.Mocked<TieringAssessmentEffectContext>

    service = new RiskActuarialService(mockApiClient)
  })

  it('should build static input correctly, call API, and save outputs to context', async () => {
    const answers: Record<string, unknown> = {
      gender: 'MALE',
      'date-of-birth': '1990-05-15',
      'date-at-first-sanction': '2010-06-20',
      'date-of-current-conviction': '2025-01-10',
      'date-of-current-supervision': '2025-02-01',
      'number-of-sanctions-for-all-offences': 5,
      'offence-code': '05600',
      'number-of-violent-sanctions': 2,
      'supervision-status': 'COMMUNITY',
      'most-recent-offence-date': '2024-11-30',
      'has-ever-committed-sexual-offence': 'YES',
      'number-of-contact-sexual-sanctions': 1,
      'number-of-contact-child-sexual-sanctions': 0,
      'indecent-child-images': 0,
      'non-contact': 0,
      'date-of-most-recent-sexual-offence': '2010-06-20',
      'victim-stranger': 'true',
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith({
      gender: 'MALE',
      dateOfBirth: '1990-05-15',
      dateOfCurrentConviction: '2025-01-10',
      dateAtStartOfFollowup: '2025-02-01',
      totalNumberOfSanctionsForAllOffences: 5,
      ageAtFirstSanction: 20,
      currentOffenceCode: '05600',
      totalNumberOfViolentSanctions: 2,
      supervisionStatus: 'COMMUNITY' as SupervisionStatus,
      mostRecentOffenceDate: '2024-11-30',
      hasEverCommittedSexualOffence: true,
      totalContactAdultSexualSanctions: 1,
      totalContactChildSexualSanctions: 0,
      totalIndecentImageSanctions: 0,
      totalNonContactSexualOffences: 0,
      dateOfMostRecentSexualOffence: '2010-06-20',
      isCurrentOffenceAgainstVictimStranger: true,
      isUnemployed: null,
      suitabilityOfAccommodation: null,
      hasBenzodiazepinesUsage: null,
      hasCannabisUsage: null,
      hasPowderCocaineUsage: null,
      hasCrackCocaineUsage: null,
      hasHallucinogensUsage: null,
      hasHeroinUsage: null,
      hasMethadoneUsage: null,
      hasMisusedPrescriptionDrugUsage: null,
      hasOtherOpiateUsage: null,
      hasSolventsUsage: null,
      hasSpiceUsage: null,
      hasSteroidsUsage: null,
      hasKetamineUsage: null,
      hasOtherDrugsUsage: null,
      motivationToTackleDrugMisuse: null,
      currentAlcoholUseProblems: null,
      excessiveAlcoholUse: null,
      currentRelationshipStatus: null,
      currentRelationshipWithPartner: null,
      regularOffendingActivities: null,
      temperControl: null,
      impulsivityProblems: null,
      proCriminalAttitudes: null,
      previousConvictions: null,
      didOffenceInvolveCarryingOrUsingWeapon: null,
      evidenceOfDomesticAbuse: null,
    })

    expect(mockContext.setAnswer).toHaveBeenCalledWith('risk-scores-all-reoffending-predictor-score', '0.45')
    expect(mockContext.setAnswer).toHaveBeenCalledWith('risk-scores-all-reoffending-predictor-band', 'MEDIUM')
    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-all-reoffending-predictor-errors',
      JSON.stringify(mockApiStaticResponse.actuarialPredictors.allPredictor.validationErrors),
    )

    expect(mockContext.setAnswer).toHaveBeenCalledWith('risk-scores-violent-reoffending-predictor-score', '0.12')
    expect(mockContext.setAnswer).toHaveBeenCalledWith('risk-scores-violent-reoffending-predictor-band', 'LOW')
    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-violent-reoffending-predictor-errors',
      JSON.stringify(mockApiStaticResponse.actuarialPredictors.violentPredictor.validationErrors),
    )

    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-direct-contact-sexual-reoffending-predictor-score',
      '0.02',
    )
    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-direct-contact-sexual-reoffending-predictor-band',
      'LOW',
    )
    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-direct-contact-sexual-reoffending-predictor-errors',
      '[]',
    )

    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-indirect-contact-sexual-reoffending-predictor-score',
      '0.01',
    )
    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-indirect-contact-sexual-reoffending-predictor-band',
      'LOW',
    )
    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-indirect-contact-sexual-reoffending-predictor-errors',
      '[]',
    )

    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-serious-violent-reoffending-predictor-score',
      '0.08',
    )
    expect(mockContext.setAnswer).toHaveBeenCalledWith('risk-scores-serious-violent-reoffending-predictor-band', 'LOW')
    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-serious-violent-reoffending-predictor-errors',
      JSON.stringify(mockApiStaticResponse.actuarialPredictors.seriousViolentPredictor.validationErrors),
    )

    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-combined-serious-reoffending-predictor-score',
      '0.15',
    )
    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-combined-serious-reoffending-predictor-band',
      'MEDIUM',
    )
    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-combined-serious-reoffending-predictor-errors',
      '[]',
    )
  })

  it('should build dynamic input correctly, call API, and save outputs to context', async () => {
    // TODO add more answers to this as pages are built
    const answers: Record<string, unknown> = {
      gender: 'MALE',
      'date-of-birth': '1990-05-15',
      'date-at-first-sanction': '2010-06-20',
      'date-of-current-conviction': '2025-01-10',
      'date-of-current-supervision': '2025-02-01',
      'number-of-sanctions-for-all-offences': 5,
      'offence-code': '05600',
      'number-of-violent-sanctions': 2,
      'supervision-status': 'COMMUNITY',
      'most-recent-offence-date': '2024-11-30',
      'has-ever-committed-sexual-offence': 'YES',
      'number-of-contact-sexual-sanctions': 1,
      'number-of-contact-child-sexual-sanctions': 0,
      'indecent-child-images': 0,
      'non-contact': 0,
      'date-of-most-recent-sexual-offence': '2010-06-20',
      'victim-stranger': 'true',
      'suitability-of-accommodation': 'SOME_PROBLEMS',
      'is-unemployed': 'true',
      'benzodiazepines-radio': 'true',
      'cannabis-radio': 'true',
      'cocaine-hydrochloride-radio': 'true',
      'crack-or-cocaine-radio': 'true',
      'hallucinogens-radio': 'true',
      'heroin-radio': 'true',
      'methadone-radio': 'true',
      'misused-prescribed-drugs-radio': 'true',
      'other-opiate-radio': 'true',
      'solvents-radio': 'true',
      'spice-radio': 'true',
      'steroids-radio': 'true',
      'ketamine-radio': 'true',
      'other-drug-radio': 'true',
      'motivation-to-tackle-drug-misuse': 'PARTIAL_MOTIVATION',
      'has-ever-drunk-alcohol': 'YES_IN_LAST_THREE_MONTHS',
      'current-alcohol-use-frequency': 3,
      'units-of-alcohol': 2,
      'alcohol-use-binge-drinking': 'SIGNIFICANT_PROBLEMS',
      'who-are-they-living-with': 'partner',
      'important-relationships': 'partner',
      'relationship-satisfaction': 'SOME_PROBLEMS',
      'regular-offending-activities': 'NO_PROBLEMS',
      'temper-control': 'SOME_PROBLEMS',
      'impulsivity-problems': 'NO_PROBLEMS',
      'pro-criminal-attitudes': 'SIGNIFICANT_PROBLEMS',
      'previous-convictions': ['FIREARMS', 'ROBBERY', 'WEAPON'],
      'offence-elements': 'domestic-abuse,excessive-violence-or-sadistic-violence,weapon',
      'evidence-of-domestic-abuse': 'true',
      'domestic-abuse-against': 'intimate-partner'
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    // TODO add more expected request values to this as pages are built
    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith({
      gender: 'MALE',
      dateOfBirth: '1990-05-15',
      dateOfCurrentConviction: '2025-01-10',
      dateAtStartOfFollowup: '2025-02-01',
      totalNumberOfSanctionsForAllOffences: 5,
      ageAtFirstSanction: 20,
      currentOffenceCode: '05600',
      totalNumberOfViolentSanctions: 2,
      supervisionStatus: 'COMMUNITY' as SupervisionStatus,
      mostRecentOffenceDate: '2024-11-30',
      hasEverCommittedSexualOffence: true,
      totalContactAdultSexualSanctions: 1,
      totalContactChildSexualSanctions: 0,
      totalIndecentImageSanctions: 0,
      totalNonContactSexualOffences: 0,
      dateOfMostRecentSexualOffence: '2010-06-20',
      isCurrentOffenceAgainstVictimStranger: true,
      suitabilityOfAccommodation: 'SOME_PROBLEMS' as ProblemLevel,
      isUnemployed: true,
      hasBenzodiazepinesUsage: true,
      hasCannabisUsage: true,
      hasPowderCocaineUsage: true,
      hasCrackCocaineUsage: true,
      hasHallucinogensUsage: true,
      hasHeroinUsage: true,
      hasMethadoneUsage: true,
      hasMisusedPrescriptionDrugUsage: true,
      hasOtherOpiateUsage: true,
      hasSolventsUsage: true,
      hasSpiceUsage: true,
      hasSteroidsUsage: true,
      hasKetamineUsage: true,
      hasOtherDrugsUsage: true,
      motivationToTackleDrugMisuse: 'PARTIAL_MOTIVATION' as MotivationLevel,
      currentAlcoholUseProblems: 'SOME_PROBLEMS' as ProblemLevel,
      excessiveAlcoholUse: 'SIGNIFICANT_PROBLEMS' as ProblemLevel,
      currentRelationshipStatus: 'IN_RELATIONSHIP_LIVING_TOGETHER' as CurrentRelationshipStatus,
      currentRelationshipWithPartner: 'SOME_PROBLEMS' as ProblemLevel,
      regularOffendingActivities: 'NO_PROBLEMS' as ProblemLevel,
      temperControl: 'SOME_PROBLEMS' as ProblemLevel,
      impulsivityProblems: 'NO_PROBLEMS' as ProblemLevel,
      proCriminalAttitudes: 'SIGNIFICANT_PROBLEMS' as ProblemLevel,
      previousConvictions: ['FIREARMS', 'ROBBERY', 'WEAPON'],
      didOffenceInvolveCarryingOrUsingWeapon: true,
      evidenceOfDomesticAbuse: true,
    })

    // TODO responses will change when enough answers provided
    expect(mockContext.setAnswer).toHaveBeenCalledWith('risk-scores-all-reoffending-predictor-score', '0.45')
    expect(mockContext.setAnswer).toHaveBeenCalledWith('risk-scores-all-reoffending-predictor-band', 'MEDIUM')
    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-all-reoffending-predictor-errors',
      JSON.stringify(mockApiStaticResponse.actuarialPredictors.allPredictor.validationErrors),
    )

    expect(mockContext.setAnswer).toHaveBeenCalledWith('risk-scores-violent-reoffending-predictor-score', '0.12')
    expect(mockContext.setAnswer).toHaveBeenCalledWith('risk-scores-violent-reoffending-predictor-band', 'LOW')
    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-violent-reoffending-predictor-errors',
      JSON.stringify(mockApiStaticResponse.actuarialPredictors.violentPredictor.validationErrors),
    )

    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-direct-contact-sexual-reoffending-predictor-score',
      '0.02',
    )
    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-direct-contact-sexual-reoffending-predictor-band',
      'LOW',
    )
    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-direct-contact-sexual-reoffending-predictor-errors',
      '[]',
    )

    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-indirect-contact-sexual-reoffending-predictor-score',
      '0.01',
    )
    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-indirect-contact-sexual-reoffending-predictor-band',
      'LOW',
    )
    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-indirect-contact-sexual-reoffending-predictor-errors',
      '[]',
    )

    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-serious-violent-reoffending-predictor-score',
      '0.08',
    )
    expect(mockContext.setAnswer).toHaveBeenCalledWith('risk-scores-serious-violent-reoffending-predictor-band', 'LOW')
    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-serious-violent-reoffending-predictor-errors',
      JSON.stringify(mockApiStaticResponse.actuarialPredictors.seriousViolentPredictor.validationErrors),
    )

    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-combined-serious-reoffending-predictor-score',
      '0.15',
    )
    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-combined-serious-reoffending-predictor-band',
      'MEDIUM',
    )
    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-combined-serious-reoffending-predictor-errors',
      '[]',
    )
  })

  it('should calculate age correctly when birthday has not occurred yet in target year', async () => {
    const answers: Record<string, unknown> = {
      'date-of-birth': '1990-10-25',
      'date-at-first-sanction': '2010-06-20',
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(expect.objectContaining({ ageAtFirstSanction: 19 }))
  })

  it('should parse missing or invalid fields to null instead of throwing or setting undefined', async () => {
    mockContext.getAnswer.mockReturnValue(undefined)

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith({
      gender: null,
      dateOfBirth: null,
      dateOfCurrentConviction: null,
      dateAtStartOfFollowup: null,
      totalNumberOfSanctionsForAllOffences: null,
      ageAtFirstSanction: null,
      currentOffenceCode: null,
      totalNumberOfViolentSanctions: null,
      supervisionStatus: null,
      mostRecentOffenceDate: null,
      hasEverCommittedSexualOffence: null,
      totalContactAdultSexualSanctions: null,
      totalContactChildSexualSanctions: null,
      totalIndecentImageSanctions: null,
      totalNonContactSexualOffences: null,
      dateOfMostRecentSexualOffence: null,
      isCurrentOffenceAgainstVictimStranger: null,
      isUnemployed: null,
      suitabilityOfAccommodation: null,
      hasBenzodiazepinesUsage: null,
      hasCannabisUsage: null,
      hasPowderCocaineUsage: null,
      hasCrackCocaineUsage: null,
      hasHallucinogensUsage: null,
      hasHeroinUsage: null,
      hasMethadoneUsage: null,
      hasMisusedPrescriptionDrugUsage: null,
      hasOtherOpiateUsage: null,
      hasSolventsUsage: null,
      hasSpiceUsage: null,
      hasSteroidsUsage: null,
      hasKetamineUsage: null,
      hasOtherDrugsUsage: null,
      motivationToTackleDrugMisuse: null,
      currentAlcoholUseProblems: null,
      excessiveAlcoholUse: null,
      currentRelationshipStatus: null,
      currentRelationshipWithPartner: null,
      regularOffendingActivities: null,
      temperControl: null,
      impulsivityProblems: null,
      proCriminalAttitudes: null,
      previousConvictions: null,
      didOffenceInvolveCarryingOrUsingWeapon: null,
      evidenceOfDomesticAbuse: null,
    })
  })

  it('should safely handle missing predictor blocks in API response', async () => {
    const incompleteApiResponse = {
      actuarialPredictors: {
        allPredictor: {
          output: { score: 0.3, band: 'LOW' },
          validationErrors: [],
        },
      },
    } as RiskScores

    mockApiClient.getRiskScores.mockResolvedValue(incompleteApiResponse)

    await expect(service.calculateAndSaveScores(mockContext)).resolves.not.toThrow()
    expect(mockContext.setAnswer).toHaveBeenCalledWith('risk-scores-all-reoffending-predictor-score', '0.3')
    expect(mockContext.setAnswer).not.toHaveBeenCalledWith(
      'risk-scores-violent-reoffending-predictor-score',
      expect.anything(),
    )
  })

  it('should handle unknown values and resolve them as null', async () => {
    const answers: Record<string, unknown> = {
      'suitability-of-accommodation': 'unknown',
      'is-unemployed': 'unknown',
      'benzodiazepines-radio': 'unknown',
      'cannabis-radio': 'unknown',
      'cocaine-hydrochloride-radio': 'unknown',
      'crack-or-cocaine-radio': 'unknown',
      'hallucinogens-radio': 'unknown',
      'heroin-radio': 'unknown',
      'methadone-radio': 'unknown',
      'misused-prescribed-drugs-radio': 'unknown',
      'other-opiate-radio': 'unknown',
      'solvents-radio': 'unknown',
      'spice-radio': 'unknown',
      'steroids-radio': 'unknown',
      'ketamine-radio': 'unknown',
      'other-drug-radio': 'unknown',
      'motivation-to-tackle-drug-misuse': 'unknown',
      'has-ever-drunk-alcohol': 'unknown',
      'alcohol-use-binge-drinking': 'unknown',
      'binge-drinking': 'unknown',
      'who-are-they-living-with': 'unknown',
      'important-relationships': 'unknown',
      'relationship-satisfaction': 'unknown',
      'regular-offending-activities': 'unknown',
      'temper-control': 'unknown',
      'impulsivity-problems': 'unknown',
      'pro-criminal-attitudes': 'unknown',
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        suitabilityOfAccommodation: null,
        isUnemployed: null,
        hasBenzodiazepinesUsage: null,
        hasCannabisUsage: null,
        hasPowderCocaineUsage: null,
        hasCrackCocaineUsage: null,
        hasHallucinogensUsage: null,
        hasHeroinUsage: null,
        hasMethadoneUsage: null,
        hasMisusedPrescriptionDrugUsage: null,
        hasOtherOpiateUsage: null,
        hasSolventsUsage: null,
        hasSpiceUsage: null,
        hasSteroidsUsage: null,
        hasKetamineUsage: null,
        hasOtherDrugsUsage: null,
        motivationToTackleDrugMisuse: null,
        currentAlcoholUseProblems: null,
        excessiveAlcoholUse: null,
        currentRelationshipStatus: null,
        currentRelationshipWithPartner: null,
        regularOffendingActivities: null,
        temperControl: null,
        impulsivityProblems: null,
        proCriminalAttitudes: null,
      }),
    )
  })

  it('should parse IN_RELATIONSHIP_LIVING_TOGETHER for currentRelationshipStatus if "who-are-they-living-with" and "important-relationships" include "partner"', async () => {
    const answers: Record<string, unknown> = {
      'who-are-they-living-with': 'partner,family',
      'important-relationships': 'partner,family-members',
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        currentRelationshipStatus: 'IN_RELATIONSHIP_LIVING_TOGETHER',
      }),
    )
  })

  it('should parse IN_RELATIONSHIP_NOT_LIVING_TOGETHER for currentRelationshipStatus if "who-are-they-living-with" not include "partner" and "important-relationships" include "partner"', async () => {
    const answers: Record<string, unknown> = {
      'who-are-they-living-with': 'friends,family',
      'important-relationships': 'partner,family',
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        currentRelationshipStatus: 'IN_RELATIONSHIP_NOT_LIVING_TOGETHER',
      }),
    )
  })

  it('should parse NOT_IN_RELATIONSHIP for currentRelationshipStatus if "who-are-they-living-with" and "important-relationships" not include "partner"', async () => {
    const answers: Record<string, unknown> = {
      'who-are-they-living-with': 'friends,family',
      'important-relationships': 'friends,family',
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        currentRelationshipStatus: 'NOT_IN_RELATIONSHIP',
      }),
    )
  })

  it('should parse null for currentRelationshipStatus if "who-are-they-living-with" and "important-relationships" are null', async () => {
    const answers: Record<string, unknown> = {
      'who-are-they-living-with': null,
      'important-relationships': null,
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        currentRelationshipStatus: null,
      }),
    )
  })

  it('should return "NO_PROBLEMS" if "has-ever-drunk-alcohol" is YES_NOT_IN_LAST_THREE_MONTHS', async () => {
    const answers: Record<string, unknown> = {
      'has-ever-drunk-alcohol': 'YES_NOT_IN_LAST_THREE_MONTHS',
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        currentAlcoholUseProblems: 'NO_PROBLEMS',
      }),
    )
  })

  it('should return null if "has-ever-drunk-alcohol" is YES_IN_LAST_THREE_MONTHS and current-alcohol-use-frequency is unknown', async () => {
    const answers: Record<string, unknown> = {
      'has-ever-drunk-alcohol': 'YES_IN_LAST_THREE_MONTHS',
      'current-alcohol-use-frequency': 'unknown',
      'units-of-alcohol': 4,
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        currentAlcoholUseProblems: null,
      }),
    )
  })

  it('should return null if "has-ever-drunk-alcohol" is YES_IN_LAST_THREE_MONTHS and units-of-alcohol is unknown', async () => {
    const answers: Record<string, unknown> = {
      'has-ever-drunk-alcohol': 'YES_IN_LAST_THREE_MONTHS',
      'current-alcohol-use-frequency': 4,
      'units-of-alcohol': 'unknown',
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        currentAlcoholUseProblems: null,
      }),
    )
  })

  it('should return null if "has-ever-drunk-alcohol" is YES_NOT_LAST_THREE_MONTHS', async () => {
    const answers: Record<string, unknown> = {
      'has-ever-drunk-alcohol': 'YES_NOT_LAST_THREE_MONTHS',
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        currentAlcoholUseProblems: null,
      }),
    )
  })

  it('should return the parsed problem level if "has-ever-drunk-alcohol" is YES_IN_LAST_THREE_MONTHS and summary of current-alcohol-use-frequency and units-of-alcohol <= 4', async () => {
    const answers: Record<string, unknown> = {
      'has-ever-drunk-alcohol': 'YES_IN_LAST_THREE_MONTHS',
      'current-alcohol-use-frequency': 3,
      'units-of-alcohol': 1,
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        currentAlcoholUseProblems: 'NO_PROBLEMS',
      }),
    )
  })

  it('should return the parsed problem level if "has-ever-drunk-alcohol" is YES_IN_LAST_THREE_MONTHS and summary of current-alcohol-use-frequency and units-of-alcohol <= 7', async () => {
    const answers: Record<string, unknown> = {
      'has-ever-drunk-alcohol': 'YES_IN_LAST_THREE_MONTHS',
      'current-alcohol-use-frequency': 3,
      'units-of-alcohol': 4,
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        currentAlcoholUseProblems: 'SOME_PROBLEMS',
      }),
    )
  })

  it('should return the parsed problem level if "has-ever-drunk-alcohol" is YES_IN_LAST_THREE_MONTHS and summary of current-alcohol-use-frequency and units-of-alcohol => 8', async () => {
    const answers: Record<string, unknown> = {
      'has-ever-drunk-alcohol': 'YES_IN_LAST_THREE_MONTHS',
      'current-alcohol-use-frequency': 4,
      'units-of-alcohol': 4,
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        currentAlcoholUseProblems: 'SIGNIFICANT_PROBLEMS',
      }),
    )
  })

  it('should return "NO_PROBLEMS" if "has-ever-drunk-alcohol" is NO', async () => {
    const answers: Record<string, unknown> = {
      'has-ever-drunk-alcohol': 'NO',
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        currentAlcoholUseProblems: 'NO_PROBLEMS',
      }),
    )
  })

  it('should return the parsed problem level if "has-ever-drunk-alcohol" is YES_NOT_LAST_THREE_MONTHS and binge-drinking is set', async () => {
    const answers: Record<string, unknown> = {
      'has-ever-drunk-alcohol': 'YES_NOT_LAST_THREE_MONTHS',
      'alcohol-use-binge-drinking': 'NO_PROBLEMS', // Practically will never happen, just checking the if functionality
      'binge-drinking': 'SIGNIFICANT_PROBLEMS',
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        excessiveAlcoholUse: 'SIGNIFICANT_PROBLEMS',
      }),
    )
  })

  it('should correctly parse a single valid conviction', async () => {
    const answers: Record<string, unknown> = {
      'previous-convictions': ['CRIMINAL_DAMAGE'],
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        previousConvictions: ['CRIMINAL_DAMAGE'],
      }),
    )
  })

  it('should parse multiple valid convictions', async () => {
    const answers: Record<string, unknown> = {
      'previous-convictions': [
        'HOMICIDE',
        'WOUNDING_GBH',
        'KIDNAPPING',
        'FIREARMS',
        'ROBBERY',
        'AGGRAVATED_BURGLARY',
        'WEAPON',
        'CRIMINAL_DAMAGE',
        'ARSON',
      ],
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        previousConvictions: [
          'HOMICIDE',
          'WOUNDING_GBH',
          'KIDNAPPING',
          'FIREARMS',
          'ROBBERY',
          'AGGRAVATED_BURGLARY',
          'WEAPON',
          'CRIMINAL_DAMAGE',
          'ARSON',
        ],
      }),
    )
  })

  it('should ignore invalid previous convictions', async () => {
    const answers: Record<string, unknown> = {
      'previous-convictions': [
        'WOUNDING_GBH',
        'RAPE_OR_SERIOUS_SEXUAL_OFFENCE',
        'WEAPON',
        'KIDNAPPING',
        'OTHER_SERIOUS_OFFENCE',
      ],
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        previousConvictions: ['WOUNDING_GBH', 'WEAPON', 'KIDNAPPING'],
      }),
    )
  })

  it('should correctly parse null for a list of invalid previous convictions', async () => {
    const answers: Record<string, unknown> = {
      'previous-convictions': ['SEXUAL_OFFENCE_AGAINST_CHILD', 'RACIAL_OFFENCE'],
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        previousConvictions: null,
      }),
    )
  })
  it('should return true if "evidence-of-domestic-abuse" is true and "domestic-abuse-against" is "intimate-partner"', async () => {
    const answers: Record<string, unknown> = {
      'evidence-of-domestic-abuse': 'true',
      'domestic-abuse-against': 'intimate-partner'
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        evidenceOfDomesticAbuse: true,
      }),
    )
  })
  it('should return true if "evidence-of-domestic-abuse" is true and "domestic-abuse-against" is "family-member-and-intimate-partner"', async () => {
    const answers: Record<string, unknown> = {
      'evidence-of-domestic-abuse': 'true',
      'domestic-abuse-against': 'family-member-and-intimate-partner'
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        evidenceOfDomesticAbuse: true,
      }),
    )
  })
  it('should return false if "evidence-of-domestic-abuse" is true and "domestic-abuse-against" is "family-member"', async () => {
    const answers: Record<string, unknown> = {
      'evidence-of-domestic-abuse': 'true',
      'domestic-abuse-against': 'family-member'
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        evidenceOfDomesticAbuse: false,
      }),
    )
  })
  it('should return false if "evidence-of-domestic-abuse" is false', async () => {
    const answers: Record<string, unknown> = {
      'evidence-of-domestic-abuse': 'false'
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        evidenceOfDomesticAbuse: false,
      }),
    )
  })
})
