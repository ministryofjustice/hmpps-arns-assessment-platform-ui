import { step, submit, redirect, Post, Answer, and, or, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { currentAccommodation } from './fields'
import { saveButton } from '../../../../constants/buttons'
import { locale } from '../../constants/locale'
import { Step } from '../../constants/step'
import { Section, SectionStatus } from '../../../../constants/section'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'

export const currentAccommodationStep = step({
  path: `/${Step.current_accommodation.path}`,
  title: locale.step[Step.current_accommodation.code],
  reachability: { entryWhen: true },
  view: {
    locals: {
      sectionTitleClass: 'govuk-body-l',
    },
  },
  blocks: [currentAccommodation, saveButton],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.accommodation.statusKey, SectionStatus.incomplete),
        ],
        next: [
          redirect({
            when: Answer(Question.current_accommodation).match(Condition.Equals(Option.settled)),
            goto: Step.settled_accommodation.path,
          }),
          redirect({
            when: and(
              Answer(Question.current_accommodation).match(Condition.Equals(Option.temporary)),
              or(
                Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.short_term)),
                Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.immigration)),
              ),
            ),
            goto: Step.temporary_accommodation.path,
          }),
          redirect({
            when: Answer(Question.current_accommodation).match(Condition.Equals(Option.temporary)),
            goto: Step.temporary_accommodation_cas_ap.path,
          }),
          redirect({
            when: Answer(Question.current_accommodation).match(Condition.Equals(Option.no_accommodation)),
            goto: Step.no_accommodation.path,
          }),
        ],
      },
    }),
  ],
})
