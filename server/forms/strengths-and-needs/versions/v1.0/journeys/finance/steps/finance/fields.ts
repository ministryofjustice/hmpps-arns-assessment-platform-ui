import {
  validation,
  Self,
  Answer,
  Format,
  Condition,
  and,
  Request,
  or,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKCheckboxInput,
  GovUKRadioInput,
  GovUKTextareaInput,

} from '@ministryofjustice/hmpps-forge/govuk-components'
import locale from '../../locale.json'
import { StrengthsAndNeedsTransformers } from '../../../../../../transformers'
import { StrengthsAndNeedsConditions } from '../../../../../../conditions'
import { CaseData } from '../../../../constants/formVersion'

const DEFAULT_CHARACTER_COUNT = 2000

const contentWith =
  (content: Record<string, any>) =>
  (code: string, ...replacements: any[]) =>
    Request.Headers('accept-language').pipe(StrengthsAndNeedsTransformers.ContentFor(content, code, ...replacements))
const contentFor = contentWith(locale)

const toDetailsField = (parent: string) => (option: string) =>
  GovUKTextareaInput({
    code: `${parent}_${option.toLowerCase()}_details`,
    label: {
      text: contentFor('optional_details'),
    },
    dependentWhen: and(
      Answer(parent).match(Condition.IsRequired()),
      or(
        and(
          Answer(parent).match(StrengthsAndNeedsConditions.IsArray()),
          Answer(parent).match(Condition.Array.Contains(option)),
        ),
        and(
          Answer(parent).not.match(StrengthsAndNeedsConditions.IsArray()),
          Answer(parent).match(Condition.Equals(option)),
        ),
      ),
    ),
    validWhen: [
      validation({
        condition: Self().match(Condition.String.HasMaxLength(DEFAULT_CHARACTER_COUNT)),
        message: `Details must be ${DEFAULT_CHARACTER_COUNT} characters or less`,
      }),
    ],
  })

const [financeIncomeNoMoneyDetails, financeIncomeOtherDetails] = ['NO_MONEY', 'OTHER'].map(
  toDetailsField('finance_income'),
)

export const financeIncomeFamilyOrFriendsDetails = GovUKRadioInput({
  code: 'finance_income_family_or_friends_details',
  fieldset: {
    legend: {
      text: Format('Is %1 over reliant on family or friends for money?', CaseData.Forename),
    },
  },
  dependentWhen: and(
    Answer('finance_income').match(Condition.IsRequired()),
    Answer('finance_income').match(Condition.Array.Contains('FAMILY_OR_FRIENDS')),
  ),
  items: [
    {
      text: 'Yes',
      value: 'YES',
    },
    {
      text: 'No',
      value: 'NO',
    },
    {
      text: 'Unknown',
      value: 'UNKNOWN',
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select if they are over reliant on family or friends for money',
    }),
  ],
})

export const financeIncome = GovUKCheckboxInput({
  code: 'finance_income',
  fieldset: {
    legend: {
      text: Format('Where does %1 currently get their money from?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'Select all that apply',
  items: [
    { text: "Carer's allowance", value: 'CARERS_ALLOWANCE' },
    {
      text: 'Disability benefits',
      value: 'DISABILITY_BENEFITS',
      hint: {
        text: 'For example, Personal Independence Payment (PIP) (also known as Disability Living Allowance) or Severe Disablement Allowance.',
      },
    },
    { text: 'Employment', value: 'EMPLOYMENT' },
    { text: 'Family or friends', value: 'FAMILY_OR_FRIENDS', block: [financeIncomeFamilyOrFriendsDetails] },
    { text: 'Offending', value: 'OFFENDING' },
    { text: 'Pension', value: 'PENSION' },
    { text: 'Student loan', value: 'STUDENT_LOAN' },
    { text: 'Undeclared (includes cash in hand)', value: 'UNDECLARED' },
    {
      text: 'Work related benefits',
      value: 'WORK_RELATED_BENEFITS',
      hint: { text: "For example, Universal Credit or Jobseeker's Allowance (JSA)." },
    },
    { text: 'Other', value: 'OTHER', block: [financeIncomeOtherDetails] },
    { text: 'Unknown', value: 'UNKNOWN', behaviour: 'exclusive' },
    { divider: 'or' },
    { text: 'No money', value: 'NO_MONEY', behaviour: 'exclusive', block: [financeIncomeNoMoneyDetails] },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: "Select where they currently get their money from, or select 'No money'",
    }),
  ],
})

export const financeBankAccount = GovUKRadioInput({
  code: 'finance_bank_account',
  fieldset: {
    legend: {
      text: Format('Does %1 have their own bank account?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { text: 'Yes', value: 'YES' },
    { text: 'No', value: 'NO' },
    { text: 'Unknown', value: 'UNKNOWN' },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select if they have their own personal bank account',
    }),
  ],
})

const [
  financeMoneyManagementGoodDetails,
  financeMoneyManagementFairlyGoodDetails,
  financeMoneyManagementFairlyBadDetails,
  financeMoneyManagementBadDetails,
] = ['GOOD', 'FAIRLY_GOOD', 'FAIRLY_BAD', 'BAD']
  .map(toDetailsField('finance_money_management'))

export const financeMoneyManagement = GovUKRadioInput({
  code: 'finance_money_management',
  fieldset: {
    legend: {
      text: Format('How good is %1 at managing their money?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'This includes things like budgeting, prioritising bills and paying rent.',
  items: [
    {
      text: 'Able to manage their money well and is a strength',
      value: 'GOOD',
      block: [financeMoneyManagementGoodDetails],
    },
    {
      text: 'Able to manage their money for everyday necessities',
      value: 'FAIRLY_GOOD',
      block: [financeMoneyManagementFairlyGoodDetails],
    },
    {
      text: 'Unable to manage their money well',
      value: 'FAIRLY_BAD',
      block: [financeMoneyManagementFairlyBadDetails],
    },
    {
      text: 'Unable to manage their money which is creating other problems',
      value: 'BAD',
      block: [financeMoneyManagementBadDetails],
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select how good they are at managing their money',
    }),
  ],
})

const [
  financeGamblingTheirGamblingDetails,
  financeGamblingSomeoneElsesGamblingDetails,
  financeGamblingUnknownGamblingDetails,
] = ['YES_THEIR_GAMBLING', 'YES_SOMEONE_ELSES_GAMBLING', 'UNKNOWN'].map(toDetailsField('finance_gambling'))

export const financeGambling = GovUKCheckboxInput({
  code: 'finance_gambling',
  fieldset: {
    legend: {
      text: Format('Is %1 affected by gambling?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'Select all that apply',
  items: [
    {
      text: 'Yes, their own gambling',
      value: 'YES_THEIR_GAMBLING',
      block: [financeGamblingTheirGamblingDetails],
    },
    {
      text: "Yes, someone else's gambling",
      value: 'YES_SOMEONE_ELSES_GAMBLING',
      block: [financeGamblingSomeoneElsesGamblingDetails],
    },
    { divider: 'or' },
    {
      text: 'No',
      value: 'NO',
      behaviour: 'exclusive',
    },
    {
      text: 'Unknown',
      value: 'UNKNOWN',
      behaviour: 'exclusive',
      block: [financeGamblingUnknownGamblingDetails],
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select if they are affected by gambling',
    }),
  ],
})

export const [yesTypeOfDebt, yesSomeoneElsesTypeOfDebt] = ['YES_THEIR_DEBT', 'YES_SOMEONE_ELSES_DEBT'].map(option => {
  const fieldCode = `${option.toLowerCase()}_type`
  const [debtToOthersDetails, formalDebtDetails] = ['DEBT_TO_OTHERS', 'FORMAL_DEBT'].map(toDetailsField(fieldCode))

  return GovUKCheckboxInput({
    hint: 'Select all that apply.',
    code: fieldCode,
    validWhen: [
      validation({
        condition: Self().match(Condition.IsRequired()),
        message: 'Select type of debt',
      }),
    ],
    items: [
      { text: 'Debt to others', value: 'DEBT_TO_OTHERS', block: [debtToOthersDetails] },
      { text: 'Formal debt', value: 'FORMAL_DEBT', block: [formalDebtDetails] },
    ],
    dependentWhen: and(
      Answer('finance_debt').match(Condition.IsRequired()),
      Answer('finance_debt').match(Condition.Array.Contains(option)),
    ),
  })
})

const unknownTypeOfDebt = toDetailsField('finance_debt')('UNKNOWN')

export const financeDebt = GovUKCheckboxInput({
  code: 'finance_debt',
  fieldset: {
    legend: {
      text: Format('Is %1 affected by debt?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'Select all that apply',
  items: [
    {
      text: 'Yes, their own debt',
      value: 'YES_THEIR_DEBT',
      block: [yesTypeOfDebt],
    },
    {
      text: "Yes, someone else's debt",
      value: 'YES_SOMEONE_ELSES_DEBT',
      block: [yesSomeoneElsesTypeOfDebt],
    },
    { divider: 'or' },
    {
      text: 'No',
      value: 'NO',
      behaviour: 'exclusive',
    },
    {
      text: 'Unknown',
      value: 'UNKNOWN',
      behaviour: 'exclusive',
      block: [unknownTypeOfDebt],
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select if they are affected by debt',
    }),
  ],
})

const [
  hasMadePositiveChangesDetails,
  isActivelyMakingChangesDetails,
  wantsToMakeChangesKnowsHowDetails,
  wantsToMakeChangesNeedsHelpDetails,
  thinkingAboutMakingChangesDetails,
  doesNotWantToMakeChangesDetails,
  doesNotWantToAnswerChangesDetails,
] = [
  'HAS_MADE_CHANGES',
  'IS_MAKING_CHANGES',
  'WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO',
  'WANTS_TO_MAKE_CHANGES_NEEDS_HELP',
  'THINKING_ABOUT_MAKING_CHANGES',
  'DOES_NOT_WANT_TO_MAKE_CHANGES',
  'DOES_NOT_WANT_TO_ANSWER',
].map(toDetailsField('finance_changes'))

export const financeChanges = GovUKRadioInput({
  code: 'finance_changes',
  fieldset: {
    legend: {
      text: Format('Does %1 want to make changes to their finance?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'HAS_MADE_CHANGES', text: contentFor('options.HAS_MADE_CHANGES'), block: hasMadePositiveChangesDetails },
    {
      value: 'IS_MAKING_CHANGES',
      text: contentFor('options.IS_MAKING_CHANGES'),
      block: isActivelyMakingChangesDetails,
    },
    {
      value: 'WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO',
      text: contentFor('options.WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO'),
      block: wantsToMakeChangesKnowsHowDetails,
    },
    {
      value: 'WANTS_TO_MAKE_CHANGES_NEEDS_HELP',
      text: contentFor('options.WANTS_TO_MAKE_CHANGES_NEEDS_HELP'),
      block: wantsToMakeChangesNeedsHelpDetails,
    },
    {
      value: 'THINKING_ABOUT_MAKING_CHANGES',
      text: contentFor('options.THINKING_ABOUT_MAKING_CHANGES'),
      block: thinkingAboutMakingChangesDetails,
    },
    {
      value: 'DOES_NOT_WANT_TO_MAKE_CHANGES',
      text: contentFor('options.DOES_NOT_WANT_TO_MAKE_CHANGES'),
      block: doesNotWantToMakeChangesDetails,
    },
    {
      value: 'DOES_NOT_WANT_TO_ANSWER',
      text: contentFor('options.DOES_NOT_WANT_TO_ANSWER'),
      block: doesNotWantToAnswerChangesDetails,
    },
    { divider: 'or' },
    {
      value: 'NOT_PRESENT',
      text: contentFor('options.NOT_PRESENT', CaseData.Forename),
    },
    { value: 'NOT_APPLICABLE', text: contentFor('options.NOT_APPLICABLE') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select if they want to make changes to their finance',
    }),
  ],
})
