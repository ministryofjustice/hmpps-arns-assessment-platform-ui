import {
  and,
  Answer,
  Condition,
  Format,
  not,
  or,
  Self,
  validation,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKCharacterCount,
  GovUKCheckboxInput,
  GovUKRadioInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import {drugsList, fieldCodeString} from '../../constants'
import {CaseData} from '../../../../constants/formVersion'
import {Question} from "../../constants/question";
import {contentFor} from "../../locales";
import {Option} from "../../constants/option";
import {CommonOption} from "../../../../constants/commonOption";
import {commonContentFor} from "../../../../locales";

const lastSixMonthConditions = drugsList.map(drug =>
  Answer(fieldCodeString('drug_last_used', drug.value)).match(Condition.Equals('LAST_SIX')),
)

const anyDrugUsedInLastSixMonths = or(
  lastSixMonthConditions[0],
  lastSixMonthConditions[1],
  ...lastSixMonthConditions.slice(2),
)

// --- Reasons for use ---

export const drugsReasonsForUse = GovUKCheckboxInput({
  code: Question.drugs_reasons_for_use,
  multiple: true,
  fieldset: {
    legend: {
      text: when(anyDrugUsedInLastSixMonths)
        .then(contentFor('question.drugs_reasons_for_use.text.usedLastSixMonths', CaseData.Forename))
        .else(contentFor('question.drugs_reasons_for_use.text.default', CaseData.Forename)),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.drugs_reasons_for_use.hint'),
  items: [
    { value: Option.cultural_or_religious, text: contentFor('question.drugs_reasons_for_use.option.CULTURAL_OR_RELIGIOUS') },
    { value: Option.curiosity_or_experimentation, text: contentFor('question.drugs_reasons_for_use.option.CURIOSITY_OR_EXPERIMENTATION') },
    { value: Option.enhance_performance, text: contentFor('question.drugs_reasons_for_use.option.ENHANCE_PERFORMANCE') },
    { value: Option.escapism_or_avoidance, text: contentFor('question.drugs_reasons_for_use.option.ESCAPISM_OR_AVOIDANCE') },
    { value: Option.managing_emotional_issues, text: contentFor('question.drugs_reasons_for_use.option.MANAGING_EMOTIONAL_ISSUES') },
    { value: Option.peer_pressure, text: contentFor('question.drugs_reasons_for_use.option.PEER_PRESSURE') },
    { value: Option.recreation_or_pleasure, text: contentFor('question.drugs_reasons_for_use.option.RECREATION_OR_PLEASURE') },
    { value: Option.self_medication, text: contentFor('question.drugs_reasons_for_use.option.SELF_MEDICATION') },
    { value: CommonOption.other, text: commonContentFor('option.OTHER') },
  ],
  validWhen: [
    validation({
      condition: not(and(anyDrugUsedInLastSixMonths, Self().not.match(Condition.IsRequired()))),
      message: contentFor('question.drugs_reasons_for_use.validation.usedLastSixMonths'),
    }),
    validation({
      condition: not(and(not(anyDrugUsedInLastSixMonths), Self().not.match(Condition.IsRequired()))),
      message: contentFor('question.drugs_reasons_for_use.validation.default'),
    }),
  ],
})

export const drugsReasonsForUseDetails = GovUKCharacterCount({
  code: Question.drugs_reasons_for_use_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
})

// --- How drug use has affected their life ---

export const drugsAffectedTheirLife = GovUKCheckboxInput({
  code: Question.drugs_affected_their_life,
  multiple: true,
  fieldset: {
    legend: {
      text: contentFor('question.drugs_affected_their_life.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: commonContentFor('select_all_that_apply'),
  items: [
    {
      value: Option.behaviour,
      text: contentFor('question.drugs_affected_their_life.option.BEHAVIOUR.text'),
      hint: { text: contentFor('question.drugs_affected_their_life.option.BEHAVIOUR.hint') },
    },
    {
      value: Option.community,
      text: contentFor('question.drugs_affected_their_life.option.COMMUNITY.text'),
      hint: { text: contentFor('question.drugs_affected_their_life.option.COMMUNITY.hint') },
    },
    {
      value: Option.finances,
      text: contentFor('question.drugs_affected_their_life.option.FINANCES.text'),
      hint: { text: contentFor('question.drugs_affected_their_life.option.FINANCES.hint') },
    },
    {
      value: Option.links_to_offending,
      text: contentFor('question.drugs_affected_their_life.option.LINKS_TO_OFFENDING.text') },
    {
      value: Option.health,
      text: contentFor('question.drugs_affected_their_life.option.HEALTH.text'),
      hint: { text: contentFor('question.drugs_affected_their_life.option.HEALTH.hint') },
    },
    {
      value: Option.relationships,
      text: contentFor('question.drugs_affected_their_life.option.RELATIONSHIPS.text'),
      hint: { text: contentFor('question.drugs_affected_their_life.option.RELATIONSHIPS.hint') },
    },
    { value: CommonOption.other, text: commonContentFor('option.OTHER') },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.drugs_affected_their_life.validation'),
    }),
  ],
})

export const drugsAffectedTheirLifeDetails = GovUKCharacterCount({
  code: Question.drugs_affected_their_life_details,
  label: 'Give details (optional)',
  maxLength: 2000,
})

// --- Help and future ---

export const drugsAnythingHelpedStopOrReduceUse = GovUKCharacterCount({
  code: Question.drugs_anything_helped_stop_or_reduce_use,
  label: {
    text: contentFor('question.drugs_anything_helped_stop_or_reduce_use.text', CaseData.Forename),
    classes: 'govuk-label--m',
  },
  hint: contentFor('question.drugs_anything_helped_stop_or_reduce_use.hint'),
  maxLength: 2000,
  visibleWhen: anyDrugUsedInLastSixMonths
})

export const drugsWhatCouldHelpNotUseDrugsInFuture = GovUKCharacterCount({
  code: Question.drugs_what_could_help_not_use_drugs_in_future,
  label: {
    text: Format('What could help %1 not use drugs in the future? (optional)', CaseData.Forename),
    classes: 'govuk-label--m',
  },
  maxLength: 2000,
  visibleWhen: not(anyDrugUsedInLastSixMonths)
})

// --- Wants to make changes ---

const hasMadeChangesDrugsDetails = GovUKCharacterCount({
  code: Question.has_made_positive_changes_drugs_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.drug_use_changes)
    .match(Condition.Equals(CommonOption.has_made_changes)),
})

const activelyMakingChangesDrugsDetails = GovUKCharacterCount({
  code: Question.actively_making_changes_drugs_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.drug_use_changes)
    .match(Condition.Equals(CommonOption.is_making_changes)),
})

const wantsToMakeChangesKnowsHowToDrugsDetails = GovUKCharacterCount({
  code: Question.wants_to_make_changes_knows_how_to_drugs_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.drug_use_changes)
    .match(Condition.Equals(CommonOption.wants_to_make_changes_knows_how_to)),
})

const wantsToMakeChangesNeedsHelpDrugsDetails = GovUKCharacterCount({
  code: Question.wants_to_make_changes_needs_help_drugs_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.drug_use_changes)
    .match(Condition.Equals(CommonOption.wants_to_make_changes_needs_help)),
})

const thinkingAboutMakingChangesDrugsDetails = GovUKCharacterCount({
  code: Question.thinking_about_making_changes_drugs_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.drug_use_changes)
    .match(Condition.Equals(CommonOption.thinking_about_making_changes)),
})

const doesNotWantToMakeChangesDrugsDetails = GovUKCharacterCount({
  code: Question.does_not_want_to_make_changes_drugs_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.drug_use_changes)
    .match(Condition.Equals(CommonOption.does_not_want_to_make_changes)),
})

const doesNotWantToAnswerDrugsDetails = GovUKCharacterCount({
  code: Question.does_not_want_to_answer_drugs_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.drug_use_changes)
    .match(Condition.Equals(CommonOption.does_not_want_to_answer)),
})

export const drugUseChanges = GovUKRadioInput({
  code: Question.drug_use_changes,
  fieldset: {
    legend: {
      text: contentFor('question.drug_use_changes.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.has_made_changes, text: commonContentFor('option.HAS_MADE_CHANGES'), block: hasMadeChangesDrugsDetails },
    { value: CommonOption.is_making_changes, text: commonContentFor('option.IS_MAKING_CHANGES'), block: activelyMakingChangesDrugsDetails },
    { value: CommonOption.wants_to_make_changes_knows_how_to, text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO'), block: wantsToMakeChangesKnowsHowToDrugsDetails },
    { value: CommonOption.wants_to_make_changes_needs_help, text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_NEEDS_HELP'), block: wantsToMakeChangesNeedsHelpDrugsDetails },
    { value: CommonOption.thinking_about_making_changes, text: commonContentFor('option.THINKING_ABOUT_MAKING_CHANGES'), block: thinkingAboutMakingChangesDrugsDetails },
    { value: CommonOption.does_not_want_to_make_changes, text: commonContentFor('option.DOES_NOT_WANT_TO_MAKE_CHANGES'), block: doesNotWantToMakeChangesDrugsDetails },
    { value: CommonOption.does_not_want_to_answer, text: commonContentFor('option.DOES_NOT_WANT_TO_ANSWER'), block: doesNotWantToAnswerDrugsDetails },
    { divider: 'or' },
    { value: CommonOption.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.drug_use_changes.validation'),
    }),
  ],
})
