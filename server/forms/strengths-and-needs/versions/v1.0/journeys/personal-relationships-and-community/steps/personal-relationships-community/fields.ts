import { GovUKCharacterCount, GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Answer, Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { CommonOption } from '../../../../constants/commonOption'
import { CaseData } from '../../../../constants/formVersion'
import { contentFor } from '../../locales'
import { commonContentFor } from '../../../../locales'
import { detailsFactory } from '../../detailsFactory'

// --- Reusable helpers ---

const radioDetails = (code: string, parentQuestion: string, optionValue: string, hint?: string) =>
  detailsFactory({
    code,
    label: commonContentFor('optional_details'),
    dependentWhen: Answer(parentQuestion).match(Condition.Equals(optionValue)),
    hint,
  })

const changesDetails = (code: string, optionValue: string) =>
  radioDetails(code, Question.personal_relationships_community_changes, optionValue)

// --- Current Relationship Status ---

const currentRelationshipContentFor = 'question.personal_relationships_community_current_relationship'

const happyRelationshipDetails = radioDetails(
  Question.personal_relationships_community_current_relationship_happy_relationship_details,
  Question.personal_relationships_community_current_relationship,
  Option.happy_relationship,
)

const concernsRelationshipDetails = radioDetails(
  Question.personal_relationships_community_current_relationship_concerns_happy_relationship_details,
  Question.personal_relationships_community_current_relationship,
  Option.concerns_happy_relationship,
)

const unhappyRelationshipDetails = radioDetails(
  Question.personal_relationships_community_current_relationship_unhappy_relationship_details,
  Question.personal_relationships_community_current_relationship,
  Option.unhappy_relationship,
)

export const currentRelationship = GovUKRadioInput({
  code: Question.personal_relationships_community_current_relationship,
  fieldset: {
    legend: {
      text: contentFor(`${currentRelationshipContentFor}.text`, CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: Option.happy_relationship,
      text: contentFor(`${currentRelationshipContentFor}.option.HAPPY_RELATIONSHIP.text`),
      block: happyRelationshipDetails,
    },
    {
      value: Option.concerns_happy_relationship,
      text: contentFor(`${currentRelationshipContentFor}.option.CONCERNS_HAPPY_RELATIONSHIP.text`),
      block: concernsRelationshipDetails,
    },
    {
      value: Option.unhappy_relationship,
      text: contentFor(`${currentRelationshipContentFor}.option.UNHAPPY_RELATIONSHIP.text`),
      block: unhappyRelationshipDetails,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor(`${currentRelationshipContentFor}.validation`),
    }),
  ],
})

// --- Intimate Relationship History ---

const intimateRelationshipContentFor = 'question.personal_relationships_community_intimate_relationship'

const stableIntimateDetails = radioDetails(
  Question.personal_relationships_community_intimate_relationship_stable_relationships_details,
  Question.personal_relationships_community_intimate_relationship,
  Option.stable_relationships,
  'Consider patterns and quality of any significant relationships.',
)

const mixedIntimateDetails = radioDetails(
  Question.personal_relationships_community_intimate_relationship_positive_and_negative_relationships_details,
  Question.personal_relationships_community_intimate_relationship,
  Option.positive_and_negative_relationships,
  'Consider patterns and quality of any significant relationships.',
)

const unstableIntimateDetails = radioDetails(
  Question.personal_relationships_community_intimate_relationship_unstable_relationships_details,
  Question.personal_relationships_community_intimate_relationship,
  Option.unstable_relationships,
  'Consider patterns and quality of any significant relationships.',
)

export const intimateRelationship = GovUKRadioInput({
  code: Question.personal_relationships_community_intimate_relationship,
  fieldset: {
    legend: {
      text: contentFor(`${intimateRelationshipContentFor}.text`, CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor(`${intimateRelationshipContentFor}.hint`),
  items: [
    {
      value: Option.stable_relationships,
      text: contentFor(`${intimateRelationshipContentFor}.option.STABLE_RELATIONSHIPS.text`),
      hint: { text: contentFor(`${intimateRelationshipContentFor}.option.STABLE_RELATIONSHIPS.hint`) },
      block: stableIntimateDetails,
    },
    {
      value: Option.positive_and_negative_relationships,
      text: contentFor(`${intimateRelationshipContentFor}.option.POSITIVE_AND_NEGATIVE_RELATIONSHIPS.text`),
      block: mixedIntimateDetails,
    },
    {
      value: Option.unstable_relationships,
      text: contentFor(`${intimateRelationshipContentFor}.option.UNSTABLE_RELATIONSHIPS.text`),
      hint: { text: contentFor(`${intimateRelationshipContentFor}.option.UNSTABLE_RELATIONSHIPS.hint`) },
      block: unstableIntimateDetails,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor(`${intimateRelationshipContentFor}.validation`),
    }),
  ],
})

// --- Challenges in Intimate Relationships ---

const challengesIntimateRelationshipContentFor =
  'question.personal_relationships_community_challenges_intimate_relationship'

const challengesIntimateRelationship = GovUKCharacterCount({
  code: Question.personal_relationships_community_challenges_intimate_relationship,
  label: {
    text: contentFor(`${challengesIntimateRelationshipContentFor}.text`, CaseData.Forename),
    classes: 'govuk-label--m',
  },
  hint: contentFor(`${challengesIntimateRelationshipContentFor}.hint`),
  maxLength: 2000,
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor(`${challengesIntimateRelationshipContentFor}.validation`),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_character_limit', '2000'),
    }),
  ],
})

// --- Parental Responsibilities (conditional on important_people containing CHILD_PARENTAL_RESPONSIBILITIES) ---

const parentalContentFor = 'question.personal_relationships_community_parental_responsibilities'

const hasParentalResponsibilities = Answer(Question.personal_relationships_community_important_people).match(
  Condition.Array.Contains(Option.child_parental_responsibilities),
)

const parentalYesDetails = radioDetails(
  Question.personal_relationships_community_parental_responsibilities_yes_details,
  Question.personal_relationships_community_parental_responsibilities,
  CommonOption.yes,
)

const parentalSometimesDetails = radioDetails(
  Question.personal_relationships_community_parental_responsibilities_sometimes_details,
  Question.personal_relationships_community_parental_responsibilities,
  Option.sometimes,
)

const parentalNoDetails = radioDetails(
  Question.personal_relationships_community_parental_responsibilities_no_details,
  Question.personal_relationships_community_parental_responsibilities,
  CommonOption.no,
)

export const parentalResponsibilities = GovUKRadioInput({
  code: Question.personal_relationships_community_parental_responsibilities,
  visibleWhen: hasParentalResponsibilities,
  dependentWhen: hasParentalResponsibilities,
  fieldset: {
    legend: {
      text: contentFor(`${parentalContentFor}.text`, CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor(`${parentalContentFor}.hint`),
  items: [
    {
      value: CommonOption.yes,
      text: contentFor(`${parentalContentFor}.option.YES.text`),
      block: parentalYesDetails,
    },
    {
      value: Option.sometimes,
      text: contentFor(`${parentalContentFor}.option.SOMETIMES.text`),
      block: parentalSometimesDetails,
    },
    {
      value: CommonOption.no,
      text: contentFor(`${parentalContentFor}.option.NO.text`),
      block: parentalNoDetails,
    },
    {
      value: CommonOption.unknown,
      text: contentFor(`${parentalContentFor}.option.UNKNOWN.text`),
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor(`${parentalContentFor}.validation`),
    }),
  ],
})

// --- Family Relationship ---

const familyRelationshipContentFor = 'question.personal_relationships_community_family_relationship'

const stableFamilyDetails = radioDetails(
  Question.personal_relationships_community_family_relationship_stable_relationship_details,
  Question.personal_relationships_community_family_relationship,
  Option.stable_relationship,
)

const mixedFamilyDetails = radioDetails(
  Question.personal_relationships_community_family_relationship_mixed_relationship_details,
  Question.personal_relationships_community_family_relationship,
  Option.mixed_relationship,
)

const unstableFamilyDetails = radioDetails(
  Question.personal_relationships_community_family_relationship_unstable_relationship_details,
  Question.personal_relationships_community_family_relationship,
  Option.unstable_relationship,
)

export const familyRelationship = GovUKRadioInput({
  code: Question.personal_relationships_community_family_relationship,
  fieldset: {
    legend: {
      text: contentFor(`${familyRelationshipContentFor}.text`, CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor(`${familyRelationshipContentFor}.hint`),
  items: [
    {
      value: Option.stable_relationship,
      text: contentFor(`${familyRelationshipContentFor}.option.STABLE_RELATIONSHIP.text`),
      block: stableFamilyDetails,
    },
    {
      value: Option.mixed_relationship,
      text: contentFor(`${familyRelationshipContentFor}.option.MIXED_RELATIONSHIP.text`),
      block: mixedFamilyDetails,
    },
    {
      value: Option.unstable_relationship,
      text: contentFor(`${familyRelationshipContentFor}.option.UNSTABLE_RELATIONSHIP.text`),
      hint: { text: contentFor(`${familyRelationshipContentFor}.option.UNSTABLE_RELATIONSHIP.hint`) },
      block: unstableFamilyDetails,
    },
    {
      value: CommonOption.unknown,
      text: contentFor(`${familyRelationshipContentFor}.option.UNKNOWN.text`),
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor(`${familyRelationshipContentFor}.validation`),
    }),
  ],
})

// --- Childhood Experience ---

const childhoodContentFor = 'question.personal_relationships_community_childhood'

const positiveChildhoodDetails = radioDetails(
  Question.personal_relationships_community_childhood_positive_childhood_details,
  Question.personal_relationships_community_childhood,
  Option.positive_childhood,
)

const mixedChildhoodDetails = radioDetails(
  Question.personal_relationships_community_childhood_mixed_childhood_details,
  Question.personal_relationships_community_childhood,
  Option.mixed_childhood,
)

const negativeChildhoodDetails = radioDetails(
  Question.personal_relationships_community_childhood_negative_childhood_details,
  Question.personal_relationships_community_childhood,
  Option.negative_childhood,
)

export const childhood = GovUKRadioInput({
  code: Question.personal_relationships_community_childhood,
  fieldset: {
    legend: {
      text: contentFor(`${childhoodContentFor}.text`, CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor(`${childhoodContentFor}.hint`),
  items: [
    {
      value: Option.positive_childhood,
      text: contentFor(`${childhoodContentFor}.option.POSITIVE_CHILDHOOD.text`),
      block: positiveChildhoodDetails,
    },
    {
      value: Option.mixed_childhood,
      text: contentFor(`${childhoodContentFor}.option.MIXED_CHILDHOOD.text`),
      block: mixedChildhoodDetails,
    },
    {
      value: Option.negative_childhood,
      text: contentFor(`${childhoodContentFor}.option.NEGATIVE_CHILDHOOD.text`),
      hint: { text: contentFor(`${childhoodContentFor}.option.NEGATIVE_CHILDHOOD.hint`) },
      block: negativeChildhoodDetails,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor(`${childhoodContentFor}.validation`),
    }),
  ],
})

// --- Childhood Behavioural Problems ---

const childhoodBehaviourContentFor = 'question.personal_relationships_community_childhood_behaviour'

const yesChildhoodBehaviourDetails = radioDetails(
  Question.personal_relationships_community_childhood_behaviour_yes_details,
  Question.personal_relationships_community_childhood_behaviour,
  CommonOption.yes,
)

const noChildhoodBehaviourDetails = radioDetails(
  Question.personal_relationships_community_childhood_behaviour_no_details,
  Question.personal_relationships_community_childhood_behaviour,
  CommonOption.no,
)

export const childhoodBehaviour = GovUKRadioInput({
  code: Question.personal_relationships_community_childhood_behaviour,
  fieldset: {
    legend: {
      text: contentFor(`${childhoodBehaviourContentFor}.text`, CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor(`${childhoodBehaviourContentFor}.hint`),
  items: [
    {
      value: CommonOption.yes,
      text: commonContentFor('option.YES'),
      block: yesChildhoodBehaviourDetails,
    },
    {
      value: CommonOption.no,
      text: commonContentFor('option.NO'),
      block: noChildhoodBehaviourDetails,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor(`${childhoodBehaviourContentFor}.validation`),
    }),
  ],
})

// --- Belonging (optional) ---

const belongingContentFor = 'question.personal_relationships_community_belonging'

const belonging = GovUKCharacterCount({
  code: Question.personal_relationships_community_belonging,
  label: {
    text: contentFor(`${belongingContentFor}.text`, CaseData.Forename),
    classes: 'govuk-label--m',
  },
  hint: contentFor(`${belongingContentFor}.hint`),
  maxLength: 2000,
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_character_limit', '2000'),
    }),
  ],
})

// --- Changes ---

const changesContentFor = 'question.personal_relationships_community_changes'

const hasMadeChangesDetails = changesDetails(
  Question.personal_relationships_community_changes_made_changes_details,
  CommonOption.has_made_changes,
)
const isMakingChangesDetails = changesDetails(
  Question.personal_relationships_community_changes_making_changes_details,
  CommonOption.is_making_changes,
)
const wantsToMakeChangesKnowsHowDetails = changesDetails(
  Question.personal_relationships_community_changes_want_to_make_changes_details,
  CommonOption.wants_to_make_changes_knows_how_to,
)
const wantsToMakeChangesNeedsHelpDetails = changesDetails(
  Question.personal_relationships_community_changes_needs_help_to_make_changes_details,
  CommonOption.wants_to_make_changes_needs_help,
)
const thinkingAboutChangesDetails = changesDetails(
  Question.personal_relationships_community_changes_thinking_about_making_changes_details,
  CommonOption.thinking_about_making_changes,
)
const doesNotWantToMakeChangesDetails = changesDetails(
  Question.personal_relationships_community_changes_does_not_want_to_make_changes_details,
  CommonOption.does_not_want_to_make_changes,
)
const doesNotWantToAnswerDetails = changesDetails(
  Question.personal_relationships_community_changes_does_not_want_to_answer_details,
  CommonOption.does_not_want_to_answer,
)

export const changes = GovUKRadioInput({
  code: Question.personal_relationships_community_changes,
  fieldset: {
    legend: {
      text: contentFor(`${changesContentFor}.text`, CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: commonContentFor('validation.must_answer', CaseData.Forename),
  items: [
    {
      value: CommonOption.has_made_changes,
      text: commonContentFor('option.HAS_MADE_CHANGES'),
      block: hasMadeChangesDetails,
    },
    {
      value: CommonOption.is_making_changes,
      text: commonContentFor('option.IS_MAKING_CHANGES'),
      block: isMakingChangesDetails,
    },
    {
      value: CommonOption.wants_to_make_changes_knows_how_to,
      text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO'),
      block: wantsToMakeChangesKnowsHowDetails,
    },
    {
      value: CommonOption.wants_to_make_changes_needs_help,
      text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_NEEDS_HELP'),
      block: wantsToMakeChangesNeedsHelpDetails,
    },
    {
      value: CommonOption.thinking_about_making_changes,
      text: commonContentFor('option.THINKING_ABOUT_MAKING_CHANGES'),
      block: thinkingAboutChangesDetails,
    },
    {
      value: CommonOption.does_not_want_to_make_changes,
      text: commonContentFor('option.DOES_NOT_WANT_TO_MAKE_CHANGES'),
      block: doesNotWantToMakeChangesDetails,
    },
    {
      value: CommonOption.does_not_want_to_answer,
      text: commonContentFor('option.DOES_NOT_WANT_TO_ANSWER'),
      block: doesNotWantToAnswerDetails,
    },
    { divider: commonContentFor('or') },
    { value: CommonOption.not_present, text: commonContentFor('option.NOT_PRESENT', CaseData.Forename) },
    { value: CommonOption.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('validation.select_changes', 'personal relationships and community'),
    }),
  ],
})

export const contentBlocks = [
  currentRelationship,
  intimateRelationship,
  challengesIntimateRelationship,
  parentalResponsibilities,
  familyRelationship,
  childhood,
  childhoodBehaviour,
  belonging,
  changes,
]
