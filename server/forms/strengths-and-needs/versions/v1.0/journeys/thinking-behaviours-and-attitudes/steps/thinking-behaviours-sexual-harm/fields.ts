import { validation, Self, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { contentFor } from '../../locales'
import { Question } from '../../constants/question'
import { CaseData } from '../../../../constants/formVersion'
import { Option } from '../../constants/option'

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
      text: contentFor('question.thinking_behaviours_attitudes_sexual_preoccupation.option.YES_SEXUAL_PREOCCUPATION'),
      value: Option.yes_sexual_preoccupation,
    },
    {
      text: contentFor(
        'question.thinking_behaviours_attitudes_sexual_preoccupation.option.SOMETIMES_SEXUAL_PREOCCUPATION',
      ),
      value: Option.sometimes_sexual_preoccupation,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_sexual_preoccupation.option.NO_SEXUAL_PREOCCUPATION'),
      value: Option.no_sexual_preoccupation,
    },
    {
      text: contentFor(
        'question.thinking_behaviours_attitudes_sexual_preoccupation.option.UNKNOWN_SEXUAL_PREOCCUPATION',
      ),
      value: Option.unknown_sexual_preoccupation,
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
        'question.thinking_behaviours_attitudes_offence_related_sexual_interest.option.YES_OFFENCE_RELATED_SEXUAL_INTEREST',
      ),
      value: Option.yes_offence_related_sexual_interest,
    },
    {
      text: contentFor(
        'question.thinking_behaviours_attitudes_offence_related_sexual_interest.option.SOME_OFFENCE_RELATED_SEXUAL_INTEREST',
      ),
      value: Option.some_offence_related_sexual_interest,
    },
    {
      text: contentFor(
        'question.thinking_behaviours_attitudes_offence_related_sexual_interest.option.NO_OFFENCE_RELATED_SEXUAL_INTEREST',
      ),
      value: Option.no_offence_related_sexual_interest,
    },
    {
      text: contentFor(
        'question.thinking_behaviours_attitudes_offence_related_sexual_interest.option.UNKNOWN_OFFENCE_RELATED_SEXUAL_INTEREST',
      ),
      value: Option.unknown_offence_related_sexual_interest,
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
      text: contentFor('question.thinking_behaviours_attitudes_emotional_intimacy.option.YES_EMOTIONAL_INTIMACY'),
      value: Option.yes_emotional_intimacy,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_emotional_intimacy.option.SOMETIMES_EMOTIONAL_INTIMACY'),
      value: Option.sometimes_emotional_intimacy,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_emotional_intimacy.option.NO_EMOTIONAL_INTIMACY'),
      value: Option.no_emotional_intimacy,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_emotional_intimacy.option.UNKNOWN_EMOTIONAL_INTIMACY'),
      value: Option.unknown_emotional_intimacy,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_emotional_intimacy.validation'),
    }),
  ],
})
