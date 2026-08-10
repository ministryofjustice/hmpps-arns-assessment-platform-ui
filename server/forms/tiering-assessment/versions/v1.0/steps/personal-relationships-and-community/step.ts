import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { importantRelationshipsField, relationshipSatisfactionField } from './fields'

export const personalRelationshipsAndCommunityStep = step({
  path: '/personal-relationships-and-community',
  title: 'Personal relationships and community',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
  blocks: [importantRelationshipsField, relationshipSatisfactionField, GovUKButton({ text: 'Save and continue' })],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [TieringAssessmentEffects.SaveAssessmentData()],
        next: [redirect({ goto: 'thinking-attitudes-and-behaviours' })],
      },
    }),
  ],
})
