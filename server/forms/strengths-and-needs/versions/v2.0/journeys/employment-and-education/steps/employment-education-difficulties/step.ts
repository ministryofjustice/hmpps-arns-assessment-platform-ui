import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { employmentEducationSection } from '../../section'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { sectionPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'
import { createRoute } from '../../../../../../generators'
import { baseSanRoute } from '../../../../constants/path'

export const educationDifficultiesStep = step({
  path: `/${Step.education_difficulties.path}`,
  title: sectionPageTitle(Section.employment_and_education),
  reachability: { entryWhen: true },
  view: {
    locals: {
      backlink: createRoute([
        ...baseSanRoute,
        Section.employment_and_education.path,
        Step.employment_education_details.path,
      ]),
    },
  },
  blocks: [
    employmentEducationSection.questions.readingDifficulties.displayModes.field,
    employmentEducationSection.questions.writingDifficulties.displayModes.field,
    employmentEducationSection.questions.numeracyDifficulties.displayModes.field,
    saveButton,
  ],
  onAccess: [
    auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.employment_and_education, Step.education_difficulties),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.education_difficulties.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.education_difficulties.code, Section.employment_and_education),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.education_difficulties.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.employment_and_education, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.employment_education_summary.code, IsUserSubmitted.false),
          StrengthsAndNeedsEffects.commitPendingCommands(),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.employment_and_education,
            Step.education_difficulties,
          ),
        ],
        next: [
          redirect({
            goto: Step.employment_changes.path,
          }),
        ],
      },
      onInvalid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(false),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.employment_and_education, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.employment_education_summary.code, IsUserSubmitted.false),
          StrengthsAndNeedsEffects.commitPendingCommands(),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.employment_and_education,
            Step.education_difficulties,
          ),
        ],
      },
    }),
  ],
})
