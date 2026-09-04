import { ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'

import { CaseData } from '../../constants/formVersion'
import { CommonOption } from '../../constants/commonOption'
import {
  checkboxDetails,
  checkboxField,
  question,
  QuestionFormat,
  radioDetails,
  radioField,
  revealedQuestion,

} from '../../../../constants/questionContent'
import { commonContentFor } from '../../locales'
import { contentFor } from './locales'
import { Question } from './constants/question'
import { Step } from './constants/step'
import { Option } from './constants/option'
import { Section } from '../../constants/section'
import { CharacterLimit } from '../../../../constants/characterLimit'
import { itemisedSummaryRow, optionalDetails, requiredDetails, yesNo } from '../../constants/questionContent'

const overReliantOnFamilyOrFriendsRevealed = revealedQuestion({
  content: {
    code: Question.family_or_friends_details,
    format: QuestionFormat.RADIO,
    text: contentFor('question.family_or_friends_details.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        summaryText: contentFor('question.finance_income.summary.option.YES'),
      },
      {
        value: CommonOption.no,
        text: commonContentFor('option.NO'),
        summaryText: contentFor('question.finance_income.summary.option.NO'),
      },
      {
        value: CommonOption.unknown,
        text: commonContentFor('option.UNKNOWN'),
        summaryText: contentFor('question.finance_income.summary.option.UNKNOWN'),
      },
    ],
    validationMessage: contentFor('question.family_or_friends_details.validation'),
  },
  displayModes: { field: radioDetails() },
})

const typeOfDebtRevealed = (content: {
  code: string
  text: ResolvableString
  debtToOthersDetailsCode: string
  formalDebtDetailsCode: string
}) =>
  revealedQuestion({
    content: {
      code: content.code,
      format: QuestionFormat.CHECKBOX,
      text: content.text,
      hint: commonContentFor('select_all_that_apply'),
      options: [
        {
          value: Option.debt_to_others,
          text: contentFor('common.option.DEBT_TO_OTHERS'),
          reveals: optionalDetails({
            code: content.debtToOthersDetailsCode,
            hint: contentFor('common.hint.DEBT_TO_OTHERS'),
          }),
        },
        {
          value: Option.formal_debt,
          text: contentFor('common.option.FORMAL_DEBT'),
          reveals: optionalDetails({
            code: content.formalDebtDetailsCode,
            hint: contentFor('common.hint.FORMAL_DEBT'),
          }),
        },
      ],
      validationMessage: contentFor('common.validation.select_type_of_debt'),
    },
    displayModes: { field: checkboxDetails() },
  })

const income = question({
  content: {
    code: Question.finance_income,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.finance_income.text', CaseData.Forename),
    hint: commonContentFor('select_all_that_apply'),
    options: [
      { value: Option.carers_allowance, text: contentFor('question.finance_income.option.CARERS_ALLOWANCE') },
      {
        value: Option.disability_benefits,
        text: contentFor('question.finance_income.option.DISABILITY_BENEFITS.text'),
        hint: contentFor('question.finance_income.option.DISABILITY_BENEFITS.hint'),
      },
      { value: Option.employment, text: contentFor('question.finance_income.option.EMPLOYMENT') },
      {
        value: Option.family_or_friends,
        text: contentFor('question.finance_income.option.FAMILY_OR_FRIENDS'),
        reveals: overReliantOnFamilyOrFriendsRevealed,
      },
      { value: Option.offending, text: contentFor('question.finance_income.option.OFFENDING') },
      { value: Option.pension, text: contentFor('question.finance_income.option.PENSION') },
      { value: Option.student_loan, text: contentFor('question.finance_income.option.STUDENT_LOAN') },
      { value: Option.undeclared, text: contentFor('question.finance_income.option.Undeclared') },
      {
        value: Option.work_related_benefits,
        text: contentFor('question.finance_income.option.WORK_RELATED_BENEFITS.text'),
        hint: contentFor('question.finance_income.option.WORK_RELATED_BENEFITS.hint'),
      },
      {
        value: CommonOption.other,
        text: commonContentFor('option.OTHER'),
        reveals: optionalDetails({ code: Question.finance_income_other_details }),
      },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN'), behaviour: 'exclusive' as const },
      { divider: commonContentFor('or') },
      {
        value: Option.no_money,
        text: contentFor('question.finance_income.option.NO_MONEY'),
        behaviour: 'exclusive' as const,
        reveals: optionalDetails({ code: Question.finance_income_no_money_details }),
      },
    ],
    validationMessage: contentFor('question.finance_income.validation'),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.finance.path }),
  },
})

const bankAccount = question({
  content: {
    code: Question.finance_bank_account,
    format: QuestionFormat.RADIO,
    text: contentFor('question.finance_bank_account.text', CaseData.Forename),
    options: [...yesNo(), { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') }],
    validationMessage: contentFor('question.finance_bank_account.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.finance.path }),
  },
})

const moneyManagement = question({
  content: {
    code: Question.finance_money_management,
    format: QuestionFormat.RADIO,
    text: contentFor('question.finance_money_management.text', CaseData.Forename),
    hint: contentFor('question.finance_money_management.hint'),
    options: [
      {
        value: Option.good,
        text: contentFor('question.finance_money_management.option.GOOD'),
        reveals: optionalDetails({ code: Question.finance_money_management_good_details }),
      },
      {
        value: Option.fairly_good,
        text: contentFor('question.finance_money_management.option.FAIRLY_GOOD'),
        reveals: optionalDetails({ code: Question.finance_money_management_fairly_good_details }),
      },
      {
        value: Option.fairly_bad,
        text: contentFor('question.finance_money_management.option.FAIRLY_BAD'),
        reveals: optionalDetails({ code: Question.finance_money_management_fairly_bad_details }),
      },
      {
        value: Option.bad,
        text: contentFor('question.finance_money_management.option.BAD'),
        reveals: optionalDetails({ code: Question.finance_money_management_bad_details }),
      },
    ],
    validationMessage: contentFor('question.finance_money_management.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.finance.path }),
  },
})

const gambling = question({
  content: {
    code: Question.finance_gambling,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.finance_gambling.text', CaseData.Forename),
    hint: commonContentFor('select_all_that_apply'),
    options: [
      {
        value: Option.yes_their_gambling,
        text: contentFor('question.finance_gambling.option.YES_THEIR_GAMBLING'),
        reveals: optionalDetails({ code: Question.finance_gambling_yes_their_gambling_details }),
      },
      {
        value: Option.yes_someone_elses_gambling,
        text: contentFor('question.finance_gambling.option.YES_SOMEONE_ELSES_GAMBLING'),
        reveals: optionalDetails({ code: Question.finance_gambling_yes_someone_elses_gambling_details }),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.no, text: commonContentFor('option.NO'), behaviour: 'exclusive' as const },
      {
        value: CommonOption.unknown,
        text: commonContentFor('option.UNKNOWN'),
        behaviour: 'exclusive' as const,
        reveals: optionalDetails({ code: Question.finance_gambling_unknown_details }),
      },
    ],
    validationMessage: contentFor('question.finance_gambling.validation'),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.finance.path }),
  },
})

const debt = question({
  content: {
    code: Question.finance_debt,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.finance_debt.text', CaseData.Forename),
    options: [
      {
        value: Option.yes_their_debt,
        text: contentFor('question.finance_debt.option.YES_THEIR_DEBT'),
        reveals: typeOfDebtRevealed({
          code: Question.yes_type_of_debt,
          text: contentFor('question.finance_debt.option.YES_THEIR_DEBT'),
          debtToOthersDetailsCode: Question.yes_type_of_debt_debt_to_others_details,
          formalDebtDetailsCode: Question.yes_type_of_debt_formal_debt_details,
        }),
      },
      {
        value: Option.yes_someone_elses_debt,
        text: contentFor('question.finance_debt.option.YES_SOMEONE_ELSES_DEBT'),
        reveals: typeOfDebtRevealed({
          code: Question.yes_someone_elses_type_of_debt,
          text: contentFor('question.finance_debt.option.YES_SOMEONE_ELSES_DEBT'),
          debtToOthersDetailsCode: Question.yes_someone_elses_type_of_debt_debt_to_others_details,
          formalDebtDetailsCode: Question.yes_someone_elses_type_of_debt_formal_debt_details,
        }),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.no, text: commonContentFor('option.NO'), behaviour: 'exclusive' as const },
      {
        value: CommonOption.unknown,
        text: commonContentFor('option.UNKNOWN'),
        behaviour: 'exclusive' as const,
        reveals: optionalDetails({ code: Question.finance_debt_unknown_details }),
      },
    ],
    validationMessage: contentFor('question.finance_debt.validation'),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.finance.path }),
  },
})

const changes = question({
  content: {
    code: Question.finance_changes,
    format: QuestionFormat.RADIO,
    text: contentFor('question.finance_changes.text', CaseData.Forename),
    hint: contentFor('question.finance_changes.hint', CaseData.Forename),
    options: [
      {
        value: CommonOption.made_changes,
        text: commonContentFor('option.MADE_CHANGES'),
        reveals: optionalDetails({ code: Question.finance_changes_made_changes_details }),
      },
      {
        value: CommonOption.making_changes,
        text: commonContentFor('option.MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.finance_changes_making_changes_details }),
      },
      {
        value: CommonOption.want_to_make_changes,
        text: commonContentFor('option.WANT_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.finance_changes_want_to_make_changes_details }),
      },
      {
        value: CommonOption.needs_help_to_make_changes,
        text: commonContentFor('option.NEEDS_HELP_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.finance_changes_needs_help_to_make_changes_details }),
      },
      {
        value: CommonOption.thinking_about_making_changes,
        text: commonContentFor('option.THINKING_ABOUT_MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.finance_changes_thinking_about_making_changes_details }),
      },
      {
        value: CommonOption.does_not_want_to_make_changes,
        text: commonContentFor('option.DOES_NOT_WANT_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.finance_changes_does_not_want_to_make_changes_details }),
      },
      {
        value: CommonOption.does_not_want_to_answer,
        text: commonContentFor('option.DOES_NOT_WANT_TO_ANSWER'),
        reveals: optionalDetails({ code: Question.finance_changes_does_not_want_to_answer_details }),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.not_present, text: commonContentFor('option.NOT_PRESENT', CaseData.Forename) },
      { value: CommonOption.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
    ],
    validationMessage: contentFor('question.finance_changes.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.finance.path }),
  },
})

const strengthsOrProtectiveFactors = question({
  content: {
    code: Question.finance_practitioner_analysis_strengths_or_protective_factors,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.finance_practitioner_analysis_strengths_or_protective_factors.text',
      CaseData.ForenamePossessive,
    ),
    hint: contentFor('question.finance_practitioner_analysis_strengths_or_protective_factors.hint'),
    options: yesNo({
      yes: requiredDetails({
        code: Question.finance_practitioner_analysis_strengths_or_protective_factors_yes_details,
        validationMessage: contentFor(
          'question.finance_practitioner_analysis_strengths_or_protective_factors_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.finance_practitioner_analysis_strengths_or_protective_factors_no_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor('question.finance_practitioner_analysis_strengths_or_protective_factors.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.financeSummary.path,
      changeVisuallyHiddenText: true,
    }),
  },
})

const riskOfSeriousHarm = question({
  content: {
    code: Question.finance_practitioner_analysis_risk_of_serious_harm,
    format: QuestionFormat.RADIO,
    text: contentFor('question.finance_practitioner_analysis_risk_of_serious_harm.text', CaseData.ForenamePossessive),
    options: yesNo({
      yes: requiredDetails({
        code: Question.finance_practitioner_analysis_risk_of_serious_harm_yes_details,
        validationMessage: contentFor(
          'question.finance_practitioner_analysis_risk_of_serious_harm_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.finance_practitioner_analysis_risk_of_serious_harm_no_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor('question.finance_practitioner_analysis_risk_of_serious_harm.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.financeSummary.path,
      changeVisuallyHiddenText: true,
    }),
  },
})

const riskOfReoffending = question({
  content: {
    code: Question.finance_practitioner_analysis_risk_of_reoffending,
    format: QuestionFormat.RADIO,
    text: contentFor('question.finance_practitioner_analysis_risk_of_reoffending.text', CaseData.ForenamePossessive),
    options: yesNo({
      yes: requiredDetails({
        code: Question.finance_practitioner_analysis_risk_of_reoffending_yes_details,
        validationMessage: contentFor(
          'question.finance_practitioner_analysis_risk_of_reoffending_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1000,
      }),
      no: optionalDetails({
        code: Question.finance_practitioner_analysis_risk_of_reoffending_no_details,
        maxLength: CharacterLimit.c1000,
      }),
    }),
    validationMessage: contentFor('question.finance_practitioner_analysis_risk_of_reoffending.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.financeSummary.path,
      changeVisuallyHiddenText: true,
    }),
  },
})

export const financeSection = {
  code: Section.finance.code,
  questions: {
    income,
    bankAccount,
    moneyManagement,
    gambling,
    debt,
    changes,
  },
  practitionerAnalysis: {
    strengthsOrProtectiveFactors,
    riskOfSeriousHarm,
    riskOfReoffending,
  },
}
