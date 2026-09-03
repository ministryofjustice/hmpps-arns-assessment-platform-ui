import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { contentFor } from '../../locales'
import { commonContentFor, sectionPageTitle } from '../../../../locales'
import { baseSanRoute } from '../../../../constants/path'
import { thinkingBehavioursAttitudesSection } from '../../section'
import { createRoute } from '../../../../../../generators'

export const thinkingBehavioursSexualHarmStep = step({
  path: `/${Step.thinkingBehavioursSexualHarm.path}`,
  title: sectionPageTitle(Section.thinking_behaviours_and_attitudes),
  view: {
    locals: {
      sectionTitle: contentFor('step.thinking_behaviours_sexual_harm'),
      pageSubHeading: commonContentFor('sectionTitle.thinking-behaviours-and-attitudes'),
      backlink: createRoute([
        ...baseSanRoute,
        Section.thinking_behaviours_and_attitudes.path,
        Step.thinkingBehavioursRiskOfSexualHarm.path,
      ]),
    },
  },
  blocks: [
    thinkingBehavioursAttitudesSection.questions.sexualPreoccupation.displayModes.field,
    thinkingBehavioursAttitudesSection.questions.offenceRelatedSexualInterest.displayModes.field,
    thinkingBehavioursAttitudesSection.questions.emotionalIntimacy.displayModes.field,
    saveButton,
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.thinking_behaviours_and_attitudes, SectionComplete.no),
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
