import {access, Condition, Post, redirect, step, submit} from '@ministryofjustice/hmpps-forge/core/authoring'
import {GovUKButton} from '@ministryofjustice/hmpps-forge/govuk-components'
import {StrengthsAndNeedsEffects} from '../../../../../../effects'
import {offenceAnalysisSummaryTab,} from './fields'
import {Step} from '../../constants/step'
import {Section, SectionStatus} from '../../../../constants/section'
import {collectionCode, collectionName} from "../offence-analysis-victim-summary/step";

const saveButton = GovUKButton({
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const offenceAnalysisSummaryStep = step({
  path: `/${Step.offence_analysis_summary.path}`,
  title: 'Offence analysis summary',
  reachability: { entryWhen: true },
  blocks: [
    offenceAnalysisSummaryTab,
  ],
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
