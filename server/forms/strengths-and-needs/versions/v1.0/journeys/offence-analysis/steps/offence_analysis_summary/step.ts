import { access, Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { offenceAnalysisSummaryTab } from './fields'
import { Step } from '../../constants/step'
import { collectionCode, collectionName } from '../../constants/constants'

export const offenceAnalysisSummaryStep = step({
  path: `/${Step.offence_analysis_summary.path}`,
  title: 'Offence analysis summary',
  reachability: { entryWhen: true },
  blocks: [offenceAnalysisSummaryTab],
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.loadAnswersFromCollection(collectionCode, collectionName)],
    }),
  ],
  onSubmission: [
    submit({
      when: Post('delete').match(Condition.IsRequired()),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.removeItemFromCollection(collectionName, Post('delete'))],
        next: [redirect({ goto: Step.offence_analysis_victim_summary.path })],
      },
    }),
  ],
})
