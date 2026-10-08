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
  path: `/${Step.accommodation_status.path}`,
  title: sectionPageTitle(Section.accommodation),
  reachability: { entryWhen: true },
  view: {
    locals: {
      sectionTitleClass,
    },
  },
  blocks: [accommodationSection.questions.currentAccommodation.displayModes.field, saveButton],
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.accommodation, Step.accommodation_status)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.accommodation_status.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autoSaveAccommodationSubmit(Step.accommodation_status.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.accommodation_status.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentAccommodationStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.accommodation, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.accommodation_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.accommodation, Step.accommodation_status),
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
