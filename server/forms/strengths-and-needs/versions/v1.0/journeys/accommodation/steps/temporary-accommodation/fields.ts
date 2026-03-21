import { validation, Self, Answer, Format } from '@form-engine/form/builders'
import { GovUKRadioInput, GovUKCharacterCount } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { CaseData } from '../../../../constants'

// --- Suitable Housing Planned Group ---

const futureAccommodationAwaitingAssessmentDetails = GovUKCharacterCount({
  code: 'future_accommodation_type_awaiting_assessment_details',
  label: 'Give details',
  maxLength: 2000,
  dependent: Answer('future_accommodation_type').match(Condition.Equals('AWAITING_ASSESSMENT')),
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter details',
    }),
  ],
})

const futureAccommodationAwaitingPlacementDetails = GovUKCharacterCount({
  code: 'future_accommodation_type_awaiting_placement_details',
  label: 'Give details',
  maxLength: 2000,
  dependent: Answer('future_accommodation_type').match(Condition.Equals('AWAITING_PLACEMENT')),
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter details',
    }),
  ],
})

const futureAccommodationOtherDetails = GovUKCharacterCount({
  code: 'future_accommodation_type_other_details',
  label: 'Give details',
  hint: 'Include where and who with.',
  maxLength: 2000,
  dependent: Answer('future_accommodation_type').match(Condition.Equals('OTHER')),
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter details',
    }),
  ],
})

export const futureAccommodationType = GovUKRadioInput({
  code: 'future_accommodation_type',
  fieldset: {
    legend: {
      text: 'What is the type of future accommodation?',
      classes: 'govuk-visually-hidden',
    },
  },
  dependent: Answer('suitable_housing_planned').match(Condition.Equals('YES')),
  items: [
    {
      value: 'AWAITING_ASSESSMENT',
      text: 'Awaiting assessment',
      block: futureAccommodationAwaitingAssessmentDetails,
    },
    {
      value: 'AWAITING_PLACEMENT',
      text: 'Awaiting placement',
      block: futureAccommodationAwaitingPlacementDetails,
    },
    { value: 'BUYING_HOUSE', text: 'Buy a house' },
    { value: 'LIVING_WITH_FRIENDS_OR_FAMILY', text: 'Living with friends or family' },
    { value: 'RENT_PRIVATELY', text: 'Rent privately' },
    { value: 'RENT_SOCIAL', text: 'Rent from social, local authority or other' },
    { value: 'RESIDENTIAL_HEALTHCARE', text: 'Residential healthcare' },
    { value: 'SUPPORTED_ACCOMMODATION', text: 'Supported accommodation' },
    { value: 'OTHER', text: 'Other', block: futureAccommodationOtherDetails },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select the type of future accommodation',
    }),
  ],
})

export const suitableHousingPlanned = GovUKRadioInput({
  code: 'suitable_housing_planned',
  fieldset: {
    legend: {
      text: Format('Does %1 have future accommodation planned?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'YES', text: 'Yes', block: futureAccommodationType },
    { value: 'NO', text: 'No' },
    { value: 'UNKNOWN', text: 'Unknown' },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select if they have future accommodation planned',
    }),
  ],
})
