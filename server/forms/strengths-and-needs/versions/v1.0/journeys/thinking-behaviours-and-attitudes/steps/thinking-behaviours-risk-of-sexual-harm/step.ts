import { Answer, Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Step } from '../../constants/step'
import { Question } from '../../constants/question'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { contentFor } from '../../locales'
import { commonContentFor, sectionPageTitle } from '../../../../locales'
import { sectionPath } from '../../../../constants/path'
import { CommonOption } from '../../../../constants/commonOption'
import { thinkingBehavioursAttitudesSection } from '../../section'

export const thinkingBehavioursRiskOfSexualHarmStep = step({
  path: `/${Step.thinkingBehavioursRiskOfSexualHarm.path}`,
  title: sectionPageTitle(Section.thinking_behaviours_and_attitudes),
  view: {
    locals: {
      sectionTitle: contentFor('step.thinking_behaviours_sexual_harm'),
      pageSubHeading: commonContentFor('sectionTitle.thinking-behaviours-and-attitudes'),
      sectionTitleClass: 'govuk-body-l',
      backlink: sectionPath(Section.thinking_behaviours_and_attitudes) + Step.thinkingBehaviours.path,
    },
  },
  blocks: [thinkingBehavioursAttitudesSection.fields.riskSexualHarm.displayModes.field, saveButton],
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
            when: Answer(Question.thinking_behaviours_attitudes_risk_sexual_harm).match(
              Condition.Equals(CommonOption.yes),
            ),
            goto: Step.thinkingBehavioursSexualHarm.path,
          }),
          redirect({
            goto: Step.thinkingBehavioursSummary.path,
          }),
        ],
      },
    }),
  ],
})
