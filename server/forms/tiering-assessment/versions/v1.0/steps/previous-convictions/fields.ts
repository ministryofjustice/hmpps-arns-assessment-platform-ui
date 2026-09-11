import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'
import { checkboxField, itemisedSummaryRow, question, QuestionFormat } from '../../../../constants/questionContent'
import { Question } from './constants/question'
import { contentFor } from './locales'
import { commonContentFor } from '../../locales'
import { Option } from './constants/option'
import { Step } from '../../constants/page'

const previousConvictionsQuestion = question({
  content: {
    code: Question.previous_convictions,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.previous_convictions.text', CaseData.Forename),
    hint: commonContentFor('select_all_that_apply'),
    options: [
      { value: Option.HOMICIDE, text: contentFor('question.previous_convictions.option.HOMICIDE') },
      { value: Option.WOUNDING_GBH, text: contentFor('question.previous_convictions.option.WOUNDING_GBH') },
      {
        value: Option.SEXUAL_OFFENCE_AGAINST_CHILD,
        text: contentFor('question.previous_convictions.option.SEXUAL_OFFENCE_AGAINST_CHILD'),
      },
      {
        value: Option.OTHER_OFFENCE_AGAINST_CHILD,
        text: contentFor('question.previous_convictions.option.OTHER_OFFENCE_AGAINST_CHILD'),
      },
      { value: Option.CRIMINAL_DAMAGE, text: contentFor('question.previous_convictions.option.CRIMINAL_DAMAGE') },
      { value: Option.WEAPON, text: contentFor('question.previous_convictions.option.WEAPON') },
      { value: Option.KIDNAPPING, text: contentFor('question.previous_convictions.option.KIDNAPPING') },
      { value: Option.ARSON, text: contentFor('question.previous_convictions.option.ARSON') },
      { value: Option.RACIAL_OFFENCE, text: contentFor('question.previous_convictions.option.RACIAL_OFFENCE') },
      {
        value: Option.AGGRAVATED_BURGLARY,
        text: contentFor('question.previous_convictions.option.AGGRAVATED_BURGLARY'),
      },
      { value: Option.ROBBERY, text: contentFor('question.previous_convictions.option.ROBBERY') },
      {
        value: Option.OTHER_SERIOUS_OFFENCE,
        text: contentFor('question.previous_convictions.option.OTHER_SERIOUS_OFFENCE'),
      },
      {
        value: Option.OFFENCE_COMMITTED_IN_CUSTODY,
        text: contentFor('question.previous_convictions.option.OFFENCE_COMMITTED_IN_CUSTODY'),
      },
      { value: Option.FIREARMS, text: contentFor('question.previous_convictions.option.FIREARMS') },
      { divider: commonContentFor('or') },
      {
        value: Option.NA,
        text: contentFor('question.previous_convictions.option.NA'),
        behaviour: 'exclusive' as const,
      },
    ],
    validationMessage: contentFor('question.previous_convictions.validation', CaseData.Forename),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.previous_convictions.path }),
  },
})

export const previousConvictionsFields = {
  code: Step.previous_convictions.code,
  questions: {
    previousConvictionsQuestion,
  },
}
