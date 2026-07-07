import { AssessmentBuilder } from './AssessmentBuilder'
import type { AssessmentBuilderInstance } from './AssessmentBuilder'
import type { TestAapApiClient } from '../support/apis/TestAapApiClient'
import type { CreatedAssessment } from './types'

/**
 * Factory for creating StrengthsAndNeedsBuilder instances with a bound client.
 *
 * @example
 * // Create a fresh san (no coordinator)
 * await StrengthsAndNeedsBuilder(client).fresh()
 *   .save()
 */
export function StrengthsAndNeedsBuilder(client: TestAapApiClient): StrengthsAndNeedsBuilderFactory {
  return {
    fresh: () =>
      new StrengthsAndNeedsBuilderInstance(
        client,
        AssessmentBuilder(client).fresh().ofType('SAN_BETA').withFormVersion('1.0'),
      ),
  }
}

export interface StrengthsAndNeedsBuilderFactory {
  fresh: () => StrengthsAndNeedsBuilderInstance
}

/**
 * Fluent builder for STRENGTHS_AND_NEEDS assessments.
 */
export class StrengthsAndNeedsBuilderInstance {
  readonly client: TestAapApiClient

  private readonly assessmentBuilder: AssessmentBuilderInstance

  constructor(client: TestAapApiClient, assessmentBuilder: AssessmentBuilderInstance) {
    this.client = client
    this.assessmentBuilder = assessmentBuilder
  }

  /**
   * Save the san to the backend.
   */
  async save(): Promise<CreatedAssessment> {
    const assessment = await this.assessmentBuilder.save()
    const result = this.mapToCreatedSan(assessment)

    return result
  }

  private mapToCreatedSan(assessment: CreatedAssessment): CreatedAssessment {
    return {
      uuid: assessment.uuid,
      collections: assessment.collections,
    }
  }
}
