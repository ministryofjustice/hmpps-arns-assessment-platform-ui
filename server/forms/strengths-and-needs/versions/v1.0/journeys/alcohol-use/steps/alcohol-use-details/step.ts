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

export const alcoholUseDetailsStep = step({
  path: `/${Step.alcohol_use_details.path}`,
  title: sectionPageTitle(Section.alcohol_use),
  view: {
    locals: {
      backlink: createRoute([...baseSanRoute, Section.alcohol_use.path]),
    },
  },
  blocks: [
    alcoholUseSection.questions.frequency.displayModes.field,
    alcoholUseSection.questions.units.displayModes.field,
    alcoholUseSection.questions.bingeDrinking.displayModes.field,
    alcoholUseSection.questions.evidenceOfExcessDrinking.displayModes.field,
    alcoholUseSection.questions.pastIssues.displayModes.field,
    alcoholUseSection.questions.reasonsForUse.displayModes.field,
    alcoholUseSection.questions.impactOfUse.displayModes.field,
    alcoholUseSection.questions.stoppedOrReduced.displayModes.field,
    alcoholUseSection.questions.changes.displayModes.field,
    saveButton,
  ],
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.alcohol_use, Step.alcohol_use_details)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.alcohol_use_details.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.alcohol_use_details.code, Section.alcohol_use),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.alcohol_use_details.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveAndClearStaleAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.alcohol_use, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.alcohol_use_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.alcohol_use, Step.alcohol_use_details),
        ],
        next: [redirect({ goto: Step.alcohol_use_summary.path })],
      },
    }),
  ],
})
