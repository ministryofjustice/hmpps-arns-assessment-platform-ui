import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { healthWellbeingSection } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { sectionPath } from '../../../../constants/path'
import { sectionPageTitle } from '../../../../locales'

export const physicalMentalHealthStep = step({
  path: `/${Step.physical_mental_health.path}`,
  title: sectionPageTitle(Section.health_and_wellbeing),
  view: {
    locals: {
      backlink: sectionPath(Section.health_and_wellbeing),
    },
  },
  blocks: [
    healthWellbeingSection.fields.prescribedPhysicalHealthMedicationsTreatments.displayModes.field,
    healthWellbeingSection.fields.prescribedMentalHealthMedicationsTreatments.displayModes.field,
    healthWellbeingSection.fields.psychiatricTreatment.displayModes.field,
    healthWellbeingSection.fields.headInjuries.displayModes.field,
    healthWellbeingSection.fields.neurodiverseConditions.displayModes.field,
    healthWellbeingSection.fields.impactOnLearningAbilities.displayModes.field,
    healthWellbeingSection.fields.copeWithDayToDayLife.displayModes.field,
    healthWellbeingSection.fields.attitudeTowardsSelf.displayModes.field,
    healthWellbeingSection.fields.selfHarm.displayModes.field,
    healthWellbeingSection.fields.suicidalTendencies.displayModes.field,
    healthWellbeingSection.fields.feelingsAboutFuture.displayModes.field,
    healthWellbeingSection.fields.helpedDuringPeriodsGoodHealthWellbeing.displayModes.field,
    healthWellbeingSection.fields.changes.displayModes.field,
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
