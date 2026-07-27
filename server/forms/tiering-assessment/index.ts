import { createForgePackage, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffectsImplementations } from './effects/TieringAssessmentEffects'
import { TieringAssessmentFunctions } from './functions/TieringAssessmentFunctions'
import { TieringAssessmentEffectsDeps } from './@types/TieringAssessmentEffectsDeps'
import { tieringAssessmentV1Journey } from './versions/v1.0'

const tieringAssessmentJourney = journey({
  code: 'tiering-assessment',
  title: 'Tiering Assessment',
  path: '/tiering-assessment',
  children: [tieringAssessmentV1Journey],
})

export default createForgePackage<TieringAssessmentEffectsDeps>({
  enabled: true,
  functions: {
    ...TieringAssessmentEffectsImplementations,
    ...TieringAssessmentFunctions.implementations,
  },
  journey: tieringAssessmentJourney,
})
