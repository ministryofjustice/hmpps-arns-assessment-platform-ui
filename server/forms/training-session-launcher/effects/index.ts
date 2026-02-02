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
import { defineNamespacedEffectsWithDeps } from '../../shared/defineNamespacedEffectsWithDeps'

/**
 * Training Session Launcher Effects
 *
 * All effects are namespaced in the registry (e.g., trainingLauncherLoadScenarios)
 * but use short names in the effects API (e.g., effects.loadScenarios()).
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
export const { effects: TrainingSessionLauncherEffects, createRegistry: createTrainingSessionLauncherEffectsRegistry } =
  defineNamespacedEffectsWithDeps<TrainingSessionLauncherEffectsDeps>('trainingLauncher')({
    // Scenarios
    loadScenarios,

    // Preferences
    loadPreferences,
    saveScenario,
    deleteScenario,
    saveSession,
    deleteSession,
    deleteAllSessions,

    // Sessions
    createSessionFromPreset,
    createSessionFromCustomize,
    generateHandoverLink,

    // Customise
    loadScenarioForCustomise,
    saveCustomPreset,

    // Notifications
    addNotification,
    loadNotifications,

    // Utilities
    storeCsrf,
  })
