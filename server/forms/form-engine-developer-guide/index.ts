import { createFormPackage } from '@form-engine/form/builders'
import { createDeveloperGuideEffectsRegistry } from './effects'
import { developerGuideJourney } from './form'
import { formEngineDeveloperGuideComponents } from './components'
import config from '../../config'

/**
 * Export for the Form Engine Developer Guide that includes all its
 * components, functions, effects etc.
 */
export default createFormPackage({
  enabled: config.forms.formEngineDeveloperGuide.enabled,
  journey: developerGuideJourney,
  components: formEngineDeveloperGuideComponents,
  createRegistries: () => ({
    ...createDeveloperGuideEffectsRegistry({}),
  }),
})
