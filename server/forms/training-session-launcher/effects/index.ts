import { EffectRegistry } from '@ministryofjustice/hmpps-forge/core/authoring'
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

export const trainingSessionLauncherEffectRegistry = new EffectRegistry<TrainingSessionLauncherEffectsDeps>()

/**
 * Training Session Launcher Effects
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
export const TrainingSessionLauncherEffects = {
  // Scenarios
  loadScenarios: trainingSessionLauncherEffectRegistry.register(loadScenarios),

  // Preferences
  loadPreferences: trainingSessionLauncherEffectRegistry.register(loadPreferences),
  saveScenario: trainingSessionLauncherEffectRegistry.register(saveScenario),
  deleteScenario: trainingSessionLauncherEffectRegistry.register(deleteScenario),
  saveSession: trainingSessionLauncherEffectRegistry.register(saveSession),
  deleteSession: trainingSessionLauncherEffectRegistry.register(deleteSession),
  deleteAllSessions: trainingSessionLauncherEffectRegistry.register(deleteAllSessions),

  // Sessions
  createSessionFromPreset: trainingSessionLauncherEffectRegistry.register(createSessionFromPreset),
  createSessionFromCustomize: trainingSessionLauncherEffectRegistry.register(createSessionFromCustomize),
  generateHandoverLink: trainingSessionLauncherEffectRegistry.register(generateHandoverLink),

  // Customise
  loadScenarioForCustomise: trainingSessionLauncherEffectRegistry.register(loadScenarioForCustomise),
  saveCustomPreset: trainingSessionLauncherEffectRegistry.register(saveCustomPreset),

  // Notifications
  addNotification: trainingSessionLauncherEffectRegistry.register(addNotification),
  loadNotifications: trainingSessionLauncherEffectRegistry.register(loadNotifications),

  // Context
  setTargetService: trainingSessionLauncherEffectRegistry.register(setTargetService),

  // Utilities
  storeCsrf: trainingSessionLauncherEffectRegistry.register(storeCsrf),
}
