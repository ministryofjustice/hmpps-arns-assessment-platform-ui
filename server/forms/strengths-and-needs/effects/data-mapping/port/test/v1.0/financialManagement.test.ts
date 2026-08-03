/** Port of oasys/datamapping/v1/FinancialManagementTest.kt. */

import { Field, Value } from '../../codes'
import { FinancialManagement } from '../../v1.0/financialManagement'
import { Given, testSection } from '../support/given'
import { PractitionerAnalysisScenarios } from '../support/practitionerAnalysisScenarios'

describe('FinancialManagement', () => {
  const sectionMapping = new FinancialManagement()

  it('q3', () => {
    testSection(sectionMapping, 'o5-3', [
      new Given().expect(null),
      new Given(Field.FINANCE_MONEY_MANAGEMENT, null).expect(null),
      new Given(Field.FINANCE_MONEY_MANAGEMENT, Value.GOOD).expect('0'),
      new Given(Field.FINANCE_MONEY_MANAGEMENT, Value.FAIRLY_GOOD).expect('0'),
      new Given(Field.FINANCE_MONEY_MANAGEMENT, Value.FAIRLY_BAD).expect('1'),
      new Given(Field.FINANCE_MONEY_MANAGEMENT, Value.BAD).expect('2'),
    ])
  })

  it('q4', () => {
    testSection(sectionMapping, 'o5-4', [
      new Given().expect(null),
      new Given(Field.FINANCE_INCOME, []).expect('0'),
      new Given(Field.FINANCE_INCOME, [Value.CARERS_ALLOWANCE]).expect('0'),
      new Given(Field.FINANCE_INCOME, [Value.DISABILITY_BENEFITS]).expect('0'),
      new Given(Field.FINANCE_INCOME, [Value.EMPLOYMENT]).expect('0'),
      new Given(Field.FINANCE_INCOME, [Value.FAMILY_OR_FRIENDS]).expect('0'),
      new Given(Field.FINANCE_INCOME, [Value.PENSION]).expect('0'),
      new Given(Field.FINANCE_INCOME, [Value.STUDENT_LOAN]).expect('0'),
      new Given(Field.FINANCE_INCOME, [Value.Undeclared]).expect('0'),
      new Given(Field.FINANCE_INCOME, [Value.WORK_RELATED_BENEFITS]).expect('0'),
      new Given(Field.FINANCE_INCOME, [Value.OTHER]).expect('0'),
      new Given(Field.FINANCE_INCOME, [Value.UNKNOWN]).expect('M'),
      new Given(Field.FINANCE_INCOME, [Value.NO_MONEY]).expect('0'),
      new Given(Field.FINANCE_INCOME, [Value.OFFENDING, Value.CARERS_ALLOWANCE]).expect('1'),
      new Given(Field.FINANCE_INCOME, [Value.OFFENDING, Value.DISABILITY_BENEFITS]).expect('1'),
      new Given(Field.FINANCE_INCOME, [Value.OFFENDING, Value.EMPLOYMENT]).expect('1'),
      new Given(Field.FINANCE_INCOME, [Value.OFFENDING, Value.FAMILY_OR_FRIENDS]).expect('1'),
      new Given(Field.FINANCE_INCOME, [Value.OFFENDING, Value.PENSION]).expect('1'),
      new Given(Field.FINANCE_INCOME, [Value.OFFENDING, Value.STUDENT_LOAN]).expect('1'),
      new Given(Field.FINANCE_INCOME, [Value.OFFENDING, Value.Undeclared]).expect('1'),
      new Given(Field.FINANCE_INCOME, [Value.OFFENDING, Value.WORK_RELATED_BENEFITS]).expect('1'),
      new Given(Field.FINANCE_INCOME, [Value.OFFENDING, Value.OTHER]).expect('1'),
      new Given(Field.FINANCE_INCOME, [Value.OFFENDING, Value.UNKNOWN]).expect('1'),
      new Given(Field.FINANCE_INCOME, [Value.OFFENDING]).expect('2'),
    ])
  })

  it('q5', () => {
    testSection(sectionMapping, 'o5-5', [
      new Given().expect(null),
      new Given(Field.FINANCE_INCOME, []).expect('0'),
      new Given(Field.FINANCE_INCOME, [Value.STUDENT_LOAN]).expect('0'),
      new Given(Field.FINANCE_INCOME, [Value.FAMILY_OR_FRIENDS]).expect('0'),
      new Given(Field.FINANCE_INCOME, [Value.FAMILY_OR_FRIENDS])
        .and(Field.FAMILY_OR_FRIENDS_DETAILS, Value.NO)
        .expect('0'),
      new Given(Field.FINANCE_INCOME, [Value.FAMILY_OR_FRIENDS])
        .and(Field.FAMILY_OR_FRIENDS_DETAILS, Value.YES)
        .expect('2'),
      new Given(Field.FINANCE_INCOME, [Value.FAMILY_OR_FRIENDS])
        .and(Field.FAMILY_OR_FRIENDS_DETAILS, Value.UNKNOWN)
        .expect('M'),
    ])
  })

  it('q6', () => {
    testSection(sectionMapping, 'o5-6', [
      new Given().expect(null),
      new Given(Field.FINANCE_MONEY_MANAGEMENT, Value.BAD).expect(null),
      new Given(Field.FINANCE_MONEY_MANAGEMENT, Value.FAIRLY_BAD).expect(null),
      new Given(Field.FINANCE_MONEY_MANAGEMENT, Value.GOOD).expect('0'),
      new Given(Field.FINANCE_MONEY_MANAGEMENT, Value.FAIRLY_GOOD).expect('0'),
    ])
  })

  it('q97', () => {
    testSection(sectionMapping, 'o5-97', new PractitionerAnalysisScenarios('FINANCE').notes())
  })

  it('q98', () => {
    testSection(sectionMapping, 'o5-98', new PractitionerAnalysisScenarios('FINANCE').riskOfSeriousHarm())
  })

  it('q99', () => {
    testSection(sectionMapping, 'o5-99', new PractitionerAnalysisScenarios('FINANCE').riskOfReoffending())
  })

  it('qStrength', () => {
    testSection(
      sectionMapping,
      'o5_SAN_STRENGTH',
      new PractitionerAnalysisScenarios('FINANCE').strengthsOrProtectiveFactors(),
    )
  })
})
