import EffectFunctionContext from '@form-engine/core/ast/thunks/EffectFunctionContext'
import AssessmentPlatformApiClient from '../../../data/assessmentPlatformApiClient'
import { defineVersionedEffects } from '../utils/versionedRegistry'
import referenceData from '../referenceData'

/**
 * Dependencies for sentence plan effects
 */
export interface SentencePlanEffectsDeps {
  api: AssessmentPlatformApiClient
}

/**
 * Sentence Plan v1.0 Effects
 *
 * These effects handle:
 * - Loading/creating sentence plans
 * - Managing goals and steps (CRUD)
 * - Plan agreement workflow
 * - Progress notes
 *
 * Usage in forms:
 * ```typescript
 * import { SentencePlan } from './effects'
 *
 * SentencePlan.V1.loadOrCreatePlan()
 * SentencePlan.V1.saveGoal()
 * ```
 */
export const { effects: SentencePlanV1Effects, createRegistry: SentencePlanV1Registry } =
  defineVersionedEffects<SentencePlanEffectsDeps>('SentencePlan.V1')({
    // =========================================================================
    // Assessment
    // =========================================================================

    /**
     * Load goal suggestions for a specific area of need
     *
     * Filters the reference data based on the areaOfNeed URL parameter
     * and sets the filtered goal suggestions in context.
     */
    loadGoalsByAreaOfNeed: _deps => async (context: EffectFunctionContext) => {
      const areaOfNeedParam = context.getRequestParam('areaOfNeed')

      // Find the matching area of need in reference data
      const areaData = referenceData.find(
        area => area.name.toLowerCase().replace(/\s+/g, '-') === areaOfNeedParam?.toLowerCase(),
      )

      // Set the goal suggestions (empty array if not found)
      context.setData('goalSuggestions', areaData?.goals ?? [])
      context.setData('areaOfNeedName', areaData?.name ?? '')
    },

    /**
     * Load an existing sentence plan or create a new one
     *
     * Fetches the full plan with goals and steps (depth: 1+) and stores in session.
     * If no plan exists for the identifier, creates a new assessment.
     */
    loadOrCreatePlan: _deps => async (_context: EffectFunctionContext) => {
      // TODO: Implement - CreateAssessmentCommand or AssessmentVersionQuery
      const caseData = {
        name: {
          forename: 'Buster',
          middleName: '',
          surname: 'Sanford',
        },
        crn: 'X123456',
        tier: '',
        dateOfBirth: '2002-01-15',
        nomisId: '',
        region: '',
        location: 'COMMUNITY',
        sexuallyMotivatedOffenceHistory: 'YES',
        sentences: [
          {
            description: 'Custodial Sentence',
            startDate: '2024-11-06',
            endDate: '2029-01-12',
            programmeRequirement: false,
            unpaidWorkHoursOrdered: 10,
            unpaidWorkMinutesCompleted: 20,
            rarDaysOrdered: 3,
            rarDaysCompleted: 1,
            rarRequirement: true,
          },
          {
            description: 'ORA Community Order',
            startDate: '2024-11-19',
            endDate: '2025-05-18',
            programmeRequirement: false,
            unpaidWorkHoursOrdered: 0,
            unpaidWorkMinutesCompleted: 0,
            rarDaysOrdered: 0,
            rarDaysCompleted: 0,
            rarRequirement: false,
          },
        ],
      }

      _context.setData('caseData', caseData)
    },

    /**
     * Mark the sentence plan as agreed
     *
     * Updates AGREEMENT_STATUS and records a timeline event for the agreement.
     */
    agreePlan: _deps => async (_context: EffectFunctionContext) => {
      // TODO: Implement - UpdateAssessmentPropertiesCommand with timeline
    },

    // =========================================================================
    // Goals
    // =========================================================================

    /**
     * Create or update a goal
     *
     * If goalId is 'new', creates the GOALS collection (if needed) and adds a new goal.
     * Otherwise, updates the existing goal's answers.
     */
    saveGoal: _deps => async (_context: EffectFunctionContext) => {
      // TODO: Implement - CreateCollectionCommand + AddCollectionItemCommand or UpdateCollectionItemAnswersCommand
    },

    /**
     * Update a goal's status (e.g., ACTIVE, ACHIEVED, REMOVED)
     *
     * Updates both the STATUS answer and STATUS_DATE property.
     */
    updateGoalStatus: _deps => async (_context: EffectFunctionContext) => {
      // TODO: Implement - UpdateCollectionItemAnswersCommand + UpdateCollectionItemPropertiesCommand
    },

    /**
     * Change the display order of goals
     *
     * Moves a goal to a new position in the goals collection.
     */
    reorderGoals: _deps => async (_context: EffectFunctionContext) => {
      // TODO: Implement - ReorderCollectionItemCommand
    },

    /**
     * Remove a goal from the plan
     */
    removeGoal: _deps => async (_context: EffectFunctionContext) => {
      // TODO: Implement - RemoveCollectionItemCommand (or equivalent)
    },

    // =========================================================================
    // Steps
    // =========================================================================

    /**
     * Create or update a step within a goal
     *
     * If stepId is 'new', creates the STEPS collection (if needed) and adds a new step.
     * Otherwise, updates the existing step's answers.
     */
    saveStep: _deps => async (_context: EffectFunctionContext) => {
      // TODO: Implement - CreateCollectionCommand + AddCollectionItemCommand or UpdateCollectionItemAnswersCommand
    },

    /**
     * Update a step's status (e.g., NOT_STARTED, IN_PROGRESS, COMPLETED)
     *
     * Updates both the STATUS answer and STATUS_DATE property.
     */
    updateStepStatus: _deps => async (_context: EffectFunctionContext) => {
      // TODO: Implement - UpdateCollectionItemAnswersCommand + UpdateCollectionItemPropertiesCommand
    },

    /**
     * Remove a step from a goal
     */
    removeStep: _deps => async (_context: EffectFunctionContext) => {
      // TODO: Implement - RemoveCollectionItemCommand (or equivalent)
    },

    // =========================================================================
    // Notes
    // =========================================================================

    /**
     * Add a progress note to a goal
     *
     * Creates the NOTES collection (if needed) and adds a new note item.
     */
    addNote: _deps => async (_context: EffectFunctionContext) => {
      // TODO: Implement - CreateCollectionCommand + AddCollectionItemCommand
    },
  })
