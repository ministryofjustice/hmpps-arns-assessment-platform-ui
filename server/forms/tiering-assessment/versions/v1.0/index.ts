import { access, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../effects/TieringAssessmentEffects'
import { startTieringAssessmentStep } from './steps/start-tiering-assessment/step'
import { uuidPlaceholderStep } from './steps/uuid-placeholder/step'

export const tieringAssessmentV1Journey = journey({
  code: 'tiering-assessment-v1',
  title: 'Tiering Assessment',
  path: '/v1.0',
  steps: [startTieringAssessmentStep, uuidPlaceholderStep],
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
})
