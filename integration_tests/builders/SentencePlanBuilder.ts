import type { Commands } from '@server/interfaces/aap-api/command'
import { AgreementStatus } from '@server/forms/sentence-plan/effects'
import { AssessmentBuilder, CollectionBuilder, CollectionItemBuilder } from './AssessmentBuilder'
import type { AssessmentBuilderInstance } from './AssessmentBuilder'
import type { TestAapApiClient } from '../support/apis/TestAapApiClient'
import type {
  CreatedAssessment,
  CreatedCollectionItem,
  GoalStatus,
  PlanAgreementStatus,
  PlanAgreementConfig,
  GoalConfig,
  NoteConfig,
} from './types'
import { generateUserId } from './utils'

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
      new SentencePlanBuilderInstance(
        client,
        AssessmentBuilder(client).fresh().ofType('SENTENCE_PLAN').withFormVersion('1.0'),
      ),
    extend: (sentencePlanId: string) =>
      new SentencePlanBuilderInstance(client, AssessmentBuilder(client).extend(sentencePlanId)),
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
  private readonly client: TestAapApiClient

  private readonly assessmentBuilder: AssessmentBuilderInstance

  private readonly goals: GoalConfig[] = []

  private agreementStatus: AgreementStatus | PlanAgreementStatus | undefined

  constructor(client: TestAapApiClient, assessmentBuilder: AssessmentBuilderInstance) {
    this.client = client
    this.assessmentBuilder = assessmentBuilder
  }

  /**
   * Set the CRN identifier (only relevant for fresh plans)
   */
  forCrn(crn: string): this {
    this.assessmentBuilder.forCrn(crn)

    return this
  }

  private planAgreements: PlanAgreementConfig[] = []

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
   * Add multiple plan agreements with full configuration.
   * Agreements are created in order (first = oldest, last = most recent).
   * Use dateOffset to control the timing of each agreement.
   */
  withPlanAgreements(agreements: PlanAgreementConfig[]): this {
    this.planAgreements = agreements
    return this
  }

  /**
   * Set the plan agreement status ('AGREED', 'DO_NOT_AGREE', 'COULD_NOT_ANSWER', 'UPDATED_AGREED', 'UPDATED_DO_NOT_AGREE')
   */
  withAgreementStatus(status: AgreementStatus | PlanAgreementStatus): this {
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
    const result = this.mapToCreatedSentencePlan(assessment)

    await this.emitGoalLifecycleTimelineEvents(assessment.uuid, result.goals)

    return result
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
    // Handle multiple plan agreements (for plan history)
    if (this.planAgreements.length > 0) {
      const questionMap: Record<PlanAgreementStatus, string> = {
        AGREED: 'yes',
        DO_NOT_AGREE: 'no',
        COULD_NOT_ANSWER: 'could_not_answer',
        UPDATED_AGREED: 'yes',
        UPDATED_DO_NOT_AGREE: 'no',
      }

      this.assessmentBuilder.withCollection('PLAN_AGREEMENTS', (collection: CollectionBuilder) => {
        this.planAgreements.forEach(agreement => {
          const date = new Date(Date.now() + (agreement.dateOffset ?? 0)).toISOString()

          collection.withItem((item: CollectionItemBuilder) => {
            item
              .withAnswer('agreement_question', questionMap[agreement.status])
              .withProperty('status', agreement.status)
              .withProperty('status_date', date)

            if (agreement.createdBy) {
              item.withAnswer('created_by', agreement.createdBy)
            }
            if (agreement.notes) {
              item.withAnswer('notes', agreement.notes)
            }
            if (agreement.detailsNo) {
              item.withAnswer('details_no', agreement.detailsNo)
            }
            if (agreement.detailsCouldNotAnswer) {
              item.withAnswer('details_could_not_answer', agreement.detailsCouldNotAnswer)
            }

            return item
          })
        })

        return collection
      })

      return
    }

    // Handle single agreement status (legacy API)
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

    if (config.achievedBy) {
      goalItem.withProperty('achieved_by', config.achievedBy)
    }

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

  /**
   * Emit timeline events for goal lifecycle changes (achieved, removed, readded).
   *
   * These mirror the real app's behavior where markGoalAsAchieved, markGoalAsRemoved,
   * and readdGoalToPlan emit timeline events via UpdateCollectionItemPropertiesCommand.
   * The plan history page reads these events via loadPlanTimeline.
   */
  private async emitGoalLifecycleTimelineEvents(assessmentUuid: string, createdGoals: CreatedGoal[]): Promise<void> {
    // Generate unique user ID to avoid "duplicate key" errors in parallel tests
    const user = { id: generateUserId(), name: 'E2E_TEST', authSource: 'HMPPS_AUTH' as const }

    for (let i = 0; i < this.goals.length; i++) {
      const goalConfig = this.goals[i]
      const createdGoal = createdGoals[i]

      if (createdGoal) {
        const timelineEvents = this.buildGoalTimelineEvents(goalConfig, createdGoal.uuid)

        for (const timeline of timelineEvents) {
          const command: Commands = {
            type: 'UpdateCollectionItemPropertiesCommand',
            collectionItemUuid: createdGoal.uuid,
            added: {},
            removed: [],
            timeline,
            assessmentUuid,
            user,
          }
          // eslint-disable-next-line no-await-in-loop
          await this.client.executeCommand(command)
        }
      }
    }
  }

  private buildGoalTimelineEvents(
    goalConfig: GoalConfig,
    goalUuid: string,
  ): Array<{ type: string; data: Record<string, unknown> }> {
    const events: Array<{ type: string; data: Record<string, unknown> }> = []

    // Build timeline events from notes
    if (goalConfig.notes) {
      for (const note of goalConfig.notes) {
        const event = this.noteToTimelineEvent(note, goalConfig, goalUuid)
        if (event) events.push(event)
      }
    }

    // If ACHIEVED status but no ACHIEVED note, still emit a GOAL_ACHIEVED event
    if (goalConfig.status === 'ACHIEVED' && !events.some(e => e.type === 'GOAL_ACHIEVED')) {
      events.push({
        type: 'GOAL_ACHIEVED',
        data: {
          goalUuid,
          goalTitle: goalConfig.title,
          achievedBy: goalConfig.achievedBy || 'E2E Test',
        },
      })
    }

    // If REMOVED status but no REMOVED note, still emit a GOAL_REMOVED event
    if (goalConfig.status === 'REMOVED' && !events.some(e => e.type === 'GOAL_REMOVED')) {
      events.push({
        type: 'GOAL_REMOVED',
        data: {
          goalUuid,
          goalTitle: goalConfig.title,
          removedBy: 'E2E Test',
        },
      })
    }

    return events
  }

  private noteToTimelineEvent(
    note: NoteConfig,
    goalConfig: GoalConfig,
    goalUuid: string,
  ): { type: string; data: Record<string, unknown> } | undefined {
    switch (note.type) {
      case 'ACHIEVED':
        return {
          type: 'GOAL_ACHIEVED',
          data: {
            goalUuid,
            goalTitle: goalConfig.title,
            achievedBy: note.createdBy || goalConfig.achievedBy || 'E2E Test',
            notes: note.note?.trim() || undefined,
          },
        }
      case 'REMOVED':
        return {
          type: 'GOAL_REMOVED',
          data: {
            goalUuid,
            goalTitle: goalConfig.title,
            removedBy: note.createdBy || 'E2E Test',
            reason: note.note?.trim() || undefined,
          },
        }
      case 'READDED':
        return {
          type: 'GOAL_READDED',
          data: {
            goalUuid,
            goalTitle: goalConfig.title,
            readdedBy: note.createdBy || 'E2E Test',
            reason: note.note?.trim() || undefined,
          },
        }
      default:
        return undefined
    }
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
