import { Answer, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'
import {
  checkboxField,
  itemisedSummaryRow,
  question,
  QuestionFormat,
  radioField,
} from '../../../../constants/questionContent'
import { Question } from './constants/question'
import { contentFor } from './locales'
import { commonContentFor } from '../../locales'
import { Step } from '../../constants/page'
import { RelationshipOption } from './constants/RelationshipOption'
import { CommonOption } from '../../constants/commonOption'

const importantRelationshipsQuestion = question({
  content: {
    code: Question.important_relationships,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.important_relationships.text', CaseData.ForenamePossessive),
    hint: commonContentFor('select_all_that_apply'),
    options: [
      {
        value: RelationshipOption.partner,
        text: contentFor('question.important_relationships.option.PARTNER'),
      },
      {
        value: RelationshipOption.children_or_wards,
        text: contentFor('question.important_relationships.option.CHILDREN_OR_WARDS'),
      },
      {
        value: RelationshipOption.other_children,
        text: contentFor('question.important_relationships.option.OTHER_RELATIONSHIP'),
      },
      {
        value: RelationshipOption.family_members,
        text: contentFor('question.important_relationships.option.FAMILY_MEMBERS'),
      },
      {
        value: RelationshipOption.friends,
        text: contentFor('question.important_relationships.option.FRIENDS'),
      },
      {
        value: RelationshipOption.other_relationship,
        text: contentFor('question.important_relationships.option.OTHER_RELATIONSHIP'),
      },
      {
        divider: commonContentFor('or'),
      },
      {
        value: CommonOption.unknown,
        text: commonContentFor('option.UNKNOWN'),
        behaviour: 'exclusive' as const,
      },
    ],
    validationMessage: contentFor('question.important_relationships.validation.required', CaseData.ForenamePossessive),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({
      visibleWhen: Answer(Question.important_relationships).match(Condition.IsRequired()),
      changePath: Step.personal_relationships_and_community.path,
    }),
  },
})

const relationshipSatisfactionQuestion = question({
  content: {
    code: Question.relationship_satisfaction,
    format: QuestionFormat.RADIO,
    text: contentFor('question.relationship_satisfaction.text', CaseData.ForenamePossessive),
    options: [
      {
        value: CommonOption.no_problems,
        text: contentFor('question.relationship_satisfaction.option.NO_PROBLEMS'),
      },
      {
        value: CommonOption.some_problems,
        text: contentFor('question.relationship_satisfaction.option.SOME_PROBLEMS'),
      },
      {
        value: CommonOption.significant_problems,
        text: contentFor('question.relationship_satisfaction.option.SIGNIFICANT_PROBLEMS'),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor(
      'question.relationship_satisfaction.validation.required',
      CaseData.ForenamePossessive,
    ),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      visibleWhen: Answer(Question.relationship_satisfaction).match(Condition.IsRequired()),
      changePath: Step.drug_use.path,
    }),
  },
})

export const personalRelationshipsFields = {
  code: Step.drug_use.code,
  questions: {
    importantRelationshipsQuestion,
    relationshipSatisfactionQuestion,
  },
}
