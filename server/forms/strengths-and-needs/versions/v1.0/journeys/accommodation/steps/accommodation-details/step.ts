import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { accommodationSection } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { sectionPath } from '../../../../constants/path'
import { sectionPageTitle } from '../../../../locales'
import { SanAuditEvent, auditPageAction, auditPageView } from '../../../../audit'

export const accommodationDetailsStep = step({
  path: `/${Step.accommodation_details.path}`,
  title: sectionPageTitle(Section.accommodation),
  view: {
    locals: {
      backlink: sectionPath(Section.accommodation),
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
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.accommodation, SectionComplete.no),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.accommodation, Step.accommodation_details),
        ],
        next: [redirect({ goto: Step.accommodation_summary.path })],
      },
    }),
  ],
})
