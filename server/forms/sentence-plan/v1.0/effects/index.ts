import { defineVersionedEffects } from '../../utils/versionedRegistry'
import { AssessmentPlatformApiClient, DeliusApiClient } from '../../../../data'
import { loadPersonByCrn } from './loadPersonByCrn'
import { loadOrCreatePlanByCrn } from './loadOrCreatePlanByCrn'
import { loadOrCreatePlanByOasys } from './loadOrCreatePlanByOasys'
import { loadPlanFromSession } from './loadPlanFromSession'
import { saveActiveGoal } from './goals/saveActiveGoal'
import { deriveGoalCurrentAreaOfNeed } from './deriveGoalCurrentAreaOfNeed'
import { deriveGoalsWithStepsFromAssessment } from './deriveGoalsWithStepsFromAssessment'
import { derivePlanAgreementsFromAssessment } from './derivePlanAgreementsFromAssessment'
import { setActiveGoalContext } from './goals/setActiveGoalContext'
import { initializeStepEditSession } from './steps/initializeStepEditSession'
import { addStepToStepEditSession } from './steps/addStepToStepEditSession'
import { removeStepFromStepEditSession } from './steps/removeStepFromStepEditSession'
import { saveStepEditSession } from './steps/saveStepEditSession'
import { setSessionAccessType } from './setSessionAccessType'
import { loadActiveGoalForEdit } from './goals/loadActiveGoalForEdit'
import { updateActiveGoal } from './goals/updateActiveGoal'
import { deleteActiveGoal } from './goals/deleteActiveGoal'
import { updatePlanAgreementStatus } from './updatePlanAgreementStatus'
import { addNotification } from './notifications/addNotification'
import { loadNotifications } from './notifications/loadNotifications'

/**
 * Dependencies for sentence plan effects
 */
export interface SentencePlanEffectsDeps {
  api: AssessmentPlatformApiClient
  deliusApi: DeliusApiClient
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
 * import { SentencePlanV1Effects } from './effects'
 *
 * SentencePlanV1Effects.loadOrCreatePlanByCrn()
 * SentencePlanV1Effects.saveGoal()
 * ```
 */
export const { effects: SentencePlanV1Effects, createRegistry: SentencePlanV1Registry } =
  defineVersionedEffects<SentencePlanEffectsDeps>('SentencePlan.V1')({
    // Access
    setSessionAccessType,

    // Notifications
    addNotification,
    loadNotifications,

    // Assessment
    loadPersonByCrn,
    loadOrCreatePlanByCrn,
    loadOrCreatePlanByOasys,
    loadPlanFromSession,
    deriveGoalsWithStepsFromAssessment,
    derivePlanAgreementsFromAssessment,

    // Plan Agreement
    updatePlanAgreementStatus,

    // Goals
    saveActiveGoal,
    deriveGoalCurrentAreaOfNeed,
    setActiveGoalContext,
    loadActiveGoalForEdit,
    updateActiveGoal,
    deleteActiveGoal,

    // Steps
    initializeStepEditSession,
    addStepToStepEditSession,
    removeStepFromStepEditSession,
    saveStepEditSession,
  })
