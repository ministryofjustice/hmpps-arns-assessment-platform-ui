import { AssessmentV2 } from '@ministryofjustice/hmpps-arns-frontend-components-lib/dist/types/AssessmentV2'
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
        type: 'STATIC',
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
        type: 'STATIC',
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
              'hasCurrentDrugMisuse',
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
        type: 'DYNAMIC',
        validationErrors: [],
        algorithm: '',
        modelVersion: '',
        thresholdsVersion: '',
        featureValues: undefined,
      },
      indirectContactSexualPredictor: {
        output: { score: 0.01, band: 'LOW' },
        type: 'DYNAMIC',
        validationErrors: [],
        algorithm: '',
        modelVersion: '',
        thresholdsVersion: '',
        featureValues: undefined,
      },
      seriousViolentPredictor: {
        output: { score: 0.08, band: 'LOW' },
        type: 'STATIC',
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
        type: 'COMBINED',
        validationErrors: [],
        algorithm: '',
        modelVersion: '',
        thresholdsVersion: '',
        featureValues: undefined,
      },
    },
  }

  const mockDate = new Date('2026-08-21T10:30:00.000Z')

  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(mockDate)

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
      date_at_first_sanction: '2010-06-20',
      'date-of-current-conviction': '2025-01-10',
      date_of_current_supervision: '2025-02-01',
      'number-of-sanctions-for-all-offences': 5,
      'offence-code': '05600',
      'number-of-violent-sanctions': 2,
      'supervision-status': 'COMMUNITY',
      'most-recent-offence-date': '2024-11-30',
      has_ever_committed_sexual_offence: 'YES',
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
      hasCurrentDrugMisuse: null,
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
      date_at_first_sanction: '2010-06-20',
      'date-of-current-conviction': '2025-01-10',
      date_of_current_supervision: '2025-02-01',
      'number-of-sanctions-for-all-offences': 5,
      'offence-code': '05600',
      'number-of-violent-sanctions': 2,
      'supervision-status': 'COMMUNITY',
      'most-recent-offence-date': '2024-11-30',
      has_ever_committed_sexual_offence: 'YES',
      'number-of-contact-sexual-sanctions': 1,
      'number-of-contact-child-sexual-sanctions': 0,
      'indecent-child-images': 0,
      'non-contact': 0,
      'date-of-most-recent-sexual-offence': '2010-06-20',
      'victim-stranger': 'true',
      suitability_of_accommodation: 'SOME_PROBLEMS',
      'is-unemployed': 'true',
      'drug-misuse': [
        'amphetamines',
        'benzodiazepines',
        'cannabis',
        'cocaine-hydrochloride',
        'crack-or-cocaine',
        'ecstasy',
        'hallucinogens',
        'heroin',
        'ketamine',
        'methadone',
        'misused-prescribed-drugs',
        'other-opiates',
        'solvents',
        'spice',
        'steroids',
        'other-drug',
      ],
      'benzodiazepines-radio': 'true',
      'cannabis-radio': 'true',
      'cocaine-hydrochloride-radio': 'true',
      'crack-or-cocaine-radio': 'true',
      'hallucinogens-radio': 'true',
      'heroin-radio': 'true',
      'methadone-radio': 'true',
      'misused-prescribed-drugs-radio': 'true',
      'other-opiates-radio': 'true',
      'solvents-radio': 'true',
      'spice-radio': 'true',
      'steroids-radio': 'true',
      'ketamine-radio': 'true',
      'other-drug-radio': 'true',
      'ever-misused-drugs': 'true',
      'motivation-to-tackle-drug-misuse': 'PARTIAL_MOTIVATION',
      'has-ever-drunk-alcohol': 'YES_IN_LAST_THREE_MONTHS',
      'current-alcohol-use-frequency': 3,
      'units-of-alcohol': 2,
      'alcohol-use-binge-drinking': 'SIGNIFICANT_PROBLEMS',
      who_are_they_living_with: 'partner',
      'important-relationships': 'partner',
      'relationship-satisfaction': 'SOME_PROBLEMS',
      'regular-offending-activities': 'NO_PROBLEMS',
      'temper-control': 'SOME_PROBLEMS',
      'impulsivity-problems': 'NO_PROBLEMS',
      'pro-criminal-attitudes': 'SIGNIFICANT_PROBLEMS',
      'previous-convictions': ['FIREARMS', 'ROBBERY', 'WEAPON'],
      'offence-elements': 'domestic-abuse,excessive-violence-or-sadistic-violence,weapon',
      'evidence-of-domestic-abuse': 'true',
      'domestic-abuse-against': 'intimate-partner',
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
      hasCurrentDrugMisuse: true,
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
    expect(mockContext.setAnswer).toHaveBeenCalledWith('risk-scores-all-reoffending-predictor-type', 'STATIC')

    expect(mockContext.setAnswer).toHaveBeenCalledWith('risk-scores-violent-reoffending-predictor-score', '0.12')
    expect(mockContext.setAnswer).toHaveBeenCalledWith('risk-scores-violent-reoffending-predictor-band', 'LOW')
    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-violent-reoffending-predictor-errors',
      JSON.stringify(mockApiStaticResponse.actuarialPredictors.violentPredictor.validationErrors),
    )
    expect(mockContext.setAnswer).toHaveBeenCalledWith('risk-scores-violent-reoffending-predictor-type', 'STATIC')

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
      'risk-scores-direct-contact-sexual-reoffending-predictor-type',
      'DYNAMIC',
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
      'risk-scores-indirect-contact-sexual-reoffending-predictor-type',
      'DYNAMIC',
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
      'risk-scores-serious-violent-reoffending-predictor-type',
      'STATIC',
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
    expect(mockContext.setAnswer).toHaveBeenCalledWith(
      'risk-scores-combined-serious-reoffending-predictor-type',
      'COMBINED',
    )
  })

  it('should produce RiskData when RiskScores set in context', async () => {
    mockContext.getAnswer.mockImplementation((key: string) => {
      if (key.endsWith('-band')) return 'VERY_HIGH'
      if (key.endsWith('-score')) return 12.34
      if (key.endsWith('-type')) return 'STATIC'
      return null
    })

    const assessment = service.createV2AssessmentRiskData(mockContext).assessments[0] as AssessmentV2
    expect(assessment.assessmentType).toBe('Tiering')
    expect(assessment.outputVersion).toBe('2')
    expect(assessment.completedDate).toBe('21 August 2026')
    expect(assessment.completedDateTime).toMatch(/^21 August 2026 at \d{2}:\d{2}$/)

    expect(assessment.allReoffendingPredictor).toEqual({
      name: 'All reoffending predictor',
      band: 'VERY HIGH',
      score: 12.34,
      staticOrDynamic: 'Static',
      completedDate: '21 August 2026',
    })

    expect(mockContext.getAnswer).toHaveBeenCalledWith('risk-scores-all-reoffending-predictor-band')
    expect(mockContext.getAnswer).toHaveBeenCalledWith('risk-scores-all-reoffending-predictor-score')
    expect(mockContext.getAnswer).toHaveBeenCalledWith('risk-scores-all-reoffending-predictor-type')
  })

  it('should produce RiskData when RiskScores set to null in context', async () => {
    mockContext.getAnswer.mockImplementation(() => {
      return null
    })

    const assessment = service.createV2AssessmentRiskData(mockContext).assessments[0] as AssessmentV2

    expect(assessment.allReoffendingPredictor).toEqual({
      name: 'All reoffending predictor',
      band: null,
      score: null,
      staticOrDynamic: '',
      completedDate: '21 August 2026',
    })

    expect(mockContext.getAnswer).toHaveBeenCalledWith('risk-scores-all-reoffending-predictor-band')
    expect(mockContext.getAnswer).toHaveBeenCalledWith('risk-scores-all-reoffending-predictor-score')
    expect(mockContext.getAnswer).toHaveBeenCalledWith('risk-scores-all-reoffending-predictor-type')
  })

  it('should calculate age correctly when birthday has not occurred yet in target year', async () => {
    const answers: Record<string, unknown> = {
      'date-of-birth': '1990-10-25',
      date_at_first_sanction: '2010-06-20',
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
      hasCurrentDrugMisuse: null,
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
      suitability_of_accommodation: 'unknown',
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
      'ever-misused-drugs': 'unknown',
      'motivation-to-tackle-drug-misuse': 'unknown',
      'has-ever-drunk-alcohol': 'unknown',
      'alcohol-use-binge-drinking': 'unknown',
      'binge-drinking': 'unknown',
      who_are_they_living_with: 'unknown',
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
        hasCurrentDrugMisuse: null,
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

  it('should parse IN_RELATIONSHIP_LIVING_TOGETHER for currentRelationshipStatus if "who_are_they_living_with" and "important-relationships" include "partner"', async () => {
    const answers: Record<string, unknown> = {
      who_are_they_living_with: 'partner,family',
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

  it('should parse IN_RELATIONSHIP_NOT_LIVING_TOGETHER for currentRelationshipStatus if "who_are_they_living_with" not include "partner" and "important-relationships" include "partner"', async () => {
    const answers: Record<string, unknown> = {
      who_are_they_living_with: 'friends,family',
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

  it('should parse NOT_IN_RELATIONSHIP for currentRelationshipStatus if "who_are_they_living_with" and "important-relationships" not include "partner"', async () => {
    const answers: Record<string, unknown> = {
      who_are_they_living_with: 'friends,family',
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

  it('should parse null for currentRelationshipStatus if "who_are_they_living_with" and "important-relationships" are null', async () => {
    const answers: Record<string, unknown> = {
      who_are_they_living_with: null,
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
      'domestic-abuse-against': 'intimate-partner',
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
      'domestic-abuse-against': 'family-member-and-intimate-partner',
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
      'domestic-abuse-against': 'family-member',
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
      'evidence-of-domestic-abuse': 'false',
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        evidenceOfDomesticAbuse: false,
      }),
    )
  })
  it('should return true if "offence-elements" contains "weapon"', async () => {
    const answers: Record<string, unknown> = {
      'offence-elements': 'arson,weapon',
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        didOffenceInvolveCarryingOrUsingWeapon: true,
      }),
    )
  })
  it('should return true if "offence-elements" contains "weapon"', async () => {
    const answers: Record<string, unknown> = {
      'offence-elements': 'arson,weapon,violent-or-threat-of-violence-with-a-weapon',
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        didOffenceInvolveCarryingOrUsingWeapon: true,
      }),
    )
  })
  it('should return false if "offence-elements" does not contain "weapon"', async () => {
    const answers: Record<string, unknown> = {
      'offence-elements': 'arson,hatred-of-identifiable-group',
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        didOffenceInvolveCarryingOrUsingWeapon: false,
      }),
    )
  })
  it('should return true if "evidence-of-domestic-abuse" is true and "domestic-abuse-against" is "intimate-partner"', async () => {
    const answers: Record<string, unknown> = {
      'evidence-of-domestic-abuse': 'true',
      'domestic-abuse-against': 'intimate-partner',
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
      'domestic-abuse-against': 'family-member-and-intimate-partner',
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
      'domestic-abuse-against': 'family-member',
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
      'evidence-of-domestic-abuse': 'false',
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        evidenceOfDomesticAbuse: false,
      }),
    )
  })

  it('should return false for items not found in drug-misuse checkbox, but follow boolean or null logic for selected items with radio selected', async () => {
    const answers: Record<string, unknown> = {
      'drug-misuse': ['benzodiazepines', 'cannabis', 'cocaine-hydrochloride'],
      'benzodiazepines-radio': true,
      'cannabis-radio': false,
      'cocaine-hydrochloride-radio': 'unknown',
    }

    mockContext.getAnswer.mockImplementation((key: string) => answers[key])

    await service.calculateAndSaveScores(mockContext)

    expect(mockApiClient.getRiskScores).toHaveBeenCalledWith(
      expect.objectContaining({
        hasBenzodiazepinesUsage: true,
        hasCannabisUsage: false,
        hasPowderCocaineUsage: null,
        hasCrackCocaineUsage: false,
        hasHallucinogensUsage: false,
        hasHeroinUsage: false,
        hasMethadoneUsage: false,
        hasMisusedPrescriptionDrugUsage: false,
        hasOtherOpiateUsage: false,
        hasSolventsUsage: false,
        hasSpiceUsage: false,
        hasSteroidsUsage: false,
        hasKetamineUsage: false,
        hasOtherDrugsUsage: false,
      }),
    )
  })

})
