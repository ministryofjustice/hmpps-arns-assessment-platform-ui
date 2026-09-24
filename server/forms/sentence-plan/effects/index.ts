import { EffectRegistry } from '@ministryofjustice/hmpps-forge/core/authoring'
import { createNavigationEffects } from '@ministryofjustice/hmpps-aap-sdk/utils/navigation/createNavigationEffects'
import { addNotification } from './notifications/addNotification'
import { loadNotifications } from './notifications/loadNotifications'
import { Nav } from './navigation'
import { initializeSessionFromAccess } from './session/initializeSessionFromAccess'
import { loadSessionData } from './session/loadSessionData'
import { loadSentenceInformation } from './session/loadSentenceInformation'
import { loadPlan } from './plan/loadPlan'
import { deriveGoalsWithStepsFromAssessment } from './goals/deriveGoalsWithStepsFromAssessment'
import { derivePlanAgreementsFromAssessment } from './plan/derivePlanAgreementsFromAssessment'
import { loadPlanTimeline } from './plan/loadPlanTimeline'
import { derivePlanHistoryEntries } from './plan/derivePlanHistoryEntries'
import { derivePlanLastUpdated, derivePlanLastUpdatedForHistoric } from './plan/derivePlanLastUpdated'
import { updatePlanAgreementStatus } from './plan/updatePlanAgreementStatus'
import { createGoal } from './goals/createGoal'
import { setAreaDataFromUrlParam } from './goals/setAreaDataFromUrlParam'
import { setAreaDataFromActiveGoal } from './goals/setAreaDataFromActiveGoal'
import { loadAreaAssessmentInfo } from './goals/loadAreaAssessmentInfo'
import { loadAllAreasAssessmentInfo } from './goals/loadAllAreasAssessmentInfo'
import { setActiveGoalContext } from './goals/setActiveGoalContext'
import { loadActiveGoalForEdit } from './goals/loadActiveGoalForEdit'
import { updateActiveGoal } from './goals/updateActiveGoal'
import { updateGoalProgress } from './goals/updateGoalProgress'
import { markGoalAsAchieved } from './goals/markGoalAsAchieved'
import { markGoalAsRemoved } from './goals/markGoalAsRemoved'
import { readdGoalToPlan } from './goals/readdGoalToPlan'
import { deleteActiveGoal } from './goals/deleteActiveGoal'
import { reorderGoal } from './goals/reorderGoal'
import { initializeStepEditSession } from './steps/initializeStepEditSession'
import { addStepToStepEditSession } from './steps/addStepToStepEditSession'
import { removeStepFromStepEditSession } from './steps/removeStepFromStepEditSession'
import { saveStepEditSession } from './steps/saveStepEditSession'
import { setPrivacyAccepted } from './access/setPrivacyAccepted'
import { updatePlanAgreement } from './plan/updatePlanAgreement'
import { loadPreviousVersions } from './plan/loadPreviousVersions'
import { loadHistoricPlan } from './plan/loadHistoricPlan'
import { sendAuditEvent } from './audit/sendAuditEvent'
import { loadFeatureFlags } from './feature-flags/loadFeatureFlags'
import { loadSupervisionPackage } from './supervision-package/loadSupervisionPackage'
import { sendTelemetryEvent } from './telemetry/sendTelemetryEvent'
import { SentencePlanEffectsDeps } from './types'

const { trackNavigation, insertNavigationReferrer } = createNavigationEffects({
  stackKey: 'sentence-plan',
  clearKey: Nav.PLAN_OVERVIEW,
})

export const sentencePlanEffectRegistry = new EffectRegistry<SentencePlanEffectsDeps>()

export enum AuditEvent {
  CONFIRM_PRIVACY_SCREEN = 'CONFIRM_PRIVACY_SCREEN',
  VIEW_PLAN_OVERVIEW = 'VIEW_PLAN_OVERVIEW',
  PRINT_ALL_GOALS = 'PRINT_ALL_GOALS',
  VIEW_SELECT_AREA_OF_NEED = 'VIEW_SELECT_AREA_OF_NEED',
  VIEW_CREATE_GOAL = 'VIEW_CREATE_GOAL',
  CREATE_GOAL = 'CREATE_GOAL',
  VIEW_CHANGE_GOAL = 'VIEW_CHANGE_GOAL',
  VIEW_CHANGE_AREA_OF_NEED = 'VIEW_CHANGE_AREA_OF_NEED',
  EDIT_GOAL = 'EDIT_GOAL',
  VIEW_ADD_STEPS = 'VIEW_ADD_STEPS',
  ADD_STEPS = 'ADD_STEPS',
  EDIT_STEPS = 'EDIT_STEPS',
  VIEW_DELETE_GOAL = 'VIEW_DELETE_GOAL',
  DELETE_GOAL = 'DELETE_GOAL',
  VIEW_PLAN_AGREEMENT = 'VIEW_PLAN_AGREEMENT',
  EDIT_PLAN_AGREEMENT = 'EDIT_PLAN_AGREEMENT',
  VIEW_PLAN_AGREEMENT_UPDATE = 'VIEW_PLAN_AGREEMENT_UPDATE',
  EDIT_PLAN_AGREEMENT_UPDATE = 'EDIT_PLAN_AGREEMENT_UPDATE',
  VIEW_UPDATE_GOAL_AND_STEPS = 'VIEW_UPDATE_GOAL_AND_STEPS',
  EDIT_STEP_PROGRESS = 'EDIT_STEP_PROGRESS',
  VIEW_CONFIRM_GOAL_ACHIEVED = 'VIEW_CONFIRM_GOAL_ACHIEVED',
  EDIT_GOAL_ACHIEVED = 'EDIT_GOAL_ACHIEVED',
  VIEW_CONFIRM_GOAL_REMOVED = 'VIEW_CONFIRM_GOAL_REMOVED',
  EDIT_GOAL_REMOVED = 'EDIT_GOAL_REMOVED',
  VIEW_CONFIRM_RE_ADD_GOAL = 'VIEW_CONFIRM_RE_ADD_GOAL',
  CREATE_RE_ADD_GOAL = 'CREATE_RE_ADD_GOAL',
  VIEW_INACTIVE_GOAL = 'VIEW_INACTIVE_GOAL',
  VIEW_ABOUT_PERSON = 'VIEW_ABOUT_PERSON',
  VIEW_SUPERVISION_PACKAGE = 'VIEW_SUPERVISION_PACKAGE',
  VIEW_PLAN_HISTORY = 'VIEW_PLAN_HISTORY',
  VIEW_PREVIOUS_VERSIONS = 'VIEW_PREVIOUS_VERSIONS',
  VIEW_HISTORIC_PLAN = 'VIEW_HISTORIC_PLAN',
  VIEW_HISTORIC_ASSESSMENT = 'VIEW_HISTORIC_ASSESSMENT',
}

export { POST_AGREEMENT_PROCESS_STATUSES } from './types'
export type { AgreementStatus } from './types'
export { Nav } from './navigation'
export type { NavigationReferrer } from './navigation'

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
 * Access flow is handled by the access form (/access).
 * This form's entry point (plan/overview) calls initializeSessionFromAccess
 * to convert generic access data into sentence plan specific session.
 *
 * Usage in forms:
 * ```typescript
 * import { SentencePlanEffects } from './effects'
 *
 * SentencePlanEffects.initializeSessionFromAccess()
 * SentencePlanEffects.loadPlan()
 * SentencePlanEffects.createGoal()
 * ```
 */
export const SentencePlanEffects = {
  initializeSessionFromAccess: sentencePlanEffectRegistry.register(initializeSessionFromAccess),
  loadSessionData: sentencePlanEffectRegistry.register(loadSessionData),
  loadSentenceInformation: sentencePlanEffectRegistry.register(loadSentenceInformation),
  setPrivacyAccepted: sentencePlanEffectRegistry.register(setPrivacyAccepted),
  addNotification: sentencePlanEffectRegistry.register(addNotification),
  loadNotifications: sentencePlanEffectRegistry.register(loadNotifications),
  trackNavigation: sentencePlanEffectRegistry.register(trackNavigation),
  insertNavigationReferrer: sentencePlanEffectRegistry.register(insertNavigationReferrer),
  loadPlan: sentencePlanEffectRegistry.register(loadPlan),
  deriveGoalsWithStepsFromAssessment: sentencePlanEffectRegistry.register(deriveGoalsWithStepsFromAssessment),
  derivePlanAgreementsFromAssessment: sentencePlanEffectRegistry.register(derivePlanAgreementsFromAssessment),
  loadPlanTimeline: sentencePlanEffectRegistry.register(loadPlanTimeline),
  derivePlanHistoryEntries: sentencePlanEffectRegistry.register(derivePlanHistoryEntries),
  derivePlanLastUpdated: sentencePlanEffectRegistry.register(derivePlanLastUpdated),
  derivePlanLastUpdatedForHistoric: sentencePlanEffectRegistry.register(derivePlanLastUpdatedForHistoric),
  updatePlanAgreementStatus: sentencePlanEffectRegistry.register(updatePlanAgreementStatus),
  updatePlanAgreement: sentencePlanEffectRegistry.register(updatePlanAgreement),
  loadPreviousVersions: sentencePlanEffectRegistry.register(loadPreviousVersions),
  loadHistoricPlan: sentencePlanEffectRegistry.register(loadHistoricPlan),
  createGoal: sentencePlanEffectRegistry.register(createGoal),
  setAreaDataFromUrlParam: sentencePlanEffectRegistry.register(setAreaDataFromUrlParam),
  setAreaDataFromActiveGoal: sentencePlanEffectRegistry.register(setAreaDataFromActiveGoal),
  loadAreaAssessmentInfo: sentencePlanEffectRegistry.register(loadAreaAssessmentInfo),
  loadAllAreasAssessmentInfo: sentencePlanEffectRegistry.register(loadAllAreasAssessmentInfo),
  setActiveGoalContext: sentencePlanEffectRegistry.register(setActiveGoalContext),
  loadActiveGoalForEdit: sentencePlanEffectRegistry.register(loadActiveGoalForEdit),
  updateActiveGoal: sentencePlanEffectRegistry.register(updateActiveGoal),
  updateGoalProgress: sentencePlanEffectRegistry.register(updateGoalProgress),
  markGoalAsAchieved: sentencePlanEffectRegistry.register(markGoalAsAchieved),
  markGoalAsRemoved: sentencePlanEffectRegistry.register(markGoalAsRemoved),
  readdGoalToPlan: sentencePlanEffectRegistry.register(readdGoalToPlan),
  deleteActiveGoal: sentencePlanEffectRegistry.register(deleteActiveGoal),
  reorderGoal: sentencePlanEffectRegistry.register(reorderGoal),
  initializeStepEditSession: sentencePlanEffectRegistry.register(initializeStepEditSession),
  addStepToStepEditSession: sentencePlanEffectRegistry.register(addStepToStepEditSession),
  removeStepFromStepEditSession: sentencePlanEffectRegistry.register(removeStepFromStepEditSession),
  saveStepEditSession: sentencePlanEffectRegistry.register(saveStepEditSession),
  sendAuditEvent: sentencePlanEffectRegistry.register(sendAuditEvent),
  sendTelemetryEvent: sentencePlanEffectRegistry.register(sendTelemetryEvent),
  loadFeatureFlags: sentencePlanEffectRegistry.register(loadFeatureFlags),
  loadSupervisionPackage: sentencePlanEffectRegistry.register(loadSupervisionPackage),
}
