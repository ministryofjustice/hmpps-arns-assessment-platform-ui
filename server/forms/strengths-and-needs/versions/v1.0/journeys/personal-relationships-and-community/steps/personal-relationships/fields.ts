import { GovUKCharacterCount, GovUKCheckboxInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Answer, Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Question } from '../../constants/question'
import { contentFor } from '../../locales'
import { CaseData } from '../../../../constants/formVersion'
import { commonContentFor } from '../../../../locales'
import { Option } from '../../constants/option'

// --------------------------- reusable items:
const currentQContentForShortcut = 'question.personal_relationships_community_important_people'

const detailsFactory = (code: string, optionKey: string, optionValue: string) =>
  GovUKCharacterCount({
    code,
    label: contentFor(`${currentQContentForShortcut}.option.${optionKey}.label`),
    maxLength: 2000,
    dependentWhen: Answer(Question.personal_relationships_community_important_people).match(
      Condition.Array.Contains(optionValue),
    ),
    validWhen: [
      validation({
        condition: Self().match(Condition.String.HasMaxLength(2000)),
        message: commonContentFor('validation.details_character_limit', '2000'),
      }),
    ],
  })
//---------------------------

// --------------------------- options:
const partnerIntimateRelationshipDetails = GovUKCharacterCount({
  code: Question.personal_relationships_community_important_people_partner_intimate_relationship_details,
  label: commonContentFor('optional_details'),
  hint: contentFor(`${currentQContentForShortcut}.option.PARTNER_INTIMATE_RELATIONSHIP.hint`),
  maxLength: 2000,
  dependentWhen: Answer(Question.personal_relationships_community_important_people).match(
    Condition.Array.Contains(Option.partner_intimate_relationship),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_character_limit', '2000'),
    }),
  ],
})

const childParentalResponsibilitiesDetails = detailsFactory(
  Question.personal_relationships_community_important_people_child_parental_responsibilities_details,
  'CHILD_PARENTAL_RESPONSIBILITIES',
  Option.child_parental_responsibilities,
)
const otherChildrenDetails = detailsFactory(
  Question.personal_relationships_community_important_people_other_children_details,
  'OTHER_CHILDREN',
  Option.other_children,
)
const familyDetails = detailsFactory(
  Question.personal_relationships_community_important_people_family_details,
  'FAMILY',
  Option.family,
)
const friendsDetails = detailsFactory(
  Question.personal_relationships_community_important_people_friends_details,
  'FRIENDS',
  Option.friends,
)

const otherDetails = GovUKCharacterCount({
  code: Question.personal_relationships_community_important_people_other_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.personal_relationships_community_important_people).match(
    Condition.Array.Contains(Option.other),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('validation.enter_details'),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_character_limit', '2000'),
    }),
  ],
})
//---------------------------

export const personalRelationshipsCommunityImportantPeople = GovUKCheckboxInput({
  code: Question.personal_relationships_community_important_people,
  multiple: true,
  fieldset: {
    legend: {
      text: contentFor(`${currentQContentForShortcut}.text`, CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--l',
    },
  },
  hint: commonContentFor('select_all_that_apply'),
  items: [
    {
      value: Option.partner_intimate_relationship,
      text: contentFor(`${currentQContentForShortcut}.option.PARTNER_INTIMATE_RELATIONSHIP.text`),
      block: partnerIntimateRelationshipDetails,
    },
    {
      value: Option.child_parental_responsibilities,
      text: contentFor(`${currentQContentForShortcut}.option.CHILD_PARENTAL_RESPONSIBILITIES.text`),
      block: childParentalResponsibilitiesDetails,
    },
    {
      value: Option.other_children,
      text: contentFor(`${currentQContentForShortcut}.option.OTHER_CHILDREN.text`),
      block: otherChildrenDetails,
    },
    {
      value: Option.family,
      text: contentFor(`${currentQContentForShortcut}.option.FAMILY.text`, CaseData.ForenamePossessive),
      block: familyDetails,
    },
    {
      value: Option.friends,
      text: contentFor(`${currentQContentForShortcut}.option.FRIENDS.text`),
      block: friendsDetails,
    },
    {
      value: Option.other,
      text: contentFor(`${currentQContentForShortcut}.option.OTHER.text`, CaseData.ForenamePossessive),
      block: otherDetails,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('validation.select_at_least_one_option'),
    }),
  ],
})
