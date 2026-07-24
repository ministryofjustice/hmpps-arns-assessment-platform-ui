import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import {
  accommodationChanges,
  livingWith,
  noAccommodationReason,
  pastAccommodationDetails,
  suitableHousing,
  suitableHousingLocation,
  suitableHousingPlanned,
} from './fields'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Section, SectionStatus } from '../../../../constants/section'
import { sectionPath } from '../../../../constants/path'

export const accommodationDetailsStep = step({
  path: `/${Step.accommodation_details.path}`,
  title: 'Settled accommodation', // TODO: contentFor('step.settled_accommodation')
  view: {
    locals: {
      backlink: sectionPath(Section.accommodation),
    },
  },
  blocks: [
    livingWith,
    noAccommodationReason,
    pastAccommodationDetails,
    suitableHousingLocation,
    suitableHousing,
    suitableHousingPlanned,
    accommodationChanges,
    saveButton,
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.accommodation.statusKey, SectionStatus.incomplete),
        ],
        next: [redirect({ goto: Step.accommodation_summary.path })],
      },
    }),
  ],
})
