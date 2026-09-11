import { and, Answer, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
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

const domesticAbuseAgainstQuestion = revealedQuestion({
  content: {
    code: Question.domestic_abuse_against,
    format: QuestionFormat.RADIO,
    text: contentFor('question.domestic_abuse_against.text'),
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
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
  },
  displayModes: {
    field: radioField({
      dependentWhen: and(
        Answer(Question.evidence_of_domestic_abuse).match(Condition.IsRequired()),
        Answer(Question.evidence_of_domestic_abuse).match(Condition.String.Contains(CommonOption.yes)),
      ),
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
      { value: OffenceOption.domestic_abuse, text: contentFor('question.offence_elements.option.DOMESTIC_ABUSE') },
      {
        value: OffenceOption.excessive_violence_or_sadistic_violence,
        text: contentFor('question.offence_elements.option.EXCESSIVE_VIOLENCE_OR_SADISTIC_VIOLENCE'),
      },
      {
        value: OffenceOption.hatred_of_identifiable_group,
        text: contentFor('question.offence_elements.option.HATRED_OF_IDENTIFIABLE_GROUP'),
      },
      {
        value: OffenceOption.physical_violence_against_a_child,
        text: contentFor('question.offence_elements.option.PHYSICAL_VIOLENCE_AGAINST_A_CHILD'),
      },
      { value: OffenceOption.sexual_element, text: contentFor('question.offence_elements.option.SEXUAL_ELEMENT') },
      { value: OffenceOption.stalking_element, text: contentFor('question.offence_elements.option.STALKING_ELEMENT') },
      {
        value: OffenceOption.violent_or_threat_of_violence_with_a_weapon,
        text: contentFor('question.offence_elements.option.VIOLENT_OR_THREAT_OF_VIOLENCE_WITH_A_WEAPON'),
      },
      { value: OffenceOption.weapon, text: contentFor('question.offence_elements.option.WEAPON') },
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
        reveals: domesticAbuseAgainstQuestion,
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
