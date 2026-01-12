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

/**
 * Generic builder for any assessment type.
 * Handles core AAP concepts: assessments, collections, items, answers, properties.
 *
 * Uses deferred execution - fluent calls build a definition tree,
 * then create() executes API calls via TestAapClient and threads UUIDs.
 */
export class AssessmentBuilder {
  private definition: AssessmentDefinition = {
    assessmentType: 'DEFAULT',
    formVersion: '1',
    identifiers: {},
    answers: {},
    properties: {},
    collections: [],
  }

  private user: User = { id: 'e2e-test', name: 'E2E_TEST' }

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
   * Set the CRN identifier. If not called, a random UUID will be generated.
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
   * Execute all API calls to create the assessment and its nested structure.
   * Wrapped in a Playwright test.step() for trace visibility.
   * Returns the created assessment with all UUIDs populated.
   */
  async create(client: TestAapApiClient): Promise<CreatedAssessment> {
    const stepName = `Create ${this.definition.assessmentType} assessment`

    return test.step(stepName, async () => {
      // Auto-generate CRN if not provided
      if (!this.definition.identifiers.CRN) {
        this.definition.identifiers.CRN = generateCrn()
      }

      // Phase 1: Create the assessment
      const createResult = await client.executeCommand<CreateAssessmentCommandResult>({
        type: 'CreateAssessmentCommand',
        assessmentType: this.definition.assessmentType,
        formVersion: this.definition.formVersion,
        identifiers: this.definition.identifiers,
        properties: this.definition.properties,
        user: this.user,
      })

      const assessmentUuid = createResult.assessmentUuid

      // Phase 2: Add assessment-level answers if any
      if (Object.keys(this.definition.answers).length > 0) {
        await client.executeCommand({
          type: 'UpdateAssessmentAnswersCommand',
          assessmentUuid,
          user: this.user,
          added: this.definition.answers,
          removed: [],
        })
      }

      // Phase 3: Create collections recursively
      const createdCollections: CreatedCollection[] = []

      for (const collectionDef of this.definition.collections) {
        // eslint-disable-next-line no-await-in-loop
        const created = await this.createCollection(client, assessmentUuid, collectionDef)
        createdCollections.push(created)
      }

      return {
        uuid: assessmentUuid,
        collections: createdCollections,
      }
    })
  }

  private async createCollection(
    client: TestAapApiClient,
    assessmentUuid: string,
    def: CollectionDefinition,
    parentItemUuid?: string,
  ): Promise<CreatedCollection> {
    // Create the collection itself
    const createResult = await client.executeCommand<CreateCollectionCommandResult>({
      type: 'CreateCollectionCommand',
      name: def.name,
      assessmentUuid,
      parentCollectionItemUuid: parentItemUuid,
      user: this.user,
    })

    const collectionUuid = createResult.collectionUuid

    // Create each item in this collection
    const createdItems: CreatedCollectionItem[] = []

    for (const itemDef of def.items) {
      // eslint-disable-next-line no-await-in-loop
      const created = await this.createCollectionItem(client, assessmentUuid, collectionUuid, itemDef)
      createdItems.push(created)
    }

    return {
      name: def.name,
      uuid: collectionUuid,
      items: createdItems,
    }
  }

  private async createCollectionItem(
    client: TestAapApiClient,
    assessmentUuid: string,
    collectionUuid: string,
    def: CollectionItemDefinition,
  ): Promise<CreatedCollectionItem> {
    // Create the item
    const createResult = await client.executeCommand<AddCollectionItemCommandResult>({
      type: 'AddCollectionItemCommand',
      collectionUuid,
      assessmentUuid,
      answers: def.answers,
      properties: def.properties,
      user: this.user,
    })

    const collectionItemUuid = createResult.collectionItemUuid

    // Create any nested collections under this item
    const nestedCollections: CreatedCollection[] = []

    for (const nestedDef of def.collections) {
      // eslint-disable-next-line no-await-in-loop
      const created = await this.createCollection(client, assessmentUuid, nestedDef, collectionItemUuid)
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
