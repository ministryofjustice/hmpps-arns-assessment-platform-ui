import { validation, Self, Condition, when, Data } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants/formVersion'
import { contentFor } from '../../locales'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'

export const thinkingBehavioursRiskSexualHarm = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_risk_sexual_harm,
  hint: {
    html: when(Data('caseData.sexuallyMotivatedOffenceHistory').match(Condition.Equals('NO')))
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
      text: contentFor('question.thinking_behaviours_attitudes_risk_sexual_harm.option.YES_RISK_SEXUAL_HARM.text'),
      hint: contentFor('question.thinking_behaviours_attitudes_risk_sexual_harm.option.YES_RISK_SEXUAL_HARM.hint'),
      value: Option.yes_risk_sexual_harm,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_risk_sexual_harm.option.NO_RISK_SEXUAL_HARM'),
      value: Option.no_risk_sexual_harm,
      disabled: Data('caseData.sexuallyMotivatedOffenceHistory').match(Condition.Equals('YES')),
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_risk_sexual_harm.validation'),
    }),
  ],
})
