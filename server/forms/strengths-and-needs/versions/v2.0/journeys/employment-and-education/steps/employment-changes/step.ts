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
import { employmentEducationSection, hasEducationalDifficulties } from '../../section'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { sectionTitleClassV2 } from '../../../../constants/formVersion'
import { sectionPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'
import { createRoute } from '../../../../../../generators'
import { baseSanRoute } from '../../../../constants/path'

export const employmentChangesStep = step({
  path: `/${Step.employment_changes.path}`,
  title: sectionPageTitle(Section.employment_and_education),
  reachability: { entryWhen: true },
  view: {
    locals: {
      sectionTitleClass: sectionTitleClassV2,
      backlink: when(hasEducationalDifficulties)
        .then(createRoute([...baseSanRoute, Section.employment_and_education.path, Step.education_difficulties.path]))
        .else(
          createRoute([...baseSanRoute, Section.employment_and_education.path, Step.employment_education_details.path]),
        ),
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
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.employment_and_education, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.employment_education_summary.code, IsUserSubmitted.false),
          StrengthsAndNeedsEffects.commitPendingCommands(),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.employment_and_education, Step.employment_changes),
        ],
        next: [
          redirect({
            goto: Step.employment_education_summary.path,
          }),
        ],
      },
      onInvalid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(false),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.employment_and_education, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.employment_education_summary.code, IsUserSubmitted.false),
          StrengthsAndNeedsEffects.commitPendingCommands(),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.employment_and_education, Step.employment_changes),
        ],
      },
    }),
  ],
})
