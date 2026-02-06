import { test } from '@playwright/test'
import type { TestCoordinatorApiClient } from '../support/apis/TestCoordinatorApiClient'
import type {
  OasysCreateRequest,
  OasysCreateResponse,
  OasysUserDetails,
  PlanType,
  AssessmentType,
  UserLocation,
  SubjectDetails,
} from '../../server/interfaces/coordinator-api/oasysCreate'
import { generateUserId } from './utils'

/**
 * Result of creating a coordinator association.
 * Contains all entity IDs created by the coordinator API.
 */
export interface CoordinatorAssociation {
  oasysAssessmentPk: string
  crn: string
  sanAssessmentId: string
  sanAssessmentVersion: number
  sentencePlanId: string
  sentencePlanVersion: number
}

/**
 * Factory for creating CoordinatorBuilder instances with a bound client.
 *
 * @example
 * // Create a basic SAN + Sentence Plan association
 * const association = await CoordinatorBuilder(client).create()
 *   .withAssessmentType('SAN_SP')
 *   .save()
 *
 * @example
 * // Use via fixture
 * test('my test', async ({ coordinatorBuilder }) => {
 *   const association = await coordinatorBuilder.create()
 *     .withAssessmentType('SAN_SP')
 *     .withCrn('A123456')
 *     .save()
 * })
 */
export function CoordinatorBuilder(client: TestCoordinatorApiClient): CoordinatorBuilderFactory {
  return {
    create: () => new CoordinatorBuilderInstance(client),
  }
}

export interface CoordinatorBuilderFactory {
  create: () => CoordinatorBuilderInstance
}

/**
 * Fluent builder for creating OASys associations via the coordinator API.
 */
export class CoordinatorBuilderInstance {
  private readonly client: TestCoordinatorApiClient

  private oasysAssessmentPk: string

  private crn: string | undefined

  private planType: PlanType = 'INITIAL'

  private assessmentType: AssessmentType = 'SAN_SP'

  // Generate unique user ID to avoid "duplicate key" errors in parallel tests
  private userDetails: OasysUserDetails = {
    id: generateUserId(),
    name: 'Test User',
    location: 'COMMUNITY',
  }

  private subjectDetails: Partial<SubjectDetails> = {}

  private newPeriodOfSupervision: 'Y' | 'N' = 'Y'

  private previousOasysSanPk: string | undefined

  private previousOasysSpPk: string | undefined

  private regionPrisonCode: string | undefined

  constructor(client: TestCoordinatorApiClient) {
    this.client = client
    this.oasysAssessmentPk = Math.floor(Math.random() * 1000000000).toString()
  }

  /**
   * Set the assessment type.
   * - SAN_SP: Creates both SAN assessment and Sentence Plan
   * - SP: Creates only Sentence Plan
   */
  withAssessmentType(assessmentType: AssessmentType): this {
    this.assessmentType = assessmentType

    return this
  }

  /**
   * Set the plan type.
   * - INITIAL: New plan for a new period of supervision
   * - REVIEW: Review of an existing plan
   * - UPW: No idea what this is (Unpaid work??)
   * - PSR_OUTLINE: Even less idea what this one is?
   */
  withPlanType(planType: PlanType): this {
    this.planType = planType

    return this
  }

  /**
   * Set the user (practitioner) details
   */
  withUser(user: Partial<OasysUserDetails>): this {
    this.userDetails = { ...this.userDetails, ...user }

    return this
  }

  /**
   * Set the user's location
   */
  withUserLocation(location: UserLocation): this {
    this.userDetails.location = location

    return this
  }

  /**
   * Set the subject (person on probation) details
   */
  withSubject(subject: Partial<SubjectDetails>): this {
    this.subjectDetails = { ...this.subjectDetails, ...subject }

    if (subject.crn) {
      this.crn = subject.crn
    }

    return this
  }

  /**
   * Set a specific CRN for the subject
   */
  withCrn(crn: string): this {
    this.crn = crn
    this.subjectDetails.crn = crn

    return this
  }

  /**
   * Set a specific NOMIS ID for the subject
   */
  withNomisId(nomisId: string): this {
    this.subjectDetails.nomisId = nomisId

    return this
  }

  /**
   * Set a specific OASys assessment PK
   */
  withOasysAssessmentPk(pk: string): this {
    this.oasysAssessmentPk = pk

    return this
  }

  /**
   * Set whether this is a new period of supervision
   */
  withNewPeriodOfSupervision(value: 'Y' | 'N'): this {
    this.newPeriodOfSupervision = value

    return this
  }

  /**
   * Set the previous OASys SAN PK
   */
  withPreviousOasysSanPk(pk: string): this {
    this.previousOasysSanPk = pk

    return this
  }

  /**
   * Set the previous OASys SP PK
   */
  withPreviousOasysSpPk(pk: string): this {
    this.previousOasysSpPk = pk

    return this
  }

  /**
   * Set the region/prison code
   */
  withRegionPrisonCode(code: string): this {
    this.regionPrisonCode = code

    return this
  }

  /**
   * Save the OASys association via the coordinator API.
   */
  async save(): Promise<CoordinatorAssociation> {
    return test.step('Create coordinator association', async () => {
      if (!this.crn) {
        // It'd probably be a good idea to expose this somehow as part of the create request,
        // as this does get saved as the `CRN` identifier in the AAP.
        const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
        const digits = Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, '0')
        this.crn = `${letter}${digits}`
      }

      const request: OasysCreateRequest = {
        oasysAssessmentPk: this.oasysAssessmentPk,
        planType: this.planType,
        assessmentType: this.assessmentType,
        userDetails: this.userDetails,
        subjectDetails: {
          crn: this.crn,
          ...this.subjectDetails,
        },
        newPeriodOfSupervision: this.newPeriodOfSupervision,
        previousOasysSanPk: this.previousOasysSanPk,
        previousOasysSpPk: this.previousOasysSpPk,
        regionPrisonCode: this.regionPrisonCode,
      }

      const response: OasysCreateResponse = await this.client.createOasysAssociation(request)

      return {
        oasysAssessmentPk: this.oasysAssessmentPk,
        crn: this.crn,
        sanAssessmentId: response.sanAssessmentId,
        sanAssessmentVersion: response.sanAssessmentVersion,
        sentencePlanId: response.sentencePlanId,
        sentencePlanVersion: response.sentencePlanVersion,
      }
    })
  }
}
