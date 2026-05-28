import { createForgePackage } from '@ministryofjustice/hmpps-forge/core/authoring'
import { trainingSessionLauncherJourney } from './form'
import { trainingSessionLauncherEffectImplementations } from './effects'
import { trainingSessionLauncherComponents } from './components'
import { TrainingSessionLauncherTransformerImplementations } from './transformers'
import { TrainingSessionLauncherEffectsDeps } from './effects/types'
import config from '../../config'

/**
 * Training Session Launcher Form Package
 *
 * Provides a UI for launching training sessions into ARNS applications.
 * Replaces the OAStub functionality with a proper form-based interface.
 */
export default createForgePackage<TrainingSessionLauncherEffectsDeps>({
  enabled: config.forms.trainingSessionLauncher.enabled ?? false,
  journey: trainingSessionLauncherJourney,
  components: trainingSessionLauncherComponents,
  functions: {
    ...trainingSessionLauncherEffectImplementations,
    ...TrainingSessionLauncherTransformerImplementations,
  },
})
