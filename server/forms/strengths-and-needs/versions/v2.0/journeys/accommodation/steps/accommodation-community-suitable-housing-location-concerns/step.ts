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

export const suitableHousingLocationConcernsStep = step({
  path: `/${Step.community_suitable_housing_location_concerns.path}`,
  title: sectionPageTitle(Section.accommodation),
  view: {
    locals: {
      backlink: createRoute([...baseSanRoute, Section.accommodation.path]),
    },
  },
  blocks: [accommodationSection.questions.suitableHousingLocationConcerns.displayModes.field, saveButton],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_QUESTION_PAGE,
      Section.accommodation,
      Step.community_suitable_housing_location_concerns,
    ),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.community_suitable_housing_location_concerns.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.community_suitable_housing_location_concerns.code, Section.accommodation),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [
          StrengthsAndNeedsEffects.setUserSubmitted(
            Step.community_suitable_housing_location_concerns.code,
          ),
        ],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.accommodation, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.accommodation_summary.code, IsUserSubmitted.false),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.accommodation,
            Step.community_suitable_housing_location_concerns,
          ),
        ],
        next: [redirect({ goto: Step.community_suitable_housing.path })],
      },
      onInvalid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(false),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.accommodation, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.accommodation_summary.code, IsUserSubmitted.false),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.accommodation,
            Step.community_suitable_housing_location_concerns,
          ),
        ],
      },
    }),
  ],
})
