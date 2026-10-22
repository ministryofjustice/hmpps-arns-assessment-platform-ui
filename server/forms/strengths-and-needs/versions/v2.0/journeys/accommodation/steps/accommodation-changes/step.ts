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
import {
  accommodationSection,
  hasNoAccommodation,
  isSuitableAccommodation,
} from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { baseSanRoute } from '../../../../constants/path'
import { sectionPageTitle } from '../../../../locales'
import { createRoute } from '../../../../../../generators'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'

export const accommodationChangesStep = step({
  path: `/${Step.accommodation_changes.path}`,
  title: sectionPageTitle(Section.accommodation),
  view: {
    locals: {
      backlink: when(hasNoAccommodation)
        .then(createRoute([...baseSanRoute, Section.accommodation.path, Step.community_no_accommodation_reason.path]))
        .else(
          when(isSuitableAccommodation)
            .then(createRoute([...baseSanRoute, Section.accommodation.path, Step.community_suitable_housing.path]))
            .else(
              createRoute([...baseSanRoute, Section.accommodation.path, Step.community_suitable_housing_concerns.path]),
            ),
        ),
    },
  },
  blocks: [accommodationSection.questions.changes.displayModes.field, saveButton],
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.accommodation, Step.accommodation_changes)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.accommodation_changes.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.accommodation_changes.code, Section.accommodation),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.accommodation_changes.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.accommodation, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.accommodation_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.accommodation, Step.accommodation_changes),
        ],
        next: [redirect({ goto: Step.accommodation_summary.path })],
      },
      onInvalid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(false),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.accommodation, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.accommodation_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.accommodation, Step.accommodation_changes),
        ],
      },
    }),
  ],
})
