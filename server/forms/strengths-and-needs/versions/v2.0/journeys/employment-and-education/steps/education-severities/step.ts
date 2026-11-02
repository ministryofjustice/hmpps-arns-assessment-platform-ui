import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { employmentEducationSection } from '../../section'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { sectionTitleClass } from '../../../../constants/formVersion'
import { sectionPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'

export const educationSeveritiesStep = step({
  path: `/${Step.education_severities.path}`,
  title: sectionPageTitle(Section.employment_and_education),
  reachability: { entryWhen: true },
  view: {
    locals: {
      sectionTitleClass,
    },
  },
  blocks: [
    employmentEducationSection.questions.readingSeverity.displayModes.field,
    employmentEducationSection.questions.writingSeverity.displayModes.field,
    employmentEducationSection.questions.numeracySeverity.displayModes.field,
    saveButton,
  ],
  onAccess: [
    auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.employment_and_education, Step.education_severities),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.education_severities.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.education_severities.code, Section.employment_and_education),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.education_severities.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.employment_and_education, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.employment_education_summary.code, IsUserSubmitted.false),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.employment_and_education,
            Step.education_severities,
          ),
        ],
        next: [
          redirect({
            goto: Step.employment_education_details.path,
          }),
        ],
      },
      onInvalid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(false),
          StrengthsAndNeedsEffects.setSectionProgress(Section.employment_and_education, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.employment_education_summary.code, IsUserSubmitted.false),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.employment_and_education,
            Step.education_severities,
          ),
        ],
      },
    }),
  ],
})
