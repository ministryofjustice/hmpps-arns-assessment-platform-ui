import { AssessmentBuilder, CollectionBuilder, CollectionItemBuilder } from './AssessmentBuilder'
import type { AssessmentBuilderInstance } from './AssessmentBuilder'
import type { TestAapApiClient } from '../support/apis/TestAapApiClient'
import type { CreatedAssessment, CreatedCollectionItem, GoalStatus, GoalConfig } from './types'
import { AgreementStatus } from '../../server/forms/sentence-plan/effects'

/**
 * Created sentence plan with typed goal information
 */
export interface CreatedSentencePlan extends CreatedAssessment {
  goals: CreatedGoal[]
}

/**
 * Created goal with step information
 */
export interface CreatedGoal extends CreatedCollectionItem {
  title: string
  status: GoalStatus
  steps: CreatedStep[]
}

/**
 * Created step
 */
export interface CreatedStep extends CreatedCollectionItem {
  actor: string
  description: string
}

/**
 * Factory for creating SentencePlanBuilder instances with a bound client.
 *
 * @example
 * // Create a fresh sentence plan (no coordinator)
 * await SentencePlanBuilder(client).fresh()
 *   .forCrn('X123456')
 *   .withGoals(currentGoals(2))
 *   .withAgreementStatus('AGREED')
 *   .save()
 *
 * @example
 * // Extend an existing sentence plan (from coordinator)
 * await SentencePlanBuilder(client).extend(association.sentencePlanId)
 *   .withGoals(currentGoals(2))
 *   .save()
 *
 * @example
 * // Use via fixture
 * test('my test', async ({ sentencePlanBuilder }) => {
 *   await sentencePlanBuilder.extend(id).withGoals(currentGoals(2)).save()
 * })
 */
export function SentencePlanBuilder(client: TestAapApiClient): SentencePlanBuilderFactory {
  return {
    fresh: () =>
      new SentencePlanBuilderInstance(AssessmentBuilder(client).fresh().ofType('SENTENCE_PLAN').withFormVersion('1.0')),
    extend: (sentencePlanId: string) =>
      new SentencePlanBuilderInstance(AssessmentBuilder(client).extend(sentencePlanId)),
  }
}

export interface SentencePlanBuilderFactory {
  fresh: () => SentencePlanBuilderInstance
  extend: (sentencePlanId: string) => SentencePlanBuilderInstance
}

/**
 * Fluent builder for SENTENCE_PLAN assessments with goals and steps.
 */
export class SentencePlanBuilderInstance {
  private readonly assessmentBuilder: AssessmentBuilderInstance

  private readonly goals: GoalConfig[] = []

  private agreementStatus: AgreementStatus | undefined

  constructor(assessmentBuilder: AssessmentBuilderInstance) {
    this.assessmentBuilder = assessmentBuilder
  }

  /**
   * Set the CRN identifier (only relevant for fresh plans)
   */
  forCrn(crn: string): this {
    this.assessmentBuilder.forCrn(crn)

    return this
  }

  /**
   * Add a goal to the sentence plan
   */
  withGoal(config: GoalConfig): this {
    this.goals.push(config)

    return this
  }

  /**
   * Add multiple goals to the sentence plan
   */
  withGoals(configs: GoalConfig[]): this {
    configs.forEach(config => this.goals.push(config))

    return this
  }

  /**
   * Set the plan agreement status ('AGREED', 'DO_NOT_AGREE', 'COULD_NOT_ANSWER')
   */
  withAgreementStatus(status: AgreementStatus): this {
    this.agreementStatus = status

    return this
  }

  /**
   * Save the sentence plan to the backend.
   */
  async save(): Promise<CreatedSentencePlan> {
    this.buildGoalsCollection()
    this.buildAgreementCollection()

    const assessment = await this.assessmentBuilder.save()

    return this.mapToCreatedSentencePlan(assessment)
  }

  private buildGoalsCollection(): void {
    this.assessmentBuilder.withCollection('GOALS', (goalsCollection: CollectionBuilder) => {
      this.goals.forEach(goalConfig => {
        goalsCollection.withItem((goalItem: CollectionItemBuilder) => this.buildGoalItem(goalItem, goalConfig))
      })

      return goalsCollection
    })
  }

  private buildAgreementCollection(): void {
    if (!this.agreementStatus) {
      return
    }

    const now = new Date().toISOString()
    const questionMap: Record<string, string> = {
      AGREED: 'yes',
      DO_NOT_AGREE: 'no',
      COULD_NOT_ANSWER: 'could_not_answer',
    }

    this.assessmentBuilder.withCollection('PLAN_AGREEMENTS', (collection: CollectionBuilder) =>
      collection.withItem((item: CollectionItemBuilder) =>
        item
          .withAnswer('agreement_question', questionMap[this.agreementStatus!])
          .withProperty('status', this.agreementStatus!)
          .withProperty('status_date', now),
      ),
    )
  }

  private buildGoalItem(goalItem: CollectionItemBuilder, config: GoalConfig): CollectionItemBuilder {
    const status = config.status ?? 'ACTIVE'
    const now = new Date().toISOString()

    goalItem
      .withAnswer('title', config.title)
      .withAnswer('area_of_need', config.areaOfNeed)
      .withAnswer('related_areas_of_need', config.relatedAreasOfNeed ?? [])
      .withProperty('status', status)
      .withProperty('status_date', now)

    if (config.targetDate) {
      goalItem.withAnswer('target_date', config.targetDate)
    }

    if (config.steps && config.steps.length > 0) {
      goalItem.withCollection('STEPS', (stepsCollection: CollectionBuilder) => {
        config.steps!.forEach(stepConfig => {
          stepsCollection.withItem((stepItem: CollectionItemBuilder) => {
            const stepNow = new Date().toISOString()

            return stepItem
              .withAnswer('actor', stepConfig.actor)
              .withAnswer('description', stepConfig.description)
              .withAnswer('status', stepConfig.status ?? 'NOT_STARTED')
              .withProperty('status_date', stepNow)
          })
        })

        return stepsCollection
      })
    }

    if (config.notes && config.notes.length > 0) {
      goalItem.withCollection('NOTES', (notesCollection: CollectionBuilder) => {
        config.notes!.forEach(noteConfig => {
          notesCollection.withItem((noteItem: CollectionItemBuilder) => {
            const noteNow = new Date().toISOString()

            return noteItem
              .withAnswer('note', noteConfig.note)
              .withAnswer('created_by', noteConfig.createdBy ?? 'E2E Test')
              .withProperty('type', noteConfig.type)
              .withProperty('created_at', noteNow)
          })
        })

        return notesCollection
      })
    }

    return goalItem
  }

  private mapToCreatedSentencePlan(assessment: CreatedAssessment): CreatedSentencePlan {
    const goalsCollection = assessment.collections.find(c => c.name === 'GOALS')

    const createdGoals: CreatedGoal[] =
      goalsCollection?.items.map((item: CreatedCollectionItem, index: number) => {
        const goalConfig = this.goals[index]
        const stepsCollection = item.collections.find(c => c.name === 'STEPS')

        return {
          uuid: item.uuid,
          collections: item.collections,
          title: goalConfig?.title ?? '',
          status: goalConfig?.status ?? 'ACTIVE',
          steps:
            stepsCollection?.items.map((stepItem: CreatedCollectionItem, stepIndex: number) => ({
              uuid: stepItem.uuid,
              collections: stepItem.collections,
              actor: goalConfig?.steps?.[stepIndex]?.actor ?? '',
              description: goalConfig?.steps?.[stepIndex]?.description ?? '',
            })) ?? [],
        }
      }) ?? []

    return {
      uuid: assessment.uuid,
      collections: assessment.collections,
      goals: createdGoals,
    }
  }
}
