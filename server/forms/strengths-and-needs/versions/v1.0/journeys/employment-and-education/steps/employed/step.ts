import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { employmentEducationSection } from '../../section'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { baseSanRoute } from '../../../../constants/path'
import { sectionPageTitle } from '../../../../locales'
import { createRoute } from '../../../../../../generators'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'

export const employedEmploymentStep = step({
  path: `/${Step.employment_education_details.path}`,
  title: sectionPageTitle(Section.employment_and_education),
  view: {
    locals: {
      backlink: createRoute([...baseSanRoute, Section.employment_and_education.path]),
    },
  },
  blocks: [
    employmentEducationSection.questions.employmentSector.displayModes.field,
    employmentEducationSection.questions.employmentHistory.displayModes.field,
    employmentEducationSection.questions.dayToDayCommitments.displayModes.field,
    employmentEducationSection.questions.academicQualification.displayModes.field,
    employmentEducationSection.questions.professionalQualification.displayModes.field,
    employmentEducationSection.questions.jobSkills.displayModes.field,
    employmentEducationSection.questions.difficultiesReadingWritingNumeracy.displayModes.field,
    employmentEducationSection.questions.employmentExperience.displayModes.field,
    employmentEducationSection.questions.educationExperience.displayModes.field,
    employmentEducationSection.questions.changes.displayModes.field,
    saveButton,
  ],
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.employment_and_education, Step.employment_education_details)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.employment_education_details.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.employment_education_details.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.employment_education_details.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveAndClearStaleAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.employment_and_education, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.employment_education_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.employment_and_education, Step.employment_education_details),
        ],
        next: [redirect({ goto: Step.employment_education_summary.path })],
      },
    }),
  ],
})
