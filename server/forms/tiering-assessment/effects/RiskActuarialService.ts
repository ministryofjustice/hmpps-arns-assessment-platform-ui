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
import { EmploymentOption } from '../versions/v1.0/steps/employment/constants/employmentOption'
import { CommonOption } from '../versions/v1.0/constants/commonOption'
import { UnitsOfAlcoholOption, FrequencyOption } from '../versions/v1.0/steps/alcohol/constants/option'
import { DrugOption } from '../versions/v1.0/steps/drug-use/constants/DrugOption'

export class RiskActuarialService {
  constructor(private readonly riskActuarialApiClient: RiskActuarialApiClient) {}

  async calculateAndSaveScores(context: TieringAssessmentEffectContext): Promise<void> {
    const input: RiskScoreInput = this.buildRiskScoreInput(context)
    const riskScores: RiskScores = await this.riskActuarialApiClient.getRiskScores(input)
    this.saveScoresToContext(context, riskScores)
  }

  private buildRiskScoreInput(context: TieringAssessmentEffectContext): RiskScoreInput {
    const dob = this.parseString(context.getAnswer('date-of-birth'))
    const dateAtFirstSanction = this.parseString(context.getAnswer('date_at_first_sanction'))

    return {
      gender: this.parseString(context.getAnswer('gender')),
      dateOfBirth: dob,
      dateOfCurrentConviction: this.parseString(context.getAnswer('date-of-current-conviction')),
      dateAtStartOfFollowup: this.parseString(context.getAnswer('date_of_current_supervision')),
      totalNumberOfSanctionsForAllOffences: this.parseNumber(context.getAnswer('number_of_sanctions_for_all_offences')),
      ageAtFirstSanction: this.calculateAgeAtDate(dob, dateAtFirstSanction),
      currentOffenceCode: this.parseString(context.getAnswer('offence-code')),
      totalNumberOfViolentSanctions: this.parseNumber(context.getAnswer('number_of_violent_sanctions')),
      supervisionStatus: this.parseSupervisionStatus(context.getAnswer('supervision-status')),
      mostRecentOffenceDate: this.parseString(context.getAnswer('most-recent-offence-date')),
      hasEverCommittedSexualOffence: this.parseBoolean(context.getAnswer('has_ever_committed_sexual_offence')),
      totalContactAdultSexualSanctions: this.parseNumber(context.getAnswer('number_of_contact_sexual_sanctions')),
      totalContactChildSexualSanctions: this.parseNumber(context.getAnswer('number_of_contact_child_sexual_sanctions')),
      totalIndecentImageSanctions: this.parseNumber(context.getAnswer('indecent_child_images')),
      totalNonContactSexualOffences: this.parseNumber(context.getAnswer('non_contact')),
      dateOfMostRecentSexualOffence: this.parseString(context.getAnswer('date_of_most_recent_sexual_offence')),
      isCurrentOffenceAgainstVictimStranger: this.parseBoolean(context.getAnswer('victim_stranger')),
      suitabilityOfAccommodation: this.parseProblemLevel(context.getAnswer('suitability_of_accommodation')),
      isUnemployed: this.parseEmploymentStatus(context.getAnswer('is_unemployed')),
      hasBenzodiazepinesUsage: this.parseDrugCheckbox(DrugOption.benzodiazepines, context),
      hasCannabisUsage: this.parseDrugCheckbox(DrugOption.cannabis, context),
      hasPowderCocaineUsage: this.parseDrugCheckbox(DrugOption.cocaine_hydrochloride, context),
      hasCrackCocaineUsage: this.parseDrugCheckbox(DrugOption.crack_or_cocaine, context),
      hasHallucinogensUsage: this.parseDrugCheckbox(DrugOption.hallucinogens, context),
      hasHeroinUsage: this.parseDrugCheckbox(DrugOption.heroin, context),
      hasMethadoneUsage: this.parseDrugCheckbox(DrugOption.methadone, context),
      hasMisusedPrescriptionDrugUsage: this.parseDrugCheckbox(DrugOption.misused_prescribed_drugs, context),
      hasOtherOpiateUsage: this.parseDrugCheckbox(DrugOption.other_opiates, context),
      hasSolventsUsage: this.parseDrugCheckbox(DrugOption.solvents, context),
      hasSpiceUsage: this.parseDrugCheckbox(DrugOption.spice, context),
      hasSteroidsUsage: this.parseDrugCheckbox(DrugOption.steroids, context),
      hasKetamineUsage: this.parseDrugCheckbox(DrugOption.ketamine, context),
      hasOtherDrugsUsage: this.parseDrugCheckbox(DrugOption.other_drugs, context),
      hasCurrentDrugMisuse: this.parseBoolean(context.getAnswer('ever_misused_drugs')),
      motivationToTackleDrugMisuse: this.parseMotivationLevel(context.getAnswer('motivation_to_tackle_drug_misuse')),
      currentAlcoholUseProblems: this.getCurrentAlcoholUseProblems(context),
      excessiveAlcoholUse: this.getExcessiveAlcoholUseProblems(context),
      currentRelationshipStatus: this.getCurrentRelationshipStatus(context),
      currentRelationshipWithPartner: this.parseProblemLevel(context.getAnswer('relationship_satisfaction')),
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
    const whoAreTheyLivingWith = this.parseString(context.getAnswer('who_are_they_living_with'))
    const importantRelationships = this.parseString(context.getAnswer('important_relationships'))

    const isInvalid = (val: string | null) => val === null || val === 'unknown'

    if (isInvalid(whoAreTheyLivingWith) || isInvalid(importantRelationships)) {
      return null
    }

    if (whoAreTheyLivingWith.toLowerCase().includes('partner')) return 'IN_RELATIONSHIP_LIVING_TOGETHER'
    if (importantRelationships.toLowerCase().includes('partner')) return 'IN_RELATIONSHIP_NOT_LIVING_TOGETHER'
    return 'NOT_IN_RELATIONSHIP'
  }

  private getCurrentAlcoholUseProblems(context: TieringAssessmentEffectContext): ProblemLevel | null {
    const hasEverDrunkAlcohol = this.parseString(context.getAnswer('has_ever_drunk_alcohol'))
    const currentAlcoholUseFrequency = this.parseString(context.getAnswer('current_alcohol_use_frequency'))
    const unitsOfAlcohol = this.parseString(context.getAnswer('units_of_alcohol'))

    if (hasEverDrunkAlcohol === null || hasEverDrunkAlcohol === 'unknown') return null
    if (hasEverDrunkAlcohol === 'YES_NOT_IN_LAST_THREE_MONTHS' || hasEverDrunkAlcohol === 'NO') return 'NO_PROBLEMS'

    return this.currentAlcoholUseAndUnitsToProblemLevel(currentAlcoholUseFrequency, unitsOfAlcohol)
  }

  private getExcessiveAlcoholUseProblems(context: TieringAssessmentEffectContext): ProblemLevel | null {
    const hasEverDrunkAlcohol = this.parseString(context.getAnswer('has_ever_drunk_alcohol'))

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
    const drugAnswers = context.getAnswer('drug_use') as string[] | null | undefined

    if (!drugAnswers) return null
    if (!drugAnswers.includes(val)) return false

    const radioAnswer = context.getAnswer(`${val}_RADIO`)

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
    frequency: string | null,
    unitsOfAlcohol: string | null,
  ): ProblemLevel | null {
    if (frequency === null || unitsOfAlcohol === null) {
      return null
    }

    const alcoholSummary =
      this.FREQUENCY_MAP[frequency as FrequencyOption] + this.ALCOHOL_UNITS_MAP[unitsOfAlcohol as UnitsOfAlcoholOption]

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

  private readonly UNEMPLOYMENT_MAP: Record<EmploymentOption, boolean> = {
    [EmploymentOption.employed]: false,
    [EmploymentOption.self_employed]: false,
    [EmploymentOption.retired]: false,
    [EmploymentOption.currently_unavailable_for_work]: false,
    [EmploymentOption.unemployed_actively_looking_for_work]: true,
    [EmploymentOption.unemployed_not_actively_looking_for_work]: true,
  }

  private readonly FREQUENCY_MAP: Record<FrequencyOption, number> = {
    [FrequencyOption.ONCE_A_MONTH]: 0,
    [FrequencyOption.TWO_TO_FOUR_TIMES_A_MONTH]: 1,
    [FrequencyOption.TWO_TO_THREE_TIMES_A_WEEK]: 3,
    [FrequencyOption.MORE_THAN_FOUR_TIME_A_WEEK]: 4,
  }

  private readonly ALCOHOL_UNITS_MAP: Record<UnitsOfAlcoholOption, number> = {
    [UnitsOfAlcoholOption.ONE_TO_TWO_UNITS]: 0,
    [UnitsOfAlcoholOption.THREE_TO_FOUR_UNITS]: 1,
    [UnitsOfAlcoholOption.FIVE_TO_SIX_UNITS]: 2,
    [UnitsOfAlcoholOption.SEVEN_TO_NINE_UNITS]: 3,
    [UnitsOfAlcoholOption.TEN_OR_MORE_UNITS]: 4,
  }

  private parseEmploymentStatus(employmentStatus: unknown): boolean | null {
    if (typeof employmentStatus !== 'string' || employmentStatus === CommonOption.unknown) {
      return null
    }

    return this.UNEMPLOYMENT_MAP[employmentStatus as EmploymentOption] ?? null
  }
}
