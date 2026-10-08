import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { healthWellbeingSection } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { baseSanRoute } from '../../../../constants/path'
import { sectionPageTitle } from '../../../../locales'
import { createRoute } from '../../../../../../generators'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'

export const healthWellbeingDetailsStep = step({
  path: `/${Step.health_wellbeing_details.path}`,
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
  onAccess: [
    auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.health_and_wellbeing, Step.health_wellbeing_details),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.health_wellbeing_details.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.health_wellbeing_details.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.health_wellbeing_details.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveAndClearStaleAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.health_and_wellbeing, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.health_wellbeing_summary.code, IsUserSubmitted.false),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.health_and_wellbeing,
            Step.health_wellbeing_details,
          ),
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
