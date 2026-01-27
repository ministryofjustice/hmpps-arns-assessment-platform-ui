import { defineEffectsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
import { SentencePlanEffectsDeps } from './types'
import { addNotification } from './notifications/addNotification'
import { loadNotifications } from './notifications/loadNotifications'
import { setNavigationReferrer } from './navigation/setNavigationReferrer'
import { loadNavigationReferrer } from './navigation/loadNavigationReferrer'
import { initializeSessionFromAccess } from './session/initializeSessionFromAccess'
import { loadSessionData } from './session/loadSessionData'
import { loadPlan } from './plan/loadPlan'
import { deriveGoalsWithStepsFromAssessment } from './goals/deriveGoalsWithStepsFromAssessment'
import { derivePlanAgreementsFromAssessment } from './plan/derivePlanAgreementsFromAssessment'
import { derivePlanHistoryEntries } from './plan/derivePlanHistoryEntries'
import { updatePlanAgreementStatus } from './plan/updatePlanAgreementStatus'
import { saveActiveGoal } from './goals/saveActiveGoal'
import { deriveGoalCurrentAreaOfNeed } from './goals/deriveGoalCurrentAreaOfNeed'
import { setActiveGoalContext } from './goals/setActiveGoalContext'
import { loadActiveGoalForEdit } from './goals/loadActiveGoalForEdit'
import { updateActiveGoal } from './goals/updateActiveGoal'
import { updateGoalProgress } from './goals/updateGoalProgress'
import { markGoalAsAchieved } from './goals/markGoalAsAchieved'
import { markGoalAsRemoved } from './goals/markGoalAsRemoved'
import { markGoalAsActive } from './goals/markGoalAsActive'
import { deleteActiveGoal } from './goals/deleteActiveGoal'
import { reorderGoal } from './goals/reorderGoal'
import { initializeStepEditSession } from './steps/initializeStepEditSession'
import { addStepToStepEditSession } from './steps/addStepToStepEditSession'
import { removeStepFromStepEditSession } from './steps/removeStepFromStepEditSession'
import { saveStepEditSession } from './steps/saveStepEditSession'
import { setPrivacyAccepted } from './access/setPrivacyAccepted'

export { POST_AGREEMENT_PROCESS_STATUSES } from './types'
export type { AgreementStatus } from './types'

/**
 * Sentence Plan Effects
 *
 * These effects handle:
 * - Initializing session from access form data
 * - Loading/creating sentence plans
 * - Managing goals and steps (CRUD)
 * - Plan agreement workflow
 * - Progress notes
 *
 * Access flow is handled by the access form (/forms/access).
 * This form's entry point (plan/overview) calls initializeSessionFromAccess
 * to convert generic access data into sentence plan specific session.
 *
 * Usage in forms:
 * ```typescript
 * import { SentencePlanEffects } from './effects'
 *
 * SentencePlanEffects.initializeSessionFromAccess()
 * SentencePlanEffects.loadPlan()
 * SentencePlanEffects.saveActiveGoal()
 * ```
 */
export const { effects: SentencePlanEffects, createRegistry: SentencePlanEffectsRegistry } =
  defineEffectsWithDeps<SentencePlanEffectsDeps>()({
    // Session
    initializeSessionFromAccess,
    loadSessionData,

    // Access
    setPrivacyAccepted,

    // Notifications
    addNotification,
    loadNotifications,

    // Navigation
    setNavigationReferrer,
    loadNavigationReferrer,

    // Plan
    loadPlan,
    deriveGoalsWithStepsFromAssessment,
    derivePlanAgreementsFromAssessment,
    derivePlanHistoryEntries,
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
    markGoalAsActive,
    deleteActiveGoal,
    reorderGoal,

    // Steps
    initializeStepEditSession,
    addStepToStepEditSession,
    removeStepFromStepEditSession,
    saveStepEditSession,
  })
