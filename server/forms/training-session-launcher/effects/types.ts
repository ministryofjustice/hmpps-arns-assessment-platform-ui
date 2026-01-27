import { CoordinatorApiClient, HandoverApiClient, PreferencesStore } from '../../../data'

export interface TrainingSessionLauncherEffectsDeps {
  handoverApiClient: HandoverApiClient
  coordinatorApiClient: CoordinatorApiClient
  preferencesStore: PreferencesStore
}
