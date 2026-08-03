/** Port of oasys/datamapping/v1/PredictorsTest.kt (which declares no scenarios). */

import { Predictors } from '../../v1.0/predictors'
import { AnswersProvider } from '../../common/answersProvider'
import { formConfig1_0 } from '../support/formConfig'

describe('Predictors', () => {
  it('maps to an empty result', () => {
    const result = new Predictors().map(new AnswersProvider({}, formConfig1_0))
    expect(result).toEqual({})
  })
})
