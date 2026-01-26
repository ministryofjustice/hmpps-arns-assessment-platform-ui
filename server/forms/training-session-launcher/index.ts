import { createFormPackage } from '@form-engine/form/builders'
import { trainingSessionLauncherJourney } from './form'
import { createTrainingSessionLauncherEffectsRegistry } from './effects'
import { trainingSessionLauncherComponents } from './components'
import { TrainingSessionLauncherTransformersRegistry } from './transformers'
import { TrainingSessionLauncherEffectsDeps } from './effects/types'

/**
 * Training Session Launcher Form Package
 *
 * Provides a UI for launching training sessions into ARNS applications.
 * Replaces the OAStub functionality with a proper form-based interface.
 */
export default createFormPackage({
  enabled: true, // config.forms.trainingSessionLauncher?.enabled ?? false,
  journey: trainingSessionLauncherJourney,
  components: trainingSessionLauncherComponents,
  createRegistries: (deps: TrainingSessionLauncherEffectsDeps) => ({
    ...createTrainingSessionLauncherEffectsRegistry(deps),
    ...TrainingSessionLauncherTransformersRegistry,
  }),
})
