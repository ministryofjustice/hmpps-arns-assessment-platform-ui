import {and, Answer, Condition, not, Self, validation} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKCharacterCount,
  GovUKRadioInput,
  GovUKSummaryList,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import {
  financeBankAccount, financeChanges, financeDebt, financeGambling, financeIncome,
  financeMoneyManagement,
  yesTypeOfDebt
} from '../finance/fields'
import {CaseData} from '../../../../constants/formVersion'
import {getDisplayTextForSpecificItem} from '../../../../../../i18n'
import {Question} from '../../constants/question'
import {Option} from '../../constants/option'
import {commonContentFor} from '../../../../locales'
import {Step} from '../../constants/step'
import {goToPractitionerAnalysisButton, markAsCompleteButton} from '../../../../constants/buttons'
import {CommonOption} from '../../../../constants/commonOption'
import {contentFor} from "../../locales";

const PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT = 1425

const createSummaryRowFor = (parent: string, items: any) => (option: string) =>
  getDisplayTextForSpecificItem(parent, items, option)

const createSummaryDetailsRow = (field: string) =>
  GovUKBody({
    text: Answer(field),
    size: 's',
  })

const createSummaryRowForFinanceIncome = createSummaryRowFor(Question.finance_income, financeIncome.items)
const createSummaryRowForFinanceMoneyManagement = createSummaryRowFor(
  Question.finance_money_management,
  financeMoneyManagement.items,
)
const createSummaryRowForFinanceGambling = createSummaryRowFor(Question.finance_gambling, financeGambling.items)
const createSummaryRowForFinanceDebt = createSummaryRowFor(Question.finance_debt, financeDebt.items)
const createSummaryRowForFinanceChanges = createSummaryRowFor(Question.finance_changes, financeChanges.items)

export const financeSummary = GovUKSummaryList({
  rows: [
    {
      key: { text: contentFor('question.finance_income.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForFinanceIncome(Option.carers_allowance),
          createSummaryRowForFinanceIncome(Option.disability_benefits),
          createSummaryRowForFinanceIncome(Option.employment),
          createSummaryRowForFinanceIncome(Option.family_or_friends),
          [
            { option: CommonOption.yes, text: contentFor('question.finance_income.summary.option.YES') },
            { option: CommonOption.no, text: contentFor('question.finance_income.summary.option.NO') },
            { option: CommonOption.unknown, text: contentFor('question.finance_income.summary.option.UNKNOWN') },
          ].map(({ option, text }) =>
            GovUKBody({
              text,
              visibleWhen: and(
                Answer(Question.finance_income_family_or_friends_details).match(Condition.IsRequired()),
                Answer(Question.finance_income_family_or_friends_details).match(Condition.Equals(option)),
              ),
              size: 's',
            }),
          ),
          createSummaryRowForFinanceIncome(Option.pension),
          createSummaryRowForFinanceIncome(Option.student_loan),
          createSummaryRowForFinanceIncome(Option.undeclared),
          createSummaryRowForFinanceIncome(Option.work_related_benefits),
          createSummaryRowForFinanceIncome(CommonOption.other),
          createSummaryDetailsRow(Question.finance_income_other_details),
          createSummaryRowForFinanceIncome(CommonOption.unknown),
          createSummaryRowForFinanceIncome(Option.no_money),
          createSummaryDetailsRow(Question.finance_income_no_money_details),
        ].flat(),
      },
      actions: {
        items: [{ href: Step.finance.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.finance_bank_account.text', CaseData.Forename) },
      value: {
        blocks: [CommonOption.yes, CommonOption.no, CommonOption.unknown]
          .map(option => getDisplayTextForSpecificItem(Question.finance_bank_account, financeBankAccount.items, option))
          .flat(),
      },
      actions: {
        items: [{ href: Step.finance.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.finance_money_management.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForFinanceMoneyManagement(Option.good),
          createSummaryDetailsRow(Question.finance_money_management_good_details),
          createSummaryRowForFinanceMoneyManagement(Option.fairly_good),
          createSummaryDetailsRow(Question.finance_money_management_fairly_good_details),
          createSummaryRowForFinanceMoneyManagement(Option.fairly_bad),
          createSummaryDetailsRow(Question.finance_money_management_fairly_bad_details),
          createSummaryRowForFinanceMoneyManagement(Option.bad),
          createSummaryDetailsRow(Question.finance_money_management_bad_details),
        ].flat(),
      },
      actions: {
        items: [{ href: Step.finance.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.finance_gambling.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForFinanceGambling(Option.yes_their_gambling),
          createSummaryDetailsRow(Question.finance_gambling_yes_their_gambling_details),
          createSummaryRowForFinanceGambling(Option.yes_someone_elses_gambling),
          createSummaryDetailsRow(Question.finance_gambling_yes_someone_elses_gambling_details),
          createSummaryRowForFinanceGambling(CommonOption.no),
          createSummaryRowForFinanceGambling(CommonOption.unknown),
          createSummaryDetailsRow(Question.finance_gambling_unknown_details),
        ].flat(),
      },
      actions: {
        items: [{ href: Step.finance.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.finance_debt.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForFinanceDebt(Option.yes_their_debt),
          getDisplayTextForSpecificItem(
            Question.finance_debt_yes_their_debt,
            yesTypeOfDebt.items as unknown as any,
            Option.debt_to_others,
          ),
          createSummaryDetailsRow(Question.yes_their_debt_debt_to_others_details),
          getDisplayTextForSpecificItem(
            Question.finance_debt_yes_their_debt,
            yesTypeOfDebt.items as unknown as any,
            Option.formal_debt,
          ),
          createSummaryDetailsRow(Question.yes_their_debt_formal_debt_details),
          createSummaryRowForFinanceDebt(Option.yes_someone_elses_debt),
          getDisplayTextForSpecificItem(
            Question.finance_debt_yes_someone_elses_debt,
            yesTypeOfDebt.items as unknown as any,
            Option.debt_to_others,
          ),
          createSummaryDetailsRow(Question.yes_someone_elses_debt_debt_to_others_details),
          getDisplayTextForSpecificItem(
            Question.finance_debt_yes_someone_elses_debt,
            yesTypeOfDebt.items as unknown as any,
            Option.formal_debt,
          ),
          createSummaryDetailsRow(Question.yes_someone_elses_debt_formal_debt_details),
          createSummaryRowForFinanceDebt(CommonOption.no),
          createSummaryRowForFinanceDebt(CommonOption.unknown),
          createSummaryDetailsRow(Question.finance_debt_unknown_details),
        ].flat(),
      },
      actions: {
        items: [{ href: Step.finance.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.finance_changes.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForFinanceChanges(CommonOption.has_made_changes),
          createSummaryDetailsRow(Question.finance_changes_has_made_changes_details),
          createSummaryRowForFinanceChanges(CommonOption.is_making_changes),
          createSummaryDetailsRow(Question.finance_changes_is_making_changes_details),
          createSummaryRowForFinanceChanges(CommonOption.wants_to_make_changes_knows_how_to),
          createSummaryDetailsRow(Question.finance_changes_wants_to_make_changes_knows_how_to_details),
          createSummaryRowForFinanceChanges(CommonOption.wants_to_make_changes_needs_help),
          createSummaryDetailsRow(Question.finance_changes_wants_to_make_changes_needs_help_details),
          createSummaryRowForFinanceChanges(CommonOption.thinking_about_making_changes),
          createSummaryDetailsRow(Question.finance_changes_thinking_about_making_changes_details),
          createSummaryRowForFinanceChanges(CommonOption.does_not_want_to_make_changes),
          createSummaryDetailsRow(Question.finance_changes_does_not_want_to_answer_details),
          createSummaryRowForFinanceChanges(CommonOption.does_not_want_to_answer),
          createSummaryDetailsRow(Question.finance_changes_does_not_want_to_answer_details),
          createSummaryRowForFinanceChanges(CommonOption.not_present),
          createSummaryRowForFinanceChanges(CommonOption.not_applicable),
        ].flat(),
      },
      actions: {
        items: [{ href: Step.finance.path, text: commonContentFor('change') }],
      },
    },
  ],
})

const strengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: Question.finance_strengths_protective_factors_details,
  label: commonContentFor('required_details'),
  maxLength: PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT,
  dependentWhen: and(
    Answer(Question.finance_strengths_protective_factors).match(Condition.IsRequired()),
    Answer(Question.finance_strengths_protective_factors_details).match(Condition.Equals(CommonOption.yes)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.finance_strengths_protective_factors_details.validation'),
    }),
  ],
})

const noStrengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: Question.finance_no_strengths_protective_factors_details,
  label: commonContentFor('optional_details'),
  maxLength: PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT,
  dependentWhen: Answer(Question.finance_strengths_protective_factors).match(Condition.Equals(CommonOption.no)),
})

export const strengthsOrProtectiveFactors = GovUKRadioInput({
  code: Question.finance_strengths_protective_factors,
  fieldset: {
    legend: {
      text: contentFor('question.finance_strengths_protective_factors.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.finance_strengths_protective_factors.hint'),
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: strengthsProtectiveFactorsDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: noStrengthsProtectiveFactorsDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.finance_strengths_protective_factors.validation'),
    }),
  ],
})

const seriousHarmDetails = GovUKCharacterCount({
  code: Question.finance_serious_harm_details,
  label: commonContentFor('required_details'),
  maxLength: PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT,
  dependentWhen: and(
    Answer(Question.finance_linked_to_serious_harm).match(Condition.IsRequired()),
    Answer(Question.finance_linked_to_serious_harm).match(Condition.Equals(CommonOption.yes)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.finance_serious_harm_details.validation'),
    }),
  ],
})

const noSeriousHarmDetails = GovUKCharacterCount({
  code: Question.finance_no_serious_harm_details,
  label: commonContentFor('optional_details'),
  maxLength: PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT,
  dependentWhen: Answer(Question.finance_linked_to_serious_harm).match(Condition.Equals(CommonOption.no)),
})

export const linkedToSeriousHarm = GovUKRadioInput({
  code: Question.finance_linked_to_serious_harm,
  fieldset: {
    legend: {
      text: contentFor('question.finance_linked_to_serious_harm.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: seriousHarmDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: noSeriousHarmDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.finance_linked_to_serious_harm.validation'),
    }),
  ],
})

const riskOfReoffendingDetails = GovUKCharacterCount({
  code: Question.finance_risk_of_reoffending_details,
  label: commonContentFor('required_details'),
  maxLength: PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT,
  dependentWhen: and(
    Answer(Question.finance_linked_to_reoffending).match(Condition.IsRequired()),
    Answer(Question.finance_linked_to_reoffending).match(Condition.Equals(CommonOption.yes)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.finance_risk_of_reoffending_details.validation'),
    }),
  ],
})

const noRiskOfReoffendingDetails = GovUKCharacterCount({
  code: Question.finance_no_risk_of_reoffending_details,
  label: commonContentFor('optional_details'),
  maxLength: PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT,
  dependentWhen: Answer(Question.finance_linked_to_reoffending).match(Condition.Equals(CommonOption.no)),
})

export const linkedToReoffending = GovUKRadioInput({
  code: Question.finance_linked_to_reoffending,
  fieldset: {
    legend: {
      text: contentFor('question.finance_linked_to_reoffending.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: riskOfReoffendingDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: noRiskOfReoffendingDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.finance_linked_to_reoffending.validation'),
    }),
  ],
})

export const summaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: { blocks: [financeSummary, goToPractitionerAnalysisButton(Step.financeSummary.path)] },
    },
    {
      id: 'practitioner-analysis',
      label: commonContentFor('practitioner_analysis'),
      panel: {
        blocks: [strengthsOrProtectiveFactors, linkedToSeriousHarm, linkedToReoffending, markAsCompleteButton],
      },
    },
  ],
})
