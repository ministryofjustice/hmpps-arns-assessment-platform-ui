import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { alcoholUseSection } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { baseSanRoute } from '../../../../constants/path'
import { sectionPageTitle } from '../../../../locales'
import { createRoute } from '../../../../../../generators'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'

export const alcoholUseChanges = step({
  path: `/${Step.alcohol_use_changes.path}`,
  title: sectionPageTitle(Section.alcohol_use),
  reachability: { entryWhen: true },
  view: {
    locals: {
      backlink: createRoute([...baseSanRoute, Section.alcohol_use.path]),
    },
  },
  blocks: [alcoholUseSection.questions.changes.displayModes.field, saveButton],
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.alcohol_use, Step.alcohol_use_changes)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.alcohol_use_changes.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.alcohol_use_changes.code, Section.alcohol_use),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.alcohol_use_changes.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.alcohol_use, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.alcohol_use_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.alcohol_use, Step.alcohol_use_changes),
        ],
        next: [redirect({ goto: Step.alcohol_use_summary.path })],
      },
      onInvalid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(false),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.alcohol_use, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.alcohol_use_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.alcohol_use, Step.alcohol_use_changes),
        ],
      },
    }),
  ],
})
