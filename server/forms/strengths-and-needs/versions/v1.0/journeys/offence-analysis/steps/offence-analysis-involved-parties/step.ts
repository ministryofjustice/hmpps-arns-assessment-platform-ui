import {Condition, Post, redirect, step, submit} from '@ministryofjustice/hmpps-forge/core/authoring'
import {GovUKButton} from '@ministryofjustice/hmpps-forge/govuk-components'
import {StrengthsAndNeedsEffects} from '../../../../../../effects'
import {offenceAnalysisWhoWasTheOffenceCommittedAgainst,} from './fields'
import {Step} from '../../constants/step'
import {Section, SectionStatus} from '../../../../constants/section'

const saveButton = GovUKButton({
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const offenceAnalysisInvolvedPartiesStep = step({
  path: `/${Step.offence_analysis_involved_parties.path}`,
  title: 'Offence analysis Involved Parties',
  reachability: { entryWhen: true },
  blocks: [
    offenceAnalysisWhoWasTheOffenceCommittedAgainst,
    saveButton,
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.offence_analysis.statusKey, SectionStatus.incomplete),
        ],
        next: [
          redirect({
            goto: Step.offence_analysis_impact.path,
          }),
        ],
      },
    }),
  ],
})
