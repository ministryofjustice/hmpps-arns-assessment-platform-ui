import {createTestEffectContext} from '@ministryofjustice/hmpps-forge/core/testing'
import {StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps} from '../types'
import {CommonOption} from '../../versions/v2.0/constants/commonOption'
import {clearFinanceConcernsDownstreamAnswers} from './clearFinanceConcernsDownstreamAnswers'

const downstreamAnswers = [
  'finance_money_management',
  'finance_money_management_good_details',
  'finance_money_management_fairly_good_details',
  'finance_money_management_fairly_bad_details',
  'finance_money_management_bad_details',
  'finance_debt',
  'finance_debt_unknown_details',
  'yes_type_of_debt',
  'yes_type_of_debt_debt_to_others_details',
  'yes_type_of_debt_formal_debt_details',
  'yes_someone_elses_type_of_debt',
  'yes_someone_elses_type_of_debt_debt_to_others_details',
  'yes_someone_elses_type_of_debt_formal_debt_details',
  'finance_changes',
  'finance_changes_made_changes_details',
  'finance_changes_making_changes_details',
  'finance_changes_want_to_make_changes_details',
  'finance_changes_needs_help_to_make_changes_details',
  'finance_changes_thinking_about_making_changes_details',
  'finance_changes_does_not_want_to_make_changes_details',
  'finance_changes_does_not_want_to_answer_details',
  'finance_practitioner_analysis_strengths_or_protective_factors',
  'finance_practitioner_analysis_strengths_or_protective_factors_yes_details',
  'finance_practitioner_analysis_strengths_or_protective_factors_no_details',
  'finance_practitioner_analysis_risk_of_serious_harm',
  'finance_practitioner_analysis_risk_of_serious_harm_yes_details',
  'finance_practitioner_analysis_risk_of_serious_harm_no_details',
  'finance_practitioner_analysis_risk_of_reoffending',
  'finance_practitioner_analysis_risk_of_reoffending_yes_details',
  'finance_practitioner_analysis_risk_of_reoffending_no_details',
]

const deps = {} as StrengthsAndNeedsEffectsDeps

const contextFor = (financialConcernsAnswer: string) =>
  createTestEffectContext({
    answers: {finance_concerns: financialConcernsAnswer},
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
