import { Condition, not, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'

import { CaseData } from '../../../../constants/formVersion'
import { contentFor } from '../../locales'
import { CommonOption } from '../../../../constants/commonOption'
import { commonContentFor } from '../../../../locales'
import { Question } from '../../constants/question'

export const drugUse = GovUKRadioInput({
  code: Question.drug_use,
  fieldset: {
    legend: {
      text: contentFor('question.drug_use.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.drug_use.hint'),
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES') },
    { value: CommonOption.no, text: commonContentFor('option.NO') },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.drug_use.validation'),
    }),
  ],
})
