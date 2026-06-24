import { Locale } from '../../../../../i18n'
import { Question } from '../constants/question'
import { Step } from '../constants/step'
import { Option } from '../constants/option'
import { CommonOption } from '../../../constants/commonOption'

export const english = {
  step: {
    [Step.finance.code]: 'Finance',
    [Step.financeSummary.code]: 'Finance Summary',
    [Step.financeAnalysis.code]: 'Finance Analysis',
  },
  question: {
    [Question.finance_income]: {
      text: 'Where does %1 currently get their money from?',
      hint: '',
      option: {
        [Option.carers_allowance]: "Carer's allowance",
        [Option.disability_benefits]: {
          text: 'Disability benefits',
          hint: 'For example, Personal Independence Payment (PIP) (also known as Disability Living Allowance) or Severe Disablement Allowance.',
        },
        [Option.employment]: 'Employment',
        [Option.family_or_friends]: 'Family or friends',
        [Option.offending]: 'Offending',
        [Option.pension]: 'Pension',
        [Option.student_loan]: 'Student loan',
        [Option.undeclared]: 'Undeclared (includes cash in hand)',
        [Option.work_related_benefits]: {
          text: 'Work related benefits',
          hint: "For example, Universal Credit or Jobseeker's Allowance (JSA).",
        },
        [Option.no_money]: 'No money',
      },
      validation: "Select where they currently get their money from, or select 'No money'",
      summary: {
        option: {
          [CommonOption.yes]: 'Yes, over reliant on friends and family for money',
          [CommonOption.no]: 'No, not over reliant on friends and family for money',
          [CommonOption.unknown]: 'Unknown if they’re over reliant on friends and family for money',
        },
      },
    },
    [Question.finance_income_family_or_friends_details]: {
      text: 'Is %1 over reliant on family or friends for money?',
      validation: 'Select if they are over reliant on family or friends for money',
    },
    [Question.finance_bank_account]: {
      text: 'Does %1 have their own bank account?',
      validation: 'Select if they have their own personal bank account',
    },
    [Question.finance_money_management]: {
      text: 'How good is %1 at managing their money?',
      hint: 'This includes things like budgeting, prioritising bills and paying rent.',
      option: {
        [Option.good]: 'Able to manage their money well and is a strength',
        [Option.fairly_good]: 'Able to manage their money for everyday necessities',
        [Option.fairly_bad]: 'Unable to manage their money well',
        [Option.bad]: 'Unable to manage their money which is creating other problems',
      },
      validation: 'Select how good they are at managing their money',
    },
    [Question.finance_gambling]: {
      text: 'Is %1 affected by gambling?',
      option: {
        [Option.yes_their_gambling]: 'Yes, their own gambling',
        [Option.yes_someone_elses_gambling]: "Yes, someone else's gambling",
      },
      validation: 'Select if they are affected by gambling',
    },
    [Question.finance_debt]: {
      text: 'Is %1 affected by debt',
      option: {
        [Option.yes_their_debt]: 'Yes, their debt',
        [Option.yes_someone_elses_debt]: "Yes, someone else's debt",
      },
      validation: 'Select if they are affected by debt',
    },
    [Question.finance_changes]: {
      text: 'Does %1 want to make changes to their finance?',
      validation: 'Select if they want to make changes to their finance',
    },
    [Question.finance_strengths_protective_factors]: {
      text: 'Are there any strengths or protective factors related to %1 finance?',
      hint: 'Include any strategies, people or support networks that helped.',
      validation: 'Select if there are any strengths or protective factors',
    },
    [Question.finance_strengths_protective_factors_details]: {
      validation: 'Give details on strengths or protective factors related to their finance',
    },
    [Question.finance_linked_to_serious_harm]: {
      text: 'Is %1 finance linked to risk of serious harm?',
      validation: 'Select if linked to risk of serious harm',
    },
    [Question.finance_serious_harm_details]: {
      validation: 'Give details on the risk of serious harm',
    },
    [Question.finance_linked_to_reoffending]: {
      text: 'Is %1 finance linked to risk of reoffending?',
      validation: 'Select if linked to risk of reoffending',
    },
    [Question.finance_risk_of_reoffending_details]: {
      validation: 'Give details on the risk of reoffending',
    },
  },
  common: {
    option: {
      [Option.debt_to_others]: 'Debt to others',
      [Option.formal_debt]: 'Formal debt',
    },
    validation: {
      select_type_of_debt: 'Select type of debt',
    },
  },
} as const

export type FinanceLocale = Locale<typeof english>
