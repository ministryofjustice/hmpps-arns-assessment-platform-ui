import { test } from '@playwright/test'
import { TestRiskActuarialApiClient } from 'support/apis/TestRiskActuarialApiClient'
import {
  CurrentRelationshipStatus,
  PreviousConviction,
  ProblemLevel,
  RiskScoreInput,
  RiskScores,
  SupervisionStatus,
  MotivationLevel,
} from '@server/interfaces/risk-actuarial-api/riskScores'

/**
 * Factory for creating RiskActuarialApiBuilder instances with a bound client.
 *
 * @example
 * // Use via fixture
 * test('my test', async ({ riskActuarialApiBuilder }) => {
 *   const association = await riskActuarialApiBuilder.create()
 *     .withGender('MALE')
 *     .withTotalNumberOfSanctionsForAllOffences('A123456')
 *     ...
 *     .save()
 * })
 */
export function RiskActuarialApiBuilder(client: TestRiskActuarialApiClient): RiskActuarialApiBuilderFactory {
  return {
    create: () => new RiskActuarialApiBuilderInstance(client),
  }
}

export interface RiskActuarialApiBuilderFactory {
  create: () => RiskActuarialApiBuilderInstance
}

/**
 * Fluent builder for getting risk scores via the Risk Actuarial API.
 */
export class RiskActuarialApiBuilderInstance {
  private readonly client: TestRiskActuarialApiClient

  private gender: string

  private dateOfBirth: string

  private dateOfCurrentConviction: string

  private dateAtStartOfFollowup: string

  private totalNumberOfSanctionsForAllOffences: number

  private ageAtFirstSanction: number

  private currentOffenceCode: string

  private totalNumberOfViolentSanctions: number

  private isUnemployed: boolean

  private currentAlcoholUseProblems: ProblemLevel

  private excessiveAlcoholUse: ProblemLevel

  private temperControl: ProblemLevel

  private proCriminalAttitudes: ProblemLevel

  private regularOffendingActivities: ProblemLevel

  private motivationToTackleDrugMisuse: MotivationLevel

  private impulsivityProblems: ProblemLevel

  private supervisionStatus: SupervisionStatus

  private hasEverCommittedSexualOffence: boolean

  private didOffenceInvolveCarryingOrUsingWeapon: boolean

  private evidenceOfDomesticAbuse: boolean

  private totalContactAdultSexualSanctions: number

  private totalContactChildSexualSanctions: number

  private totalIndecentImageSanctions: number

  private totalNonContactSexualOffences: number

  private dateOfMostRecentSexualOffence: string

  private isCurrentOffenceAgainstVictimStranger: boolean

  private suitabilityOfAccommodation: ProblemLevel

  private currentRelationshipWithPartner: ProblemLevel

  private currentRelationshipStatus: CurrentRelationshipStatus

  private previousConvictions: PreviousConviction[]

  private isCurrentOffenceSexuallyMotivated: boolean

  private mostRecentOffenceDate: string

  private hasHeroinUsage: boolean

  private hasOtherOpiateUsage: boolean

  private hasCrackCocaineUsage: boolean

  private hasPowderCocaineUsage: boolean

  private hasMisusedPrescriptionDrugUsage: boolean

  private hasBenzodiazepinesUsage: boolean

  private hasCannabisUsage: boolean

  private hasSteroidsUsage: boolean

  private hasOtherDrugsUsage: boolean

  private hasKetamineUsage: boolean

  private hasSpiceUsage: boolean

  private hasHallucinogensUsage: boolean

  private hasSolventsUsage: boolean

  private hasMethadoneUsage: boolean

  constructor(client: TestRiskActuarialApiClient) {
    this.client = client
  }

  withGender(gender: string): this {
    this.gender = gender

    return this
  }

  withDateOfBirth(dateOfBirth: string): this {
    this.dateOfBirth = dateOfBirth

    return this
  }

  withDateOfCurrentConviction(dateOfCurrentConviction: string): this {
    this.dateOfCurrentConviction = dateOfCurrentConviction

    return this
  }

  withDateAtStartOfFollowup(dateAtStartOfFollowup: string): this {
    this.dateAtStartOfFollowup = dateAtStartOfFollowup

    return this
  }

  withTotalNumberOfSanctionsForAllOffences(totalNumberOfSanctionsForAllOffences: number): this {
    this.totalNumberOfSanctionsForAllOffences = totalNumberOfSanctionsForAllOffences

    return this
  }

  withAgeAtFirstSanction(ageAtFirstSanction: number): this {
    this.ageAtFirstSanction = ageAtFirstSanction

    return this
  }

  withCurrentOffenceCode(currentOffenceCode: string): this {
    this.currentOffenceCode = currentOffenceCode

    return this
  }

  withTotalNumberOfViolentSanctions(totalNumberOfViolentSanctions: number): this {
    this.totalNumberOfViolentSanctions = totalNumberOfViolentSanctions

    return this
  }

  withIsUnemployed(isUnemployed: boolean): this {
    this.isUnemployed = isUnemployed

    return this
  }

  withCurrentAlcoholUseProblems(currentAlcoholUseProblems: ProblemLevel): this {
    this.currentAlcoholUseProblems = currentAlcoholUseProblems

    return this
  }

  withExcessiveAlcoholUse(excessiveAlcoholUse: ProblemLevel): this {
    this.excessiveAlcoholUse = excessiveAlcoholUse

    return this
  }

  withTemperControl(temperControl: ProblemLevel): this {
    this.temperControl = temperControl

    return this
  }

  withProCriminalAttitudes(proCriminalAttitudes: ProblemLevel): this {
    this.proCriminalAttitudes = proCriminalAttitudes

    return this
  }

  withRegularOffendingActivities(regularOffendingActivities: ProblemLevel): this {
    this.regularOffendingActivities = regularOffendingActivities

    return this
  }

  withMotivationToTackleDrugMisuse(motivationToTackleDrugMisuse: MotivationLevel): this {
    this.motivationToTackleDrugMisuse = motivationToTackleDrugMisuse

    return this
  }

  withImpulsivityProblems(impulsivityProblems: ProblemLevel): this {
    this.impulsivityProblems = impulsivityProblems

    return this
  }

  withSupervisionStatus(supervisionStatus: SupervisionStatus): this {
    this.supervisionStatus = supervisionStatus

    return this
  }

  withHasEverCommittedSexualOffence(hasEverCommittedSexualOffence: boolean): this {
    this.hasEverCommittedSexualOffence = hasEverCommittedSexualOffence

    return this
  }

  withDidOffenceInvolveCarryingOrUsingWeapon(didOffenceInvolveCarryingOrUsingWeapon: boolean): this {
    this.didOffenceInvolveCarryingOrUsingWeapon = didOffenceInvolveCarryingOrUsingWeapon

    return this
  }

  withEvidenceOfDomesticAbuse(evidenceOfDomesticAbuse: boolean): this {
    this.evidenceOfDomesticAbuse = evidenceOfDomesticAbuse

    return this
  }

  withTotalContactAdultSexualSanctions(totalContactAdultSexualSanctions: number): this {
    this.totalContactAdultSexualSanctions = totalContactAdultSexualSanctions

    return this
  }

  withTotalContactChildSexualSanctions(totalContactChildSexualSanctions: number): this {
    this.totalContactChildSexualSanctions = totalContactChildSexualSanctions

    return this
  }

  withTotalIndecentImageSanctions(totalIndecentImageSanctions: number): this {
    this.totalIndecentImageSanctions = totalIndecentImageSanctions

    return this
  }

  withTotalNonContactSexualOffences(totalNonContactSexualOffences: number): this {
    this.totalNonContactSexualOffences = totalNonContactSexualOffences

    return this
  }

  withDateOfMostRecentSexualOffence(dateOfMostRecentSexualOffence: string): this {
    this.dateOfMostRecentSexualOffence = dateOfMostRecentSexualOffence

    return this
  }

  withIsCurrentOffenceAgainstVictimStranger(isCurrentOffenceAgainstVictimStranger: boolean): this {
    this.isCurrentOffenceAgainstVictimStranger = isCurrentOffenceAgainstVictimStranger

    return this
  }

  withSuitabilityOfAccommodation(suitabilityOfAccommodation: ProblemLevel): this {
    this.suitabilityOfAccommodation = suitabilityOfAccommodation

    return this
  }

  withCurrentRelationshipWithPartner(currentRelationshipWithPartner: ProblemLevel): this {
    this.currentRelationshipWithPartner = currentRelationshipWithPartner

    return this
  }

  withCurrentRelationshipStatus(currentRelationshipStatus: CurrentRelationshipStatus): this {
    this.currentRelationshipStatus = currentRelationshipStatus

    return this
  }

  withPreviousConvictions(previousConvictions: PreviousConviction[]): this {
    this.previousConvictions = previousConvictions

    return this
  }

  withIsCurrentOffenceSexuallyMotivated(isCurrentOffenceSexuallyMotivated: boolean): this {
    this.isCurrentOffenceSexuallyMotivated = isCurrentOffenceSexuallyMotivated

    return this
  }

  withMostRecentOffenceDate(mostRecentOffenceDate: string): this {
    this.mostRecentOffenceDate = mostRecentOffenceDate

    return this
  }

  withHasHeroinUsage(hasHeroinUsage: boolean): this {
    this.hasHeroinUsage = hasHeroinUsage

    return this
  }

  withHasOtherOpiateUsage(hasOtherOpiateUsage: boolean): this {
    this.hasOtherOpiateUsage = hasOtherOpiateUsage

    return this
  }

  withHasCrackCocaineUsage(hasCrackCocaineUsage: boolean): this {
    this.hasCrackCocaineUsage = hasCrackCocaineUsage

    return this
  }

  withHasPowderCocaineUsage(hasPowderCocaineUsage: boolean): this {
    this.hasPowderCocaineUsage = hasPowderCocaineUsage

    return this
  }

  withHasMisusedPrescriptionDrugUsage(hasMisusedPrescriptionDrugUsage: boolean): this {
    this.hasMisusedPrescriptionDrugUsage = hasMisusedPrescriptionDrugUsage

    return this
  }

  withHasBenzodiazepinesUsage(hasBenzodiazepinesUsage: boolean): this {
    this.hasBenzodiazepinesUsage = hasBenzodiazepinesUsage

    return this
  }

  withHasCannabisUsage(hasCannabisUsage: boolean): this {
    this.hasCannabisUsage = hasCannabisUsage

    return this
  }

  withHasSteroidsUsage(hasSteroidsUsage: boolean): this {
    this.hasSteroidsUsage = hasSteroidsUsage

    return this
  }

  withHasOtherDrugsUsage(hasOtherDrugsUsage: boolean): this {
    this.hasOtherDrugsUsage = hasOtherDrugsUsage

    return this
  }

  withHasKetamineUsage(hasKetamineUsage: boolean): this {
    this.hasKetamineUsage = hasKetamineUsage

    return this
  }

  withHasSpiceUsage(hasSpiceUsage: boolean): this {
    this.hasSpiceUsage = hasSpiceUsage

    return this
  }

  withHasHallucinogensUsage(hasHallucinogensUsage: boolean): this {
    this.hasHallucinogensUsage = hasHallucinogensUsage

    return this
  }

  withHasSolventsUsage(hasSolventsUsage: boolean): this {
    this.hasSolventsUsage = hasSolventsUsage

    return this
  }

  withHasMethadoneUsage(hasMethadoneUsage: boolean): this {
    this.hasMethadoneUsage = hasMethadoneUsage

    return this
  }

  /**
   * Get the risk scores via the Risk Actuarial API.
   */
  async save(): Promise<RiskScores> {
    return test.step('Get risk scores', async () => {
      const request: RiskScoreInput = {
        gender: this.gender,
        dateOfBirth: this.dateOfBirth,
        dateOfCurrentConviction: this.dateOfCurrentConviction,
        currentOffenceCode: this.currentOffenceCode,
        totalNumberOfSanctionsForAllOffences: this.totalNumberOfSanctionsForAllOffences,
        ageAtFirstSanction: this.ageAtFirstSanction,
        supervisionStatus: this.supervisionStatus,
        dateAtStartOfFollowup: this.dateAtStartOfFollowup,
        totalNumberOfViolentSanctions: this.totalNumberOfViolentSanctions,
        didOffenceInvolveCarryingOrUsingWeapon: this.didOffenceInvolveCarryingOrUsingWeapon,
        suitabilityOfAccommodation: this.suitabilityOfAccommodation,
        isUnemployed: this.isUnemployed,
        currentRelationshipWithPartner: this.currentRelationshipWithPartner,
        currentAlcoholUseProblems: this.currentAlcoholUseProblems,
        excessiveAlcoholUse: this.excessiveAlcoholUse,
        impulsivityProblems: this.impulsivityProblems,
        temperControl: this.temperControl,
        proCriminalAttitudes: this.proCriminalAttitudes,
        evidenceOfDomesticAbuse: this.evidenceOfDomesticAbuse,
        previousConvictions: this.previousConvictions,
        hasEverCommittedSexualOffence: this.hasEverCommittedSexualOffence,
        isCurrentOffenceSexuallyMotivated: this.isCurrentOffenceSexuallyMotivated,
        mostRecentOffenceDate: this.mostRecentOffenceDate,
        totalContactAdultSexualSanctions: this.totalContactAdultSexualSanctions,
        totalContactChildSexualSanctions: this.totalContactChildSexualSanctions,
        totalNonContactSexualOffences: this.totalNonContactSexualOffences,
        totalIndecentImageSanctions: this.totalIndecentImageSanctions,
        dateOfMostRecentSexualOffence: this.dateOfMostRecentSexualOffence,
        isCurrentOffenceAgainstVictimStranger: this.isCurrentOffenceAgainstVictimStranger,
        regularOffendingActivities: this.regularOffendingActivities,
        motivationToTackleDrugMisuse: this.motivationToTackleDrugMisuse,
        currentRelationshipStatus: this.currentRelationshipStatus,
        hasHeroinUsage: this.hasHeroinUsage,
        hasMethadoneUsage: this.hasMethadoneUsage,
        hasOtherOpiateUsage: this.hasOtherOpiateUsage,
        hasCrackCocaineUsage: this.hasCrackCocaineUsage,
        hasPowderCocaineUsage: this.hasPowderCocaineUsage,
        hasMisusedPrescriptionDrugUsage: this.hasMisusedPrescriptionDrugUsage,
        hasBenzodiazepinesUsage: this.hasBenzodiazepinesUsage,
        hasCannabisUsage: this.hasCannabisUsage,
        hasSteroidsUsage: this.hasSteroidsUsage,
        hasOtherDrugsUsage: this.hasOtherDrugsUsage,
        hasKetamineUsage: this.hasKetamineUsage,
        hasSpiceUsage: this.hasSpiceUsage,
        hasHallucinogensUsage: this.hasHallucinogensUsage,
        hasSolventsUsage: this.hasSolventsUsage,
      }

      return await this.client.getRiskScores(request)
    })
  }
}
