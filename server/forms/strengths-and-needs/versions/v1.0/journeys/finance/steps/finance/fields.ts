import { validation, Self, Answer, Condition, and, or } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKCheckboxInput,
  GovUKRadioInput,
  GovUKTextareaInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsConditions } from '../../../../../../conditions'
import { CaseData } from '../../../../constants/formVersion'
import { contentFor } from '../../locales'
import { Question } from '../../constants/question'
import { commonContentFor } from '../../../../locales'
import { Option } from '../../constants/option'
import { CommonOption } from '../../../../constants/commonOption'

const DEFAULT_CHARACTER_COUNT = 2000

const toDetailsField =
  (parent: string) =>
  ({ code, option, mandatory = false }: { code: string; option: string; mandatory?: boolean }) =>
    GovUKTextareaInput({
      code,
      label: {
        text: mandatory ? commonContentFor('required_details') : commonContentFor('optional_details'),
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
          message: commonContentFor('validation.details_character_limit', DEFAULT_CHARACTER_COUNT),
        }),
      ],
    })

const [financeIncomeNoMoneyDetails, financeIncomeOtherDetails] = [
  { option: Option.no_money, code: Question.finance_income_no_money_details },
  { option: CommonOption.other, code: Question.finance_income_other_details },
].map(toDetailsField(Question.finance_income))

export const financeIncomeFamilyOrFriendsDetails = GovUKRadioInput({
  code: Question.finance_income_family_or_friends_details,
  fieldset: {
    legend: {
      text: contentFor('question.finance_income_family_or_friends_details.text', CaseData.Forename),
    },
  },
  dependentWhen: and(
    Answer(Question.finance_income).match(Condition.IsRequired()),
    Answer(Question.finance_income).match(Condition.Array.Contains(Option.family_or_friends)),
  ),
  items: [
    {
      text: commonContentFor('option.YES'),
      value: CommonOption.yes,
    },
    {
      text: commonContentFor('option.NO'),
      value: CommonOption.no,
    },
    {
      text: commonContentFor('option.UNKNOWN'),
      value: CommonOption.unknown,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.finance_income_family_or_friends_details.validation'),
    }),
  ],
})

export const financeIncome = GovUKCheckboxInput({
  code: Question.finance_income,
  fieldset: {
    legend: {
      text: contentFor('question.finance_income.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: commonContentFor('select_all_that_apply'),
  items: [
    { text: contentFor('question.finance_income.option.CARERS_ALLOWANCE'), value: Option.carers_allowance },
    {
      text: contentFor('question.finance_income.option.DISABILITY_BENEFITS.text'),
      value: Option.disability_benefits,
      hint: {
        text: contentFor('question.finance_income.option.DISABILITY_BENEFITS.hint'),
      },
    },
    { text: contentFor('question.finance_income.option.EMPLOYMENT'), value: Option.employment },
    {
      text: contentFor('question.finance_income.option.FAMILY_OR_FRIENDS'),
      value: Option.family_or_friends,
      block: [financeIncomeFamilyOrFriendsDetails],
    },
    { text: contentFor('question.finance_income.option.OFFENDING'), value: Option.offending },
    { text: contentFor('question.finance_income.option.PENSION'), value: Option.pension },
    { text: contentFor('question.finance_income.option.STUDENT_LOAN'), value: Option.student_loan },
    { text: contentFor('question.finance_income.option.UNDECLARED'), value: Option.undeclared },
    {
      text: contentFor('question.finance_income.option.WORK_RELATED_BENEFITS.text'),
      value: Option.work_related_benefits,
      hint: { text: contentFor('question.finance_income.option.WORK_RELATED_BENEFITS.hint') },
    },
    { text: commonContentFor('option.OTHER'), value: CommonOption.other, block: [financeIncomeOtherDetails] },
    { text: commonContentFor('option.UNKNOWN'), value: CommonOption.unknown, behaviour: 'exclusive' },
    { divider: commonContentFor('or') },
    {
      text: contentFor('question.finance_income.option.NO_MONEY'),
      value: Option.no_money,
      behaviour: 'exclusive',
      block: [financeIncomeNoMoneyDetails],
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.finance_income.validation'),
    }),
  ],
})

export const financeBankAccount = GovUKRadioInput({
  code: Question.finance_bank_account,
  fieldset: {
    legend: {
      text: contentFor('question.finance_bank_account.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { text: commonContentFor('option.YES'), value: CommonOption.yes },
    { text: commonContentFor('option.NO'), value: CommonOption.no },
    { text: commonContentFor('option.UNKNOWN'), value: CommonOption.unknown },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.finance_bank_account.validation'),
    }),
  ],
})

const [
  financeMoneyManagementGoodDetails,
  financeMoneyManagementFairlyGoodDetails,
  financeMoneyManagementFairlyBadDetails,
  financeMoneyManagementBadDetails,
] = [
  { option: Option.good, code: Question.finance_money_management_good_details },
  { option: Option.fairly_good, code: Question.finance_money_management_fairly_good_details },
  { option: Option.fairly_bad, code: Question.finance_money_management_fairly_bad_details },
  { option: Option.bad, code: Question.finance_money_management_bad_details },
]
  .map(toDetailsField(Question.finance_money_management))

export const financeMoneyManagement = GovUKRadioInput({
  code: Question.finance_money_management,
  fieldset: {
    legend: {
      text: contentFor('question.finance_money_management.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.finance_money_management.hint'),
  items: [
    {
      text: contentFor('question.finance_money_management.option.GOOD'),
      value: Option.good,
      block: [financeMoneyManagementGoodDetails],
    },
    {
      text: contentFor('question.finance_money_management.option.FAIRLY_GOOD'),
      value: Option.fairly_good,
      block: [financeMoneyManagementFairlyGoodDetails],
    },
    {
      text: contentFor('question.finance_money_management.option.FAIRLY_BAD'),
      value: Option.fairly_bad,
      block: [financeMoneyManagementFairlyBadDetails],
    },
    {
      text: contentFor('question.finance_money_management.option.BAD'),
      value: Option.bad,
      block: [financeMoneyManagementBadDetails],
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.finance_money_management.validation'),
    }),
  ],
})

const [
  financeGamblingTheirGamblingDetails,
  financeGamblingSomeoneElsesGamblingDetails,
  financeGamblingUnknownGamblingDetails,
] = [
  { option: Option.yes_their_gambling, code: Question.finance_gambling_yes_their_gambling_details },
  { option: Option.yes_someone_elses_gambling, code: Question.finance_gambling_yes_someone_elses_gambling_details },
  { option: CommonOption.unknown, code: Question.finance_gambling_unknown_details },
].map(toDetailsField(Question.finance_gambling))

export const financeGambling = GovUKCheckboxInput({
  code: Question.finance_gambling,
  fieldset: {
    legend: {
      text: contentFor('question.finance_gambling.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: commonContentFor('select_all_that_apply'),
  items: [
    {
      text: contentFor('question.finance_gambling.option.YES_THEIR_GAMBLING'),
      value: Option.yes_their_gambling,
      block: [financeGamblingTheirGamblingDetails],
    },
    {
      text: contentFor('question.finance_gambling.option.YES_SOMEONE_ELSES_GAMBLING'),
      value: Option.yes_someone_elses_gambling,
      block: [financeGamblingSomeoneElsesGamblingDetails],
    },
    { divider: commonContentFor('or') },
    {
      text: commonContentFor('option.NO'),
      value: CommonOption.no,
      behaviour: 'exclusive',
    },
    {
      text: commonContentFor('option.UNKNOWN'),
      value: CommonOption.unknown,
      behaviour: 'exclusive',
      block: [financeGamblingUnknownGamblingDetails],
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.finance_gambling.validation'),
    }),
  ],
})

export const [yesTypeOfDebt, yesSomeoneElsesTypeOfDebt] = [
  {
    option: Option.yes_their_debt,
    code: Question.finance_debt_yes_their_debt,
    subOptions: [
      { option: Option.debt_to_others, code: Question.yes_their_debt_debt_to_others_details },
      { option: Option.formal_debt, code: Question.yes_their_debt_formal_debt_details },
    ],
  },
  {
    option: Option.yes_someone_elses_debt,
    code: Question.finance_debt_yes_someone_elses_debt,
    subOptions: [
      { option: Option.debt_to_others, code: Question.yes_someone_elses_debt_debt_to_others_details },
      { option: Option.formal_debt, code: Question.yes_someone_elses_debt_formal_debt_details },
    ],
  },
].map(({ code, option, subOptions }) => {
  const [debtToOthersDetails, formalDebtDetails] = subOptions.map(toDetailsField(code))

  return GovUKCheckboxInput({
    hint: commonContentFor('select_all_that_apply'),
    code,
    validWhen: [
      validation({
        condition: Self().match(Condition.IsRequired()),
        message: contentFor('common.validation.select_type_of_debt'),
      }),
    ],
    items: [
      { text: contentFor('common.option.DEBT_TO_OTHERS'), value: Option.debt_to_others, block: [debtToOthersDetails] },
      { text: contentFor('common.option.FORMAL_DEBT'), value: Option.formal_debt, block: [formalDebtDetails] },
    ],
    dependentWhen: and(
      Answer(Question.finance_debt).match(Condition.IsRequired()),
      Answer(Question.finance_debt).match(Condition.Array.Contains(option)),
    ),
  })
})

const unknownTypeOfDebt = toDetailsField(Question.finance_debt)({
  option: CommonOption.unknown,
  code: Question.finance_debt_unknown_details,
})

export const financeDebt = GovUKCheckboxInput({
  code: Question.finance_debt,
  fieldset: {
    legend: {
      text: contentFor('question.finance_debt.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: commonContentFor('select_all_that_apply'),
  items: [
    {
      text: contentFor('question.finance_debt.option.YES_THEIR_DEBT'),
      value: Option.yes_their_debt,
      block: [yesTypeOfDebt],
    },
    {
      text: contentFor('question.finance_debt.option.YES_SOMEONE_ELSES_DEBT'),
      value: Option.yes_someone_elses_debt,
      block: [yesSomeoneElsesTypeOfDebt],
    },
    { divider: commonContentFor('or') },
    {
      text: commonContentFor('option.NO'),
      value: CommonOption.no,
      behaviour: 'exclusive',
    },
    {
      text: commonContentFor('option.UNKNOWN'),
      value: CommonOption.unknown,
      behaviour: 'exclusive',
      block: [unknownTypeOfDebt],
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.finance_debt.validation'),
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
  { option: CommonOption.has_made_changes, code: Question.finance_changes_has_made_changes_details },
  { option: CommonOption.is_making_changes, code: Question.finance_changes_is_making_changes_details },
  {
    option: CommonOption.wants_to_make_changes_knows_how_to,
    code: Question.finance_changes_wants_to_make_changes_knows_how_to_details,
  },
  {
    option: CommonOption.wants_to_make_changes_needs_help,
    code: Question.finance_changes_wants_to_make_changes_needs_help_details,
  },
  {
    option: CommonOption.thinking_about_making_changes,
    code: Question.finance_changes_thinking_about_making_changes_details,
  },
  {
    option: CommonOption.does_not_want_to_make_changes,
    code: Question.finance_changes_does_not_want_to_make_changes_details,
  },
  { option: CommonOption.does_not_want_to_answer, code: Question.finance_changes_does_not_want_to_answer_details },
].map(toDetailsField(Question.finance_changes))

export const financeChanges = GovUKRadioInput({
  code: Question.finance_changes,
  fieldset: {
    legend: {
      text: contentFor('question.finance_changes.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: CommonOption.has_made_changes,
      text: commonContentFor('option.HAS_MADE_CHANGES'),
      block: hasMadePositiveChangesDetails,
    },
    {
      value: CommonOption.is_making_changes,
      text: commonContentFor('option.IS_MAKING_CHANGES'),
      block: isActivelyMakingChangesDetails,
    },
    {
      value: CommonOption.wants_to_make_changes_knows_how_to,
      text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO'),
      block: wantsToMakeChangesKnowsHowDetails,
    },
    {
      value: CommonOption.wants_to_make_changes_needs_help,
      text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_NEEDS_HELP'),
      block: wantsToMakeChangesNeedsHelpDetails,
    },
    {
      value: CommonOption.thinking_about_making_changes,
      text: commonContentFor('option.THINKING_ABOUT_MAKING_CHANGES'),
      block: thinkingAboutMakingChangesDetails,
    },
    {
      value: CommonOption.does_not_want_to_make_changes,
      text: commonContentFor('option.DOES_NOT_WANT_TO_MAKE_CHANGES'),
      block: doesNotWantToMakeChangesDetails,
    },
    {
      value: CommonOption.does_not_want_to_answer,
      text: commonContentFor('option.DOES_NOT_WANT_TO_ANSWER'),
      block: doesNotWantToAnswerChangesDetails,
    },
    { divider: commonContentFor('or') },
    {
      value: CommonOption.not_present,
      text: commonContentFor('option.NOT_PRESENT', CaseData.Forename),
    },
    { value: CommonOption.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.finance_changes.validation'),
    }),
  ],
})
