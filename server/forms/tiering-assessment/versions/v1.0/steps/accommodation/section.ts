import { contentFor } from './locales'
import { Question } from './constants/question'
import { Option } from './constants/option'
import { Step } from './constants/step'
import { commonContentFor } from '../../locales'
import { CommonOption } from '../../constants/commonOption'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'
import { Section } from '../../constants/section'
import {
  checkboxField,
  itemisedSummaryRow,
  question,
  QuestionFormat,
  radioField,
} from '../../../../constants/questionContent'

const whoAreTheyLivingWithQuestion = question({
  content: {
    code: Question.who_are_they_living_with,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.who_are_they_living_with.text', CaseData.Forename),
    hint: commonContentFor('select_all_that_apply'),
    options: [
      { value: Option.family, text: contentFor('question.who_are_they_living_with.option.FAMILY') },
      { value: Option.friends, text: contentFor('question.who_are_they_living_with.option.FRIENDS') },
      { value: Option.partner, text: contentFor('question.who_are_they_living_with.option.PARTNER') },
      { value: Option.person_under_18, text: contentFor('question.who_are_they_living_with.option.PERSON_UNDER_18') },
      { value: CommonOption.other, text: commonContentFor('option.OTHER') },
      { divider: commonContentFor('or') },
      {
        value: Option.alone,
        text: contentFor('question.who_are_they_living_with.option.ALONE'),
        behaviour: 'exclusive' as const,
      },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN'), behaviour: 'exclusive' as const },
    ],
    validationMessage: contentFor('question.who_are_they_living_with.validation', CaseData.Forename),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.accommodation.path }),
  },
})

export const suitabilityOfAccommodationQuestion = question({
  content: {
    code: Question.suitability_of_accommodation,
    format: QuestionFormat.RADIO,
    text: contentFor('question.suitability_of_accommodation.text', CaseData.ForenamePossessive),
    hint: contentFor('question.suitability_of_accommodation.hint'),
    options: [
      {
        value: CommonOption.no_problems,
        text: contentFor('question.suitability_of_accommodation.option.NO_PROBLEMS'),
      },
      {
        value: CommonOption.some_problems,
        text: contentFor('question.suitability_of_accommodation.option.SOME_PROBLEMS'),
      },
      {
        value: CommonOption.significant_problems,
        text: contentFor('question.suitability_of_accommodation.option.SIGNIFICANT_PROBLEMS'),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.accommodation.path }),
  },
})

export const accommodationSection = {
  code: Section.accommodation.code,
  questions: {
    whoAreTheyLivingWithQuestion,
    suitabilityOfAccommodationQuestion,
  },
}
