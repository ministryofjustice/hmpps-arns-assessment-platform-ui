import {
  Condition,
  Data,
  Post,
  redirect, Session,
  step,
  submit,
  validation
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { employmentEducationSection } from '../../section'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { sectionTitleClass } from '../../../../constants/formVersion'
import { sectionPageTitle } from '../../../../locales'
import { SanAuditEvent, auditPageAction, auditPageView } from '../../../../audit'
import { autosaveAction, autosaveSubmit } from '../../../../autosave'
import { isEditMode } from '../../../../guards';

export const currentEmploymentStep = step({
  path: `/${Step.current_employment.path}`,
  title: sectionPageTitle(Section.employment_and_education),
  reachability: { entryWhen: true },
  view: {
    locals: {
      sectionTitleClass,
    },
  },
  blocks: [employmentEducationSection.questions.currentEmploymentStatus.displayModes.field, saveButton],
  onAccess: [
    auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.employment_and_education, Step.current_employment),
  ],
  validWhen: [
    validation({
      condition: Session('userSubmitted').path(Step.current_employment.code).match(Condition.Equals(true)),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals(autosaveAction)),
      guards: isEditMode,
      validate: false,
      onAlways: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.current_employment.code, false),
        ],
      },
    }),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.current_employment.code, true)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.employment_and_education, SectionComplete.no),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.employment_and_education, Step.current_employment),
        ],
        next: [
          redirect({
            goto: Step.employed.path,
          }),
        ],
      },
    }),
  ],
})
