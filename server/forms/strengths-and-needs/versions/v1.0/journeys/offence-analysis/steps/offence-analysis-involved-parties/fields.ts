import { Answer, Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { commonContentFor } from '../../../../locales'
import { contentFor } from '../../locales'
import { CommonOption } from '../../../../constants/commonOption'

export const offenceAnalysisWhoWasTheOffenceCommittedAgainst = GovUKRadioInput({
  code: Question.offence_analysis_who_was_the_victim,
  fieldset: {
    legend: {
      text: contentFor('question.offence_analysis_commited_against.text'),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: commonContentFor('select_all_that_apply'),
  items: [
    {
      value: Option.none,
      text: contentFor('option.NONE'),
    },
    {
      value: Option.one,
      text: contentFor('question.offence_analysis_who_was_the_victim.option.ONE'),
    },
    {
      value: Option.two,
      text: contentFor('question.offence_analysis_who_was_the_victim.option.TWO'),
    },
    {
      value: Option.three,
      text: contentFor('question.offence_analysis_who_was_the_victim.option.THREE'),
    },
    {
      value: Option.four,
      text: contentFor('question.offence_analysis_who_was_the_victim.option.FOUR'),
    },
    {
      value: Option.five,
      text: contentFor('question.offence_analysis_who_was_the_victim.option.FIVE'),
    },
    {
      value: Option.six_to_ten,
      text: contentFor('question.offence_analysis_who_was_the_victim.option.SIX_TO_10'),
    },
    {
      value: Option.eleven_to_fifteen,
      text: contentFor('question.offence_analysis_who_was_the_victim.option.ELEVEN_TO_15'),
    },
    {
      value: Option.more_than_fifteen,
      text: contentFor('question.offence_analysis_who_was_the_victim.option.MORE_THAN_15'),
    },
  ],
  dependentWhen: Answer(Question.offence_analysis_commited_against).match(Condition.Array.Contains(CommonOption.other)),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.offence_analysis_who_was_the_victim.validation'),
    }),
  ],
})
