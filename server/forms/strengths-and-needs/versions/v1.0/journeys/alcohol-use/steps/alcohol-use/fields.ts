import { validation, Self, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { CaseData } from '../../../../constants/formVersion'
import { CommonOption } from '../../../../constants/commonOption'
import { contentFor } from '../../locales'
import { commonContentFor } from '../../../../locales'

export const alcoholUse = GovUKRadioInput({
  code: Question.alcohol_use,
  fieldset: {
    legend: {
      text: contentFor('question.alcohol_use.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--l',
    },
  },
  items: [
    {
      value: Option.yes_within_last_three_months,
      text: contentFor('question.alcohol_use.option.YES_WITHIN_LAST_THREE_MONTHS'),
    },
    {
      value: Option.yes_not_in_last_three_months,
      text: contentFor('question.alcohol_use.option.YES_NOT_IN_LAST_THREE_MONTHS'),
    },
    { value: CommonOption.no, text: commonContentFor('option.NO') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.alcohol_use.validation'),
    }),
  ],
})
