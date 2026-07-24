import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { currentAccommodation } from './fields'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Section, SectionStatus } from '../../../../constants/section'

export const currentAccommodationStep = step({
  path: `/${Step.current_accommodation.path}`,
  title: 'Current accommodation', // TODO: contentFor('step.current_accommodation')
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
            goto: Step.accommodation_details.path,
          }),
        ],
      },
    }),
  ],
})
