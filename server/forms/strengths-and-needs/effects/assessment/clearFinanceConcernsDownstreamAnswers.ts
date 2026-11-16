import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { CommonOption } from '../../versions/v2.0/constants/commonOption'
import { Question } from '../../versions/v2.0/journeys/finance/constants/question'

/**
 * AC 7: When a practitioner answers "No" to "Does [Name] have any financial issues or worries?"
 * the following downstream questions must be defaulted to NULL.
 *
 * TODO: Replace null-setting with the agreed default value logic once confirmed.
 */

const DOWNSTREAM_QUESTIONS = [
  // How good is [Name] at managing their money?
  Question.finance_money_management,
  Question.finance_money_management_good_details,
  Question.finance_money_management_fairly_good_details,
  Question.finance_money_management_fairly_bad_details,
  Question.finance_money_management_bad_details,
  // Is [Name] affected by debt?
  Question.finance_debt,
  Question.finance_debt_unknown_details,
  // What type of debt does [Name] have?
  Question.yes_type_of_debt,
  Question.yes_type_of_debt_debt_to_others_details,
  Question.yes_type_of_debt_formal_debt_details,
  Question.yes_someone_elses_type_of_debt,
  Question.yes_someone_elses_type_of_debt_debt_to_others_details,
  Question.yes_someone_elses_type_of_debt_formal_debt_details,
  // Does [Name] want to make changes to their finances?
  Question.finance_changes,
  Question.finance_changes_made_changes_details,
  Question.finance_changes_making_changes_details,
  Question.finance_changes_want_to_make_changes_details,
  Question.finance_changes_needs_help_to_make_changes_details,
  Question.finance_changes_thinking_about_making_changes_details,
  Question.finance_changes_does_not_want_to_make_changes_details,
  Question.finance_changes_does_not_want_to_answer_details,
  // Practitioner analysis
  Question.finance_practitioner_analysis_strengths_or_protective_factors,
  Question.finance_practitioner_analysis_strengths_or_protective_factors_yes_details,
  Question.finance_practitioner_analysis_strengths_or_protective_factors_no_details,
  Question.finance_practitioner_analysis_risk_of_serious_harm,
  Question.finance_practitioner_analysis_risk_of_serious_harm_yes_details,
  Question.finance_practitioner_analysis_risk_of_serious_harm_no_details,
  Question.finance_practitioner_analysis_risk_of_reoffending,
  Question.finance_practitioner_analysis_risk_of_reoffending_yes_details,
  Question.finance_practitioner_analysis_risk_of_reoffending_no_details,
] as const

export const clearFinanceConcernsDownstreamAnswers =
  (_deps: StrengthsAndNeedsEffectsDeps) =>
  async (context: StrengthsAndNeedsContext): Promise<void> => {
    if (context.getAnswer(Question.finance_concerns) !== CommonOption.no) {
      return
    }
    // TODO: Replace with agreed default value logic once confirmed. Currently passing NULL.
    for (const code of DOWNSTREAM_QUESTIONS) {
      context.setAnswer(code, null)
    }
  }
