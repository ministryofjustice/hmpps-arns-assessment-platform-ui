import { GovUKRadioInput } from '@form-engine/registry/components/govuk-frontend/radio-input/govukRadioInput'
import { GovUKUtilityClasses } from '@form-engine/utils/govukUtilityClasses'
import { Answer, field, Self, validation } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKCheckboxInput } from '@form-engine/registry/components/govuk-frontend/checkbox-input/govukCheckboxInput'
import { GovUKCharacterCount } from '@form-engine/registry/components/govuk-frontend/character-count/govukCharacterCount'
import { and } from '@form-engine/form/builders/PredicateTestExprBuilder'
import { characterLimits } from '../../../../constants'

export const possessionUseWeaponsDetails = field<GovUKRadioInput>({
  variant: 'govukRadioInput',
  code: 'posession_use_weapons_details',
  label: 'Did this involve possession of a firearm with intent to endanger life or resist arrest?',
  items: [
    { text: 'Yes', value: 'YES' },
    { text: 'No', value: 'NO' },
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.IsRequired()),
      message: 'Select yes or no',
    }),
  ],
  dependent: Answer('previous_convicted_offences').match(Condition.Equals('POSSESSION_USE_WEAPONS')),
})

export const otherSeriousOffenceDetails = field<GovUKCharacterCount>({
  variant: 'govukCharacterCount',
  code: 'other_serious_offence_details',
  label: 'Give details',
  maxLength: characterLimits.c4000,
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.IsRequired()),
      message: 'Give details about any other serious offence',
    }),
    validation({
      when: Answer(Self()).not.match(Condition.String.HasMaxLength(characterLimits.c4000)),
      message: `Details must be ${characterLimits.c4000} or less`,
    }),
  ],
  dependent: Answer('previous_convicted_offences').match(Condition.Equals('OTHER_SERIOUS_OFFENCE')),
})

export const previouslyConvictedOffences = field<GovUKCheckboxInput>({
  code: 'previous_convicted_offences',
  variant: 'govukCheckboxInput',
  fieldset: {
    legend: {
      text: 'Has [subject] previously been convicted of any of these offences?',
      classes: GovUKUtilityClasses.Fieldset.mediumLabel,
    },
  },
  hint: "Select all that apply, or select 'None of these offences'",
  items: [
    { text: 'Murder, attempted murder, threat or conspiracy to murder or manslaughter', value: 'MURDER' },
    { text: 'Wounding or GBH', value: 'WOUNDING_GBH' },
    { text: 'Rape or serious sexual offence against an adult', value: 'SEXUAL_OFFENCE_ADULT' },
    { text: 'Any sexual offence against a child', value: 'SEXUAL_OFFENCE_CHILD' },
    { text: 'Any other offence against a child', value: 'OTHER_OFFENCE_CHILD' },
    { text: 'Criminal damage with intent to endanger life', value: 'CRIMINAL_DAMAGE_INTENT' },
    {
      text: 'Any offence involving possession or use of weapons',
      value: 'POSSESSION_USE_WEAPONS',
      block: possessionUseWeaponsDetails,
    },
    { text: 'Kidnapping or false imprisonment', value: 'KIDNAPPING_FALSE_IMPRISONMENT' },
    { text: 'Arson', value: 'ARSON' },
    { text: 'Racially motivated or racially aggravated offence', value: 'RACIAL_OFFENCE' },
    { text: 'Aggravated burglary', value: 'AGGRAVATED_BURGLARY' },
    { text: 'Robbery', value: 'ROBBERY' },
    {
      text: 'Any other serious offence (for example, blackmail, harassment, stalking, indecent images of children, child neglect or abduction)',
      value: 'OTHER_SERIOUS_OFFENCE',
      block: otherSeriousOffenceDetails,
    },
    { text: 'Any offence committed in custody', value: 'CUSTODY_OFFENCE' },
    { divider: 'or' },
    { text: 'None of these offences', value: 'NONE', behaviour: 'exclusive' },
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.IsRequired()),
      message: "Select all offences that [subject] has been convicted of, or select 'None of these offences'",
    }),
    validation({
      when: and(
        Self().match(Condition.Array.Contains('NONE')),
        Self().match(
          Condition.Array.ContainsAny([
            'MURDER',
            'WOUNDING_GBH',
            'SEXUAL_OFFENCE_ADULT',
            'SEXUAL_OFFENCE_CHILD',
            'OTHER_OFFENCE_CHILD',
            'CRIMINAL_DAMAGE_INTENT',
            'POSSESSION_USE_WEAPONS',
            'KIDNAPPING_FALSE_IMPRISONMENT',
            'ARSON',
            'RACIAL_OFFENCE',
            'AGGRAVATED_BURGLARY',
            'ROBBERY',
            'OTHER_SERIOUS_OFFENCE',
            'CUSTODY_OFFENCE',
          ]),
        ),
      ),
      message: "Select all offences that [subject] has been convicted of, or select 'None of these offences'",
    }),
  ],
})

export const significantBehavioursOrEvents = field<GovUKCheckboxInput>({
  code: 'significant_behaviours_events',
  variant: 'govukCheckboxInput',
  fieldset: {
    legend: {
      text: 'Has [subject] been involved in these significant behaviours or events?',
      classes: GovUKUtilityClasses.Fieldset.mediumLabel,
    },
  },
  hint: "Select all that apply, or select 'None of these significant behaviours or events'",
  items: [
    { text: 'Assaulted or threatened staff', value: 'ASSAULT_THREATEN_STAFF' },
    { text: 'Assaulted or threatened others', value: 'ASSAULT_THREATEN_OTHERS' },
    { text: 'Domestic abuse towards a partner or other member of their family', value: 'DOMESTIC_ABUSE' },
    { text: 'Committed a serious offence while not complying with medication', value: 'SERIOUS_OFFENCE_MEDICATION' },
    { text: 'Hate-based behaviour', value: 'HATE_BEHAVIOUR' },
    { text: 'Assessed as high risk of serious harm on previous occasion', value: 'HIGH_RISK_PREVIOUS' },
    {
      text: 'Been a conditionally-charged patient subject to a restriction order under Section 41 MHA 1983',
      value: 'CONDITIONALLY_CHARGED',
    },
    { text: 'Stalking', value: 'STALKING' },
    { text: 'Obsessive behaviour linked to offending', value: 'OBSESSIVE_BEHAVIOUR' },
    { text: 'Displayed offence-related behaviour in custody', value: 'OFFENCE_RELATED_CUSTODY' },
    {
      text: 'Displayed inappropriate behaviour towards custodial staff, visitors or prisoners',
      value: 'INAPPROPRIATE_BEHAVIOUR',
    },
    {
      text: 'Established links or associations while in custody that increase risk of serious harm',
      value: 'ESTABLISHED_LINKS',
    },
    {
      text: 'Perpetrated any behaviours relating to group-based child sexual exploitation',
      value: 'GROUP_CHILD_EXPLOITATION',
    },
    { divider: 'or' },
    { text: 'None of these significant behaviours or events', value: 'NONE', behaviour: 'exclusive' },
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.IsRequired()),
      message:
        "Select all significant behaviours and events that [subject] has been involved in, or select 'None of these significant behaviours or events'",
    }),
    validation({
      when: and(
        Self().match(Condition.Array.Contains('NONE')),
        Self().match(
          Condition.Array.ContainsAny([
            'ASSAULT_THREATEN_STAFF',
            'ASSAULT_THREATEN_OTHERS',
            'DOMESTIC_ABUSE',
            'SERIOUS_OFFENCE_MEDICATION',
            'HATE_BEHAVIOUR',
            'HIGH_RISK_PREVIOUS',
            'CONDITIONALLY_CHARGED',
            'STALKING',
            'OBSESSIVE_BEHAVIOUR',
            'OFFENCE_RELATED_CUSTODY',
            'INAPPROPRIATE_BEHAVIOUR',
            'ROBBERY',
            'ESTABLISHED_LINKS',
            'GROUP_CHILD_EXPLOITATION',
          ]),
        ),
      ),
      message:
        "Select all significant behaviours and events that [subject] has been involved in, or select 'None of these significant behaviours or events'",
    }),
  ],
})

export const civilAncillaryOrdersYesDetails = field<GovUKCheckboxInput>({
  code: 'civil_ancillary_orders_yes_details',
  variant: 'govukCheckboxInput',
  label: 'Select all that apply',
  items: [
    { text: 'Banning order', value: 'BANNING' },
    { text: 'Child arrangement order', value: 'CHILD_ARRANGEMENT' },
    { text: 'Civil injunction', value: 'CIVIL_INJUNCTION' },
    { text: 'Community protection notice', value: 'COMMUNITY_PROTECTION' },
    { text: 'Criminal behaviour order', value: 'CRIMINAL_BEHAVIOUR' },
    { text: 'Female genital mutilation order', value: 'FEMALE_GENITAL_MUTILATION' },
    { text: 'Forced marriage order', value: 'FORCED_MARRIAGE' },
    { text: 'Knife crime prevention order', value: 'KNIFE_CRIME_PREVENTION' },
    { text: 'Non-molestation order', value: 'NON_MOLESTATION' },
    { text: 'Occupation order', value: 'OCCUPATION' },
    { text: 'Prohibited steps order', value: 'PROHIBITED_STEPS' },
    { text: 'Public spaces protection order', value: 'PUBLIC_SPACES_PROTECTION' },
    { text: 'Restraining orders', value: 'RESTRAINING' },
    { text: 'Serious crime prevention order', value: 'SERIOUS_CRIME_PREVENTION' },
    { text: 'Serious violence reduction order', value: 'SERIOUS_VIOLENCE_REDUCTION' },
    { text: 'Sexual harm prevention orders', value: 'SEXUAL_HARM_PREVENTION' },
    { text: 'Sexual risk order', value: 'SEXUAL_RISK' },
    { text: 'Slavery and trafficking prevention and risk orders', value: 'SLAVERY_TRAFFICKING_PREVENTION' },
    { text: 'Stalking protection order', value: 'STALKING_PROTECTION' },
    { text: 'Violent offender order', value: 'VIOLENT_OFFENDER' },
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.IsRequired()),
      message: 'Select all civil and ancillary orders that [subject] is currently subject to',
    }),
  ],
  dependent: Answer('civil_ancillary_orders').match(Condition.Equals('YES')),
})

export const civilOrAncillaryOrders = field<GovUKRadioInput>({
  code: 'civil_ancillary_orders',
  variant: 'govukRadioInput',
  fieldset: {
    legend: {
      text: 'Is [subject] currently subject to any civil or ancillary orders?',
      classes: GovUKUtilityClasses.Fieldset.mediumLabel,
    },
  },
  items: [
    { text: 'Yes', value: 'YES', block: civilAncillaryOrdersYesDetails },
    { text: 'No', value: 'NO' },
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.IsRequired()),
      message: 'Select yes or no',
    }),
  ],
})
