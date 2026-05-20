import { createForgePackage } from '@ministryofjustice/hmpps-forge/core/authoring'
import { DataDeletionToolEffectsDeps } from './effects/types'
import config from '../../config'
import { DataDeletionToolEffectImplementations } from './effects'
import { dataDeletionToolJourney } from './form'
import { DataDeletionToolTransformerImplementations } from './transformers'

/**
 * Root Data Deletion Tool Form Package
 */
export default createForgePackage<DataDeletionToolEffectsDeps>({
  enabled: config.forms.dataDeletionTool.enabled ?? false,
  journey: dataDeletionToolJourney,
  functions: {
    ...DataDeletionToolEffectImplementations,
    ...DataDeletionToolTransformerImplementations,
  },
})
