import { createTestEffectContext } from '@ministryofjustice/hmpps-forge/core/testing'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { CommonOption } from '../../versions/v2.0/constants/commonOption'
import { Question } from '../../versions/v2.0/journeys/finance/constants/question'
import { clearFinanceConcernsDownstreamAnswers } from './clearFinanceConcernsDownstreamAnswers'

const downstreamAnswers = [
  Question.finance_money_management,
  Question.finance_money_management_good_details,
  Question.finance_money_management_fairly_good_details,
  Question.finance_money_management_fairly_bad_details,
  Question.finance_money_management_bad_details,
  Question.finance_debt,
  Question.finance_debt_unknown_details,
  Question.yes_type_of_debt,
  Question.yes_type_of_debt_debt_to_others_details,
  Question.yes_type_of_debt_formal_debt_details,
  Question.yes_someone_elses_type_of_debt,
  Question.yes_someone_elses_type_of_debt_debt_to_others_details,
  Question.yes_someone_elses_type_of_debt_formal_debt_details,
  Question.finance_changes,
  Question.finance_changes_made_changes_details,
  Question.finance_changes_making_changes_details,
  Question.finance_changes_want_to_make_changes_details,
  Question.finance_changes_needs_help_to_make_changes_details,
  Question.finance_changes_thinking_about_making_changes_details,
  Question.finance_changes_does_not_want_to_make_changes_details,
  Question.finance_changes_does_not_want_to_answer_details,
  Question.finance_practitioner_analysis_strengths_or_protective_factors,
  Question.finance_practitioner_analysis_strengths_or_protective_factors_yes_details,
  Question.finance_practitioner_analysis_strengths_or_protective_factors_no_details,
  Question.finance_practitioner_analysis_risk_of_serious_harm,
  Question.finance_practitioner_analysis_risk_of_serious_harm_yes_details,
  Question.finance_practitioner_analysis_risk_of_serious_harm_no_details,
  Question.finance_practitioner_analysis_risk_of_reoffending,
  Question.finance_practitioner_analysis_risk_of_reoffending_yes_details,
  Question.finance_practitioner_analysis_risk_of_reoffending_no_details,
]

const deps = {} as StrengthsAndNeedsEffectsDeps

const contextFor = (financialConcernsAnswer: string) =>
  createTestEffectContext({
    answers: { [Question.finance_concerns]: financialConcernsAnswer },
  }) as unknown as StrengthsAndNeedsContext

describe('clearFinanceConcernsDownstreamAnswers', () => {
  it('should set all downstream finance answers to null when financial concerns is No', async () => {
    const context = contextFor(CommonOption.no)
    const setAnswer = jest.spyOn(context, 'setAnswer')

    await clearFinanceConcernsDownstreamAnswers(deps)(context)

    expect(setAnswer).toHaveBeenCalledTimes(downstreamAnswers.length)
    downstreamAnswers.forEach(code => {
      expect(setAnswer).toHaveBeenCalledWith(code, null)
    })
  })

  it.each([CommonOption.yes, CommonOption.unknown])(
    'should not clear downstream answers when financial concerns is %s',
    async answer => {
      const context = contextFor(answer)
      const setAnswer = jest.spyOn(context, 'setAnswer')

      await clearFinanceConcernsDownstreamAnswers(deps)(context)

      expect(setAnswer).not.toHaveBeenCalled()
    },
  )
})
