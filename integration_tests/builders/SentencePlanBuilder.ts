import { test } from '@playwright/test'
import type { User } from '../../server/interfaces/user'
import type { SingleValue, MultiValue } from '../../server/interfaces/aap-api/dataModel'
import type {
  CreateCollectionCommandResult,
  AddCollectionItemCommandResult,
} from '../../server/interfaces/aap-api/commandResult'
import { AssessmentBuilder, CollectionItemBuilder } from './AssessmentBuilder'
import type { TestAapApiClient } from '../support/apis/TestAapApiClient'
import type { CreatedAssessment, CreatedCollectionItem } from './types'

/**
 * Goal status enum matching the form-engine types
 */
export type GoalStatus = 'ACTIVE' | 'FUTURE'

/**
 * Step status enum matching the form-engine types
 */
export type StepStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'

/**
 * Valid area of need slugs
 */
export type AreaOfNeedSlug =
  | 'accommodation'
  | 'employment-and-education'
  | 'finances'
  | 'drug-use'
  | 'alcohol-use'
  | 'health-and-wellbeing'
  | 'personal-relationships-and-community'
  | 'thinking-behaviours-and-attitudes'

/**
 * Step configuration for test setup
 */
export interface StepConfig {
  actor: string
  description: string
  status?: StepStatus
}

/**
 * Goal configuration for test setup
 */
export interface GoalConfig {
  title: string
  areaOfNeed: AreaOfNeedSlug | string
  status?: GoalStatus
  targetDate?: string
  relatedAreasOfNeed?: string[]
  steps?: StepConfig[]
}

/**
 * Created sentence plan with typed goal information
 */
export interface CreatedSentencePlan extends CreatedAssessment {
  crn: string
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

const single = (value: string): SingleValue => ({ type: 'Single', value })
const multi = (values: string[]): MultiValue => ({ type: 'Multi', values })

/**
 * Fluent builder for creating SENTENCE_PLAN assessments with goals and steps.
 */
export class SentencePlanBuilder {
  private readonly goals: GoalConfig[] = []

  private crn: string | undefined

  private user: User = { id: 'e2e-test', name: 'E2E_TEST' }

  /**
   * Set a specific CRN for this sentence plan.
   * Only used with create() - if not called, a random CRN will be generated.
   */
  forCrn(crn: string): this {
    this.crn = crn
    return this
  }

  /**
   * Set the user context for API calls
   */
  asUser(user: User): this {
    this.user = user
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
   * Create a NEW sentence plan assessment with the configured goals.
   * Returns the created assessment with goals and steps.
   */
  async create(client: TestAapApiClient): Promise<CreatedSentencePlan> {
    // Generate CRN if not provided
    if (!this.crn) {
      const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
      const digits = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0')
      this.crn = `${letter}${digits}`
    }

    const builder = new AssessmentBuilder().ofType('SENTENCE_PLAN').withFormVersion('1.0').forCrn(this.crn)

    // Build the GOALS collection with all goals
    if (this.goals.length > 0) {
      builder.withCollection('GOALS', goalsCollection => {
        this.goals.forEach(goalConfig => {
          goalsCollection.withItem(goalItem => this.buildGoalItemForCreate(goalItem, goalConfig))
        })
        return goalsCollection
      })
    } else {
      // Create empty GOALS collection for consistency
      builder.withCollection('GOALS', goalsCollection => goalsCollection)
    }

    const assessment = await builder.create(client)

    // Map created collections to typed goals
    const goalsCollection = assessment.collections.find(c => c.name === 'GOALS')
    const createdGoals: CreatedGoal[] =
      goalsCollection?.items.map((item, index) => {
        const goalConfig = this.goals[index]
        const stepsCollection = item.collections.find(c => c.name === 'STEPS')

        return {
          uuid: item.uuid,
          collections: item.collections,
          title: goalConfig?.title ?? '',
          status: goalConfig?.status ?? 'ACTIVE',
          steps:
            stepsCollection?.items.map((stepItem, stepIndex) => ({
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
      crn: this.crn,
      goals: createdGoals,
    }
  }

  /**
   * Add goals to an EXISTING assessment.
   * Use this for the "reverse flow" pattern where an assessment already exists.
   *
   * @param assessmentUuid The UUID of the existing assessment
   * @param client The AAP API client
   * @returns Array of created goals with their UUIDs
   */
  async addTo(assessmentUuid: string, client: TestAapApiClient): Promise<CreatedGoal[]> {
    return test.step(`Add ${this.goals.length} goal(s) to assessment`, async () => {
      // Create the GOALS collection
      const goalsCollectionResult = await client.executeCommand<CreateCollectionCommandResult>({
        type: 'CreateCollectionCommand',
        name: 'GOALS',
        assessmentUuid,
        user: this.user,
      })

      const goalsCollectionUuid = goalsCollectionResult.collectionUuid

      // Create each goal
      const createdGoals: CreatedGoal[] = []

      for (const goalConfig of this.goals) {
        // eslint-disable-next-line no-await-in-loop
        const createdGoal = await this.createGoalItem(client, assessmentUuid, goalsCollectionUuid, goalConfig)
        createdGoals.push(createdGoal)
      }

      return createdGoals
    })
  }

  /**
   * Build a goal item for the create() path (using CollectionItemBuilder)
   */
  private buildGoalItemForCreate(goalItem: CollectionItemBuilder, config: GoalConfig): CollectionItemBuilder {
    const status = config.status ?? 'ACTIVE'
    const now = new Date().toISOString()

    // Set goal answers
    goalItem
      .withAnswer('title', config.title)
      .withAnswer('area_of_need', config.areaOfNeed)
      .withAnswer('related_areas_of_need', config.relatedAreasOfNeed ?? [])

    // Only set target date for ACTIVE goals
    if (config.targetDate) {
      goalItem.withAnswer('target_date', config.targetDate)
    }

    // Set goal properties
    goalItem.withProperty('status', status).withProperty('status_date', now)

    // Add STEPS collection if steps exist
    if (config.steps && config.steps.length > 0) {
      goalItem.withCollection('STEPS', stepsCollection => {
        config.steps!.forEach(stepConfig => {
          stepsCollection.withItem(stepItem => this.buildStepItemForCreate(stepItem, stepConfig))
        })
        return stepsCollection
      })
    }

    return goalItem
  }

  /**
   * Build a step item for the create() path (using CollectionItemBuilder)
   */
  private buildStepItemForCreate(stepItem: CollectionItemBuilder, config: StepConfig): CollectionItemBuilder {
    const now = new Date().toISOString()

    stepItem
      .withAnswer('actor', config.actor)
      .withAnswer('description', config.description)
      .withAnswer('status', config.status ?? 'NOT_STARTED')
      .withProperty('status_date', now)

    return stepItem
  }

  /**
   * Create a goal item for the addTo() path (direct API calls)
   */
  private async createGoalItem(
    client: TestAapApiClient,
    assessmentUuid: string,
    goalsCollectionUuid: string,
    config: GoalConfig,
  ): Promise<CreatedGoal> {
    const status = config.status ?? 'ACTIVE'
    const now = new Date().toISOString()

    // Build goal answers
    const answers: Record<string, SingleValue | MultiValue> = {
      title: single(config.title),
      area_of_need: single(config.areaOfNeed),
      related_areas_of_need: multi(config.relatedAreasOfNeed ?? []),
    }

    if (config.targetDate) {
      answers.target_date = single(config.targetDate)
    }

    // Build goal properties
    const properties: Record<string, SingleValue | MultiValue> = {
      status: single(status),
      status_date: single(now),
    }

    // Create the goal item
    const goalResult = await client.executeCommand<AddCollectionItemCommandResult>({
      type: 'AddCollectionItemCommand',
      collectionUuid: goalsCollectionUuid,
      assessmentUuid,
      answers,
      properties,
      user: this.user,
    })

    const goalItemUuid = goalResult.collectionItemUuid

    // Create steps if any
    const createdSteps: CreatedStep[] = []

    if (config.steps && config.steps.length > 0) {
      // Create STEPS collection under this goal
      const stepsCollectionResult = await client.executeCommand<CreateCollectionCommandResult>({
        type: 'CreateCollectionCommand',
        name: 'STEPS',
        assessmentUuid,
        parentCollectionItemUuid: goalItemUuid,
        user: this.user,
      })

      const stepsCollectionUuid = stepsCollectionResult.collectionUuid

      // Create each step
      for (const stepConfig of config.steps) {
        // eslint-disable-next-line no-await-in-loop
        const createdStep = await this.createStepItem(client, assessmentUuid, stepsCollectionUuid, stepConfig)
        createdSteps.push(createdStep)
      }
    }

    return {
      uuid: goalItemUuid,
      collections: [],
      title: config.title,
      status,
      steps: createdSteps,
    }
  }

  /**
   * Create a step item for the addTo() path (direct API calls)
   */
  private async createStepItem(
    client: TestAapApiClient,
    assessmentUuid: string,
    stepsCollectionUuid: string,
    config: StepConfig,
  ): Promise<CreatedStep> {
    const now = new Date().toISOString()

    const stepResult = await client.executeCommand<AddCollectionItemCommandResult>({
      type: 'AddCollectionItemCommand',
      collectionUuid: stepsCollectionUuid,
      assessmentUuid,
      answers: {
        actor: single(config.actor),
        description: single(config.description),
        status: single(config.status ?? 'NOT_STARTED'),
      },
      properties: {
        status_date: single(now),
      },
      user: this.user,
    })

    return {
      uuid: stepResult.collectionItemUuid,
      collections: [],
      actor: config.actor,
      description: config.description,
    }
  }
}
