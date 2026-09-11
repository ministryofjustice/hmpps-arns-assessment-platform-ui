import { GovUKCheckboxInput, GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import {and, Answer, Condition, Format, Self, validation} from '@ministryofjustice/hmpps-forge/core/authoring'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'
import {
  itemisedSummaryRow,
  question,
  QuestionFormat,
  radioField,
  revealedQuestion
} from "../../../../constants/questionContent";
import {CommonOption} from "../../constants/commonOption";
import {commonContentFor} from "../../locales";
import {Step} from "../../constants/page";
import {Question} from "./constants/question";
import {contentFor} from "./locales";
import {DomesticAbuseOption} from "./constants/DomesticAbuseOption";

const drugLastUsedQuestion = revealedQuestion({
    content: {
      code: Question.domestic_abuse_against,
      format: QuestionFormat.RADIO,
      text: contentFor('question.domestic_abuse_against.text'),
      options: [
        {
          value: DomesticAbuseOption.family_member,
          text: contentFor('question.domestic_abuse_against.option.FAMILY_MEMBER'),
        },
        {
          value: DomesticAbuseOption.intimate_partner,
          text: contentFor('question.domestic_abuse_against.option.INTIMATE_PARTNER'),
        },
        {
          value: DomesticAbuseOption.family_member_and_intimate_partner,
          text: contentFor('question.domestic_abuse_against.option.FAMILY_MEMBER_AND_INTIMATE_PARTNER'),
        },
      ],
      validationMessage: commonContentFor('validation.this_is_a_required_field'),
    },
    displayModes: {
      field: radioField({
        legendClasses: 'govuk-visually-hidden',
        dependentWhen: Answer(Question.domestic_abuse_against).match(Condition.IsRequired()),
      }),
    },
  })

export const offenceElementsField = GovUKCheckboxInput({
  code: 'offence-elements',
  hint: {
    text: 'Select all that apply.',
  },
  fieldset: {
    legend: {
      text: Format('Does %1 current offence have any of the following elements?', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    {
      value: 'arson',
      text: 'Arson',
    },
    {
      value: 'domestic-abuse',
      text: 'Domestic abuse',
    },
    {
      value: 'excessive-violence-or-sadistic-violence',
      text: 'Excessive violence or sadistic violence',
    },
    {
      value: 'hatred-of-identifiable-group',
      text: 'Hatred of identifiable groups',
    },
    {
      value: 'physical-violence-against-a-child',
      text: 'Physical violence against a child',
    },
    {
      value: 'sexual-element',
      text: 'Sexual element',
    },
    {
      value: 'stalking-element',
      text: 'Stalking element',
    },
    {
      value: 'violent-or-threat-of-violence-with-a-weapon',
      text: 'Violent or threat of violence with a weapon',
    },
    {
      value: 'weapon',
      text: 'Weapon',
    },
    {
      divider: 'or',
    },
    {
      value: 'NA',
      text: 'None of these elements',
      behaviour: 'exclusive',
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
  ],
})

const evidenceOfDomesticAbuseQuestion = question({
  content: {
    code: Question.evidence_of_domestic_abuse,
    format: QuestionFormat.RADIO,
    text: contentFor('question.evidence_of_domestic_abuse.text', CaseData.ForenamePossessive),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        reveal: drugLastUsedQuestion
      },
      {
        value: CommonOption.no,
        text: commonContentFor('option.NO'),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      visibleWhen: Answer(Question.evidence_of_domestic_abuse).match(Condition.IsRequired()),
      changePath: Step.thinking_attitudes_and_behaviours.path,
    }),
  },
})
