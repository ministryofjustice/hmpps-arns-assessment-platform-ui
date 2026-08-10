import RiskActuarialApiClient from '../../../data/riskActuarialApiClient'
import { TieringAssessmentEffectContext } from '../@types/TieringAssessmentEffectContext'
import {
  MotivationLevel,
  ProblemLevel,
  RiskScoreInput,
  RiskScores,
  SupervisionStatus,
} from '../../../interfaces/risk-actuarial-api/riskScores'

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
      hasBenzodiazepinesUsage: this.parseBoolean(context.getAnswer('benzodiazepines-radio')),
      hasCannabisUsage: this.parseBoolean(context.getAnswer('cannabis-radio')),
      hasPowderCocaineUsage: this.parseBoolean(context.getAnswer('cocaine-hydrochloride-radio')),
      hasCrackCocaineUsage: this.parseBoolean(context.getAnswer('crack-or-cocaine-radio')),
      hasHallucinogensUsage: this.parseBoolean(context.getAnswer('hallucinogens-radio')),
      hasHeroinUsage: this.parseBoolean(context.getAnswer('heroin-radio')),
      hasMethadoneUsage: this.parseBoolean(context.getAnswer('methadone-radio')),
      hasMisusedPrescriptionDrugUsage: this.parseBoolean(context.getAnswer('misused-prescribed-drugs-radio')),
      hasOtherOpiateUsage: this.parseBoolean(context.getAnswer('other-opiate-radio')),
      hasSolventsUsage: this.parseBoolean(context.getAnswer('solvents-radio')),
      hasSpiceUsage: this.parseBoolean(context.getAnswer('spice-radio')),
      hasSteroidsUsage: this.parseBoolean(context.getAnswer('steroids-radio')),
      hasKetamineUsage: this.parseBoolean(context.getAnswer('ketamine-radio')),
      hasOtherDrugsUsage: this.parseBoolean(context.getAnswer('other-drug-radio')),
      motivationToTackleDrugMisuse: this.parseMotivationLevel(context.getAnswer('motivation-to-tackle-drug-misuse')),
      currentAlcoholUseProblems: this.getCurrentAlcoholUseProblems(context),
    }
  }

  private getCurrentAlcoholUseProblems(context: TieringAssessmentEffectContext): ProblemLevel | null {
    const isProblem = this.parseBoolean(context.getAnswer('is-current-alcohol-use-a-problem'))

    if (isProblem === null) return null
    if (!isProblem) return 'NO_PROBLEMS'

    return this.parseProblemLevel(context.getAnswer('current-alcohol-use-problems'))
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
      'risk-scores-combined-serious-reoffending-predictor-errors',
      riskScores.actuarialPredictors?.seriousPredictor?.validationErrors,
    )
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
    if (val === undefined || val === null) return null
    const str: string = String(val).trim()
    return str === '' ? null : str
  }

  private parseBoolean(val: unknown): boolean | null {
    if (typeof val === 'boolean') return val
    if (typeof val === 'string' && val.toLowerCase() !== 'unknown')
      return val.toLowerCase() === 'true' || val.toUpperCase() === 'YES'
    return null
  }

  private parseNumber(val: unknown): number | null {
    if (val === undefined || val === null || val === '') return null
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
}
