import { createForgePackage } from '@ministryofjustice/hmpps-forge/core/authoring'
import { DataDeletionToolEffectsDeps } from './effects/types'
import { dataDeletionToolConfig } from './config'
import { dataDeletionToolJourney } from './form'
import { dataDeletionToolComponents } from './components'
import { dataDeletionToolEffectRegistry } from './effects'
import { dataDeletionToolTransformerRegistry } from './transformers'
import { dataDeletionToolConditionRegistry } from './conditions'

/**
 * Root Data Deletion Tool Form Package
 */
export default createForgePackage<DataDeletionToolEffectsDeps>({
  enabled: dataDeletionToolConfig.enabled,
  journey: dataDeletionToolJourney,
  components: dataDeletionToolComponents,
  functions: [dataDeletionToolEffectRegistry, dataDeletionToolTransformerRegistry, dataDeletionToolConditionRegistry],
})
