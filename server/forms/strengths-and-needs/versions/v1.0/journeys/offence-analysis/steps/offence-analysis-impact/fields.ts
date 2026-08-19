import { Answer, Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKCharacterCount, GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Question } from '../../constants/question'
import { commonContentFor } from '../../../../locales'
import { contentFor } from '../../locales'
import { CommonOption } from '../../../../constants/commonOption'
import { CaseData } from '../../../../constants/formVersion'
import { Option } from '../../constants/option'

// Leader of current index offence group

const offenceAnalysisLeaderDetails = GovUKCharacterCount({
  code: Question.offence_analysis_leader_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.offence_analysis_leader).match(Condition.Equals(CommonOption.yes)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(4000)),
      message: commonContentFor('validation.details_must_be_less_than', 4000),
    }),
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('validation.enter_details'),
    }),
  ],
})

const noOffenceAnalysisLeaderDetails = GovUKCharacterCount({
  code: Question.no_offence_analysis_leader_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.offence_analysis_leader).match(Condition.Equals(CommonOption.no)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(4000)),
      message: commonContentFor('validation.details_must_be_less_than', 4000),
    }),
  ],
})

export const offenceAnalysisLeader = GovUKRadioInput({
  code: Question.offence_analysis_leader,
  fieldset: {
    legend: {
      text: contentFor('question.offence_analysis_leader.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: CommonOption.yes,
      text: commonContentFor('option.YES'),
      block: offenceAnalysisLeaderDetails,
    },
    {
      value: CommonOption.no,
      text: commonContentFor('option.NO'),
      block: noOffenceAnalysisLeaderDetails,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.offence_analysis_leader.validation'),
    }),
  ],
})

// Recognition of impact group

const offenceAnalysisOnVictimsDetails = GovUKCharacterCount({
  code: Question.offence_analysis_impact_on_victims_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.offence_analysis_impact_on_victims).match(Condition.Equals(CommonOption.yes)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

const offenceAnalysisNoImpactOnVictimsDetails = GovUKCharacterCount({
  code: Question.no_offence_analysis_impact_on_victims_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.offence_analysis_impact_on_victims).match(Condition.Equals(CommonOption.no)),
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
  items: [
    {
      value: CommonOption.yes,
      text: commonContentFor('option.YES'),
      block: offenceAnalysisOnVictimsDetails,
    },
    {
      value: CommonOption.no,
      text: commonContentFor('option.NO'),
      block: offenceAnalysisNoImpactOnVictimsDetails,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.offence_analysis_impact_on_victims.validation'),
    }),
  ],
})

// Responsibility for offence group

const offenceAnalysisAcceptResponsibilityDetails = GovUKCharacterCount({
  code: Question.offence_analysis_accept_responsibility_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.offence_analysis_accept_responsibility).match(Condition.Equals(CommonOption.yes)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

const noOffenceAnalysisAcceptResponsibilityDetails = GovUKCharacterCount({
  code: Question.no_offence_analysis_accept_responsibility_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.offence_analysis_accept_responsibility).match(Condition.Equals(CommonOption.no)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

export const offenceAnalysisAcceptResponsibility = GovUKRadioInput({
  code: Question.offence_analysis_accept_responsibility,
  fieldset: {
    legend: {
      text: contentFor('question.offence_analysis_accept_responsibility.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: CommonOption.yes,
      text: commonContentFor('option.YES'),
      block: offenceAnalysisAcceptResponsibilityDetails,
    },
    {
      value: CommonOption.no,
      text: commonContentFor('option.NO'),
      block: noOffenceAnalysisAcceptResponsibilityDetails,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.offence_analysis_accept_responsibility.validation'),
    }),
  ],
})

// Escalation in seriousness group

const offenceAnalysisEscalationDetails = GovUKCharacterCount({
  code: Question.offence_analysis_escalation_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.offence_analysis_escalation).match(Condition.Equals(CommonOption.yes)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

const noOffenceAnalysisEscalationDetails = GovUKCharacterCount({
  code: Question.no_offence_analysis_escalation_details,
  label: commonContentFor('optional_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.offence_analysis_escalation).match(Condition.Equals(CommonOption.no)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
  ],
})

export const offenceAnalysisEscalation = GovUKRadioInput({
  code: Question.offence_analysis_escalation,
  fieldset: {
    legend: {
      text: contentFor('question.offence_analysis_escalation.text'),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: CommonOption.yes,
      text: commonContentFor('option.YES'),
      block: offenceAnalysisEscalationDetails,
    },
    {
      value: CommonOption.no,
      text: commonContentFor('option.NO'),
      block: noOffenceAnalysisEscalationDetails,
    },
    {
      value: CommonOption.not_applicable,
      text: commonContentFor('option.NOT_APPLICABLE'),
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.offence_analysis_escalation.validation'),
    }),
  ],
})

// Perpetrator of domestic abuse group

const offenceAnalysisPerpetratorOfDomesticAbuseTypeFamilyMemberDetails = GovUKCharacterCount({
  code: Question.offence_analysis_perpetrator_of_domestic_abuse_type_family_member_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.offence_analysis_perpetrator_of_domestic_abuse_type).match(
    Condition.Equals(Option.family_member),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('validation.enter_details'),
    }),
  ],
})

const offenceAnalysisPerpetratorOfDomesticAbuseTypeIntimatePartnerDetails = GovUKCharacterCount({
  code: Question.offence_analysis_perpetrator_of_domestic_abuse_type_intimate_partner_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.offence_analysis_perpetrator_of_domestic_abuse_type).match(
    Condition.Equals(Option.intimate_partner),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('validation.enter_details'),
    }),
  ],
})

const offenceAnalysisPerpetratorOfDomesticAbuseTypeFamilyMemberAndPartnerDetails = GovUKCharacterCount({
  code: Question.offence_analysis_perpetrator_of_domestic_abuse_type_family_member_and_partner_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.offence_analysis_perpetrator_of_domestic_abuse_type).match(
    Condition.Equals(Option.family_member_and_intimate_partner),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('validation.enter_details'),
    }),
  ],
})

export const offenceAnalysisPerpetratorOfDomesticAbuseType = GovUKRadioInput({
  code: Question.offence_analysis_perpetrator_of_domestic_abuse_type,
  fieldset: {
    legend: {
      text: contentFor('question.offence_analysis_perpetrator_of_domestic_abuse_type.text'),
    },
  },
  items: [
    {
      value: Option.family_member,
      text: contentFor('option.FAMILY_MEMBER'),
      block: offenceAnalysisPerpetratorOfDomesticAbuseTypeFamilyMemberDetails,
    },
    {
      value: Option.intimate_partner,
      text: contentFor('option.INTIMATE_PARTNER'),
      block: offenceAnalysisPerpetratorOfDomesticAbuseTypeIntimatePartnerDetails,
    },
    {
      value: Option.family_member_and_intimate_partner,
      text: contentFor('option.FAMILY_MEMBER_AND_INTIMATE_PARTNER'),
      block: offenceAnalysisPerpetratorOfDomesticAbuseTypeFamilyMemberAndPartnerDetails,
    },
  ],
  dependentWhen: Answer(Question.offence_analysis_perpetrator_of_domestic_abuse).match(
    Condition.Equals(CommonOption.yes),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('validation.select_an_option'),
    }),
  ],
})

export const offenceAnalysisPerpetratorOfDomesticAbuse = GovUKRadioInput({
  code: Question.offence_analysis_perpetrator_of_domestic_abuse,
  fieldset: {
    legend: {
      text: contentFor('question.offence_analysis_perpetrator_of_domestic_abuse.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: CommonOption.yes,
      text: commonContentFor('option.YES'),
      block: offenceAnalysisPerpetratorOfDomesticAbuseType,
    },
    {
      value: CommonOption.no,
      text: commonContentFor('option.NO'),
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.offence_analysis_perpetrator_of_domestic_abuse.validation'),
    }),
  ],
})

// Victim of domestic abuse group

const offenceAnalysisVictimOfDomesticAbuseTypeFamilyMemberDetails = GovUKCharacterCount({
  code: Question.offence_analysis_victim_of_domestic_abuse_type_family_member_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.offence_analysis_victim_of_domestic_abuse_type).match(
    Condition.Equals(Option.family_member),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('validation.enter_details'),
    }),
  ],
})

const offenceAnalysisVictimOfDomesticAbuseTypeIntimatePartnerDetails = GovUKCharacterCount({
  code: Question.offence_analysis_victim_of_domestic_abuse_type_intimate_partner_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.offence_analysis_victim_of_domestic_abuse_type).match(
    Condition.Equals(Option.intimate_partner),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('validation.enter_details'),
    }),
  ],
})

const offenceAnalysisVictimOfDomesticAbuseTypeFamilyMemberAndPartnerDetails = GovUKCharacterCount({
  code: Question.offence_analysis_victim_of_domestic_abuse_type_family_member_and_partner_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.offence_analysis_victim_of_domestic_abuse_type).match(
    Condition.Equals(Option.family_member_and_intimate_partner),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: commonContentFor('validation.details_must_be_less_than', 2000),
    }),
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('validation.enter_details'),
    }),
  ],
})

export const offenceAnalysisVictimOfDomesticAbuseType = GovUKRadioInput({
  code: Question.offence_analysis_victim_of_domestic_abuse_type,
  fieldset: {
    legend: {
      text: contentFor('question.offence_analysis_victim_of_domestic_abuse_type.text'),
    },
  },
  items: [
    {
      value: Option.family_member,
      text: contentFor('option.FAMILY_MEMBER'),
      block: offenceAnalysisVictimOfDomesticAbuseTypeFamilyMemberDetails,
    },
    {
      value: Option.intimate_partner,
      text: contentFor('option.INTIMATE_PARTNER'),
      block: offenceAnalysisVictimOfDomesticAbuseTypeIntimatePartnerDetails,
    },
    {
      value: Option.family_member_and_intimate_partner,
      text: contentFor('option.FAMILY_MEMBER_AND_INTIMATE_PARTNER'),
      block: offenceAnalysisVictimOfDomesticAbuseTypeFamilyMemberAndPartnerDetails,
    },
  ],
  dependentWhen: Answer(Question.offence_analysis_victim_of_domestic_abuse).match(Condition.Equals(CommonOption.yes)),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('validation.select_an_option'),
    }),
  ],
})

export const offenceAnalysisVictimOfDomesticAbuse = GovUKRadioInput({
  code: Question.offence_analysis_victim_of_domestic_abuse,
  fieldset: {
    legend: {
      text: contentFor('question.offence_analysis_victim_of_domestic_abuse.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: CommonOption.yes,
      text: commonContentFor('option.YES'),
      block: offenceAnalysisVictimOfDomesticAbuseType,
    },
    {
      value: CommonOption.no,
      text: commonContentFor('option.NO'),
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.offence_analysis_victim_of_domestic_abuse.validation'),
    }),
  ],
})

// Patterns of offending group

export const patternsOfOffending = GovUKCharacterCount({
  code: Question.offence_analysis_patterns_of_offending,
  label: {
    text: contentFor('question.offence_analysis_patterns_of_offending.text'),
    classes: 'govuk-fieldset__legend--m',
  },
  hint: contentFor('question.offence_analysis_patterns_of_offending.hint'),
  maxLength: 4000,
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(4000)),
      message: commonContentFor('validation.details_must_be_less_than', 4000),
    }),
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('validation.enter_details'),
    }),
  ],
})

// Previous offences group

const offenceAnalysisRiskDetails = GovUKCharacterCount({
  code: Question.offence_analysis_risk_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.offence_analysis_risk).match(Condition.Equals(CommonOption.yes)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(4000)),
      message: commonContentFor('validation.details_must_be_less_than', 4000),
    }),
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('validation.enter_details'),
    }),
  ],
})

const noOffenceAnalysisRiskDetails = GovUKCharacterCount({
  code: Question.no_offence_analysis_risk_details,
  label: commonContentFor('required_details'),
  maxLength: 2000,
  dependentWhen: Answer(Question.offence_analysis_risk).match(Condition.Equals(CommonOption.no)),
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(4000)),
      message: commonContentFor('validation.details_must_be_less_than', 4000),
    }),
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: commonContentFor('validation.enter_details'),
    }),
  ],
})

export const offenceAnalysisRisk = GovUKRadioInput({
  code: Question.offence_analysis_risk,
  fieldset: {
    legend: {
      text: contentFor('question.offence_analysis_risk.text'),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: CommonOption.yes,
      text: commonContentFor('option.YES'),
      block: offenceAnalysisRiskDetails,
    },
    {
      value: CommonOption.no,
      text: commonContentFor('option.NO'),
      block: noOffenceAnalysisRiskDetails,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.offence_analysis_risk.validation'),
    }),
  ],
})
