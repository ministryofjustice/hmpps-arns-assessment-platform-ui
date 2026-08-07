import { RiskActuarialService } from './RiskActuarialService'
import RiskActuarialApiClient from '../../../data/riskActuarialApiClient'
import { TieringAssessmentEffectContext } from '../@types/TieringAssessmentEffectContext'
import { ProblemLevel, RiskScores, SupervisionStatus } from '../../../interfaces/risk-actuarial-api/riskScores'

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
      currentAlcoholUseProblems: null,
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
      'is-current-alcohol-use-a-problem': 'true',
      'current-alcohol-use-problems': 'SOME_PROBLEMS',
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
      currentAlcoholUseProblems: 'SOME_PROBLEMS' as ProblemLevel,
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
      currentAlcoholUseProblems: null,
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
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        suitabilityOfAccommodation: null,
        isUnemployed: null,
      }),
    )
  })

  it('should return null if "is-current-alcohol-use-a-problem" resolves to null', async () => {
    const answers: Record<string, unknown> = {
      'is-current-alcohol-use-a-problem': 'unknown',
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        currentAlcoholUseProblems: null,
      }),
    )
  })

  it('should return "NO_PROBLEMS" if "is-current-alcohol-use-a-problem" is false', async () => {
    const answers: Record<string, unknown> = {
      'is-current-alcohol-use-a-problem': 'false',
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        currentAlcoholUseProblems: 'NO_PROBLEMS',
      }),
    )
  })

  it('should return the parsed problem level if "is-current-alcohol-use-a-problem" is true', async () => {
    const answers: Record<string, unknown> = {
      'is-current-alcohol-use-a-problem': 'true',
      'current-alcohol-use-problems': 'SIGNIFICANT_PROBLEMS',
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        currentAlcoholUseProblems: 'SIGNIFICANT_PROBLEMS',
      }),
    )
  })
})
