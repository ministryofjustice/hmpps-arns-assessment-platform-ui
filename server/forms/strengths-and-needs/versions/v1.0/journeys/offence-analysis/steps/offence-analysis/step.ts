import {Answer, Condition, Post, redirect, step, submit} from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import {
  indexOffenceDescription,
  motivations,
  offenceCommitedAgainst,
  offenceElements,
  whyOffenceHappened,
} from './fields'
import { Step } from '../../constants/step'
import { Section, SectionStatus } from '../../../../constants/section'
import {Question} from "../../constants/question";
import {Option} from "../../constants/option";

const saveButton = GovUKButton({
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const offenceAnalysisStep = step({
  path: `/${Step.offence_analysis.path}`,
  title: 'Offence analysis',
  reachability: { entryWhen: true },
  blocks: [
    indexOffenceDescription,
    offenceElements,
    whyOffenceHappened,
    motivations,
    offenceCommitedAgainst,
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
            when: Answer(Question.offence_analysis_commited_against).match(Condition.Array.Contains(Option.one_or_more_people)),
            goto: Step.offence_analysis_victim.path,
          }),
          redirect({
            goto: Step.offence_analysis_involved_parties.path,
          }),
        ],
      },
    }),
  ],
})
