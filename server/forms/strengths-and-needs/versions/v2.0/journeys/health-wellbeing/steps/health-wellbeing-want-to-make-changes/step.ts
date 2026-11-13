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
import { sectionTitleClassV2 } from '../../../../constants/formVersion'

export const healthWellbeingWantToMakeChangesStep = step({
  path: `/${Step.health_wellbeing_want_to_make_changes.path}`,
  title: sectionPageTitle(Section.health_and_wellbeing),
  view: {
    locals: {
      sectionTitleClass: sectionTitleClassV2,
      backlink: createRoute([...baseSanRoute, Section.health_and_wellbeing.path, Step.health_wellbeing_details.path]),
    },
  },
  blocks: [healthWellbeingSection.questions.changes.displayModes.field, saveButton],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_QUESTION_PAGE,
      Section.health_and_wellbeing,
      Step.health_wellbeing_want_to_make_changes,
    ),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.health_wellbeing_want_to_make_changes.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.health_wellbeing_want_to_make_changes.code, Section.health_and_wellbeing),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.health_wellbeing_want_to_make_changes.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.health_and_wellbeing, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.health_wellbeing_summary.code, IsUserSubmitted.false),
          StrengthsAndNeedsEffects.commitPendingCommands(),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.health_and_wellbeing,
            Step.health_wellbeing_want_to_make_changes,
          ),
        ],
        next: [
          redirect({
            goto: Step.health_wellbeing_summary.path,
          }),
        ],
      },
      onInvalid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(false),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.health_and_wellbeing, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.health_wellbeing_summary.code, IsUserSubmitted.false),
          StrengthsAndNeedsEffects.commitPendingCommands(),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.health_and_wellbeing,
            Step.health_wellbeing_want_to_make_changes,
          ),
        ],
      },
    }),
  ],
})
