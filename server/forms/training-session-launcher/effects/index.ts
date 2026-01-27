import { defineEffectsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
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

/**
 * Training Session Launcher Effects
 *
 * These effects handle:
 * - Loading pre-configured training scenarios
 * - Managing saved scenarios and sessions in preferences
 * - Customising scenarios and creating sessions
 * - Creating sessions via coordinator API
 *
 * Usage in forms:
 * ```typescript
 * import { TrainingSessionLauncherEffects } from './effects'
 *
 * TrainingSessionLauncherEffects.loadScenarios()
 * TrainingSessionLauncherEffects.loadPreferences()
 * TrainingSessionLauncherEffects.saveCustomPreset()
 * TrainingSessionLauncherEffects.createSessionFromPreset()
 * TrainingSessionLauncherEffects.createSessionFromCustomize()
 * ```
 */
export const { effects: TrainingSessionLauncherEffects, createRegistry: createTrainingSessionLauncherEffectsRegistry } =
  defineEffectsWithDeps<TrainingSessionLauncherEffectsDeps>()({
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

    // Utilities
    storeCsrf,
  })
