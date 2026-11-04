import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { CommonOption } from '../../versions/v2.0/constants/commonOption'
import { Question } from '../../versions/v2.0/journeys/finance/constants/question'

const DEBT_TYPE_ANSWERS = [
  Question.yes_type_of_debt,
  Question.yes_type_of_debt_debt_to_others_details,
  Question.yes_type_of_debt_formal_debt_details,
  Question.yes_someone_elses_type_of_debt,
  Question.yes_someone_elses_type_of_debt_debt_to_others_details,
  Question.yes_someone_elses_type_of_debt_formal_debt_details,
] as const

export const clearFinanceDebtTypeAnswers =
  (_deps: StrengthsAndNeedsEffectsDeps) =>
  async (context: StrengthsAndNeedsContext): Promise<void> => {
    const debtAnswer = context.getAnswer(Question.finance_debt)

    if (debtAnswer !== CommonOption.no && debtAnswer !== CommonOption.unknown) {
      return
    }

    // TODO: Replace NULL with the agreed default-value logic once confirmed (AC 9).
    for (const code of DEBT_TYPE_ANSWERS) {
      context.setAnswer(code, null)
    }
  }
