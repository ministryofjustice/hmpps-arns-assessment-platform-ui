import { and, Answer, Condition, not, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKCharacterCount,
  GovUKRadioInput,
  GovUKSummaryList,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { SANGenerators } from '../../../../../../generators'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { CaseData } from '../../../../constants/formVersion'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { contentFor, prcShortcut } from '../../locales'
import { commonContentFor } from '../../../../locales'
import { CommonOption } from '../../../../constants/commonOption'
import {
  changes,
  childhood,
  childhoodBehaviour,
  currentRelationship,
  familyRelationship,
  intimateRelationship,
  parentalResponsibilities,
} from '../personal-relationships-community/fields'

// -------- Personal Relationships and Community Summary Group

export const personalRelationshipsCommunitySummary = GovUKSummaryList({
  rows: [
    {
      key: {
        text: contentFor(`${prcShortcut}children_details.text`, CaseData.ForenamePossessive),
      },
      value: {
        blocks: [
          GovUKBody({
            text: contentFor(`${prcShortcut}children_details.option.YES_CHILDREN_LIVING_WITH_POP.text`),
            visibleWhen: and(
              Answer(Question.personal_relationships_community_children_details).match(Condition.IsRequired()),
              Answer(Question.personal_relationships_community_children_details).match(
                Condition.Array.Contains(Option.yes_children_living_with_pop),
              ),
            ),
          }),
          GovUKBody({
            text: Answer(
              Question.personal_relationships_community_children_details_yes_children_living_with_pop_details,
            ),
            size: 's',
          }),
          GovUKBody({
            text: contentFor(`${prcShortcut}children_details.option.YES_CHILDREN_NOT_LIVING_WITH_POP.text`),
            visibleWhen: and(
              Answer(Question.personal_relationships_community_children_details).match(Condition.IsRequired()),
              Answer(Question.personal_relationships_community_children_details).match(
                Condition.Array.Contains(Option.yes_children_not_living_with_pop),
              ),
            ),
          }),
          GovUKBody({
            text: Answer(
              Question.personal_relationships_community_children_details_yes_children_not_living_with_pop_details,
            ),
            size: 's',
          }),
          GovUKBody({
            text: contentFor(`${prcShortcut}children_details.option.YES_CHILDREN_VISITING.text`),
            visibleWhen: and(
              Answer(Question.personal_relationships_community_children_details).match(Condition.IsRequired()),
              Answer(Question.personal_relationships_community_children_details).match(
                Condition.Array.Contains(Option.yes_children_visiting),
              ),
            ),
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_children_details_yes_children_visiting_details),
            size: 's',
          }),
          GovUKBody({
            text: contentFor(`${prcShortcut}children_details.option.NO_CHILDREN.text`, CaseData.ForenamePossessive),
            visibleWhen: and(
              Answer(Question.personal_relationships_community_children_details).match(Condition.IsRequired()),
              Answer(Question.personal_relationships_community_children_details).match(
                Condition.Array.Contains(Option.no_children),
              ),
            ),
          }),
        ],
      },
      actions: {
        items: [{ href: Step.personal_relationships_children_information.path, text: commonContentFor('change') }],
      },
    },
    {
      key: {
        text: contentFor(`${prcShortcut}important_people.text`, CaseData.ForenamePossessive),
      },
      value: {
        blocks: [
          GovUKBody({
            text: contentFor(`${prcShortcut}important_people.option.PARTNER_INTIMATE_RELATIONSHIP.text`),
            visibleWhen: and(
              Answer(Question.personal_relationships_community_important_people).match(Condition.IsRequired()),
              Answer(Question.personal_relationships_community_important_people).match(
                Condition.Array.Contains(Option.partner_intimate_relationship),
              ),
            ),
          }),
          GovUKBody({
            text: Answer(
              Question.personal_relationships_community_important_people_partner_intimate_relationship_details,
            ),
            size: 's',
          }),
          GovUKBody({
            text: contentFor(`${prcShortcut}important_people.option.CHILD_PARENTAL_RESPONSIBILITIES.text`),
            visibleWhen: and(
              Answer(Question.personal_relationships_community_important_people).match(Condition.IsRequired()),
              Answer(Question.personal_relationships_community_important_people).match(
                Condition.Array.Contains(Option.child_parental_responsibilities),
              ),
            ),
          }),
          GovUKBody({
            text: Answer(
              Question.personal_relationships_community_important_people_child_parental_responsibilities_details,
            ),
            size: 's',
          }),
          GovUKBody({
            text: contentFor(`${prcShortcut}important_people.option.OTHER_CHILDREN.text`),
            visibleWhen: and(
              Answer(Question.personal_relationships_community_important_people).match(Condition.IsRequired()),
              Answer(Question.personal_relationships_community_important_people).match(
                Condition.Array.Contains(Option.other_children),
              ),
            ),
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_important_people_other_children_details),
            size: 's',
          }),
          GovUKBody({
            text: contentFor(`${prcShortcut}important_people.option.FAMILY.text`, CaseData.ForenamePossessive),
            visibleWhen: and(
              Answer(Question.personal_relationships_community_important_people).match(Condition.IsRequired()),
              Answer(Question.personal_relationships_community_important_people).match(
                Condition.Array.Contains(Option.family),
              ),
            ),
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_important_people_family_details),
            size: 's',
          }),
          GovUKBody({
            text: contentFor(`${prcShortcut}important_people.option.FRIENDS.text`),
            visibleWhen: and(
              Answer(Question.personal_relationships_community_important_people).match(Condition.IsRequired()),
              Answer(Question.personal_relationships_community_important_people).match(
                Condition.Array.Contains(Option.friends),
              ),
            ),
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_important_people_friends_details),
            size: 's',
          }),
          GovUKBody({
            text: contentFor(`${prcShortcut}important_people.option.OTHER.text`, CaseData.ForenamePossessive),
            visibleWhen: and(
              Answer(Question.personal_relationships_community_important_people).match(Condition.IsRequired()),
              Answer(Question.personal_relationships_community_important_people).match(
                Condition.Array.Contains(Option.other),
              ),
            ),
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_important_people_other_details),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [{ href: Step.personal_relationships.path, text: commonContentFor('change') }],
      },
    },
    {
      key: {
        text: contentFor(`${prcShortcut}current_relationship.text`, CaseData.Forename),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              currentRelationship.items,
              Answer(Question.personal_relationships_community_current_relationship),
            ),
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_current_relationship_happy_relationship_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(
              Question.personal_relationships_community_current_relationship_concerns_happy_relationship_details,
            ),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_current_relationship_unhappy_relationship_details),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [{ href: Step.personal_relationships_community.path, text: commonContentFor('change') }],
      },
    },
    {
      key: {
        text: contentFor(`${prcShortcut}intimate_relationship.text`, CaseData.ForenamePossessive),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              intimateRelationship.items,
              Answer(Question.personal_relationships_community_intimate_relationship),
            ),
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_intimate_relationship_stable_relationships_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(
              Question.personal_relationships_community_intimate_relationship_positive_and_negative_relationships_details,
            ),
            size: 's',
          }),
          GovUKBody({
            text: Answer(
              Question.personal_relationships_community_intimate_relationship_unstable_relationships_details,
            ),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [{ href: Step.personal_relationships_community.path, text: commonContentFor('change') }],
      },
    },
    {
      key: {
        text: contentFor(`${prcShortcut}challenges_intimate_relationship.text`, CaseData.Forename),
      },
      value: {
        blocks: [
          GovUKBody({ text: Answer(Question.personal_relationships_community_challenges_intimate_relationship) }),
        ],
      },
      actions: {
        items: [{ href: Step.personal_relationships_community.path, text: commonContentFor('change') }],
      },
      visibleWhen: Answer(Question.personal_relationships_community_challenges_intimate_relationship).match(
        Condition.IsRequired(),
      ),
    },
    {
      key: {
        text: contentFor(`${prcShortcut}parental_responsibilities.text`, CaseData.Forename),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              parentalResponsibilities.items,
              Answer(Question.personal_relationships_community_parental_responsibilities),
            ),
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_parental_responsibilities_yes_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_parental_responsibilities_sometimes_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_parental_responsibilities_no_details),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [{ href: Step.personal_relationships_community.path, text: commonContentFor('change') }],
      },
      visibleWhen: Answer(Question.personal_relationships_community_important_people).match(
        Condition.Array.Contains(Option.child_parental_responsibilities),
      ),
    },
    {
      key: {
        text: contentFor(`${prcShortcut}family_relationship.text`, CaseData.ForenamePossessive),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              familyRelationship.items,
              Answer(Question.personal_relationships_community_family_relationship),
            ),
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_family_relationship_stable_relationship_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_family_relationship_mixed_relationship_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_family_relationship_unstable_relationship_details),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [{ href: Step.personal_relationships_community.path, text: commonContentFor('change') }],
      },
    },
    {
      key: {
        text: contentFor(`${prcShortcut}childhood.text`, CaseData.ForenamePossessive),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              childhood.items,
              Answer(Question.personal_relationships_community_childhood),
            ),
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_childhood_positive_childhood_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_childhood_mixed_childhood_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_childhood_negative_childhood_details),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [{ href: Step.personal_relationships_community.path, text: commonContentFor('change') }],
      },
    },
    {
      key: {
        text: contentFor(`${prcShortcut}childhood_behaviour.text`, CaseData.Forename),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              childhoodBehaviour.items,
              Answer(Question.personal_relationships_community_childhood_behaviour),
            ),
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_childhood_behaviour_yes_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_childhood_behaviour_no_details),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [{ href: Step.personal_relationships_community.path, text: commonContentFor('change') }],
      },
    },
    {
      key: {
        text: contentFor(`${prcShortcut}belonging.text`, CaseData.Forename),
      },
      value: {
        blocks: [GovUKBody({ text: Answer(Question.personal_relationships_community_belonging) })],
      },
      actions: {
        items: [{ href: Step.personal_relationships_community.path, text: commonContentFor('change') }],
      },
      visibleWhen: Answer(Question.personal_relationships_community_belonging).match(Condition.IsRequired()),
    },
    {
      key: {
        text: contentFor(`${prcShortcut}changes.text`, CaseData.Forename),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              changes.items,
              Answer(Question.personal_relationships_community_changes),
            ),
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_changes_made_changes_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_changes_making_changes_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_changes_want_to_make_changes_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_changes_needs_help_to_make_changes_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_changes_thinking_about_making_changes_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_changes_does_not_want_to_make_changes_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.personal_relationships_community_changes_does_not_want_to_answer_details),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [{ href: Step.personal_relationships_community.path, text: commonContentFor('change') }],
      },
    },
  ],
})

// -------- Strengths or Protective Factors Group

const strengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: Question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_yes_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors).match(
      Condition.IsRequired(),
    ),
    Answer(Question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors).match(
      Condition.Equals(CommonOption.yes),
    ),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor(`${prcShortcut}practitioner_analysis_strengths_or_protective_factors_yes_details.validation`),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

const noStrengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: Question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_no_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(
    Question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors,
  ).match(Condition.Equals(CommonOption.no)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

export const personalRelationshipsCommunityStrengthsProtectiveFactors = GovUKRadioInput({
  code: Question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors,
  fieldset: {
    legend: {
      text: contentFor(
        `${prcShortcut}practitioner_analysis_strengths_or_protective_factors.text`,
        CaseData.ForenamePossessive,
      ),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor(`${prcShortcut}practitioner_analysis_strengths_or_protective_factors.hint`),
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: strengthsProtectiveFactorsDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: noStrengthsProtectiveFactorsDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor(`${prcShortcut}practitioner_analysis_strengths_or_protective_factors.validation`),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

// -------- Linked to Risk of Serious Harm Group

const seriousHarmDetails = GovUKCharacterCount({
  code: Question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm_yes_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm).match(
      Condition.IsRequired(),
    ),
    Answer(Question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm).match(
      Condition.Equals(CommonOption.yes),
    ),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor(`${prcShortcut}practitioner_analysis_risk_of_serious_harm_yes_details.validation`),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

const noSeriousHarmDetails = GovUKCharacterCount({
  code: Question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm_no_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm).match(
    Condition.Equals(CommonOption.no),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

export const personalRelationshipsCommunityLinkedToSeriousHarm = GovUKRadioInput({
  code: Question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm,
  fieldset: {
    legend: {
      text: contentFor(`${prcShortcut}practitioner_analysis_risk_of_serious_harm.text`, CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: seriousHarmDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: noSeriousHarmDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor(`${prcShortcut}practitioner_analysis_risk_of_serious_harm.validation`),
    }),
  ],
})

// -------- Linked to Risk of Reoffending Group

const riskOfReoffendingDetails = GovUKCharacterCount({
  code: Question.personal_relationships_community_practitioner_analysis_risk_of_reoffending_yes_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.personal_relationships_community_practitioner_analysis_risk_of_reoffending).match(
      Condition.IsRequired(),
    ),
    Answer(Question.personal_relationships_community_practitioner_analysis_risk_of_reoffending).match(
      Condition.Equals(CommonOption.yes),
    ),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor(`${prcShortcut}practitioner_analysis_risk_of_reoffending_yes_details.validation`),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

const noRiskOfReoffendingDetails = GovUKCharacterCount({
  code: Question.personal_relationships_community_practitioner_analysis_risk_of_reoffending_no_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.personal_relationships_community_practitioner_analysis_risk_of_reoffending).match(
    Condition.Equals(CommonOption.no),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

export const personalRelationshipsCommunityLinkedReoffending = GovUKRadioInput({
  code: Question.personal_relationships_community_practitioner_analysis_risk_of_reoffending,
  fieldset: {
    legend: {
      text: contentFor(`${prcShortcut}practitioner_analysis_risk_of_reoffending.text`, CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: riskOfReoffendingDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: noRiskOfReoffendingDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor(`${prcShortcut}practitioner_analysis_risk_of_reoffending.validation`),
    }),
  ],
})

export const personalRelationshipsCommunitySummaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: {
        blocks: [
          personalRelationshipsCommunitySummary,
          goToPractitionerAnalysisButton(Step.personal_relationships_community_summary.path),
        ],
      },
    },
    {
      id: 'practitioner-analysis',
      label: commonContentFor('practitioner_analysis'),
      panel: {
        blocks: [
          personalRelationshipsCommunityStrengthsProtectiveFactors,
          personalRelationshipsCommunityLinkedToSeriousHarm,
          personalRelationshipsCommunityLinkedReoffending,
          markAsCompleteButton,
        ],
      },
    },
  ],
})
