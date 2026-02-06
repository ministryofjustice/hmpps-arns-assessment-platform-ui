// eslint-disable-next-line max-classes-per-file
import { test } from '@playwright/test'
import type { User } from '../../server/interfaces/user'
import type { SingleValue, MultiValue } from '../../server/interfaces/aap-api/dataModel'
import type {
  CreateAssessmentCommandResult,
  CreateCollectionCommandResult,
  AddCollectionItemCommandResult,
} from '../../server/interfaces/aap-api/commandResult'
import type {
  AssessmentDefinition,
  CollectionDefinition,
  CollectionItemDefinition,
  CreatedAssessment,
  CreatedCollection,
  CreatedCollectionItem,
} from './types'
import type { TestAapApiClient } from '../support/apis/TestAapApiClient'
import { generateUserId } from './utils'

const single = (value: string): SingleValue => ({ type: 'Single', value })
const multi = (values: string[]): MultiValue => ({ type: 'Multi', values })

/**
 * Generate a random CRN in the format: letter + 6 digits (e.g., X123456)
 */
function generateCrn(): string {
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
  const digits = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0')

  return `${letter}${digits}`
}

type BuilderMode = 'fresh' | 'extend'

/**
 * Factory for creating AssessmentBuilder instances with a bound client.
 *
 * @example
 * // Create a new assessment
 * await AssessmentBuilder(client).fresh()
 *   .ofType('SENTENCE_PLAN')
 *   .forCrn('X123456')
 *   .withCollection('GOALS', c => c.withItem(...))
 *   .save()
 *
 * @example
 * // Extend an existing assessment (e.g., from coordinator)
 * await AssessmentBuilder(client).extend(association.sentencePlanId)
 *   .withCollection('GOALS', c => c.withItem(...))
 *   .save()
 *
 * @example
 * // Use via fixture
 * test('my test', async ({ assessmentBuilder }) => {
 *   await assessmentBuilder.fresh().ofType('E2E_TEST').save()
 * })
 */
export function AssessmentBuilder(client: TestAapApiClient): AssessmentBuilderFactory {
  return {
    fresh: () => new AssessmentBuilderInstance(client, 'fresh'),
    extend: (assessmentUuid: string) => new AssessmentBuilderInstance(client, 'extend', assessmentUuid),
  }
}

export interface AssessmentBuilderFactory {
  fresh: () => AssessmentBuilderInstance
  extend: (assessmentUuid: string) => AssessmentBuilderInstance
}

/**
 * Generic builder for any assessment type.
 * Handles core AAP concepts: assessments, collections, items, answers, properties.
 */
export class AssessmentBuilderInstance {
  private readonly client: TestAapApiClient

  private readonly mode: BuilderMode

  private existingAssessmentUuid: string | undefined

  private definition: AssessmentDefinition = {
    assessmentType: 'DEFAULT',
    formVersion: '1',
    identifiers: {},
    answers: {},
    properties: {},
    collections: [],
  }

  // Generate unique user ID to avoid "duplicate key" errors in parallel tests
  private user: User = { id: generateUserId(), name: 'E2E_TEST', authSource: 'HMPPS_AUTH' }

  constructor(client: TestAapApiClient, mode: BuilderMode, existingAssessmentUuid?: string) {
    this.client = client
    this.mode = mode
    this.existingAssessmentUuid = existingAssessmentUuid
  }

  /**
   * Set the assessment type (e.g., 'SENTENCE_PLAN')
   */
  ofType(assessmentType: string): this {
    this.definition.assessmentType = assessmentType

    return this
  }

  /**
   * Set the form version
   */
  withFormVersion(version: string): this {
    this.definition.formVersion = version

    return this
  }

  /**
   * Set the CRN identifier. If not called, a random CRN will be generated.
   */
  forCrn(crn: string): this {
    this.definition.identifiers.CRN = crn

    return this
  }

  /**
   * Set a custom identifier
   */
  withIdentifier(type: string, value: string): this {
    this.definition.identifiers[type] = value

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
   * Add an assessment-level answer
   */
  withAnswer(code: string, value: string | string[]): this {
    this.definition.answers[code] = Array.isArray(value) ? multi(value) : single(value)

    return this
  }

  /**
   * Add an assessment-level property
   */
  withProperty(key: string, value: string | string[]): this {
    this.definition.properties[key] = Array.isArray(value) ? multi(value) : single(value)

    return this
  }

  /**
   * Add a collection to the assessment
   */
  withCollection(name: string, configure: (collection: CollectionBuilder) => CollectionBuilder): this {
    const collectionBuilder = new CollectionBuilder(name)
    this.definition.collections.push(configure(collectionBuilder).build())

    return this
  }

  /**
   * Save the assessment to the backend.
   * - For fresh(): creates a new assessment then populates it
   * - For extend(): populates an existing assessment
   */
  async save(): Promise<CreatedAssessment> {
    const stepName =
      this.mode === 'fresh'
        ? `Create ${this.definition.assessmentType} assessment`
        : `Extend assessment ${this.existingAssessmentUuid}`

    return test.step(stepName, async () => {
      const assessmentUuid = await this.resolveAssessmentUuid()

      if (Object.keys(this.definition.answers).length > 0) {
        await this.client.executeCommand({
          type: 'UpdateAssessmentAnswersCommand',
          assessmentUuid,
          user: this.user,
          added: this.definition.answers,
          removed: [],
        })
      }

      const createdCollections: CreatedCollection[] = []

      for (const collectionDef of this.definition.collections) {
        // eslint-disable-next-line no-await-in-loop
        const created = await this.createCollection(assessmentUuid, collectionDef)
        createdCollections.push(created)
      }

      return {
        uuid: assessmentUuid,
        collections: createdCollections,
      }
    })
  }

  private async resolveAssessmentUuid(): Promise<string> {
    if (this.mode === 'extend') {
      if (!this.existingAssessmentUuid) {
        throw new Error('extend() requires an assessment UUID')
      }

      return this.existingAssessmentUuid
    }

    if (!this.definition.identifiers.CRN) {
      this.definition.identifiers.CRN = generateCrn()
    }

    const createResult = await this.client.executeCommand<CreateAssessmentCommandResult>({
      type: 'CreateAssessmentCommand',
      assessmentType: this.definition.assessmentType,
      formVersion: this.definition.formVersion,
      identifiers: this.definition.identifiers,
      properties: this.definition.properties,
      user: this.user,
    })

    return createResult.assessmentUuid
  }

  private async createCollection(
    assessmentUuid: string,
    def: CollectionDefinition,
    parentItemUuid?: string,
  ): Promise<CreatedCollection> {
    const createResult = await this.client.executeCommand<CreateCollectionCommandResult>({
      type: 'CreateCollectionCommand',
      name: def.name,
      assessmentUuid,
      parentCollectionItemUuid: parentItemUuid,
      user: this.user,
    })

    const collectionUuid = createResult.collectionUuid
    const createdItems: CreatedCollectionItem[] = []

    for (const itemDef of def.items) {
      // eslint-disable-next-line no-await-in-loop
      const created = await this.createCollectionItem(assessmentUuid, collectionUuid, itemDef)
      createdItems.push(created)
    }

    return {
      name: def.name,
      uuid: collectionUuid,
      items: createdItems,
    }
  }

  private async createCollectionItem(
    assessmentUuid: string,
    collectionUuid: string,
    def: CollectionItemDefinition,
  ): Promise<CreatedCollectionItem> {
    const createResult = await this.client.executeCommand<AddCollectionItemCommandResult>({
      type: 'AddCollectionItemCommand',
      collectionUuid,
      assessmentUuid,
      answers: def.answers,
      properties: def.properties,
      user: this.user,
    })

    const collectionItemUuid = createResult.collectionItemUuid
    const nestedCollections: CreatedCollection[] = []

    for (const nestedDef of def.collections) {
      // eslint-disable-next-line no-await-in-loop
      const created = await this.createCollection(assessmentUuid, nestedDef, collectionItemUuid)
      nestedCollections.push(created)
    }

    return {
      uuid: collectionItemUuid,
      collections: nestedCollections,
    }
  }
}

/**
 * Builder for defining a collection and its items
 */
export class CollectionBuilder {
  private readonly definition: CollectionDefinition

  constructor(name: string) {
    this.definition = { name, items: [] }
  }

  /**
   * Add an item to this collection
   */
  withItem(configure: (item: CollectionItemBuilder) => CollectionItemBuilder): this {
    const itemBuilder = new CollectionItemBuilder()
    this.definition.items.push(configure(itemBuilder).build())

    return this
  }

  build(): CollectionDefinition {
    return this.definition
  }
}

/**
 * Builder for defining a collection item (answers, properties, nested collections)
 */
export class CollectionItemBuilder {
  private definition: CollectionItemDefinition = {
    answers: {},
    properties: {},
    collections: [],
  }

  /**
   * Add an answer to this item
   */
  withAnswer(code: string, value: string | string[]): this {
    this.definition.answers[code] = Array.isArray(value) ? multi(value) : single(value)

    return this
  }

  /**
   * Add a property to this item
   */
  withProperty(key: string, value: string | string[]): this {
    this.definition.properties[key] = Array.isArray(value) ? multi(value) : single(value)

    return this
  }

  /**
   * Add a nested collection under this item
   */
  withCollection(name: string, configure: (collection: CollectionBuilder) => CollectionBuilder): this {
    const collectionBuilder = new CollectionBuilder(name)
    this.definition.collections.push(configure(collectionBuilder).build())

    return this
  }

  build(): CollectionItemDefinition {
    return this.definition
  }
}
