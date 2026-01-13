import { defineEffectsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
import { SentencePlanEffectsDeps } from './types'
import { addNotification } from './notifications/addNotification'
import { loadNotifications } from './notifications/loadNotifications'
import { loadPersonByCrn } from './session/loadPersonByCrn'
import { loadOrCreatePlanByCrn } from './plan/loadOrCreatePlanByCrn'
import { loadOrCreatePlanByOasys } from './plan/loadOrCreatePlanByOasys'
import { loadPlanFromSession } from './plan/loadPlanFromSession'
import { deriveGoalsWithStepsFromAssessment } from './goals/deriveGoalsWithStepsFromAssessment'
import { derivePlanAgreementsFromAssessment } from './plan/derivePlanAgreementsFromAssessment'
import { updatePlanAgreementStatus } from './plan/updatePlanAgreementStatus'
import { saveActiveGoal } from './goals/saveActiveGoal'
import { deriveGoalCurrentAreaOfNeed } from './goals/deriveGoalCurrentAreaOfNeed'
import { setActiveGoalContext } from './goals/setActiveGoalContext'
import { loadActiveGoalForEdit } from './goals/loadActiveGoalForEdit'
import { updateActiveGoal } from './goals/updateActiveGoal'
import { updateGoalProgress } from './goals/updateGoalProgress'
import { markGoalAsAchieved } from './goals/markGoalAsAchieved'
import { markGoalAsRemoved } from './goals/markGoalAsRemoved'
import { deleteActiveGoal } from './goals/deleteActiveGoal'
import { initializeStepEditSession } from './steps/initializeStepEditSession'
import { addStepToStepEditSession } from './steps/addStepToStepEditSession'
import { removeStepFromStepEditSession } from './steps/removeStepFromStepEditSession'
import { saveStepEditSession } from './steps/saveStepEditSession'
import { setSessionAccessType } from './access/setSessionAccessType'

/**
 * Sentence Plan Effects
 *
 * These effects handle:
 * - Loading/creating sentence plans
 * - Managing goals and steps (CRUD)
 * - Plan agreement workflow
 * - Progress notes
 *
 * Usage in forms:
 * ```typescript
 * import { SentencePlanEffects } from './effects'
 *
 * SentencePlanEffects.loadOrCreatePlanByCrn()
 * SentencePlanEffects.saveGoal()
 * ```
 */
export const { effects: SentencePlanEffects, createRegistry: SentencePlanEffectsRegistry } =
  defineEffectsWithDeps<SentencePlanEffectsDeps>()({
    // Access
    setSessionAccessType,

    // Session
    loadPersonByCrn,

    // Notifications
    addNotification,
    loadNotifications,

    // Plan
    loadOrCreatePlanByCrn,
    loadOrCreatePlanByOasys,
    loadPlanFromSession,
    deriveGoalsWithStepsFromAssessment,
    derivePlanAgreementsFromAssessment,
    updatePlanAgreementStatus,

    // Goals
    saveActiveGoal,
    deriveGoalCurrentAreaOfNeed,
    setActiveGoalContext,
    loadActiveGoalForEdit,
    updateActiveGoal,
    updateGoalProgress,
    markGoalAsAchieved,
    markGoalAsRemoved,
    deleteActiveGoal,

    // Steps
    initializeStepEditSession,
    addStepToStepEditSession,
    removeStepFromStepEditSession,
    saveStepEditSession,
  })
