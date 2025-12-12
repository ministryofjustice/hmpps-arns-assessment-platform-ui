import { defineEffectsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
import EffectFunctionContext from '@form-engine/core/ast/thunks/EffectFunctionContext'
import { ChainableRef } from '@form-engine/form/builders/types'
import { AnswerHistory, AnswerSource } from '@form-engine/core/ast/thunks/types'
import AssessmentPlatformApiClient from '../../data/assessmentPlatformApiClient'
import {
  AddCollectionItemCommand,
  CreateAssessmentCommand,
  CreateCollectionCommand,
  UpdateAssessmentAnswersCommand,
  UpdateCollectionItemAnswersCommand,
} from '../../interfaces/aap-api/command'
import { Answers, Values } from '../../interfaces/aap-api/dataModel'
import { AssessmentVersionQuery } from '../../interfaces/aap-api/query'
import { AssessmentVersionQueryResult } from '../../interfaces/aap-api/queryResult'
import { CreateAssessmentCommandResult } from '../../interfaces/aap-api/commandResult'

interface AnswerDelta {
  added: Record<string, { value: unknown }>
  removed: string[]
}

/**
 * Calculate answer delta from mutation histories
 *
 * Finds answers that were modified during this request by looking for
 * mutations with 'post', 'processed', or 'action' sources.
 *
 * - Added: Fields with user input that have a non-empty value
 * - Removed: Fields with user input that are now empty but previously had a loaded value
 */
function calculateAnswerDelta(histories: Record<string, AnswerHistory>): AnswerDelta {
  const userInputSources: AnswerSource[] = ['post', 'processed', 'action']
  const added: Record<string, { value: unknown }> = {}
  const removed: string[] = []

  Object.entries(histories).forEach(([code, history]) => {
    const hasUserInput = history.mutations.some(m => userInputSources.includes(m.source))

    if (!hasUserInput) {
      return
    }

    const isEmpty = history.current === '' || history.current === undefined || history.current === null

    if (isEmpty) {
      const wasLoaded = history.mutations.some(m => m.source === 'load')

      if (wasLoaded) {
        removed.push(code)
      }
    } else {
      added[code] = { value: history.current }
    }
  })

  return { added, removed }
}

/**
 * Dependencies for food business registration effects
 */
export interface FoodBusinessEffectsDeps {
  api: AssessmentPlatformApiClient
}

/**
 * Custom effects for food business registration form
 *
 * These effects handle:
 * - Data initialization (menu items, operating hours)
 * - External API simulation (postcode lookup)
 * - Collection CRUD operations (menu items)
 * - Submission orchestration (final registration)
 *
 * Usage:
 * - Import `FoodBusinessEffects` for step definitions (no deps needed)
 * - Import `createFoodBusinessEffectsRegistry` for app.ts (pass real deps)
 */
export const { effects: FoodBusinessEffects, createRegistry: createFoodBusinessEffectsRegistry } =
  defineEffectsWithDeps<FoodBusinessEffectsDeps>()({
    /**
     * Create a new assessment or load existing one from API
     * Stores the full assessment data (including collections) in context data
     */
    createOrLoadAssessment: deps => async (context: EffectFunctionContext) => {
      const session = context.getSession()
      const user = context.getState('user')
      let assessmentUuid = session?.assessmentUuid

      // Create new assessment if none exists
      if (!assessmentUuid) {
        const command: CreateAssessmentCommand = {
          type: 'CreateAssessmentCommand',
          assessmentType: 'FoodBusinessRegistration',
          formVersion: '1.0.0',
          user,
        }

        const response = await deps.api.executeCommands({ commands: [command] })
        const result = response.commands[0].result as CreateAssessmentCommandResult

        assessmentUuid = result.assessmentUuid
        session.assessmentUuid = assessmentUuid
      }

      // Query the full assessment data
      const query: AssessmentVersionQuery = {
        type: 'AssessmentVersionQuery',
        assessmentIdentifier: { type: 'UUID', uuid: assessmentUuid },
        user,
      }

      const queryResponse = await deps.api.executeQueries({ queries: [query] })
      const assessment = queryResponse.queries[0].result as AssessmentVersionQueryResult

      // Store full assessment in data for other effects to use
      context.setData('assessment', assessment)

      Object.entries(assessment.answers).forEach(([code, value]) => {
        if (value.type === 'Single') {
          context.setAnswer(code, value.value)
        } else {
          context.setAnswer(code, value.values)
        }
      })
    },

    /**
     * Save changed answers to the API using mutation history
     *
     * Calculates delta by examining answer mutation histories for changes
     * made during this request (post, processed, or action sources).
     *
     * Should be called in onSubmission transitions.
     */
    saveStepAnswers: deps => async (context: EffectFunctionContext) => {
      const histories = context.getAllAnswerHistories()
      const delta = calculateAnswerDelta(histories)
      const hasChanges = Object.keys(delta.added).length > 0 || delta.removed.length > 0

      if (!hasChanges) {
        return
      }

      const user = context.getState('user')
      const assessment = context.getData('assessment') as AssessmentVersionQueryResult

      const added: Answers = Object.fromEntries(
        Object.entries(delta.added).map(([code, entry]): [string, Values] => [
          code,
          Array.isArray(entry.value)
            ? { type: 'Multi', values: entry.value as string[] }
            : { type: 'Single', value: String(entry.value) },
        ]),
      )

      const command: UpdateAssessmentAnswersCommand = {
        type: 'UpdateAssessmentAnswersCommand',
        assessmentUuid: assessment.assessmentUuid,
        added,
        removed: delta.removed,
        user,
      }

      await deps.api.executeCommands({ commands: [command] })
    },

    /**
     * Initialize menu items array with sample data if it doesn't exist
     * Used in onLoad of menu hub step for development/testing
     */
    initializeMenuItems: _deps => (context: EffectFunctionContext) => {
      const data = context.getData()

      if (!data?.menuItems) {
        context.setData('menuItems', [
          {
            id: 'item_1',
            name: 'Fish and Chips',
            category: 'Main Course',
            price: 12.99,
            description: 'Classic battered cod with chunky chips and mushy peas',
          },
          {
            id: 'item_2',
            name: 'Veggie Burger',
            category: 'Main Course',
            price: 10.5,
            description: 'Plant-based patty with lettuce, tomato, and vegan mayo',
          },
          {
            id: 'item_3',
            name: 'Sticky Toffee Pudding',
            category: 'Dessert',
            price: 6.5,
            description: 'Warm sponge pudding with toffee sauce and vanilla ice cream',
          },
        ])
      }
    },

    /**
     * Initialize menu items grouped by category for nested collection demo
     * Each category has a list of items (collection within collection)
     */
    initializeMenuByCategory: _deps => (context: EffectFunctionContext) => {
      const data = context.getData()

      if (!data?.menuByCategory) {
        context.setData('menuByCategory', [
          {
            id: 'cat_1',
            name: 'Starters',
            description: 'Light bites to begin your meal',
            items: [
              { id: 'starter_1', name: 'Soup of the Day', price: 5.5 },
              { id: 'starter_2', name: 'Garlic Bread', price: 4.0 },
              { id: 'starter_3', name: 'Prawn Cocktail', price: 7.5 },
            ],
          },
          {
            id: 'cat_2',
            name: 'Main Courses',
            description: 'Hearty dishes for the hungry',
            items: [
              { id: 'main_1', name: 'Fish and Chips', price: 12.99 },
              { id: 'main_2', name: 'Veggie Burger', price: 10.5 },
              { id: 'main_3', name: 'Steak Pie', price: 14.0 },
              { id: 'main_4', name: 'Chicken Tikka Masala', price: 13.5 },
            ],
          },
          {
            id: 'cat_3',
            name: 'Desserts',
            description: 'Sweet treats to finish',
            items: [
              { id: 'dessert_1', name: 'Sticky Toffee Pudding', price: 6.5 },
              { id: 'dessert_2', name: 'Ice Cream Sundae', price: 5.0 },
            ],
          },
        ])
      }
    },

    /**
     * Simulate postcode lookup API call
     * In production, this would call a real postcode lookup service
     *
     * Directly sets answers for address fields rather than using defaultValue,
     * so the looked-up address takes effect immediately.
     *
     * Example postcodes: SW1A 1AA, SW1A 2AA, EC1A 1BB, M1 1AE, B1 1AA
     */
    lookupPostcode: _deps => (context: EffectFunctionContext, postcode: ChainableRef) => {
      if (!postcode) {
        return
      }

      // Simulated address data based on postcode
      const mockAddresses: Record<string, { line1: string; town: string; county: string }> = {
        SW1A1AA: {
          line1: '10 Downing Street',
          town: 'Westminster',
          county: 'Greater London',
        },
        SW1A2AA: {
          line1: 'Buckingham Palace',
          town: 'Westminster',
          county: 'Greater London',
        },
        EC1A1BB: {
          line1: "1 St Martin's Le Grand",
          town: 'City of London',
          county: 'Greater London',
        },
        M11AE: {
          line1: '1 Piccadilly Gardens',
          town: 'Manchester',
          county: 'Greater Manchester',
        },
        B11AA: {
          line1: '1 Victoria Square',
          town: 'Birmingham',
          county: 'West Midlands',
        },
      }

      // Remove spaces and convert to uppercase for lookup
      const normalizedPostcode = String(postcode).replace(/\s/g, '').toUpperCase()
      const addressData = mockAddresses[normalizedPostcode]

      if (addressData) {
        // Directly set answers so they persist and override any existing values
        context.setAnswer('addressLine1', addressData.line1)
        context.setAnswer('town', addressData.town)
        context.setAnswer('county', addressData.county)
      }
    },

    /**
     * Add a new menu item to the collection
     * Creates a new item with generated ID and navigates to edit page
     */
    addMenuItem: _deps => (context: EffectFunctionContext) => {
      const data = context.getData()
      const items = data?.menuItems || []
      const newItemId = `item_${Date.now()}`

      const newItem = {
        id: newItemId,
        name: '',
        description: '',
        price: '',
        category: '',
        dietary: [] as any,
        allergens: [] as any,
      }

      context.setData('menuItems', [...items, newItem])
      context.setData('currentItemId', newItemId)
    },

    /**
     * Load a menu item for editing
     * Sets form answers based on the item ID from URL params
     */
    loadMenuItem: _deps => (context: EffectFunctionContext) => {
      const itemId = context.getRequestParam('itemId')
      const data = context.getData()
      const menuItems = data?.menuItems || []

      if (itemId === 'new') {
        // Initialize empty form for new item
        context.setAnswer('itemName', '')
        context.setAnswer('itemDescription', '')
        context.setAnswer('itemPrice', '')
        context.setAnswer('itemCategory', '')
        context.setAnswer('itemDietary', [])
        context.setAnswer('itemAllergens', [])
      } else {
        // Find existing item and populate form
        const item = menuItems.find((i: { id: string }) => i.id === itemId)

        if (item) {
          context.setAnswer('itemName', item.name)
          context.setAnswer('itemDescription', item.description || '')
          context.setAnswer('itemPrice', item.price?.toString() || '')
          context.setAnswer('itemCategory', item.category || '')
          context.setAnswer('itemDietary', item.dietary || [])
          context.setAnswer('itemAllergens', item.allergens || [])
        } else {
          context.setData('itemNotFound', true)
        }
      }
    },

    /**
     * Save menu item changes back to the collection via API
     * Uses assessment data from context, creates collection if not found, then adds/updates item
     */
    saveMenuItem: deps => async (context: EffectFunctionContext) => {
      const user = context.getState('user')
      const assessment = context.getData('assessment') as AssessmentVersionQueryResult
      const assessmentUuid = assessment.assessmentUuid
      const itemId = context.getRequestParam('itemId')

      // Find existing MENU_ITEMS collection from loaded assessment data
      const existingCollection = assessment.collections.find(c => c.name === 'MENU_ITEMS')

      let collectionUuid: string

      if (existingCollection) {
        collectionUuid = existingCollection.uuid
      } else {
        // Collection doesn't exist, create it
        const createCollectionCommand: CreateCollectionCommand = {
          type: 'CreateCollectionCommand',
          name: 'MENU_ITEMS',
          assessmentUuid,
          user,
        }

        const createResponse = await deps.api.executeCommands({ commands: [createCollectionCommand] })
        const createResult = createResponse.commands[0].result

        if (!('collectionUuid' in createResult)) {
          throw new Error('Failed to create MENU_ITEMS collection')
        }

        collectionUuid = createResult.collectionUuid
      }

      const answers: Answers = {
        itemName: { type: 'Single', value: String(context.getAnswer('itemName') || '') },
        itemDescription: { type: 'Single', value: String(context.getAnswer('itemDescription') || '') },
        itemPrice: { type: 'Single', value: String(context.getAnswer('itemPrice') || '0') },
        itemCategory: { type: 'Single', value: String(context.getAnswer('itemCategory') || '') },
        itemDietary: { type: 'Multi', values: (context.getAnswer('itemDietary') as string[]) || [] },
        itemAllergens: { type: 'Multi', values: (context.getAnswer('itemAllergens') as string[]) || [] },
      }

      if (itemId === 'new') {
        const command: AddCollectionItemCommand = {
          type: 'AddCollectionItemCommand',
          assessmentUuid,
          collectionUuid,
          answers,
          properties: {},
          user,
        }

        const response = await deps.api.executeCommands({ commands: [command] })
        const result = response.commands[0].result

        if ('collectionItemUuid' in result) {
          context.setData('lastAddedItemUuid', result.collectionItemUuid)
        }
      } else {
        const command: UpdateCollectionItemAnswersCommand = {
          type: 'UpdateCollectionItemAnswersCommand',
          assessmentUuid,
          collectionItemUuid: itemId,
          added: answers,
          removed: [],
          user,
        }

        await deps.api.executeCommands({ commands: [command] })
      }
    },

    /**
     * Remove a menu item from the collection
     */
    removeMenuItem: _deps => (context: EffectFunctionContext) => {
      const itemId = context.getRequestParam('itemId')
      const data = context.getData() as Record<string, unknown> | undefined
      const menuItems = (data?.menuItems as Array<Record<string, unknown>>) || []

      context.setData(
        'menuItems',
        menuItems.filter((i: Record<string, unknown>) => i.id !== itemId),
      )
    },

    /**
     * Validate allergen consistency across menu items
     * Ensures allergen declarations match menu item allergens
     */
    validateAllergenConsistency: _deps => (context: EffectFunctionContext) => {
      const data = context.getData() as Record<string, unknown> | undefined
      const menuItems = (data?.menuItems as Array<Record<string, unknown>>) || []

      // Extract all unique allergens from menu items
      const allergenSet = new Set<string>()

      menuItems.forEach((item: Record<string, unknown>) => {
        if (item.allergens && Array.isArray(item.allergens)) {
          item.allergens.forEach((allergen: string) => allergenSet.add(allergen))
        }
      })

      context.setData('detectedAllergens', Array.from(allergenSet))
    },

    /**
     * Submit the complete registration
     * In production, this would POST to a backend API
     */
    submitRegistration: _deps => (context: EffectFunctionContext) => {
      const data = context.getData() as Record<string, unknown> | undefined

      const submission = {
        businessType: context.getAnswer('businessType'),
        businessName: context.getAnswer('businessName'),
        businessAddress: {
          line1: context.getAnswer('addressLine1'),
          line2: context.getAnswer('addressLine2'),
          town: context.getAnswer('town'),
          city: context.getAnswer('city'),
          county: context.getAnswer('county'),
          postcode: context.getAnswer('postcode'),
        },
        contactPhone: context.getAnswer('contactPhone'),
        contactEmail: context.getAnswer('contactEmail'),
        operator: {
          sameAsBusiness: context.getAnswer('operatorSameAsBusiness'),
          name: context.getAnswer('operatorName'),
          qualifications: context.getAnswer('operatorQualifications'),
        },
        menuItems: data?.menuItems || [],
        allergens: {
          declarations: context.getAnswer('allergenDeclarations') || {},
        },
        hygieneRating: {
          hasRating: context.getAnswer('hasHygieneRating'),
          rating: context.getAnswer('hygieneRating'),
          inspectionDate: context.getAnswer('hygieneInspectionDate'),
          improvementNotes: context.getAnswer('improvementNotes'),
        },
        submittedAt: new Date().toISOString(),
      }

      // eslint-disable-next-line no-console
      console.log('Submitting food business registration:', submission)

      const registrationId = `FBR-${Date.now()}`
      context.setData('registrationId', registrationId)
      context.setData('submissionComplete', true)
    },

    /**
     * Send confirmation email
     * In production, this would trigger an email service
     */
    sendConfirmationEmail: _deps => (context: EffectFunctionContext) => {
      const email = context.getAnswer('contactEmail')
      const data = context.getData() as Record<string, unknown> | undefined
      const registrationId = data?.registrationId

      // eslint-disable-next-line no-console
      console.log(`Sending confirmation email to ${email} for registration ${registrationId}`)
    },

    /**
     * Notify Food Standards Agency
     * In production, this would call FSA API
     */
    notifyFSA: _deps => (context: EffectFunctionContext) => {
      const businessType = context.getAnswer('businessType')
      const businessName = context.getAnswer('businessName')

      // eslint-disable-next-line no-console
      console.log(`Notifying FSA of new ${businessType} registration: ${businessName}`)
    },
  })
