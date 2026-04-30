import {
  validation,
  Self,
  Format,
  Answer,
  or,
  and,
  not,
  when,
  Condition,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKRadioInput,
  GovUKCheckboxInput,
  GovUKCharacterCount,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants'
import { drugsList, fieldCode } from '../../constants'

const lastSixMonthConditions = drugsList.map(drug =>
  Answer(fieldCode('drug_last_used', drug.value)).match(Condition.Equals('LAST_SIX')),
)

const anyDrugUsedInLastSixMonths = or(
  lastSixMonthConditions[0],
  lastSixMonthConditions[1],
  ...lastSixMonthConditions.slice(2),
)

// --- Reasons for use ---

export const drugsReasonsForUse = GovUKCheckboxInput({
  code: 'drugs_reasons_for_use',
  multiple: true,
  fieldset: {
    legend: {
      text: when(anyDrugUsedInLastSixMonths)
        .then(Format('Why does %1 use drugs?', CaseData.Forename))
        .else(Format('Why did %1 use drugs?', CaseData.Forename)),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'Consider why they started using, their history, and any triggers. Select all that apply.',
  items: [
    { value: 'CULTURAL_OR_RELIGIOUS', text: 'Cultural or religious practice' },
    { value: 'CURIOSITY_OR_EXPERIMENTATION', text: 'Curiosity or experimentation' },
    { value: 'ENHANCE_PERFORMANCE', text: 'Enhance performance' },
    { value: 'ESCAPISM_OR_AVOIDANCE', text: 'Escapism or avoidance' },
    { value: 'MANAGING_EMOTIONAL_ISSUES', text: 'Manage stress or emotional issues' },
    { value: 'PEER_PRESSURE', text: 'Peer pressure or social influence' },
    { value: 'RECREATION_OR_PLEASURE', text: 'Recreation or pleasure' },
    { value: 'SELF_MEDICATION', text: 'Self-medication' },
    { value: 'OTHER', text: 'Other' },
  ],
  validWhen: [
    validation({
      condition: not(and(anyDrugUsedInLastSixMonths, Self().not.match(Condition.IsRequired()))),
      message: 'Select why they use drugs',
    }),
    validation({
      condition: not(and(not(anyDrugUsedInLastSixMonths), Self().not.match(Condition.IsRequired()))),
      message: 'Select why they used drugs',
    }),
  ],
})

export const drugsReasonsForUseDetails = GovUKCharacterCount({
  code: 'drugs_reasons_for_use_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

// --- How drug use has affected their life ---

export const drugsAffectedTheirLife = GovUKCheckboxInput({
  code: 'drugs_affected_their_life',
  multiple: true,
  fieldset: {
    legend: {
      text: Format("How has %1's drug use affected their life?", CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'Select all that apply.',
  items: [
    {
      value: 'BEHAVIOUR',
      text: 'Behaviour',
      hint: { text: 'Includes unemployment, disruption on education or lack of productivity.' },
    },
    {
      value: 'COMMUNITY',
      text: 'Community',
      hint: { text: 'Includes limited opportunities or judgement from others.' },
    },
    {
      value: 'FINANCES',
      text: 'Finances',
      hint: { text: 'Includes having no money.' },
    },
    { value: 'LINKS_TO_OFFENDING', text: 'Links to offending' },
    {
      value: 'HEALTH',
      text: 'Physical or mental health',
      hint: { text: 'Includes overdose.' },
    },
    {
      value: 'RELATIONSHIPS',
      text: 'Relationships',
      hint: { text: 'Includes isolation or neglecting responsibilities.' },
    },
    { value: 'OTHER', text: 'Other' },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select how their drug use has affected their life',
    }),
  ],
})

export const drugsAffectedTheirLifeDetails = GovUKCharacterCount({
  code: 'drugs_affected_their_life_details',
  label: 'Give details (optional)',
  maxLength: 2000,
})

// --- Help and future ---

export const drugsAnythingHelpedStopOrReduceUse = GovUKCharacterCount({
  code: 'drugs_anything_helped_stop_or_reduce_use',
  label: {
    text: Format('Has anything helped %1 stop or reduce their drug use? (optional)', CaseData.Forename),
    classes: 'govuk-label--m',
  },
  hint: 'Note any treatment or lifestyle changes that have helped them.',
  maxLength: 2000,
})

export const drugsWhatCouldHelpNotUseDrugsInFuture = GovUKCharacterCount({
  code: 'drugs_what_could_help_not_use_drugs_in_future',
  label: {
    text: Format('What could help %1 not use drugs in the future? (optional)', CaseData.Forename),
    classes: 'govuk-label--m',
  },
  maxLength: 2000,
})

// --- Want to make changes ---

export const drugUseChanges = GovUKRadioInput({
  code: 'drug_use_changes',
  fieldset: {
    legend: {
      text: Format('Does %1 want to make changes to their drug use?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'MADE_CHANGES', text: 'I have already made positive changes and want to maintain them' },
    { value: 'MAKING_CHANGES', text: 'I am actively making changes' },
    { value: 'WANT_TO_MAKE_CHANGES', text: 'I want to make changes and know how to' },
    { value: 'NEEDS_HELP_TO_MAKE_CHANGES', text: 'I want to make changes but need help' },
    { value: 'THINKING_ABOUT_MAKING_CHANGES', text: 'I am thinking about making changes' },
    { value: 'DOES_NOT_WANT_TO_MAKE_CHANGES', text: 'I do not want to make changes' },
    { value: 'DOES_NOT_WANT_TO_ANSWER', text: 'I do not want to answer' },
    { divider: 'or' },
    { value: 'NOT_APPLICABLE', text: 'Not applicable' },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select if they want to make changes to their drug use',
    }),
  ],
})
