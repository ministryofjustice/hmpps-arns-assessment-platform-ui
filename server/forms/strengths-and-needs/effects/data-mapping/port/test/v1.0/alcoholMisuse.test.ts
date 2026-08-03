/** Port of oasys/datamapping/v1/AlcoholMisuseTest.kt. */

import { Field, Value } from '../../codes'
import { AlcoholMisuse } from '../../v1.0/alcoholMisuse'
import { Given, testSection } from '../support/given'
import { PractitionerAnalysisScenarios } from '../support/practitionerAnalysisScenarios'

describe('AlcoholMisuse', () => {
  const sectionMapping = new AlcoholMisuse()

  it('q1', () => {
    testSection(sectionMapping, 'o9-1', [
      new Given().expect(null),
      new Given(Field.ALCOHOL_USE, null).expect(null),
      new Given(Field.ALCOHOL_USE, Value.NO).expect('0'),
      new Given(Field.ALCOHOL_USE, Value.YES_NOT_IN_LAST_THREE_MONTHS).expect('0'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.ONCE_A_MONTH_OR_LESS)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_1_TO_2)
        .expect('0'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.ONCE_A_MONTH_OR_LESS)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_3_TO_4)
        .expect('0'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.ONCE_A_MONTH_OR_LESS)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_5_TO_6)
        .expect('0'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.ONCE_A_MONTH_OR_LESS)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_7_TO_9)
        .expect('0'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.ONCE_A_MONTH_OR_LESS)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_10_OR_MORE)
        .expect('0'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.MULTIPLE_TIMES_A_MONTH)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_1_TO_2)
        .expect('0'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.MULTIPLE_TIMES_A_MONTH)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_3_TO_4)
        .expect('0'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.MULTIPLE_TIMES_A_MONTH)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_5_TO_6)
        .expect('0'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.MULTIPLE_TIMES_A_MONTH)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_7_TO_9)
        .expect('0'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.MULTIPLE_TIMES_A_MONTH)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_10_OR_MORE)
        .expect('1'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.LESS_THAN_4_TIMES_A_WEEK)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_1_TO_2)
        .expect('0'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.LESS_THAN_4_TIMES_A_WEEK)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_3_TO_4)
        .expect('0'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.LESS_THAN_4_TIMES_A_WEEK)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_5_TO_6)
        .expect('1'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.LESS_THAN_4_TIMES_A_WEEK)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_7_TO_9)
        .expect('1'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.LESS_THAN_4_TIMES_A_WEEK)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_10_OR_MORE)
        .expect('1'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.MORE_THAN_4_TIMES_A_WEEK)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_1_TO_2)
        .expect('0'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.MORE_THAN_4_TIMES_A_WEEK)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_3_TO_4)
        .expect('1'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.MORE_THAN_4_TIMES_A_WEEK)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_5_TO_6)
        .expect('1'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.MORE_THAN_4_TIMES_A_WEEK)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_7_TO_9)
        .expect('1'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.MORE_THAN_4_TIMES_A_WEEK)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_10_OR_MORE)
        .expect('2'),
    ])
  })

  it('q1t', () => {
    testSection(sectionMapping, 'o9-1-t', [
      new Given().expect(null),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.ONCE_A_MONTH_OR_LESS)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_1_TO_2)
        .expect('Only drinks once a month or less and consumes 1 to 2 units a day, when they drink.'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.ONCE_A_MONTH_OR_LESS)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_3_TO_4)
        .expect('Only drinks once a month or less and consumes 3 to 4 units a day, when they drink.'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.ONCE_A_MONTH_OR_LESS)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_5_TO_6)
        .expect('Only drinks once a month or less and consumes 5 to 6 units a day, when they drink.'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.ONCE_A_MONTH_OR_LESS)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_7_TO_9)
        .expect('Only drinks once a month or less and consumes 7 to 9 units a day, when they drink.'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.ONCE_A_MONTH_OR_LESS)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_10_OR_MORE)
        .expect('Only drinks once a month or less and consumes 10 or more units a day, when they drink.'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.MULTIPLE_TIMES_A_MONTH)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_1_TO_2)
        .expect('Drinks multiple times a month and consumes 1 to 2 units a day, when they drink.'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.MULTIPLE_TIMES_A_MONTH)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_3_TO_4)
        .expect('Drinks multiple times a month and consumes 3 to 4 units a day, when they drink.'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.MULTIPLE_TIMES_A_MONTH)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_5_TO_6)
        .expect('Drinks multiple times a month and consumes 5 to 6 units a day, when they drink.'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.MULTIPLE_TIMES_A_MONTH)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_7_TO_9)
        .expect('Drinks multiple times a month and consumes 7 to 9 units a day, when they drink.'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.MULTIPLE_TIMES_A_MONTH)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_10_OR_MORE)
        .expect('Drinks multiple times a month and consumes 10 or more units a day, when they drink.'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.LESS_THAN_4_TIMES_A_WEEK)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_1_TO_2)
        .expect('Drinks less than four times a week and consumes 1 to 2 units a day, when they drink.'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.LESS_THAN_4_TIMES_A_WEEK)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_3_TO_4)
        .expect('Drinks less than four times a week and consumes 3 to 4 units a day, when they drink.'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.LESS_THAN_4_TIMES_A_WEEK)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_5_TO_6)
        .expect('Drinks less than four times a week and consumes 5 to 6 units a day, when they drink.'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.LESS_THAN_4_TIMES_A_WEEK)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_7_TO_9)
        .expect('Drinks less than four times a week and consumes 7 to 9 units a day, when they drink.'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.LESS_THAN_4_TIMES_A_WEEK)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_10_OR_MORE)
        .expect('Drinks less than four times a week and consumes 10 or more units a day, when they drink.'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.MORE_THAN_4_TIMES_A_WEEK)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_1_TO_2)
        .expect('Drinks more than four times a week and consumes 1 to 2 units a day, when they drink.'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.MORE_THAN_4_TIMES_A_WEEK)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_3_TO_4)
        .expect('Drinks more than four times a week and consumes 3 to 4 units a day, when they drink.'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.MORE_THAN_4_TIMES_A_WEEK)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_5_TO_6)
        .expect('Drinks more than four times a week and consumes 5 to 6 units a day, when they drink.'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.MORE_THAN_4_TIMES_A_WEEK)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_7_TO_9)
        .expect('Drinks more than four times a week and consumes 7 to 9 units a day, when they drink.'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_FREQUENCY, Value.MORE_THAN_4_TIMES_A_WEEK)
        .and(Field.ALCOHOL_UNITS, Value.UNITS_10_OR_MORE)
        .expect('Drinks more than four times a week and consumes 10 or more units a day, when they drink.'),
    ])
  })

  it('q2', () => {
    testSection(sectionMapping, 'o9-2', [
      new Given().expect(null),
      new Given(Field.ALCOHOL_USE, null).expect(null),
      new Given(Field.ALCOHOL_USE, Value.NO).expect('0'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_EVIDENCE_OF_EXCESS_DRINKING, Value.NO_EVIDENCE)
        .expect('0'),
      new Given(Field.ALCOHOL_USE, Value.YES_NOT_IN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_EVIDENCE_OF_EXCESS_DRINKING, Value.NO_EVIDENCE)
        .expect('0'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_EVIDENCE_OF_EXCESS_DRINKING, Value.YES_WITH_SOME_EVIDENCE)
        .expect('1'),
      new Given(Field.ALCOHOL_USE, Value.YES_NOT_IN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_EVIDENCE_OF_EXCESS_DRINKING, Value.YES_WITH_SOME_EVIDENCE)
        .expect('1'),
      new Given(Field.ALCOHOL_USE, Value.YES_WITHIN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_EVIDENCE_OF_EXCESS_DRINKING, Value.YES_WITH_EVIDENCE)
        .expect('2'),
      new Given(Field.ALCOHOL_USE, Value.YES_NOT_IN_LAST_THREE_MONTHS)
        .and(Field.ALCOHOL_EVIDENCE_OF_EXCESS_DRINKING, Value.YES_WITH_EVIDENCE)
        .expect('2'),
    ])
  })

  it('q97', () => {
    testSection(sectionMapping, 'o9-97', new PractitionerAnalysisScenarios('ALCOHOL_USE').notes())
  })

  it('q98', () => {
    testSection(sectionMapping, 'o9-98', new PractitionerAnalysisScenarios('ALCOHOL_USE').riskOfSeriousHarm())
  })

  it('q99', () => {
    testSection(sectionMapping, 'o9-99', new PractitionerAnalysisScenarios('ALCOHOL_USE').riskOfReoffending())
  })

  it('qStrength', () => {
    testSection(
      sectionMapping,
      'o9_SAN_STRENGTH',
      new PractitionerAnalysisScenarios('ALCOHOL_USE').strengthsOrProtectiveFactors(),
    )
  })
})
