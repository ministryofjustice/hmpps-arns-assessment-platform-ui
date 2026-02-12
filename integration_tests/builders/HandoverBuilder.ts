import { test } from '@playwright/test'
import type { TestHandoverApiClient } from '../support/apis/TestHandoverApiClient'
import type { CoordinatorAssociation } from './CoordinatorBuilder'
import type { CreateHandoverLinkRequest } from '../../server/interfaces/handover-api/request'
import type {
  HandoverPrincipalDetails,
  HandoverSubjectDetails,
  CriminogenicNeedsData,
  AccessMode,
  Location,
} from '../../server/interfaces/handover-api/shared'
import { generateUserId } from './utils'

/**
 * Result of creating a handover session.
 * Contains all information needed to navigate to the service and access entities.
 */
export interface HandoverSession {
  handoverSessionId: string
  handoverLink: string
  oasysAssessmentPk: string
  crn: string
  sentencePlanId: string
  sentencePlanVersion: number
  sanAssessmentId: string
  sanAssessmentVersion: number
}

/**
 * Factory for creating HandoverBuilder instances with a bound client.
 *
 * @example
 * // Basic usage with coordinator association
 * const session = await HandoverBuilder(client)
 *   .forAssociation(association)
 *   .save()
 *
 * @example
 * // Use via fixture
 * test('my test', async ({ handoverBuilder }) => {
 *   const session = await handoverBuilder
 *     .forAssociation(association)
 *     .withPlanAccessMode('READ_ONLY')
 *     .save()
 * })
 */
export function HandoverBuilder(client: TestHandoverApiClient): HandoverBuilderFactory {
  return {
    forAssociation: (association: CoordinatorAssociation) => new HandoverBuilderInstance(client, association),
  }
}

export interface HandoverBuilderFactory {
  forAssociation: (association: CoordinatorAssociation) => HandoverBuilderInstance
}

/**
 * Fluent builder for creating handover sessions.
 */
export class HandoverBuilderInstance {
  private readonly client: TestHandoverApiClient

  private readonly association: CoordinatorAssociation

  private principal: Partial<HandoverPrincipalDetails> = {}

  private subject: Partial<HandoverSubjectDetails> = {}

  private criminogenicNeeds: CriminogenicNeedsData | undefined

  // Generate unique user ID to avoid "duplicate key" errors in parallel tests
  private defaultPrincipal: HandoverPrincipalDetails = {
    identifier: generateUserId(),
    displayName: 'Test User',
    planAccessMode: 'READ_WRITE',
    returnUrl: 'http://localhost:3000',
  }

  constructor(client: TestHandoverApiClient, association: CoordinatorAssociation) {
    this.client = client
    this.association = association
  }

  /**
   * Set the principal (practitioner) details.
   * Merges with defaults.
   */
  withPrincipal(principal: Partial<HandoverPrincipalDetails>): this {
    this.principal = { ...this.principal, ...principal }

    return this
  }

  /**
   * Set the principal's identifier (user ID)
   */
  withPrincipalId(identifier: string): this {
    this.principal.identifier = identifier

    return this
  }

  /**
   * Set the principal's display name
   */
  withPrincipalName(displayName: string): this {
    this.principal.displayName = displayName

    return this
  }

  /**
   * Set the principal's plan access mode
   */
  withPlanAccessMode(planAccessMode: AccessMode): this {
    this.principal.planAccessMode = planAccessMode

    return this
  }

  /**
   * Set the return URL for after handover
   */
  withReturnUrl(returnUrl: string): this {
    this.principal.returnUrl = returnUrl

    return this
  }

  /**
   * Set the subject (person on probation) details.
   * Merges with defaults.
   */
  withSubject(subject: Partial<HandoverSubjectDetails>): this {
    this.subject = { ...this.subject, ...subject }

    return this
  }

  /**
   * Set the subject's name
   */
  withSubjectName(givenName: string, familyName: string): this {
    this.subject.givenName = givenName
    this.subject.familyName = familyName

    return this
  }

  /**
   * Set the subject's date of birth
   */
  withSubjectDateOfBirth(dateOfBirth: string): this {
    this.subject.dateOfBirth = dateOfBirth

    return this
  }

  /**
   * Set the subject's location
   */
  withSubjectLocation(location: Location): this {
    this.subject.location = location

    return this
  }

  /**
   * Set the subject PNC.
   */
  withSubjectPNC(pnc: string): this {
    this.subject.pnc = pnc

    return this
  }

  /**
   * Set criminogenic needs data from OASys
   */
  withCriminogenicNeeds(needs: CriminogenicNeedsData): this {
    this.criminogenicNeeds = needs

    return this
  }

  /**
   * Save the handover session via the handover API.
   */
  async save(): Promise<HandoverSession> {
    return test.step('Create handover session', async () => {
      const principalDetails: HandoverPrincipalDetails = {
        ...this.defaultPrincipal,
        ...this.principal,
      }

      const subjectDetails: HandoverSubjectDetails = {
        crn: this.association.crn,
        pnc: this.subject.pnc,
        givenName: this.subject.givenName ?? 'Test',
        familyName: this.subject.familyName ?? 'User',
        dateOfBirth: this.subject.dateOfBirth ?? '1990-01-01',
        location: this.subject.location ?? 'COMMUNITY',
        ...this.subject,
      }

      const createRequest: CreateHandoverLinkRequest = {
        user: principalDetails,
        subjectDetails,
        oasysAssessmentPk: this.association.oasysAssessmentPk,
        criminogenicNeedsData: this.criminogenicNeeds,
      }

      const handoverResponse = await test.step('POST /handover (createHandoverLink)', () =>
        this.client.createHandoverLink(createRequest))

      return {
        handoverSessionId: handoverResponse.handoverSessionId,
        handoverLink: handoverResponse.handoverLink,
        oasysAssessmentPk: this.association.oasysAssessmentPk,
        crn: this.association.crn,
        sentencePlanId: this.association.sentencePlanId,
        sentencePlanVersion: this.association.sentencePlanVersion,
        sanAssessmentId: this.association.sanAssessmentId,
        sanAssessmentVersion: this.association.sanAssessmentVersion,
      }
    })
  }
}
