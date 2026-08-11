import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { healthWellbeingSection } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { sectionPageTitle } from '../../../../locales'

export const healthWellbeingStep = step({
  path: `/${Step.health_wellbeing.path}`,
  title: sectionPageTitle(Section.health_and_wellbeing),
  reachability: { entryWhen: true },
  blocks: [
    healthWellbeingSection.fields.healthConditions.displayModes.field,
    healthWellbeingSection.fields.mentalHealthProblems.displayModes.field,
    saveButton,
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.health_and_wellbeing, SectionComplete.no),
        ],
        next: [
          redirect({
            goto: Step.physical_mental_health.path,
          }),
        ],
      },
    }),
  ],
})
