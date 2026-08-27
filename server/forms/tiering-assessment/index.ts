import { createForgePackage, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffectsRegistry } from './effects/TieringAssessmentEffects'
import { TieringAssessmentEffectsDeps } from './@types/TieringAssessmentEffectsDeps'
import { tieringAssessmentV1Journey } from './versions/v1.0'
import { detailedRiskPredictorScores } from './components/predictorScoresComponent'
import { sanGenerators } from './generators'
import { sanTransformers } from './transformers/transformers'
import { sanConditions } from './conditions/conditions'

const tieringAssessmentJourney = journey({
  code: 'tiering-assessment',
  title: 'Tiering Assessment',
  path: '/tiering-assessment',
  children: [tieringAssessmentV1Journey],
})

export default createForgePackage<TieringAssessmentEffectsDeps>({
  enabled: true,
  functions: [TieringAssessmentEffectsRegistry, sanConditions, sanGenerators, sanTransformers],
  journey: tieringAssessmentJourney,
  components: [detailedRiskPredictorScores],
})
