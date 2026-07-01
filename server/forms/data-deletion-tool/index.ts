import { createForgePackage } from '@ministryofjustice/hmpps-forge/core/authoring'
import { DataDeletionToolEffectsDeps } from './effects/types'
import config from '../../config'
import { DataDeletionToolEffectImplementations } from './effects'
import { dataDeletionToolJourney } from './form'
import { DataDeletionToolTransformerImplementations } from './transformers'
import { dataDeletionToolComponents } from './components'
import { DataDeletionConditionImplementations } from './conditions'

/**
 * Root Data Deletion Tool Form Package
 */
export default createForgePackage<DataDeletionToolEffectsDeps>({
  enabled: config.forms.dataDeletionTool.enabled ?? false,
  journey: dataDeletionToolJourney,
  components: dataDeletionToolComponents,
  functions: {
    ...DataDeletionToolEffectImplementations,
    ...DataDeletionToolTransformerImplementations,
    ...DataDeletionConditionImplementations,
  },
})
