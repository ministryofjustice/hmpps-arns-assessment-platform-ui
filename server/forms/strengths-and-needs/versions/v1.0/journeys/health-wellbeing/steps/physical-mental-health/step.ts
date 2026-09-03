import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { healthWellbeingSection } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { baseSanRoute } from '../../../../constants/path'
import { sectionPageTitle } from '../../../../locales'
import { createRoute } from '../../../../../../generators'

export const physicalMentalHealthStep = step({
  path: `/${Step.physical_mental_health.path}`,
  title: sectionPageTitle(Section.health_and_wellbeing),
  view: {
    locals: {
      backlink: createRoute([...baseSanRoute, Section.health_and_wellbeing.path]),
    },
  },
  blocks: [
    healthWellbeingSection.questions.prescribedPhysicalHealthMedicationsTreatments.displayModes.field,
    healthWellbeingSection.questions.prescribedMentalHealthMedicationsTreatments.displayModes.field,
    healthWellbeingSection.questions.psychiatricTreatment.displayModes.field,
    healthWellbeingSection.questions.headInjuries.displayModes.field,
    healthWellbeingSection.questions.neurodiverseConditions.displayModes.field,
    healthWellbeingSection.questions.impactOnLearningAbilities.displayModes.field,
    healthWellbeingSection.questions.copeWithDayToDayLife.displayModes.field,
    healthWellbeingSection.questions.attitudeTowardsSelf.displayModes.field,
    healthWellbeingSection.questions.selfHarm.displayModes.field,
    healthWellbeingSection.questions.suicidalTendencies.displayModes.field,
    healthWellbeingSection.questions.feelingsAboutFuture.displayModes.field,
    healthWellbeingSection.questions.helpedDuringPeriodsGoodHealthWellbeing.displayModes.field,
    healthWellbeingSection.questions.changes.displayModes.field,
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
            goto: Step.health_wellbeing_summary.path,
          }),
        ],
      },
    }),
  ],
})
