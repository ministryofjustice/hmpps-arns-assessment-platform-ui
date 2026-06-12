import { access, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { uuidSummaryField } from './fields'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'

export const uuidPlaceholderStep = step({
  path: '/placeholder-uuid-page',
  title: 'Placeholder UUID page',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
  blocks: [uuidSummaryField],
})
