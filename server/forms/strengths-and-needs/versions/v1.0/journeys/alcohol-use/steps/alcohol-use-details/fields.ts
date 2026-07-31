import { validation, Self, Answer, and, Condition, when } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKRadioInput,
  GovUKCheckboxInput,
  GovUKCharacterCount,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { CaseData } from '../../../../constants/formVersion'
import { CommonOption } from '../../../../constants/commonOption'
import { Gender } from '../../../../../../../shared/constants/gender'
import { contentFor } from '../../locales'
import { commonContentFor } from '../../../../locales'

/**
 * Alcohol usage details fields.
 *
 * The recency fields (frequency, units, binge drinking) only apply when they have
 * drunk alcohol in the last 3 months, so they are gated with dependentWhen. The base
 * usage fields and "want to make changes" group apply whenever they have drunk alcohol.
 */

const drankInLastThreeMonths = Answer(Question.alcohol_use).match(Condition.Equals(Option.yes_within_last_three_months))

const genderIsMale = CaseData.Gender.match(Condition.Equals(Gender.MALE))

export const alcoholBingeDrinkingLegend = when(genderIsMale)
  .then(contentFor('question.alcohol_binge_drinking.text_male', CaseData.Forename))
  .else(contentFor('question.alcohol_binge_drinking.text_other', CaseData.Forename))

// --- Usage in the last 3 months ---

export const alcoholFrequency = GovUKRadioInput({
  code: Question.alcohol_frequency,
  fieldset: {
    legend: {
      text: contentFor('question.alcohol_frequency.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  visibleWhen: drankInLastThreeMonths,
  dependentWhen: drankInLastThreeMonths,
  items: [
    { value: Option.once_a_month_or_less, text: contentFor('question.alcohol_frequency.option.ONCE_A_MONTH_OR_LESS') },
    {
      value: Option.multiple_times_a_month,
      text: contentFor('question.alcohol_frequency.option.MULTIPLE_TIMES_A_MONTH'),
    },
    {
      value: Option.less_than_4_times_a_week,
      text: contentFor('question.alcohol_frequency.option.LESS_THAN_4_TIMES_A_WEEK'),
    },
    {
      value: Option.more_than_4_times_a_week,
      text: contentFor('question.alcohol_frequency.option.MORE_THAN_4_TIMES_A_WEEK'),
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.alcohol_frequency.validation'),
    }),
  ],
})

export const alcoholUnits = GovUKRadioInput({
  code: Question.alcohol_units,
  fieldset: {
    legend: {
      text: contentFor('question.alcohol_units.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: { html: contentFor('question.alcohol_units.hint') },
  visibleWhen: drankInLastThreeMonths,
  dependentWhen: drankInLastThreeMonths,
  items: [
    { value: Option.units_1_to_2, text: contentFor('question.alcohol_units.option.UNITS_1_TO_2') },
    { value: Option.units_3_to_4, text: contentFor('question.alcohol_units.option.UNITS_3_TO_4') },
    { value: Option.units_5_to_6, text: contentFor('question.alcohol_units.option.UNITS_5_TO_6') },
    { value: Option.units_7_to_9, text: contentFor('question.alcohol_units.option.UNITS_7_TO_9') },
    { value: Option.units_10_or_more, text: contentFor('question.alcohol_units.option.UNITS_10_OR_MORE') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.alcohol_units.validation'),
    }),
  ],
})

export const alcoholBingeDrinkingFrequency = GovUKRadioInput({
  code: Question.alcohol_binge_drinking_frequency,
  fieldset: {
    legend: {
      text: contentFor('question.alcohol_binge_drinking_frequency.text'),
    },
  },
  dependentWhen: and(
    drankInLastThreeMonths,
    Answer(Question.alcohol_binge_drinking).match(Condition.Equals(CommonOption.yes)),
  ),
  items: [
    {
      value: Option.less_than_a_month,
      text: contentFor('question.alcohol_binge_drinking_frequency.option.LESS_THAN_A_MONTH'),
    },
    { value: Option.monthly, text: contentFor('question.alcohol_binge_drinking_frequency.option.MONTHLY') },
    { value: Option.weekly, text: contentFor('question.alcohol_binge_drinking_frequency.option.WEEKLY') },
    { value: Option.daily, text: contentFor('question.alcohol_binge_drinking_frequency.option.DAILY') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.alcohol_binge_drinking_frequency.validation'),
    }),
  ],
})

export const alcoholBingeDrinking = GovUKRadioInput({
  code: Question.alcohol_binge_drinking,
  fieldset: {
    legend: {
      text: alcoholBingeDrinkingLegend,
      classes: 'govuk-fieldset__legend--m',
    },
  },
  visibleWhen: drankInLastThreeMonths,
  dependentWhen: drankInLastThreeMonths,
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: alcoholBingeDrinkingFrequency },
    { value: CommonOption.no, text: commonContentFor('option.NO') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: when(genderIsMale)
        .then(contentFor('question.alcohol_binge_drinking.validation_male'))
        .else(contentFor('question.alcohol_binge_drinking.validation_other')),
    }),
  ],
})

// --- Base usage (shown whenever they have drunk alcohol) ---

export const alcoholEvidenceOfExcessDrinking = GovUKRadioInput({
  code: Question.alcohol_evidence_of_excess_drinking,
  fieldset: {
    legend: {
      text: contentFor('question.alcohol_evidence_of_excess_drinking.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: Option.no_evidence,
      text: contentFor('question.alcohol_evidence_of_excess_drinking.option.NO_EVIDENCE'),
    },
    {
      value: Option.yes_with_some_evidence,
      text: contentFor('question.alcohol_evidence_of_excess_drinking.option.YES_WITH_SOME_EVIDENCE.text'),
      hint: { text: contentFor('question.alcohol_evidence_of_excess_drinking.option.YES_WITH_SOME_EVIDENCE.hint') },
    },
    {
      value: Option.yes_with_evidence,
      text: contentFor('question.alcohol_evidence_of_excess_drinking.option.YES_WITH_EVIDENCE.text'),
      hint: { text: contentFor('question.alcohol_evidence_of_excess_drinking.option.YES_WITH_EVIDENCE.hint') },
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.alcohol_evidence_of_excess_drinking.validation'),
    }),
  ],
})

const alcoholPastIssuesDetails = GovUKCharacterCount({
  code: Question.alcohol_past_issues_yes_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.alcohol_past_issues).match(Condition.Equals(CommonOption.yes)),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.alcohol_past_issues_yes_details.validation'),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

export const alcoholPastIssues = GovUKRadioInput({
  code: Question.alcohol_past_issues,
  fieldset: {
    legend: {
      text: contentFor('question.alcohol_past_issues.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: alcoholPastIssuesDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.alcohol_past_issues.validation'),
    }),
  ],
})

const alcoholReasonsForUseOtherDetails = GovUKCharacterCount({
  code: Question.alcohol_reasons_for_use_other_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.alcohol_reasons_for_use).match(Condition.IsRequired()),
    Answer(Question.alcohol_reasons_for_use).match(Condition.Array.Contains(CommonOption.other)),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

export const alcoholReasonsForUse = GovUKCheckboxInput({
  code: Question.alcohol_reasons_for_use,
  multiple: true,
  fieldset: {
    legend: {
      text: contentFor('question.alcohol_reasons_for_use.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: commonContentFor('select_all_that_apply'),
  items: [
    {
      value: Option.cultural_or_religious,
      text: contentFor('question.alcohol_reasons_for_use.option.CULTURAL_OR_RELIGIOUS'),
    },
    {
      value: Option.curiosity_or_experimentation,
      text: contentFor('question.alcohol_reasons_for_use.option.CURIOSITY_OR_EXPERIMENTATION'),
    },
    { value: Option.enjoyment, text: contentFor('question.alcohol_reasons_for_use.option.ENJOYMENT') },
    {
      value: Option.managing_emotional_issues,
      text: contentFor('question.alcohol_reasons_for_use.option.MANAGING_EMOTIONAL_ISSUES'),
    },
    { value: Option.special_occasions, text: contentFor('question.alcohol_reasons_for_use.option.SPECIAL_OCCASIONS') },
    { value: Option.peer_pressure, text: contentFor('question.alcohol_reasons_for_use.option.PEER_PRESSURE') },
    {
      value: Option.self_medication,
      text: contentFor('question.alcohol_reasons_for_use.option.SELF_MEDICATION.text'),
      hint: { text: contentFor('question.alcohol_reasons_for_use.option.SELF_MEDICATION.hint') },
    },
    { value: Option.social, text: contentFor('question.alcohol_reasons_for_use.option.SOCIAL') },
    { value: CommonOption.other, text: commonContentFor('option.OTHER'), block: alcoholReasonsForUseOtherDetails },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.alcohol_reasons_for_use.validation'),
    }),
  ],
})

const alcoholImpactOfUseOtherDetails = GovUKCharacterCount({
  code: Question.alcohol_impact_of_use_other_details,
  label: commonContentFor('optional_details'),
  hint: contentFor('question.alcohol_impact_of_use_other_details.hint'),
  maxLength: 2000,
  dependentWhen: and(
    Answer(Question.alcohol_impact_of_use).match(Condition.IsRequired()),
    Answer(Question.alcohol_impact_of_use).match(Condition.Array.Contains(CommonOption.other)),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

export const alcoholImpactOfUse = GovUKCheckboxInput({
  code: Question.alcohol_impact_of_use,
  multiple: true,
  fieldset: {
    legend: {
      text: contentFor('question.alcohol_impact_of_use.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: commonContentFor('select_all_that_apply'),
  items: [
    {
      value: Option.behavioural,
      text: contentFor('question.alcohol_impact_of_use.option.BEHAVIOURAL.text'),
      hint: { text: contentFor('question.alcohol_impact_of_use.option.BEHAVIOURAL.hint') },
    },
    {
      value: Option.community,
      text: contentFor('question.alcohol_impact_of_use.option.COMMUNITY.text'),
      hint: { text: contentFor('question.alcohol_impact_of_use.option.COMMUNITY.hint') },
    },
    {
      value: Option.finances,
      text: contentFor('question.alcohol_impact_of_use.option.FINANCES.text'),
      hint: { text: contentFor('question.alcohol_impact_of_use.option.FINANCES.hint') },
    },
    {
      value: Option.links_to_reoffending,
      text: contentFor('question.alcohol_impact_of_use.option.LINKS_TO_REOFFENDING'),
    },
    {
      value: Option.physical_or_mental_health,
      text: contentFor('question.alcohol_impact_of_use.option.PHYSICAL_OR_MENTAL_HEALTH.text'),
      hint: { text: contentFor('question.alcohol_impact_of_use.option.PHYSICAL_OR_MENTAL_HEALTH.hint') },
    },
    {
      value: Option.relationships,
      text: contentFor('question.alcohol_impact_of_use.option.RELATIONSHIPS.text'),
      hint: { text: contentFor('question.alcohol_impact_of_use.option.RELATIONSHIPS.hint') },
    },
    { value: CommonOption.other, text: commonContentFor('option.OTHER'), block: alcoholImpactOfUseOtherDetails },
    { divider: commonContentFor('or') },
    {
      value: Option.no_negative_impact,
      text: contentFor('question.alcohol_impact_of_use.option.NO_NEGATIVE_IMPACT'),
      behaviour: 'exclusive',
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.alcohol_impact_of_use.validation'),
    }),
  ],
})

const alcoholStoppedOrReducedDetails = GovUKCharacterCount({
  code: Question.alcohol_stopped_or_reduced_yes_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.alcohol_stopped_or_reduced).match(Condition.Equals(CommonOption.yes)),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.alcohol_stopped_or_reduced_yes_details.validation'),
    }),
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

export const alcoholStoppedOrReduced = GovUKRadioInput({
  code: Question.alcohol_stopped_or_reduced,
  fieldset: {
    legend: {
      text: contentFor('question.alcohol_stopped_or_reduced.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.alcohol_stopped_or_reduced.hint'),
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: alcoholStoppedOrReducedDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.alcohol_stopped_or_reduced.validation'),
    }),
  ],
})

// --- Want to Make Changes Group ---

const hasMadeChangesAlcoholDetails = GovUKCharacterCount({
  code: Question.alcohol_use_changes_made_changes_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.alcohol_use_changes).match(Condition.Equals(CommonOption.has_made_changes)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

const activelyMakingChangesAlcoholDetails = GovUKCharacterCount({
  code: Question.alcohol_use_changes_making_changes_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.alcohol_use_changes).match(Condition.Equals(CommonOption.is_making_changes)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

const wantsToMakeChangesKnowsHowToAlcoholDetails = GovUKCharacterCount({
  code: Question.alcohol_use_changes_want_to_make_changes_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.alcohol_use_changes).match(
    Condition.Equals(CommonOption.wants_to_make_changes_knows_how_to),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

const wantsToMakeChangesNeedsHelpAlcoholDetails = GovUKCharacterCount({
  code: Question.alcohol_use_changes_needs_help_to_make_changes_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.alcohol_use_changes).match(
    Condition.Equals(CommonOption.wants_to_make_changes_needs_help),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

const thinkingAboutMakingChangesAlcoholDetails = GovUKCharacterCount({
  code: Question.alcohol_use_changes_thinking_about_making_changes_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.alcohol_use_changes).match(
    Condition.Equals(CommonOption.thinking_about_making_changes),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

const doesNotWantToMakeChangesAlcoholDetails = GovUKCharacterCount({
  code: Question.alcohol_use_changes_does_not_want_to_make_changes_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.alcohol_use_changes).match(
    Condition.Equals(CommonOption.does_not_want_to_make_changes),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

const doesNotWantToAnswerAlcoholDetails = GovUKCharacterCount({
  code: Question.alcohol_use_changes_does_not_want_to_answer_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.alcohol_use_changes).match(Condition.Equals(CommonOption.does_not_want_to_answer)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

export const alcoholChanges = GovUKRadioInput({
  code: Question.alcohol_use_changes,
  fieldset: {
    legend: {
      text: contentFor('question.alcohol_use_changes.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: CommonOption.has_made_changes,
      text: commonContentFor('option.HAS_MADE_CHANGES'),
      block: hasMadeChangesAlcoholDetails,
    },
    {
      value: CommonOption.is_making_changes,
      text: commonContentFor('option.IS_MAKING_CHANGES'),
      block: activelyMakingChangesAlcoholDetails,
    },
    {
      value: CommonOption.wants_to_make_changes_knows_how_to,
      text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO'),
      block: wantsToMakeChangesKnowsHowToAlcoholDetails,
    },
    {
      value: CommonOption.wants_to_make_changes_needs_help,
      text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_NEEDS_HELP'),
      block: wantsToMakeChangesNeedsHelpAlcoholDetails,
    },
    {
      value: CommonOption.thinking_about_making_changes,
      text: commonContentFor('option.THINKING_ABOUT_MAKING_CHANGES'),
      block: thinkingAboutMakingChangesAlcoholDetails,
    },
    {
      value: CommonOption.does_not_want_to_make_changes,
      text: commonContentFor('option.DOES_NOT_WANT_TO_MAKE_CHANGES'),
      block: doesNotWantToMakeChangesAlcoholDetails,
    },
    {
      value: CommonOption.does_not_want_to_answer,
      text: commonContentFor('option.DOES_NOT_WANT_TO_ANSWER'),
      block: doesNotWantToAnswerAlcoholDetails,
    },
    { divider: commonContentFor('or') },
    { value: CommonOption.not_present, text: commonContentFor('option.NOT_PRESENT', CaseData.Forename) },
    { value: CommonOption.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.alcohol_use_changes.validation'),
    }),
  ],
})
