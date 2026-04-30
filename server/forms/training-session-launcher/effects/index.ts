import { defineEffectFunctions } from '@ministryofjustice/hmpps-forge/core/authoring'
import type { FunctionEvaluator } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TrainingSessionLauncherEffectsDeps } from './types'
import { loadScenarios } from './scenarios/loadScenarios'
import { storeCsrf } from './storeCsrf'
import { loadPreferences } from './preferences/loadPreferences'
import { saveScenario, deleteScenario } from './preferences/saveScenario'
import { saveSession, deleteSession, deleteAllSessions } from './preferences/saveSession'
import { saveCustomPreset } from './customise/saveCustomPreset'
import { loadScenarioForCustomise } from './customise/loadScenarioForCustomise'
import { createSessionFromPreset } from './sessions/createSessionFromPreset'
import { createSessionFromCustomize } from './sessions/createSessionFromCustomize'
import { generateHandoverLink } from './sessions/generateHandoverLink'
import { addNotification } from './notifications/addNotification'
import { loadNotifications } from './notifications/loadNotifications'
import { setTargetService } from '../../shared/setTargetService'

type EffectShapesFromFactories<TFactories> = {
  [K in keyof TFactories]: TFactories[K] extends (deps: infer _Deps) => infer Evaluator
    ? Evaluator extends FunctionEvaluator<unknown>
      ? Evaluator
      : never
    : never
}

const trainingSessionLauncherEffectFactories = {
  loadScenarios,
  loadPreferences,
  saveScenario,
  deleteScenario,
  saveSession,
  deleteSession,
  deleteAllSessions,
  createSessionFromPreset,
  createSessionFromCustomize,
  generateHandoverLink,
  loadScenarioForCustomise,
  saveCustomPreset,
  addNotification,
  loadNotifications,
  setTargetService,
  storeCsrf,
}

/**
 * Training Session Launcher Effects
 *
 * Package registration scopes these implementations to the launcher while keeping
 * short names in the effects API (e.g., effects.loadScenarios()).
 *
 * Usage in forms:
 * ```typescript
 * import { TrainingSessionLauncherEffects } from './effects'
 *
 * TrainingSessionLauncherEffects.loadScenarios()
 * TrainingSessionLauncherEffects.addNotification({ ... })
 * TrainingSessionLauncherEffects.loadNotifications('target')
 * ```
 */
export const {
  effects: TrainingSessionLauncherEffects,
  implementations: trainingSessionLauncherEffectImplementations,
} = defineEffectFunctions<
  EffectShapesFromFactories<typeof trainingSessionLauncherEffectFactories>,
  TrainingSessionLauncherEffectsDeps
>(trainingSessionLauncherEffectFactories)
