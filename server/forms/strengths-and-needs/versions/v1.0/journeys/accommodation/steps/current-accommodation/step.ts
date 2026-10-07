import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { accommodationSection } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { sectionPageTitle } from '../../../../locales'
import { sectionTitleClass } from '../../../../constants/formVersion'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autoSaveAccommodationSubmit } from '../../../../autosaveAccommodation'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'

export const currentAccommodationStep = step({
  path: `/${Step.current_accommodation.path}`,
  title: sectionPageTitle(Section.accommodation),
  reachability: { entryWhen: true },
  view: {
    locals: {
      sectionTitleClass,
    },
  },
  blocks: [accommodationSection.questions.currentAccommodation.displayModes.field, saveButton],
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.accommodation, Step.current_accommodation)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.current_accommodation.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autoSaveAccommodationSubmit(Step.current_accommodation.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.current_accommodation.code, IsUserSubmitted.true)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentAccommodationStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.accommodation, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.accommodation_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.accommodation, Step.current_accommodation),
        ],
        next: [
          redirect({
            goto: Step.accommodation_details.path,
          }),
        ],
      },
    }),
  ],
})
