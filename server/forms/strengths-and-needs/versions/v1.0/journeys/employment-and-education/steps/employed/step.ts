import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { employmentEducationSection } from '../../section'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { sectionPath } from '../../../../constants/path'
import { sectionPageTitle } from '../../../../locales'
import { SanAuditEvent, auditPageAction, auditPageView } from '../../../../audit'

export const employedEmploymentStep = step({
  path: `/${Step.employed.path}`,
  title: sectionPageTitle(Section.employment_and_education),
  view: {
    locals: {
      backlink: sectionPath(Section.employment_and_education),
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
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.employment_and_education, Step.employed)],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.employment_and_education, SectionComplete.no),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.employment_and_education, Step.employed),
        ],
        next: [redirect({ goto: Step.employment_education_summary.path })],
      },
    }),
  ],
})
