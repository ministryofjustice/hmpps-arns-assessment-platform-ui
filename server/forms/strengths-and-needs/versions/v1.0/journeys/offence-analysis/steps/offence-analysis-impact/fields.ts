import {Answer, Condition, Self, validation} from '@ministryofjustice/hmpps-forge/core/authoring'
import {GovUKCharacterCount, GovUKRadioInput,} from '@ministryofjustice/hmpps-forge/govuk-components'
import {Question} from '../../constants/question'
import {Option} from '../../constants/option'
import {commonContentFor} from '../../../../locales'
import {contentFor} from '../../locales'
import {CommonOption} from '../../../../constants/commonOption'
import {CaseData} from "../../../../constants/formVersion";

const offenceAnalysisOnVictimsDetails = GovUKCharacterCount({
  code: Question.offence_analysis_impact_on_victims_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.offence_analysis_impact_on_victims).match(
    Condition.Equals(CommonOption.yes),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

const offenceAnalysisNoImpactOnVictimsDetails = GovUKCharacterCount({
  code: Question.offence_analysis_no_impact_on_victims_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.offence_analysis_impact_on_victims).match(
    Condition.Equals(CommonOption.no),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

export const offenceImpactOnVictims = GovUKRadioInput({
  code: Question.offence_analysis_impact_on_victims,
  fieldset: {
    legend: {
      text: contentFor('question.offence_analysis_impact_on_victims.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: commonContentFor('select_all_that_apply'),
  items: [
    {
      value: CommonOption.yes,
      text: commonContentFor('option.YES'),
      block: offenceAnalysisOnVictimsDetails
    },
    {
      value: CommonOption.no,
      text: commonContentFor('option.NO'),
      block: offenceAnalysisNoImpactOnVictimsDetails
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.offence_analysis_impact_on_victims.validation'),
    }),
  ],
})
