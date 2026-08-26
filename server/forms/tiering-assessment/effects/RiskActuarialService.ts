import { RiskData } from '@ministryofjustice/hmpps-arns-frontend-components-lib/dist/types/RiskData'
import { Predictor } from '@ministryofjustice/hmpps-arns-frontend-components-lib/dist/types/Predictor'
import RiskActuarialApiClient from '../../../data/riskActuarialApiClient'
import { TieringAssessmentEffectContext } from '../@types/TieringAssessmentEffectContext'
import {
  CurrentRelationshipStatus,
  MotivationLevel,
  PREVIOUS_CONVICTIONS,
  PreviousConviction,
  ProblemLevel,
  RiskScoreInput,
  RiskScores,
  SupervisionStatus,
} from '../../../interfaces/risk-actuarial-api/riskScores'
import { convertToTitleCase, replaceUnderscoresWithSpaces } from '../../../utils/utils'

export class RiskActuarialService {
  constructor(private readonly riskActuarialApiClient: RiskActuarialApiClient) {}

  async calculateAndSaveScores(context: TieringAssessmentEffectContext): Promise<void> {
    const input: RiskScoreInput = this.buildRiskScoreInput(context)
    const riskScores: RiskScores = await this.riskActuarialApiClient.getRiskScores(input)
    this.saveScoresToContext(context, riskScores)
  }

  private buildRiskScoreInput(context: TieringAssessmentEffectContext): RiskScoreInput {
    const dob = this.parseString(context.getAnswer('date-of-birth'))
    const dateAtFirstSanction = this.parseString(context.getAnswer('date-at-first-sanction'))

    return {
      gender: this.parseString(context.getAnswer('gender')),
      dateOfBirth: dob,
      dateOfCurrentConviction: this.parseString(context.getAnswer('date-of-current-conviction')),
      dateAtStartOfFollowup: this.parseString(context.getAnswer('date-of-current-supervision')),
      totalNumberOfSanctionsForAllOffences: this.parseNumber(context.getAnswer('number-of-sanctions-for-all-offences')),
      ageAtFirstSanction: this.calculateAgeAtDate(dob, dateAtFirstSanction),
      currentOffenceCode: this.parseString(context.getAnswer('offence-code')),
      totalNumberOfViolentSanctions: this.parseNumber(context.getAnswer('number-of-violent-sanctions')),
      supervisionStatus: this.parseSupervisionStatus(context.getAnswer('supervision-status')),
      mostRecentOffenceDate: this.parseString(context.getAnswer('most-recent-offence-date')),
      hasEverCommittedSexualOffence: this.parseBoolean(context.getAnswer('has-ever-committed-sexual-offence')),
      totalContactAdultSexualSanctions: this.parseNumber(context.getAnswer('number-of-contact-sexual-sanctions')),
      totalContactChildSexualSanctions: this.parseNumber(context.getAnswer('number-of-contact-child-sexual-sanctions')),
      totalIndecentImageSanctions: this.parseNumber(context.getAnswer('indecent-child-images')),
      totalNonContactSexualOffences: this.parseNumber(context.getAnswer('non-contact')),
      dateOfMostRecentSexualOffence: this.parseString(context.getAnswer('date-of-most-recent-sexual-offence')),
      isCurrentOffenceAgainstVictimStranger: this.parseBoolean(context.getAnswer('victim-stranger')),
      suitabilityOfAccommodation: this.parseProblemLevel(context.getAnswer('suitability-of-accommodation')),
      isUnemployed: this.parseBoolean(context.getAnswer('is-unemployed')),
      hasBenzodiazepinesUsage: this.parseDrugCheckbox('benzodiazepines', context),
      hasCannabisUsage: this.parseDrugCheckbox('cannabis', context),
      hasPowderCocaineUsage: this.parseDrugCheckbox('cocaine-hydrochloride', context),
      hasCrackCocaineUsage: this.parseDrugCheckbox('crack-or-cocaine', context),
      hasHallucinogensUsage: this.parseDrugCheckbox('hallucinogens', context),
      hasHeroinUsage: this.parseDrugCheckbox('heroin', context),
      hasMethadoneUsage: this.parseDrugCheckbox('methadone', context),
      hasMisusedPrescriptionDrugUsage: this.parseDrugCheckbox('misused-prescribed-drugs', context),
      hasOtherOpiateUsage: this.parseDrugCheckbox('other-opiates', context),
      hasSolventsUsage: this.parseDrugCheckbox('solvents', context),
      hasSpiceUsage: this.parseDrugCheckbox('spice', context),
      hasSteroidsUsage: this.parseDrugCheckbox('steroids', context),
      hasKetamineUsage: this.parseDrugCheckbox('ketamine', context),
      hasOtherDrugsUsage: this.parseDrugCheckbox('other-drug', context),
      hasCurrentDrugMisuse: this.parseBoolean(context.getAnswer('ever-misused-drugs')),
      motivationToTackleDrugMisuse: this.parseMotivationLevel(context.getAnswer('motivation-to-tackle-drug-misuse')),
      currentAlcoholUseProblems: this.getCurrentAlcoholUseProblems(context),
      excessiveAlcoholUse: this.getExcessiveAlcoholUseProblems(context),
      currentRelationshipStatus: this.getCurrentRelationshipStatus(context),
      currentRelationshipWithPartner: this.parseProblemLevel(context.getAnswer('relationship-satisfaction')),
      regularOffendingActivities: this.parseProblemLevel(context.getAnswer('regular-offending-activities')),
      temperControl: this.parseProblemLevel(context.getAnswer('temper-control')),
      impulsivityProblems: this.parseProblemLevel(context.getAnswer('impulsivity-problems')),
      proCriminalAttitudes: this.parseProblemLevel(context.getAnswer('pro-criminal-attitudes')),
      previousConvictions: this.parsePreviousConvictions(context.getAnswer('previous-convictions') as string[]),
      didOffenceInvolveCarryingOrUsingWeapon: this.getDidOffenceInvolveCarryingOrUsingWeapon(context),
      evidenceOfDomesticAbuse: this.getEvidenceOfDomesticAbuse(context),
    }
  }

  private getCurrentRelationshipStatus(context: TieringAssessmentEffectContext): CurrentRelationshipStatus | null {
    const whoLivingWith = this.parseString(context.getAnswer('who-are-they-living-with'))
    const importantRelationships = this.parseString(context.getAnswer('important-relationships'))

    const isInvalid = (val: string | null) => val === null || val === 'unknown'

    if (isInvalid(whoLivingWith) || isInvalid(importantRelationships)) {
      return null
    }

    if (whoLivingWith.toLowerCase().includes('partner')) return 'IN_RELATIONSHIP_LIVING_TOGETHER'
    if (importantRelationships.toLowerCase().includes('partner')) return 'IN_RELATIONSHIP_NOT_LIVING_TOGETHER'
    return 'NOT_IN_RELATIONSHIP'
  }

  private getCurrentAlcoholUseProblems(context: TieringAssessmentEffectContext): ProblemLevel | null {
    const hasEverDrunkAlcohol = this.parseString(context.getAnswer('has-ever-drunk-alcohol'))
    const currentAlcoholUseFrequency = this.parseNumber(context.getAnswer('current-alcohol-use-frequency'))
    const unitsOfAlcohol = this.parseNumber(context.getAnswer('units-of-alcohol'))

    if (hasEverDrunkAlcohol === null || hasEverDrunkAlcohol === 'unknown') return null
    if (hasEverDrunkAlcohol === 'YES_NOT_IN_LAST_THREE_MONTHS' || hasEverDrunkAlcohol === 'NO') return 'NO_PROBLEMS'

    return this.currentAlcoholUseAndUnitsToProblemLevel(currentAlcoholUseFrequency, unitsOfAlcohol)
  }

  private getExcessiveAlcoholUseProblems(context: TieringAssessmentEffectContext): ProblemLevel | null {
    const hasEverDrunkAlcohol = this.parseString(context.getAnswer('has-ever-drunk-alcohol'))

    return this.parseProblemLevel(
      hasEverDrunkAlcohol === 'YES_IN_LAST_THREE_MONTHS'
        ? context.getAnswer('alcohol-use-binge-drinking')
        : context.getAnswer('binge-drinking'),
    )
  }

  private getDidOffenceInvolveCarryingOrUsingWeapon(context: TieringAssessmentEffectContext): boolean | null {
    const offenceElements: string[] = context.getAnswer('offence-elements') as string[]
    if (offenceElements == null || offenceElements.length === 0) {
      return null
    }
    return offenceElements.includes('weapon') || offenceElements.includes('violent-or-threat-of-violence-with-a-weapon')
  }

  private getEvidenceOfDomesticAbuse(context: TieringAssessmentEffectContext): boolean | null {
    const evidenceOfDomesticAbuse = this.parseBoolean(context.getAnswer('evidence-of-domestic-abuse'))
    const domesticAbuseAgainst = this.parseString(context.getAnswer('domestic-abuse-against'))

    if (evidenceOfDomesticAbuse === null) return null
    if (!evidenceOfDomesticAbuse) return false

    return domesticAbuseAgainst === 'family-member-and-intimate-partner' || domesticAbuseAgainst === 'intimate-partner'
  }

  private saveScoresToContext(context: TieringAssessmentEffectContext, riskScores: RiskScores): void {
    const setIfDefined = (key: string, val: unknown) => {
      if (val !== undefined && val !== null) {
        context.setAnswer(key, typeof val === 'object' ? JSON.stringify(val) : String(val))
      }
    }

    const predictors = [
      {
        prefix: 'risk-scores-all-reoffending-predictor',
        predictor: riskScores.actuarialPredictors?.allPredictor,
      },
      {
        prefix: 'risk-scores-violent-reoffending-predictor',
        predictor: riskScores.actuarialPredictors?.violentPredictor,
      },
      {
        prefix: 'risk-scores-direct-contact-sexual-reoffending-predictor',
        predictor: riskScores.actuarialPredictors?.directContactSexualPredictor,
      },
      {
        prefix: 'risk-scores-indirect-contact-sexual-reoffending-predictor',
        predictor: riskScores.actuarialPredictors?.indirectContactSexualPredictor,
      },
      {
        prefix: 'risk-scores-serious-violent-reoffending-predictor',
        predictor: riskScores.actuarialPredictors?.seriousViolentPredictor,
      },
    ]

    predictors.forEach(({ prefix, predictor }) => {
      setIfDefined(`${prefix}-score`, predictor?.output?.score)
      setIfDefined(`${prefix}-band`, predictor?.output?.band)
      setIfDefined(`${prefix}-type`, predictor?.type)
      setIfDefined(`${prefix}-errors`, predictor?.validationErrors)
    })

    setIfDefined(
      'risk-scores-combined-serious-reoffending-predictor-score',
      riskScores.actuarialPredictors?.seriousPredictor?.output?.overallScore,
    )
    setIfDefined(
      'risk-scores-combined-serious-reoffending-predictor-band',
      riskScores.actuarialPredictors?.seriousPredictor?.output?.band,
    )
    setIfDefined(
      `risk-scores-combined-serious-reoffending-predictor-type`,
      riskScores.actuarialPredictors?.seriousPredictor?.type,
    )
    setIfDefined(
      'risk-scores-combined-serious-reoffending-predictor-errors',
      riskScores.actuarialPredictors?.seriousPredictor?.validationErrors,
    )
  }

  private predictorRiskData(
    predictorName: string,
    predictorPrefix: string,
    assessmentDate: string,
    context: TieringAssessmentEffectContext,
  ): Predictor {
    return {
      name: predictorName,
      band: replaceUnderscoresWithSpaces(context.getAnswer(`${predictorPrefix}-band`) as string),
      score: context.getAnswer(`${predictorPrefix}-score`) as number,
      staticOrDynamic: convertToTitleCase(context.getAnswer(`${predictorPrefix}-type`) as string),
      completedDate: assessmentDate,
    }
  }

  createV2AssessmentRiskData(context: TieringAssessmentEffectContext): RiskData {
    const date = new Date()
    const assessmentDate = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date)
    const assessmentTime: string = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    const assessmentDateTime = `${assessmentDate} at ${assessmentTime}`

    return {
      httpStatus: 200,
      assessments: [
        {
          outputVersion: '2',
          completedDate: assessmentDate,
          completedDateTime: assessmentDateTime,
          assessmentType: 'Tiering',
          allReoffendingPredictor: this.predictorRiskData(
            'All reoffending predictor',
            'risk-scores-all-reoffending-predictor',
            assessmentDate,
            context,
          ),
          violentReoffendingPredictor: this.predictorRiskData(
            'Violent reoffending predictor',
            'risk-scores-violent-reoffending-predictor',
            assessmentDate,
            context,
          ),
          seriousViolentReoffendingPredictor: this.predictorRiskData(
            'Serious violent reoffending predictor',
            'risk-scores-serious-violent-reoffending-predictor',
            assessmentDate,
            context,
          ),
          directContactSexualReoffendingPredictor: this.predictorRiskData(
            'Direct contact \u2013 sexual reoffending predictor',
            'risk-scores-direct-contact-sexual-reoffending-predictor',
            assessmentDate,
            context,
          ),
          indirectImageContactSexualReoffendingPredictor: this.predictorRiskData(
            'Images and indirect contact \u2013 sexual reoffending predictor',
            'risk-scores-indirect-contact-sexual-reoffending-predictor',
            assessmentDate,
            context,
          ),
          combinedSeriousReoffendingPredictor: this.predictorRiskData(
            'Combined serious reoffending predictor',
            'risk-scores-combined-serious-reoffending-predictor',
            assessmentDate,
            context,
          ),
        },
      ],
    }
  }

  private calculateAgeAtDate(dob?: string, targetDate?: string): number | null {
    if (!dob || !targetDate) return null

    const [dobYear, dobMonth, dobDay] = dob.split('-').map(Number)
    const [targetYear, targetMonth, targetDay] = targetDate.split('-').map(Number)

    const age: number = targetYear - dobYear
    const hasHadBirthday: boolean = targetMonth > dobMonth || (targetMonth === dobMonth && targetDay >= dobDay)

    return hasHadBirthday ? age : age - 1
  }

  private parseString(val: unknown): string | null {
    if (val === undefined || val === null || val === 'unknown') return null
    const str: string = String(val).trim()
    return str === '' ? null : str
  }

  private parseDrugCheckbox(val: string, context: TieringAssessmentEffectContext): boolean | null {
    const drugAnswers = context.getAnswer('drug-misuse') as string[] | null | undefined

    if (!drugAnswers) return null
    if (!drugAnswers.includes(val)) return false

    const radioAnswer = context.getAnswer(`${val}-radio`)

    return this.parseBoolean(radioAnswer)
  }

  private parseBoolean(val: unknown): boolean | null {
    if (typeof val === 'boolean') return val
    if (typeof val === 'string' && val.toLowerCase() !== 'unknown')
      return val.toLowerCase() === 'true' || val.toUpperCase() === 'YES'
    return null
  }

  private parseNumber(val: unknown): number | null {
    if (val === undefined || val === null || val === '' || val === 'unknown') return null
    const num: number = Number(val)
    return Number.isNaN(num) ? null : num
  }

  private parseSupervisionStatus(val: unknown): SupervisionStatus | null {
    if (val === undefined || val === null) return null
    const str = String(val).trim()
    if (str === '') return null
    return str as SupervisionStatus
  }

  private parseProblemLevel(val: unknown): ProblemLevel | null {
    if (val === undefined || val === null) return null
    const str = String(val).trim()
    if (str === '' || str === 'unknown') return null
    return str as ProblemLevel
  }

  private parseMotivationLevel(val: unknown): MotivationLevel | null {
    if (val === undefined || val === null) return null
    const str = String(val).trim()
    if (str === '' || str === 'unknown') return null
    return str as MotivationLevel
  }

  private currentAlcoholUseAndUnitsToProblemLevel(
    frequency: number | null,
    unitsOfAlcohol: number | null,
  ): ProblemLevel | null {
    if (frequency === null || unitsOfAlcohol === null) {
      return null
    }

    const alcoholSummary = frequency + unitsOfAlcohol

    if (alcoholSummary <= 4) return this.parseProblemLevel('NO_PROBLEMS')
    if (alcoholSummary <= 7) return this.parseProblemLevel('SOME_PROBLEMS')
    return this.parseProblemLevel('SIGNIFICANT_PROBLEMS')
  }

  private parsePreviousConvictions(previousConvictions: string[] | undefined | null): PreviousConviction[] | null {
    if (previousConvictions === undefined || previousConvictions === null) return null

    const validPreviousConvictions: PreviousConviction[] = previousConvictions
      .filter((item): item is PreviousConviction => (PREVIOUS_CONVICTIONS as readonly string[]).includes(item))

    return validPreviousConvictions.length > 0 ? validPreviousConvictions : null
  }
}
