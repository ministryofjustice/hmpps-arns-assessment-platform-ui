import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { accommodationSection } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { baseSanRoute } from '../../../../constants/path'
import { sectionPageTitle } from '../../../../locales'
import { createRoute } from '../../../../../../generators'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'

export const noAccommodationStep = step({
  path: `/${Step.community_no_accommodation_reason.path}`,
  title: sectionPageTitle(Section.accommodation),
  view: {
    locals: {
      backlink: createRoute([...baseSanRoute, Section.accommodation.path, Step.community_current_accommodation.path]),
    },
  },
  blocks: [accommodationSection.questions.noAccommodationReason.displayModes.field, saveButton],
  onAccess: [
    auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.accommodation, Step.community_no_accommodation_reason),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.community_no_accommodation_reason.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.community_no_accommodation_reason.code, Section.accommodation),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.community_no_accommodation_reason.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.accommodation, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.accommodation_summary.code, IsUserSubmitted.false),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.accommodation,
            Step.community_no_accommodation_reason,
          ),
        ],
        next: [redirect({ goto: Step.accommodation_changes.path })],
      },
      onInvalid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(false),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.accommodation, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.accommodation_summary.code, IsUserSubmitted.false),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.accommodation,
            Step.community_no_accommodation_reason,
          ),
        ],
      },
    }),
  ],
})
