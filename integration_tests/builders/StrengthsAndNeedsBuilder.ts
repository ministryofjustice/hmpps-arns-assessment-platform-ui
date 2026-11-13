import {
  IsUserSubmitted,
  isUserSubmittedCode,
} from '@server/forms/strengths-and-needs/versions/v1.0/constants/userSubmitted'
import type { AssessmentBuilderInstance, CollectionBuilder, CollectionItemBuilder } from './AssessmentBuilder'
import { AssessmentBuilder } from './AssessmentBuilder'
import type { TestAapApiClient } from '../support/apis/TestAapApiClient'
import type { AnswerConfig, CreatedAssessment, DataConfig } from './types'

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
    fresh: (formVersion?: string, assessmentType?: string) =>
      new StrengthsAndNeedsBuilderInstance(
        client,
        AssessmentBuilder(client).fresh().ofType(assessmentType).withFormVersion(formVersion),
      ),
    extend: (sanAssessmentId: string, formVersion?: string) =>
      new StrengthsAndNeedsBuilderInstance(
        client,
        AssessmentBuilder(client).extend(sanAssessmentId).withFormVersion(formVersion),
      ),
  }
}

export interface StrengthsAndNeedsBuilderFactory {
  fresh: (formVersion?: string, assessmentType?: string) => StrengthsAndNeedsBuilderInstance
  extend: (sanAssessmentId: string, formVersion?: string) => StrengthsAndNeedsBuilderInstance
}

/**
 * Fluent builder for STRENGTHS_AND_NEEDS assessments.
 */
export class StrengthsAndNeedsBuilderInstance {
  readonly client: TestAapApiClient

  private readonly assessmentBuilder: AssessmentBuilderInstance

  private readonly answers: AnswerConfig[] = []

  private readonly data: DataConfig[] = []

  constructor(client: TestAapApiClient, assessmentBuilder: AssessmentBuilderInstance) {
    this.client = client
    this.assessmentBuilder = assessmentBuilder
  }

  /**
   * Save the san to the backend.
   */
  async save(): Promise<CreatedAssessment> {
    this.buildAssessmentAnswers()
    this.buildAssessmentData()
    const assessment = await this.assessmentBuilder.save()
    return this.mapToCreatedSan(assessment)
  }

  private buildAssessmentAnswers(): void {
    this.answers.forEach(answer => {
      this.assessmentBuilder.withAnswer(answer.question, answer.value)
    })
  }

  private buildAssessmentData(): void {
    this.data.forEach(d => {
      this.assessmentBuilder.withProperty(d.key, d.value)
    })
  }

  /**
   * Add multiple answers to assessment
   */
  withAnswers(answer: AnswerConfig[]): this {
    answer.forEach(a => this.answers.push(a))

    return this
  }

  /**
   * Add multiple data to assessment
   */
  withData(data: DataConfig[]): this {
    data.forEach(a => this.data.push(a))

    return this
  }

  /**
   * Sets the provided step codes as user submitted
   */
  withUserSubmittedSteps(stepCodes: string[]): this {
    this.withData(stepCodes.map(stepCode => ({ key: isUserSubmittedCode(stepCode), value: IsUserSubmitted.true })))

    return this
  }

  /**
   * Add a collection to the assessment
   */
  withCollectionItems(name: string, answer: AnswerConfig[]): this {

    this.assessmentBuilder.withCollection(name, (victimsCollection: CollectionBuilder) => {
      victimsCollection.withItem((victim: CollectionItemBuilder) => {
        answer.forEach(a => {
          victim.withAnswer(a.question, a.value)
        })
        return victim
      })

      return victimsCollection
    })

    return this
  }

  private mapToCreatedSan(assessment: CreatedAssessment): CreatedAssessment {
    return {
      uuid: assessment.uuid,
      collections: assessment.collections,
    }
  }
}
