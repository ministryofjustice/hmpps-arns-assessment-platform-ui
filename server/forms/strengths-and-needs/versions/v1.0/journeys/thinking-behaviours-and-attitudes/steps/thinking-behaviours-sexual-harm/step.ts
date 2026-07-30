import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import {
  thinkingBehavioursSexualPreoccupation,
  thinkingBehavioursOffenceRelatedSexualInterest,
  thinkingBehavioursEmotionalIntimacy,
} from './fields'
import { Step } from '../../constants/step'
import { Section, SectionStatus } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { contentFor } from '../../locales'
import { commonContentFor } from '../../../../locales'
import { sectionPath } from '../../../../constants/path'

export const thinkingBehavioursSexualHarmStep = step({
  path: `/${Step.thinkingBehavioursSexualHarm.path}`,
  title: contentFor('step.thinking_behaviours_sexual_harm'),
  view: {
    locals: {
      sectionTitle: contentFor('step.thinking_behaviours_sexual_harm'),
      pageSubHeading: commonContentFor('sectionTitle.thinking-behaviours-and-attitudes'),
      backlink: sectionPath(Section.thinking_behaviours_and_attitudes) + Step.thinkingBehavioursRiskOfSexualHarm.path,
    },
  },
  blocks: [
    thinkingBehavioursSexualPreoccupation,
    thinkingBehavioursOffenceRelatedSexualInterest,
    thinkingBehavioursEmotionalIntimacy,
    saveButton,
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(
            Section.thinking_behaviours_and_attitudes.statusKey,
            SectionStatus.incomplete,
          ),
        ],
        next: [
          redirect({
            goto: Step.thinkingBehavioursSummary.path,
          }),
        ],
      },
    }),
  ],
})
