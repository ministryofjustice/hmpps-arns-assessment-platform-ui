import {
  Condition,
  Post,
  redirect,
  step,
  submit,
  validation,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { employmentEducationSection, hasEducationalDifficulties, notWorkingOrAvailableForWork } from '../../section'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { baseSanRoute } from '../../../../constants/path'
import { sectionPageTitle } from '../../../../locales'
import { createRoute } from '../../../../../../generators'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'
import { sectionTitleClass } from '../../../../constants/formVersion'

export const employmentEducationDetailsStep = step({
  path: `/${Step.employment_education_details.path}`,
  title: sectionPageTitle(Section.employment_and_education),
  view: {
    locals: {
      sectionTitleClass,
      backlink: when(notWorkingOrAvailableForWork)
        .then(createRoute([...baseSanRoute, Section.employment_and_education.path, Step.community_ever_had_a_job.path]))
        .else(createRoute([...baseSanRoute, Section.employment_and_education.path, Step.employment_status.path])),
    },
  },
  blocks: [
    employmentEducationSection.questions.employmentHistory.displayModes.field,
    employmentEducationSection.questions.dayToDayCommitments.displayModes.field,
    employmentEducationSection.questions.academicProfessionalOrVocationalQualifications.displayModes.field,
    employmentEducationSection.questions.jobSkills.displayModes.field,
    employmentEducationSection.questions.difficultiesReadingWritingNumeracy.displayModes.field,
    saveButton,
  ],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_QUESTION_PAGE,
      Section.employment_and_education,
      Step.employment_education_details,
    ),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.employment_education_details.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.employment_education_details.code, Section.employment_and_education),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.employment_education_details.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.employment_and_education, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.employment_education_summary.code, IsUserSubmitted.false),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.employment_and_education,
            Step.employment_education_details,
          ),
        ],
        next: [
          redirect({
            when: hasEducationalDifficulties,
            goto: Step.education_difficulties.path,
          }),
          redirect({ goto: Step.employment_changes.path }),
        ],
      },
      onInvalid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(false),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.employment_and_education, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.employment_education_summary.code, IsUserSubmitted.false),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.employment_and_education,
            Step.employment_education_details,
          ),
        ],
      },
    }),
  ],
})
