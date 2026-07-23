import { GovUKCharacterCount, GovUKCheckboxInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Answer, Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Question } from '../../constants/question'
import { CaseData } from '../../../../constants/formVersion'
import { contentFor } from '../../locales'
import { commonContentFor } from '../../../../locales'
import { Option } from '../../constants/option'

// --------------------------- reusable items:
const currentQContentForShortcut = 'question.personal_relationships_community_children_details'

const detailsFactory = (code: string, optionKey: string, optionValue: string) =>
  GovUKCharacterCount({
    code,
    label: contentFor(`${currentQContentForShortcut}.option.${optionKey}.label`, CaseData.Forename),
    maxLength: 2000,
    dependentWhen: Answer(Question.personal_relationships_community_children_details).match(
      Condition.Array.Contains(optionValue),
    ),
    validWhen: [
      validation({
        condition: Self().match(Condition.IsRequired()),
        message: contentFor(`${currentQContentForShortcut}.option.${optionKey}.validation`),
      }),
      validation({
        condition: Self().match(Condition.String.HasMaxLength(2000)),
        message: commonContentFor('validation.details_character_limit', '2000'),
      }),
    ],
  })
//---------------------------

const yesChildrenLivingWithPopDetails = detailsFactory(
  Question.personal_relationships_community_children_details_yes_children_living_with_pop_details,
  'YES_CHILDREN_LIVING_WITH_POP',
  Option.yes_children_living_with_pop,
)

const yesChildrenNotLivingWithPopDetails = detailsFactory(
  Question.personal_relationships_community_children_details_yes_children_not_living_with_pop_details,
  'YES_CHILDREN_NOT_LIVING_WITH_POP',
  Option.yes_children_not_living_with_pop,
)

const yesChildrenVisitingDetails = detailsFactory(
  Question.personal_relationships_community_children_details_yes_children_visiting_details,
  'YES_CHILDREN_VISITING',
  Option.yes_children_visiting,
)

export const personalRelationshipsChildrenInformation = GovUKCheckboxInput({
  code: Question.personal_relationships_community_children_details,
  multiple: true,
  fieldset: {
    legend: {
      text: contentFor(`${currentQContentForShortcut}.text`, CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--l',
    },
  },
  hint: {
    html: contentFor(`${currentQContentForShortcut}.hint`, CaseData.Forename),
  },
  items: [
    {
      value: Option.yes_children_living_with_pop,
      text: contentFor(`${currentQContentForShortcut}.option.YES_CHILDREN_LIVING_WITH_POP.text`),
      block: yesChildrenLivingWithPopDetails,
    },
    {
      value: Option.yes_children_not_living_with_pop,
      text: contentFor(`${currentQContentForShortcut}.option.YES_CHILDREN_NOT_LIVING_WITH_POP.text`),
      block: yesChildrenNotLivingWithPopDetails,
    },
    {
      value: Option.yes_children_visiting,
      text: contentFor(`${currentQContentForShortcut}.option.YES_CHILDREN_VISITING.text`),
      block: yesChildrenVisitingDetails,
    },
    { divider: commonContentFor('or') },
    {
      value: Option.no_children,
      text: contentFor(`${currentQContentForShortcut}.option.NO_CHILDREN.text`, CaseData.ForenamePossessive),
      behaviour: 'exclusive',
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('validation.select_at_least_one_option'),
    }),
  ],
})
