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

export const employmentChangesStep = step({
  path: `/${Step.employment_changes.path}`,
  title: sectionPageTitle(Section.employment_and_education),
  reachability: { entryWhen: true },
  view: {
    locals: {
      sectionTitleClass,
    },
  },
  blocks: [employmentEducationSection.questions.changes.displayModes.field, saveButton],
  onAccess: [
    auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.employment_and_education, Step.employment_changes),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.employment_changes.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.employment_changes.code, Section.employment_and_education),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.employment_changes.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.employment_and_education, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.employment_education_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.employment_and_education, Step.employment_changes),
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
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.employment_and_education, Step.employment_changes),
        ],
      },
    }),
  ],
})
