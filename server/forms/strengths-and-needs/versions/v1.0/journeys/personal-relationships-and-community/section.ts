import { Answer, Condition, Transformer } from '@ministryofjustice/hmpps-forge/core/authoring'
import { ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'

import { CaseData } from '../../constants/formVersion'
import { CommonOption } from '../../constants/commonOption'
import {
  checkboxField,
  question,
  QuestionFormat,
  radioField,
  revealedQuestion,

} from '../../../../constants/questionContent'
import { commonContentFor } from '../../locales'
import { contentFor } from './locales'
import { Question } from './constants/question'
import { Step } from './constants/step'
import { Option } from './constants/option'
import { Section } from '../../constants/section'
import { CharacterLimit } from '../../../../constants/characterLimit'
import {
  characterCountDetails,
  characterCountField,
  itemisedSummaryRow,
  optionalDetails,
  requiredDetails,
  textSummaryRow,
  yesNo,
} from '../../constants/questionContent'

// The parenting responsibilities question only applies once we know the person
// has children or parenting responsibilities.
const hasParentalResponsibilities = Answer(Question.personal_relationships_community_important_people).match(
  Condition.Array.Contains(Option.child_parental_responsibilities),
)

// The children checkboxes each reveal the same "who are they?" details under
// their own code, with an option-specific label and validation message.
const childrenDetailsRevealed = (content: {
  code: string
  text: ResolvableString
  validationMessage: ResolvableString
}) =>
  revealedQuestion({
    content: {
      code: content.code,
      format: QuestionFormat.TEXT,
      text: content.text,
      validationMessage: content.validationMessage,
    },
    displayModes: { field: characterCountDetails({ maxLength: CharacterLimit.c2000 }) },
  })

// The important people checkboxes each reveal optional relationship details
// under their own code, with an option-specific label.
const importantPersonDetailsRevealed = (content: { code: string; text: ResolvableString }) =>
  revealedQuestion({
    content: { code: content.code, format: QuestionFormat.TEXT, text: content.text },
    displayModes: { field: characterCountDetails({ maxLength: CharacterLimit.c2000 }) },
  })

const childrenDetails = question({
  content: {
    code: Question.personal_relationships_community_children_details,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.personal_relationships_community_children_details.text', CaseData.ForenamePossessive),
    hint: {
      html: contentFor('question.personal_relationships_community_children_details.hint', CaseData.Forename),
    },
    options: [
      {
        value: Option.yes_children_living_with_pop,
        text: contentFor(
          'question.personal_relationships_community_children_details.option.YES_CHILDREN_LIVING_WITH_POP.text',
        ),
        reveals: childrenDetailsRevealed({
          code: Question.personal_relationships_community_children_details_yes_children_living_with_pop_details,
          text: contentFor(
            'question.personal_relationships_community_children_details.option.YES_CHILDREN_LIVING_WITH_POP.label',
            CaseData.Forename,
          ),
          validationMessage: contentFor(
            'question.personal_relationships_community_children_details.option.YES_CHILDREN_LIVING_WITH_POP.validation',
          ),
        }),
      },
      {
        value: Option.yes_children_not_living_with_pop,
        text: contentFor(
          'question.personal_relationships_community_children_details.option.YES_CHILDREN_NOT_LIVING_WITH_POP.text',
        ),
        reveals: childrenDetailsRevealed({
          code: Question.personal_relationships_community_children_details_yes_children_not_living_with_pop_details,
          text: contentFor(
            'question.personal_relationships_community_children_details.option.YES_CHILDREN_NOT_LIVING_WITH_POP.label',
            CaseData.Forename,
          ),
          validationMessage: contentFor(
            'question.personal_relationships_community_children_details.option.YES_CHILDREN_NOT_LIVING_WITH_POP.validation',
          ),
        }),
      },
      {
        value: Option.yes_children_visiting,
        text: contentFor(
          'question.personal_relationships_community_children_details.option.YES_CHILDREN_VISITING.text',
        ),
        reveals: childrenDetailsRevealed({
          code: Question.personal_relationships_community_children_details_yes_children_visiting_details,
          text: contentFor(
            'question.personal_relationships_community_children_details.option.YES_CHILDREN_VISITING.label',
            CaseData.Forename,
          ),
          validationMessage: contentFor(
            'question.personal_relationships_community_children_details.option.YES_CHILDREN_VISITING.validation',
          ),
        }),
      },
      { divider: commonContentFor('or') },
      {
        value: Option.no_children,
        text: contentFor(
          'question.personal_relationships_community_children_details.option.NO_CHILDREN.text',
          CaseData.ForenamePossessive,
        ),
        behaviour: 'exclusive' as const,
      },
    ],
    validationMessage: commonContentFor('validation.select_at_least_one_option'),
  },
  displayModes: {
    field: checkboxField({ legendClasses: 'govuk-fieldset__legend--l' }),
    summaryRow: itemisedSummaryRow({ changePath: Step.personal_relationships_children_information.path }),
  },
})

const importantPeople = question({
  content: {
    code: Question.personal_relationships_community_important_people,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.personal_relationships_community_important_people.text', CaseData.ForenamePossessive),
    hint: commonContentFor('select_all_that_apply'),
    options: [
      {
        value: Option.partner_intimate_relationship,
        text: contentFor(
          'question.personal_relationships_community_important_people.option.PARTNER_INTIMATE_RELATIONSHIP.text',
        ),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_important_people_partner_intimate_relationship_details,
          hint: contentFor(
            'question.personal_relationships_community_important_people.option.PARTNER_INTIMATE_RELATIONSHIP.hint',
          ),
        }),
      },
      {
        value: Option.child_parental_responsibilities,
        text: contentFor(
          'question.personal_relationships_community_important_people.option.CHILD_PARENTAL_RESPONSIBILITIES.text',
        ),
        reveals: importantPersonDetailsRevealed({
          code: Question.personal_relationships_community_important_people_child_parental_responsibilities_details,
          text: contentFor(
            'question.personal_relationships_community_important_people.option.CHILD_PARENTAL_RESPONSIBILITIES.label',
          ),
        }),
      },
      {
        value: Option.other_children,
        text: contentFor('question.personal_relationships_community_important_people.option.OTHER_CHILDREN.text'),
        reveals: importantPersonDetailsRevealed({
          code: Question.personal_relationships_community_important_people_other_children_details,
          text: contentFor('question.personal_relationships_community_important_people.option.OTHER_CHILDREN.label'),
        }),
      },
      {
        value: Option.family,
        text: contentFor('question.personal_relationships_community_important_people.option.FAMILY.text'),
        reveals: importantPersonDetailsRevealed({
          code: Question.personal_relationships_community_important_people_family_details,
          text: contentFor('question.personal_relationships_community_important_people.option.FAMILY.label'),
        }),
      },
      {
        value: Option.friends,
        text: contentFor('question.personal_relationships_community_important_people.option.FRIENDS.text'),
        reveals: importantPersonDetailsRevealed({
          code: Question.personal_relationships_community_important_people_friends_details,
          text: contentFor('question.personal_relationships_community_important_people.option.FRIENDS.label'),
        }),
      },
      {
        value: CommonOption.other,
        text: commonContentFor('option.OTHER'),
        reveals: requiredDetails({
          code: Question.personal_relationships_community_important_people_other_details,
          validationMessage: commonContentFor('validation.enter_details'),
        }),
      },
    ],
    validationMessage: commonContentFor('validation.select_at_least_one_option'),
  },
  displayModes: {
    field: checkboxField({ legendClasses: 'govuk-fieldset__legend--l' }),
    summaryRow: itemisedSummaryRow({ changePath: Step.personal_relationships.path }),
  },
})

const currentRelationship = question({
  content: {
    code: Question.personal_relationships_community_current_relationship,
    format: QuestionFormat.RADIO,
    text: contentFor('question.personal_relationships_community_current_relationship.text', CaseData.Forename),
    options: [
      {
        value: Option.happy_relationship,
        text: contentFor(
          'question.personal_relationships_community_current_relationship.option.HAPPY_RELATIONSHIP.text',
        ),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_current_relationship_happy_relationship_details,
        }),
      },
      {
        value: Option.concerns_happy_relationship,
        text: contentFor(
          'question.personal_relationships_community_current_relationship.option.CONCERNS_HAPPY_RELATIONSHIP.text',
        ),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_current_relationship_concerns_happy_relationship_details,
        }),
      },
      {
        value: Option.unhappy_relationship,
        text: contentFor(
          'question.personal_relationships_community_current_relationship.option.UNHAPPY_RELATIONSHIP.text',
        ),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_current_relationship_unhappy_relationship_details,
        }),
      },
    ],
    validationMessage: contentFor('question.personal_relationships_community_current_relationship.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.personal_relationships_community.path }),
  },
})

const intimateRelationship = question({
  content: {
    code: Question.personal_relationships_community_intimate_relationship,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.personal_relationships_community_intimate_relationship.text',
      CaseData.ForenamePossessive,
    ),
    hint: contentFor('question.personal_relationships_community_intimate_relationship.hint'),
    options: [
      {
        value: Option.stable_relationships,
        text: contentFor(
          'question.personal_relationships_community_intimate_relationship.option.STABLE_RELATIONSHIPS.text',
        ),
        hint: contentFor(
          'question.personal_relationships_community_intimate_relationship.option.STABLE_RELATIONSHIPS.hint',
        ),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_intimate_relationship_stable_relationships_details,
          hint: contentFor(
            'question.personal_relationships_community_intimate_relationship.option.STABLE_RELATIONSHIPS.detailsHint',
          ),
        }),
      },
      {
        value: Option.positive_and_negative_relationships,
        text: contentFor(
          'question.personal_relationships_community_intimate_relationship.option.POSITIVE_AND_NEGATIVE_RELATIONSHIPS.text',
        ),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_intimate_relationship_positive_and_negative_relationships_details,
          hint: contentFor(
            'question.personal_relationships_community_intimate_relationship.option.POSITIVE_AND_NEGATIVE_RELATIONSHIPS.detailsHint',
          ),
        }),
      },
      {
        value: Option.unstable_relationships,
        text: contentFor(
          'question.personal_relationships_community_intimate_relationship.option.UNSTABLE_RELATIONSHIPS.text',
        ),
        hint: contentFor(
          'question.personal_relationships_community_intimate_relationship.option.UNSTABLE_RELATIONSHIPS.hint',
        ),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_intimate_relationship_unstable_relationships_details,
          hint: contentFor(
            'question.personal_relationships_community_intimate_relationship.option.UNSTABLE_RELATIONSHIPS.detailsHint',
          ),
        }),
      },
    ],
    validationMessage: contentFor('question.personal_relationships_community_intimate_relationship.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.personal_relationships_community.path }),
  },
})

const challengesIntimateRelationship = question({
  content: {
    code: Question.personal_relationships_community_challenges_intimate_relationship,
    format: QuestionFormat.TEXT,
    text: contentFor(
      'question.personal_relationships_community_challenges_intimate_relationship.text',
      CaseData.Forename,
    ),
    hint: contentFor('question.personal_relationships_community_challenges_intimate_relationship.hint'),
    validationMessage: contentFor(
      'question.personal_relationships_community_challenges_intimate_relationship.validation',
    ),
  },
  displayModes: {
    field: characterCountField({ maxLength: CharacterLimit.c2000 }),
    summaryRow: textSummaryRow({
      changeHref: Step.personal_relationships_community.path,
      visibleWhen: Answer(Question.personal_relationships_community_challenges_intimate_relationship).match(
        Condition.IsRequired(),
      ),
    }),
  },
})

const parentalResponsibilities = question({
  content: {
    code: Question.personal_relationships_community_parental_responsibilities,
    format: QuestionFormat.RADIO,
    text: contentFor('question.personal_relationships_community_parental_responsibilities.text', CaseData.Forename),
    hint: contentFor('question.personal_relationships_community_parental_responsibilities.hint'),
    options: [
      {
        value: CommonOption.yes,
        text: contentFor('question.personal_relationships_community_parental_responsibilities.option.YES.text'),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_parental_responsibilities_yes_details,
        }),
      },
      {
        value: Option.sometimes,
        text: contentFor('question.personal_relationships_community_parental_responsibilities.option.SOMETIMES.text'),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_parental_responsibilities_sometimes_details,
        }),
      },
      {
        value: CommonOption.no,
        text: contentFor('question.personal_relationships_community_parental_responsibilities.option.NO.text'),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_parental_responsibilities_no_details,
        }),
      },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.personal_relationships_community_parental_responsibilities.validation'),
  },
  displayModes: {
    field: radioField({ dependentWhen: hasParentalResponsibilities, visibleWhen: hasParentalResponsibilities }),
    summaryRow: itemisedSummaryRow({
      changePath: Step.personal_relationships_community.path,
      visibleWhen: hasParentalResponsibilities,
    }),
  },
})

const familyRelationship = question({
  content: {
    code: Question.personal_relationships_community_family_relationship,
    format: QuestionFormat.RADIO,
    text: contentFor('question.personal_relationships_community_family_relationship.text', CaseData.ForenamePossessive),
    hint: contentFor('question.personal_relationships_community_family_relationship.hint'),
    options: [
      {
        value: Option.stable_relationship,
        text: contentFor(
          'question.personal_relationships_community_family_relationship.option.STABLE_RELATIONSHIP.text',
        ),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_family_relationship_stable_relationship_details,
        }),
      },
      {
        value: Option.mixed_relationship,
        text: contentFor(
          'question.personal_relationships_community_family_relationship.option.MIXED_RELATIONSHIP.text',
        ),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_family_relationship_mixed_relationship_details,
        }),
      },
      {
        value: Option.unstable_relationship,
        text: contentFor(
          'question.personal_relationships_community_family_relationship.option.UNSTABLE_RELATIONSHIP.text',
        ),
        hint: contentFor(
          'question.personal_relationships_community_family_relationship.option.UNSTABLE_RELATIONSHIP.hint',
        ),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_family_relationship_unstable_relationship_details,
        }),
      },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.personal_relationships_community_family_relationship.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.personal_relationships_community.path }),
  },
})

const childhood = question({
  content: {
    code: Question.personal_relationships_community_childhood,
    format: QuestionFormat.RADIO,
    text: contentFor('question.personal_relationships_community_childhood.text', CaseData.ForenamePossessive),
    hint: contentFor('question.personal_relationships_community_childhood.hint'),
    options: [
      {
        value: Option.positive_childhood,
        text: contentFor('question.personal_relationships_community_childhood.option.POSITIVE_CHILDHOOD.text'),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_childhood_positive_childhood_details,
        }),
      },
      {
        value: Option.mixed_childhood,
        text: contentFor('question.personal_relationships_community_childhood.option.MIXED_CHILDHOOD.text'),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_childhood_mixed_childhood_details,
        }),
      },
      {
        value: Option.negative_childhood,
        text: contentFor('question.personal_relationships_community_childhood.option.NEGATIVE_CHILDHOOD.text'),
        hint: contentFor('question.personal_relationships_community_childhood.option.NEGATIVE_CHILDHOOD.hint'),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_childhood_negative_childhood_details,
        }),
      },
    ],
    validationMessage: contentFor('question.personal_relationships_community_childhood.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.personal_relationships_community.path }),
  },
})

const childhoodBehaviour = question({
  content: {
    code: Question.personal_relationships_community_childhood_behaviour,
    format: QuestionFormat.RADIO,
    text: contentFor('question.personal_relationships_community_childhood_behaviour.text', CaseData.Forename),
    hint: contentFor('question.personal_relationships_community_childhood_behaviour.hint'),
    options: yesNo({
      yes: optionalDetails({ code: Question.personal_relationships_community_childhood_behaviour_yes_details }),
      no: optionalDetails({ code: Question.personal_relationships_community_childhood_behaviour_no_details }),
    }),
    validationMessage: contentFor('question.personal_relationships_community_childhood_behaviour.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.personal_relationships_community.path }),
  },
})

const belonging = question({
  content: {
    code: Question.personal_relationships_community_belonging,
    format: QuestionFormat.TEXT,
    text: contentFor('question.personal_relationships_community_belonging.text', CaseData.Forename),
    hint: contentFor('question.personal_relationships_community_belonging.hint'),
  },
  displayModes: {
    field: characterCountField({ maxLength: CharacterLimit.c2000 }),
    summaryRow: textSummaryRow({
      changeHref: Step.personal_relationships_community.path,
      visibleWhen: Answer(Question.personal_relationships_community_belonging).match(Condition.IsRequired()),
    }),
  },
})

const changes = question({
  content: {
    code: Question.personal_relationships_community_changes,
    format: QuestionFormat.RADIO,
    text: contentFor('question.personal_relationships_community_changes.text', CaseData.Forename),
    hint: commonContentFor('validation.must_answer', CaseData.Forename),
    options: [
      {
        value: CommonOption.made_changes,
        text: commonContentFor('option.MADE_CHANGES'),
        reveals: optionalDetails({ code: Question.personal_relationships_community_changes_made_changes_details }),
      },
      {
        value: CommonOption.making_changes,
        text: commonContentFor('option.MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.personal_relationships_community_changes_making_changes_details }),
      },
      {
        value: CommonOption.want_to_make_changes,
        text: commonContentFor('option.WANT_TO_MAKE_CHANGES'),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_changes_want_to_make_changes_details,
        }),
      },
      {
        value: CommonOption.needs_help_to_make_changes,
        text: commonContentFor('option.NEEDS_HELP_TO_MAKE_CHANGES'),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_changes_needs_help_to_make_changes_details,
        }),
      },
      {
        value: CommonOption.thinking_about_making_changes,
        text: commonContentFor('option.THINKING_ABOUT_MAKING_CHANGES'),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_changes_thinking_about_making_changes_details,
        }),
      },
      {
        value: CommonOption.does_not_want_to_make_changes,
        text: commonContentFor('option.DOES_NOT_WANT_TO_MAKE_CHANGES'),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_changes_does_not_want_to_make_changes_details,
        }),
      },
      {
        value: CommonOption.does_not_want_to_answer,
        text: commonContentFor('option.DOES_NOT_WANT_TO_ANSWER'),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_changes_does_not_want_to_answer_details,
        }),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.not_present, text: commonContentFor('option.NOT_PRESENT', CaseData.Forename) },
      { value: CommonOption.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
    ],
    validationMessage: commonContentFor(
      'validation.select_changes',
      commonContentFor('sectionTitle.personal-relationships-and-community').pipe(Transformer.String.ToLowerCase()),
    ),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.personal_relationships_community.path }),
  },
})

const strengthsOrProtectiveFactors = question({
  content: {
    code: Question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors.text',
      CaseData.ForenamePossessive,
    ),
    hint: contentFor(
      'question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors.hint',
    ),
    options: yesNo({
      yes: requiredDetails({
        code: Question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_yes_details,
        validationMessage: contentFor(
          'question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_no_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor(
      'question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors.validation',
    ),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.personal_relationships_community_summary.path,
      changeVisuallyHiddenText: true,
    }),
  },
})

const riskOfSeriousHarm = question({
  content: {
    code: Question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm.text',
      CaseData.ForenamePossessive,
    ),
    options: yesNo({
      yes: requiredDetails({
        code: Question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm_yes_details,
        validationMessage: contentFor(
          'question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm_no_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor(
      'question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm.validation',
    ),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.personal_relationships_community_summary.path,
      changeVisuallyHiddenText: true,
    }),
  },
})

const riskOfReoffending = question({
  content: {
    code: Question.personal_relationships_community_practitioner_analysis_risk_of_reoffending,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.personal_relationships_community_practitioner_analysis_risk_of_reoffending.text',
      CaseData.ForenamePossessive,
    ),
    options: yesNo({
      yes: requiredDetails({
        code: Question.personal_relationships_community_practitioner_analysis_risk_of_reoffending_yes_details,
        validationMessage: contentFor(
          'question.personal_relationships_community_practitioner_analysis_risk_of_reoffending_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1000,
      }),
      no: optionalDetails({
        code: Question.personal_relationships_community_practitioner_analysis_risk_of_reoffending_no_details,
        maxLength: CharacterLimit.c1000,
      }),
    }),
    validationMessage: contentFor(
      'question.personal_relationships_community_practitioner_analysis_risk_of_reoffending.validation',
    ),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.personal_relationships_community_summary.path,
      changeVisuallyHiddenText: true,
    }),
  },
})

export const personalRelationshipsCommunitySection = {
  code: Section.personal_relationships_and_community.code,
  questions: {
    childrenDetails,
    importantPeople,
    currentRelationship,
    intimateRelationship,
    challengesIntimateRelationship,
    parentalResponsibilities,
    familyRelationship,
    childhood,
    childhoodBehaviour,
    belonging,
    changes,
  },
  practitionerAnalysis: {
    strengthsOrProtectiveFactors,
    riskOfSeriousHarm,
    riskOfReoffending,
  },
}
