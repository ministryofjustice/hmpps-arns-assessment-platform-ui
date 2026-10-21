import { Condition, not, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { accommodationSection, hasAccommodation } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { sectionPageTitle } from '../../../../locales'
import { sectionTitleClass } from '../../../../constants/formVersion'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autoSaveAccommodationSubmit } from '../../../../autosaveAccommodation'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'

export const currentAccommodationStep = step({
  path: `/${Step.community_current_accommodation.path}`,
  title: sectionPageTitle(Section.accommodation),
  reachability: { entryWhen: true },
  view: {
    locals: {
      sectionTitleClass,
    },
  },
  blocks: [accommodationSection.questions.currentAccommodation.displayModes.field, saveButton],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_QUESTION_PAGE,
      Section.accommodation,
      Step.community_current_accommodation,
    ),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.community_current_accommodation.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autoSaveAccommodationSubmit(Step.community_current_accommodation.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.community_current_accommodation.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentAccommodationStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.accommodation, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.accommodation_summary.code, IsUserSubmitted.false),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.accommodation,
            Step.community_current_accommodation,
          ),
        ],
        next: [
          redirect({ when: not(hasAccommodation), goto: Step.community_no_accommodation_reason.path }),
          redirect({ goto: Step.community_current_accommodation_settled.path }),
        ],
      },
      onInvalid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentAccommodationStepAnswers(false),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.accommodation, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.accommodation_summary.code, IsUserSubmitted.false),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.accommodation,
            Step.community_current_accommodation,
          ),
        ],
      },
    }),
  ],
})
