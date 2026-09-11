import { Answer, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'
import {
  checkboxField,
  itemisedSummaryRow,
  question,
  QuestionFormat,
  radioField,
  revealedQuestion,
} from '../../../../constants/questionContent'
import { CommonOption } from '../../constants/commonOption'
import { commonContentFor } from '../../locales'
import { Step } from '../../constants/page'
import { Question } from './constants/question'
import { contentFor } from './locales'
import { DomesticAbuseOption } from './constants/DomesticAbuseOption'
import { OffenceOption } from './constants/OffenceOption'

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

const offenceElementsQuestion = question({
  content: {
    code: Question.offence_elements,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.offence_elements.text', CaseData.ForenamePossessive),
    hint: commonContentFor('select_all_that_apply'),
    options: [
      { value: OffenceOption.arson, text: contentFor('question.offence_elements.option.ARSON') },
      { value: OffenceOption.domestic_abuse, text: contentFor('question.offence_elements.option.ARSON') },
      {
        value: OffenceOption.excessive_violence_or_sadistic_violence,
        text: contentFor('question.offence_elements.option.ARSON'),
      },
      { value: OffenceOption.hatred_of_identifiable_group, text: contentFor('question.offence_elements.option.ARSON') },
      {
        value: OffenceOption.physical_violence_against_a_child,
        text: contentFor('question.offence_elements.option.ARSON'),
      },
      { value: OffenceOption.sexual_element, text: contentFor('question.offence_elements.option.ARSON') },
      { value: OffenceOption.stalking_element, text: contentFor('question.offence_elements.option.ARSON') },
      {
        value: OffenceOption.violent_or_threat_of_violence_with_a_weapon,
        text: contentFor('question.offence_elements.option.ARSON'),
      },
      { value: OffenceOption.weapon, text: contentFor('question.offence_elements.option.ARSON') },
      { divider: commonContentFor('or') },
      {
        value: CommonOption.na,
        text: contentFor('question.offence_elements.option.na'),
        behaviour: 'exclusive' as const,
      },
    ],
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.accommodation.path }),
  },
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
        reveal: drugLastUsedQuestion,
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

export const offenceAnalysisFields = {
  code: Step.offence_analysis.code,
  questions: {
    offenceElementsQuestion,
    evidenceOfDomesticAbuseQuestion,
  },
}
