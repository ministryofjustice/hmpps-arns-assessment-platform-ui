import { AssessmentBuilder } from './AssessmentBuilder'
import type { AssessmentBuilderInstance } from './AssessmentBuilder'
import type { TestAapApiClient } from '../support/apis/TestAapApiClient'
import type { AnswerConfig, CreatedAssessment } from './types'

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
        AssessmentBuilder(client).fresh().ofType('SAN_SP').withFormVersion('1.0'),
      ),
    extend: (sanAssessmentId: string) =>
      new StrengthsAndNeedsBuilderInstance(client, AssessmentBuilder(client).extend(sanAssessmentId)),
  }
}

export interface StrengthsAndNeedsBuilderFactory {
  fresh: () => StrengthsAndNeedsBuilderInstance
  extend: (sanAssessmentId: string) => StrengthsAndNeedsBuilderInstance
}

/**
 * Fluent builder for STRENGTHS_AND_NEEDS assessments.
 */
export class StrengthsAndNeedsBuilderInstance {
  readonly client: TestAapApiClient

  private readonly assessmentBuilder: AssessmentBuilderInstance

  private readonly answers: AnswerConfig[] = []

  constructor(client: TestAapApiClient, assessmentBuilder: AssessmentBuilderInstance) {
    this.client = client
    this.assessmentBuilder = assessmentBuilder
  }

  /**
   * Save the san to the backend.
   */
  async save(): Promise<CreatedAssessment> {
    this.buildAssessmentAnswers()
    const assessment = await this.assessmentBuilder.save()
    const result = this.mapToCreatedSan(assessment)

    return result
  }

  private buildAssessmentAnswers(): void {
    this.answers.forEach(answer => {
      this.assessmentBuilder.withAnswer(answer.question, answer.value)
    })
  }

  /**
   * Add multiple answers to assessment
   */
  withAnswers(answer: AnswerConfig[]): this {
    answer.forEach(a => this.answers.push(a))

    return this
  }

  private mapToCreatedSan(assessment: CreatedAssessment): CreatedAssessment {
    return {
      uuid: assessment.uuid,
      collections: assessment.collections,
    }
  }
}
