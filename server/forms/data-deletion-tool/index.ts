import { createFormPackage } from '@form-engine/form/builders'
import { DataDeletionToolEffectsDeps } from './effects/types'
import config from '../../config'
import { createDataDeletionToolEffectsRegistry } from './effects'
import { dataDeletionToolComponents } from './components';
import { dataDeletionToolJourney } from './form';

/**
 * Root Data Deletion Tool Form Package
 */
export default createFormPackage({
  enabled: config.forms.dataDeletionTool.enabled,
  journey: dataDeletionToolJourney,
  components: dataDeletionToolComponents,
  createRegistries: (deps: DataDeletionToolEffectsDeps) => ({
    ...createDataDeletionToolEffectsRegistry(deps),
  }),
})
