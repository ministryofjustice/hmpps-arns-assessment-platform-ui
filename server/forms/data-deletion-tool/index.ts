import { createForgePackage } from '@ministryofjustice/hmpps-forge/core/authoring'
import { DataDeletionToolEffectsDeps } from './effects/types'
import config from '../../config'
import { DataDeletionToolEffectImplementations } from './effects'
import { dataDeletionToolComponents } from './components'
import { dataDeletionToolJourney } from './form'

/**
 * Root Data Deletion Tool Form Package
 */
export default createForgePackage<DataDeletionToolEffectsDeps>({
  enabled: config.forms.dataDeletionTool.enabled ?? false,
  journey: dataDeletionToolJourney,
  components: dataDeletionToolComponents,
  functions: {
    ...DataDeletionToolEffectImplementations,
  },
})
