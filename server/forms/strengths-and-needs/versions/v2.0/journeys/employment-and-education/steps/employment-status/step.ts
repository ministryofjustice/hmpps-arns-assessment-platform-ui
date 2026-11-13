import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { employmentEducationSection, notWorkingOrAvailableForWork } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { sectionTitleClassV2 } from '../../../../constants/formVersion'
import { sectionPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'
import { Section, SectionComplete } from '../../../../constants/section'

export const employmentStatusStep = step({
  path: `/${Step.employment_status.path}`,
  title: sectionPageTitle(Section.employment_and_education),
  reachability: { entryWhen: true },
  view: {
    locals: {
      sectionTitleClass: sectionTitleClassV2,
    },
  },
  blocks: [employmentEducationSection.questions.currentEmploymentStatus.displayModes.field, saveButton],
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.employment_and_education, Step.employment_status)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.employment_status.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.employment_status.code, Section.employment_and_education),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.employment_status.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.employment_and_education, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.employment_education_summary.code, IsUserSubmitted.false),
          StrengthsAndNeedsEffects.commitPendingCommands(),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.employment_and_education, Step.employment_status),
        ],
        next: [
          redirect({
            when: notWorkingOrAvailableForWork,
            goto: Step.community_ever_had_a_job.path,
          }),
          redirect({
            goto: Step.employment_education_details.path,
          }),
        ],
      },
      onInvalid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(false),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.employment_and_education, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.employment_education_summary.code, IsUserSubmitted.false),
          StrengthsAndNeedsEffects.commitPendingCommands(),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.employment_and_education, Step.employment_status),
        ],
      },
    }),
  ],
})
