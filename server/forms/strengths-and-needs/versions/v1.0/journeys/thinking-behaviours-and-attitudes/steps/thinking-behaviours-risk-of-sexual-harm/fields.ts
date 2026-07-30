import { validation, Self, Condition, when, Data } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants/formVersion'
import { contentFor } from '../../locales'
import { Question } from '../../constants/question'
import { CommonOption } from '../../../../constants/commonOption'
import { commonContentFor } from '../../../../locales'

export const thinkingBehavioursRiskSexualHarm = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_risk_sexual_harm,
  hint: {
    html: when(Data('caseData.sexuallyMotivatedOffenceHistory').match(Condition.Equals(CommonOption.no)))
      .then(contentFor('question.thinking_behaviours_attitudes_risk_sexual_harm.hint', CaseData.Forename))
      .else(''),
  },
  fieldset: {
    legend: {
      text: contentFor('question.thinking_behaviours_attitudes_risk_sexual_harm.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--l',
    },
  },
  items: [
    {
      text: commonContentFor('option.YES'),
      hint: contentFor('question.thinking_behaviours_attitudes_risk_sexual_harm.option.YES.hint'),
      value: CommonOption.yes,
    },
    {
      text: commonContentFor('option.NO'),
      value: CommonOption.no,
      disabled: Data('caseData.sexuallyMotivatedOffenceHistory').match(Condition.Equals(CommonOption.yes)),
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_risk_sexual_harm.validation'),
    }),
  ],
})
