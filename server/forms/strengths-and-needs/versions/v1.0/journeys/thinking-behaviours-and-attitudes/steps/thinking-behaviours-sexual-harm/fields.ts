import { validation, Self, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { contentFor } from '../../locales'
import { Question } from '../../constants/question'
import { CaseData } from '../../../../constants/formVersion'
import { Option } from '../../constants/option'
import { CommonOption } from '../../../../constants/commonOption'
import { commonContentFor } from '../../../../locales'

/* ------------------------------------------------------------------ */
/* Sexual harm detail questions (shown when risk = YES)               */
/* ------------------------------------------------------------------ */

export const thinkingBehavioursSexualPreoccupation = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_sexual_preoccupation,
  fieldset: {
    legend: {
      text: contentFor('question.thinking_behaviours_attitudes_sexual_preoccupation.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      text: contentFor('question.thinking_behaviours_attitudes_sexual_preoccupation.option.YES'),
      value: CommonOption.yes,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_sexual_preoccupation.option.SOMETIMES'),
      value: Option.sometimes,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_sexual_preoccupation.option.NO.text'),
      value: CommonOption.no,
      hint: contentFor('question.thinking_behaviours_attitudes_sexual_preoccupation.option.NO.hint'),
    },
    {
      text: commonContentFor('option.UNKNOWN'),
      value: CommonOption.unknown,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_sexual_preoccupation.validation'),
    }),
  ],
})

export const thinkingBehavioursOffenceRelatedSexualInterest = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_offence_related_sexual_interest,
  fieldset: {
    legend: {
      text: contentFor(
        'question.thinking_behaviours_attitudes_offence_related_sexual_interest.text',
        CaseData.Forename,
      ),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      text: contentFor(
        'question.thinking_behaviours_attitudes_offence_related_sexual_interest.option.YES_OFFENCE_RELATED_SEXUAL_INTEREST.text',
      ),
      value: Option.yes_offence_related_sexual_interest,
      hint: contentFor(
        'question.thinking_behaviours_attitudes_offence_related_sexual_interest.option.YES_OFFENCE_RELATED_SEXUAL_INTEREST.hint',
      ),
    },
    {
      text: contentFor(
        'question.thinking_behaviours_attitudes_offence_related_sexual_interest.option.SOME_OFFENCE_RELATED_SEXUAL_INTEREST',
      ),
      value: Option.some_offence_related_sexual_interest,
    },
    {
      text: contentFor(
        'question.thinking_behaviours_attitudes_offence_related_sexual_interest.option.NO_OFFENCE_RELATED_SEXUAL_INTEREST.text',
      ),
      value: Option.no_offence_related_sexual_interest,
      hint: contentFor(
        'question.thinking_behaviours_attitudes_offence_related_sexual_interest.option.NO_OFFENCE_RELATED_SEXUAL_INTEREST.text',
      ),
    },
    {
      text: commonContentFor('option.UNKNOWN'),
      value: CommonOption.unknown,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_offence_related_sexual_interest.validation'),
    }),
  ],
})

export const thinkingBehavioursEmotionalIntimacy = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_emotional_intimacy,
  fieldset: {
    legend: {
      text: contentFor('question.thinking_behaviours_attitudes_emotional_intimacy.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      text: contentFor('question.thinking_behaviours_attitudes_emotional_intimacy.option.YES'),
      value: CommonOption.yes,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_emotional_intimacy.option.SOMETIMES'),
      value: Option.sometimes,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_emotional_intimacy.option.NO'),
      value: CommonOption.no,
    },
    {
      text: commonContentFor('option.UNKNOWN'),
      value: CommonOption.unknown,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_emotional_intimacy.validation'),
    }),
  ],
})
