import {
  Condition,
  Data,
  Post,
  redirect,
  step,
  submit,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
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
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted';

export const accommodationDetailsStep = step({
  path: `/${Step.accommodation_details.path}`,
  title: sectionPageTitle(Section.accommodation),
  view: {
    locals: {
      backlink: createRoute([...baseSanRoute, Section.accommodation.path]),
    },
  },
  blocks: [
    accommodationSection.questions.livingWith.displayModes.field,
    accommodationSection.questions.noAccommodationReason.displayModes.field,
    accommodationSection.questions.pastAccommodationDetails.displayModes.field,
    accommodationSection.questions.suitableHousingLocation.displayModes.field,
    accommodationSection.questions.suitableHousing.displayModes.field,
    accommodationSection.questions.suitableHousingPlanned.displayModes.field,
    accommodationSection.questions.changes.displayModes.field,
    saveButton,
  ],
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.accommodation, Step.accommodation_details)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.accommodation_details.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.accommodation_details.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.accommodation_details.code, IsUserSubmitted.true)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.accommodation, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.accommodation_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.accommodation, Step.accommodation_details),
        ],
        next: [redirect({ goto: Step.accommodation_summary.path })],
      },
    }),
  ],
})
