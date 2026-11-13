import { and, Answer, Condition, not, Transformer } from '@ministryofjustice/hmpps-forge/core/authoring'
import { ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'

import { CaseData } from '../../../../constants/common'
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
  itemisedSummaryRow,
  optionalDetails,
  requiredDetails,
  yesNo,
} from '../../constants/questionContent'

// The parenting responsibilities question only applies once we know the person
// has children or parenting responsibilities.
const hasParentalResponsibilities = and(
  not(
    Answer(Question.personal_relationships_community_children_details).match(
      Condition.Array.Contains(Option.no_children),
    ),
  ),
  Answer(Question.community_personal_relationships_community_parental_responsibilities).match(
    Condition.Equals(CommonOption.yes),
  ),
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
      { divider: commonContentFor('or') },
      {
        value: Option.no_children,
        text: commonContentFor('option.NO'),
        behaviour: 'exclusive' as const,
      },
    ],
    validationMessage: commonContentFor('validation.select_at_least_one_option'),
  },
  displayModes: {
    field: checkboxField({ legendClasses: 'govuk-fieldset__legend--l' }),
    summaryRow: itemisedSummaryRow({ changeHref: Step.personal_relationships_children_information.path }),
  },
})

const anyParentingResponsibilities = question({
  content: {
    code: Question.community_personal_relationships_community_parental_responsibilities,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.community_personal_relationships_community_parental_responsibilities.text',
      CaseData.Forename,
    ),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        reveals: optionalDetails({
          code: Question.community_personal_relationships_community_parental_responsibilities_yes_details,
        }),
      },
      {
        value: CommonOption.no,
        text: commonContentFor('option.NO'),
        reveals: optionalDetails({
          code: Question.community_personal_relationships_community_parental_responsibilities_no_details,
        }),
      },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor(
      'question.community_personal_relationships_community_parental_responsibilities.validation',
    ),
  },
  displayModes: {
    field: radioField({ legendClasses: 'govuk-fieldset__legend--l' }),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.personal_relationships_any_parenting_responsibilities.path,
      visibleWhen: hasParentalResponsibilities,
    }),
  },
})

const parentalResponsibilities = question({
  content: {
    code: Question.community_personal_relationships_community_manage_parental_responsibilities,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.community_personal_relationships_community_manage_parental_responsibilities.text',
      CaseData.Forename,
    ),
    hint: contentFor('question.community_personal_relationships_community_manage_parental_responsibilities.hint'),
    options: [
      {
        value: CommonOption.yes,
        text: contentFor(
          'question.community_personal_relationships_community_manage_parental_responsibilities.option.YES.text',
        ),
        reveals: optionalDetails({
          code: Question.community_personal_relationships_community_manage_parental_responsibilities_yes_details,
        }),
      },
      {
        value: Option.sometimes,
        text: contentFor(
          'question.community_personal_relationships_community_manage_parental_responsibilities.option.SOMETIMES.text',
        ),
        reveals: optionalDetails({
          code: Question.community_personal_relationships_community_manage_parental_responsibilities_sometimes_details,
        }),
      },
      {
        value: CommonOption.no,
        text: contentFor(
          'question.community_personal_relationships_community_manage_parental_responsibilities.option.NO.text',
        ),
        reveals: optionalDetails({
          code: Question.community_personal_relationships_community_manage_parental_responsibilities_no_details,
        }),
      },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor(
      'question.community_personal_relationships_community_manage_parental_responsibilities.validation',
    ),
  },
  displayModes: {
    field: radioField({ dependentWhen: hasParentalResponsibilities, visibleWhen: hasParentalResponsibilities }),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.personal_relationships_community.path,
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
    summaryRow: itemisedSummaryRow({ changeHref: Step.personal_relationships_community.path }),
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
        hint: contentFor('question.personal_relationships_community_childhood.option.POSITIVE_CHILDHOOD.hint'),
        reveals: optionalDetails({
          code: Question.personal_relationships_community_childhood_positive_childhood_details,
        }),
      },
      {
        value: Option.mixed_childhood,
        text: contentFor('question.personal_relationships_community_childhood.option.MIXED_CHILDHOOD.text'),
        hint: contentFor('question.personal_relationships_community_childhood.option.MIXED_CHILDHOOD.hint'),
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
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.personal_relationships_community_childhood.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changeHref: Step.personal_relationships_community.path }),
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
    }),
    validationMessage: contentFor('question.personal_relationships_community_childhood_behaviour.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changeHref: Step.personal_relationships_community.path }),
  },
})

const belonging = question({
  content: {
    code: Question.personal_relationships_community_sense_of_belonging,
    format: QuestionFormat.RADIO,
    text: contentFor('question.personal_relationships_community_sense_of_belonging.text', CaseData.Forename),
    hint: contentFor('question.personal_relationships_community_sense_of_belonging.hint'),
    options: yesNo({
      yes: optionalDetails({
        code: Question.personal_relationships_community_sense_of_belonging_yes_details,
        hint: contentFor('question.personal_relationships_community_sense_of_belonging.option.YES.hint'),
      }),
    }),
    validationMessage: contentFor('question.personal_relationships_community_sense_of_belonging.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changeHref: Step.personal_relationships_community.path }),
  },
})

const inRelationship = question({
  content: {
    code: Question.personal_relationships_community_relationship_status,
    format: QuestionFormat.RADIO,
    text: contentFor('question.personal_relationships_community_relationship_status.text', CaseData.Forename),
    options: [
      {
        value: Option.in_relationship_living_together,
        text: contentFor(
          'question.personal_relationships_community_relationship_status.option.IN_RELATIONSHIP_LIVING_TOGETHER.text',
        ),
      },
      {
        value: Option.in_relationship_not_living_together,
        text: contentFor(
          'question.personal_relationships_community_relationship_status.option.IN_RELATIONSHIP_NOT_LIVING_TOGETHER.text',
        ),
      },
      {
        value: Option.no_relationship,
        text: commonContentFor('option.NO'),
      },
    ],
    validationMessage: contentFor('question.personal_relationships_community_relationship_status.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changeHref: Step.personal_relationships_community.path }),
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
        hint: contentFor(
          'question.personal_relationships_community_current_relationship.option.HAPPY_RELATIONSHIP.hint',
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
        hint: contentFor(
          'question.personal_relationships_community_current_relationship.option.CONCERNS_HAPPY_RELATIONSHIP.hint',
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
        hint: contentFor(
          'question.personal_relationships_community_current_relationship.option.UNHAPPY_RELATIONSHIP.hint',
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
    summaryRow: itemisedSummaryRow({ changeHref: Step.personal_relationships_community.path }),
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
    summaryRow: itemisedSummaryRow({ changeHref: Step.personal_relationships_community.path }),
  },
})

const domesticAbusePerpetrator = question({
  content: {
    code: Question.offence_analysis_perpetrator_of_domestic_abuse,
    format: QuestionFormat.RADIO,
    text: contentFor('question.offence_analysis_perpetrator_of_domestic_abuse.text', CaseData.Forename),
    options: yesNo(),
    validationMessage: contentFor('question.offence_analysis_perpetrator_of_domestic_abuse.validation'),
  },
  displayModes: {
    field: radioField({ legendClasses: 'govuk-fieldset__legend--l' }),
    summaryRow: itemisedSummaryRow({ changeHref: Step.personal_relationships_domestic_abuse_perpetrator.path }),
  },
})

const domesticAbuseAgainst = question({
  content: {
    code: Question.offence_analysis_perpetrator_of_domestic_abuse_victim,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.offence_analysis_perpetrator_of_domestic_abuse_victim.text', CaseData.Forename),
    hint: commonContentFor('select_all_that_apply'),
    options: [
      {
        value: Option.family_member,
        text: contentFor('question.offence_analysis_perpetrator_of_domestic_abuse_victim.option.FAMILY_MEMBER.text'),
        reveals: requiredDetails({
          code: Question.offence_analysis_perpetrator_of_domestic_abuse_victim_family_member_details,
          validationMessage: contentFor(
            'question.offence_analysis_perpetrator_of_domestic_abuse_victim.option.FAMILY_MEMBER.validation',
          ),
        }),
      },
      {
        value: Option.intimate_partner,
        text: contentFor('question.offence_analysis_perpetrator_of_domestic_abuse_victim.option.INTIMATE_PARTNER.text'),
        reveals: requiredDetails({
          code: Question.offence_analysis_perpetrator_of_domestic_abuse_victim_intimate_partner_details,
          validationMessage: contentFor(
            'question.offence_analysis_perpetrator_of_domestic_abuse_victim.option.INTIMATE_PARTNER.validation',
          ),
        }),
      },
    ],
    validationMessage: commonContentFor('validation.select_at_least_one_option'),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({ changeHref: Step.personal_relationships_domestic_abuse_against.path }),
  },
})

const coerciveBehaviour = question({
  content: {
    code: Question.controlling_coercive_behaviour,
    format: QuestionFormat.RADIO,
    text: contentFor('question.controlling_coercive_behaviour.text', CaseData.ForenamePossessive),
    options: yesNo({
      yes: requiredDetails({
        code: Question.controlling_coercive_behaviour_yes_details,
        validationMessage: contentFor('question.controlling_coercive_behaviour_yes_details.validation'),
        maxLength: CharacterLimit.c2000,
      }),
      no: optionalDetails({
        code: Question.controlling_coercive_behaviour_no_details,
        maxLength: CharacterLimit.c2000,
      }),
    }),
    validationMessage: contentFor('question.controlling_coercive_behaviour.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.personal_relationships_domestic_abuse_against.path,
    }),
  },
})

const strangulation = question({
  content: {
    code: Question.evidence_of_strangulation,
    format: QuestionFormat.RADIO,
    text: contentFor('question.evidence_of_strangulation.text', CaseData.ForenamePossessive),
    options: yesNo({
      yes: requiredDetails({
        code: Question.evidence_of_strangulation_yes_details,
        validationMessage: contentFor('question.evidence_of_strangulation.validation'),
        maxLength: CharacterLimit.c2000,
      }),
      no: optionalDetails({
        code: Question.evidence_of_strangulation_no_details,
        maxLength: CharacterLimit.c2000,
      }),
    }),
    validationMessage: contentFor('question.evidence_of_strangulation.validation'),
  },
  displayModes: {
    field: radioField({ legendClasses: 'govuk-fieldset__legend--l' }),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.personal_relationships_strangulation.path,
    }),
  },
})

const domesticAbuseVictim = question({
  content: {
    code: Question.offence_analysis_victim_of_domestic_abuse,
    format: QuestionFormat.RADIO,
    text: contentFor('question.offence_analysis_victim_of_domestic_abuse.text', CaseData.Forename),
    options: yesNo(),
    validationMessage: contentFor('question.offence_analysis_victim_of_domestic_abuse.validation'),
  },
  displayModes: {
    field: radioField({ legendClasses: 'govuk-fieldset__legend--l' }),
    summaryRow: itemisedSummaryRow({ changeHref: Step.personal_relationships_domestic_abuse_victim.path }),
  },
})

const domesticAbuseVictimBy = question({
  content: {
    code: Question.offence_analysis_victim_of_domestic_abuse_who_committed_abuse,
    format: QuestionFormat.CHECKBOX,
    text: contentFor(
      'question.offence_analysis_victim_of_domestic_abuse_who_committed_abuse.text',
      CaseData.ForenamePossessive,
    ),
    hint: commonContentFor('select_all_that_apply'),
    options: [
      {
        value: Option.family_member,
        text: contentFor(
          'question.offence_analysis_victim_of_domestic_abuse_who_committed_abuse.option.FAMILY_MEMBER.text',
        ),
        reveals: requiredDetails({
          code: Question.offence_analysis_victim_of_domestic_abuse_family_member_details,
          validationMessage: contentFor(
            'question.offence_analysis_victim_of_domestic_abuse_who_committed_abuse.option.FAMILY_MEMBER.validation',
          ),
        }),
      },
      {
        value: Option.intimate_partner,
        text: contentFor(
          'question.offence_analysis_victim_of_domestic_abuse_who_committed_abuse.option.INTIMATE_PARTNER.text',
        ),
        reveals: requiredDetails({
          code: Question.offence_analysis_victim_of_domestic_abuse_intimate_partner_details,
          validationMessage: contentFor(
            'question.offence_analysis_victim_of_domestic_abuse_who_committed_abuse.option.INTIMATE_PARTNER.validation',
          ),
        }),
      },
    ],
    validationMessage: commonContentFor('validation.select_at_least_one_option'),
  },
  displayModes: {
    field: checkboxField({ legendClasses: 'govuk-fieldset__legend--l' }),
    summaryRow: itemisedSummaryRow({ changeHref: Step.personal_relationships_domestic_abuse_victim_by.path }),
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
    field: radioField({ legendClasses: 'govuk-fieldset__legend--l' }),
    summaryRow: itemisedSummaryRow({ changeHref: Step.personal_relationships_want_to_make_changes.path }),
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
      changeHref: Step.personal_relationships_community_summary.path,
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
      changeHref: Step.personal_relationships_community_summary.path,
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
      changeHref: Step.personal_relationships_community_summary.path,
    }),
  },
})

export const personalRelationshipsCommunitySection = {
  code: Section.personal_relationships_and_community.code,
  questions: {
    childrenDetails,
    anyParentingResponsibilities,
    parentalResponsibilities,
    familyRelationship,
    childhood,
    childhoodBehaviour,
    belonging,
    inRelationship,
    currentRelationship,
    intimateRelationship,
    domesticAbusePerpetrator,
    domesticAbuseAgainst,
    coerciveBehaviour,
    strangulation,
    domesticAbuseVictim,
    domesticAbuseVictimBy,
    changes,
  },
  practitionerAnalysis: {
    strengthsOrProtectiveFactors,
    riskOfSeriousHarm,
    riskOfReoffending,
  },
}
