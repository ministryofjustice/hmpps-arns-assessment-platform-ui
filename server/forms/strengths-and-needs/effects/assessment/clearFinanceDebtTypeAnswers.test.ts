import {createTestEffectContext} from '@ministryofjustice/hmpps-forge/core/testing'
import {StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps} from '../types'
import {CommonOption} from '../../versions/v2.0/constants/commonOption'
import {Option} from '../../versions/v2.0/journeys/finance/constants/option'
import {Question} from '../../versions/v2.0/journeys/finance/constants/question'
import {clearFinanceDebtTypeAnswers} from './clearFinanceDebtTypeAnswers'

const debtTypeAnswers = [
  Question.yes_type_of_debt,
  Question.yes_type_of_debt_debt_to_others_details,
  Question.yes_type_of_debt_formal_debt_details,
  Question.yes_someone_elses_type_of_debt,
  Question.yes_someone_elses_type_of_debt_debt_to_others_details,
  Question.yes_someone_elses_type_of_debt_formal_debt_details,
]

const deps = {} as StrengthsAndNeedsEffectsDeps

const contextFor = (debtAnswer: string) =>
  createTestEffectContext({
    answers: {[Question.finance_debt]: debtAnswer},
  }) as unknown as StrengthsAndNeedsContext

describe('clearFinanceDebtTypeAnswers', () => {
  it.each([CommonOption.no, CommonOption.unknown])(
    'should set both conditional debt-type answers and their details to null when debt is %s',
    async answer => {
      const context = contextFor(answer)
      const setAnswer = jest.spyOn(context, 'setAnswer')

      await clearFinanceDebtTypeAnswers(deps)(context)

      expect(setAnswer).toHaveBeenCalledTimes(debtTypeAnswers.length)
      debtTypeAnswers.forEach(code => {
        expect(setAnswer).toHaveBeenCalledWith(code, null)
      })
    },
  )

  it.each([Option.yes_their_debt, Option.yes_someone_elses_debt])(
    'should not clear debt-type answers when debt is %s',
    async answer => {
      const context = contextFor(answer)
      const setAnswer = jest.spyOn(context, 'setAnswer')

      await clearFinanceDebtTypeAnswers(deps)(context)

      expect(setAnswer).not.toHaveBeenCalled()
    },
  )
})
