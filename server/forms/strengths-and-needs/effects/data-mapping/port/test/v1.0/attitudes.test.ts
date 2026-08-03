/** Port of oasys/datamapping/v1/AttitudesTest.kt. */

import { Field, Value } from '../../codes'
import { Attitudes } from '../../v1.0/attitudes'
import { Given, testSection } from '../support/given'
import { PractitionerAnalysisScenarios } from '../support/practitionerAnalysisScenarios'

describe('Attitudes', () => {
  const sectionMapping = new Attitudes()

  it('q1', () => {
    testSection(sectionMapping, 'o12-1', [
      new Given().expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_CRIMINAL_BEHAVIOUR, null).expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_CRIMINAL_BEHAVIOUR, Value.NO).expect('0'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_CRIMINAL_BEHAVIOUR, Value.SOMETIMES).expect('1'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_CRIMINAL_BEHAVIOUR, Value.YES).expect('2'),
    ])
  })

  it('q3', () => {
    testSection(sectionMapping, 'o12-3', [
      new Given().expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_POSITIVE_ATTITUDE, null).expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_POSITIVE_ATTITUDE, Value.YES_POSITIVE).expect('0'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_POSITIVE_ATTITUDE, Value.NEGATIVE_ATTITUDE_NO_CONCERNS).expect('1'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_POSITIVE_ATTITUDE, Value.NEGATIVE_ATTITUDE_AND_CONCERNS).expect(
        '2',
      ),
    ])
  })

  it('q4', () => {
    testSection(sectionMapping, 'o12-4', [
      new Given().expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_SUPERVISION, null).expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_SUPERVISION, Value.YES_SUPERVISION).expect('0'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_SUPERVISION, Value.UNSURE_SUPERVISION).expect('1'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_SUPERVISION, Value.NO_SUPERVISION).expect('2'),
    ])
  })

  it('q9', () => {
    testSection(sectionMapping, 'o12-9', [
      new Given().expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_HOSTILE_ORIENTATION, null).expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_HOSTILE_ORIENTATION, Value.NO).expect('0'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_HOSTILE_ORIENTATION, Value.SOME).expect('1'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_HOSTILE_ORIENTATION, Value.YES).expect('2'),
    ])
  })

  it('q97', () => {
    testSection(sectionMapping, 'o12-97', new PractitionerAnalysisScenarios('THINKING_BEHAVIOURS_ATTITUDES').notes())
  })

  it('q98', () => {
    testSection(
      sectionMapping,
      'o12-98',
      new PractitionerAnalysisScenarios('THINKING_BEHAVIOURS_ATTITUDES').riskOfSeriousHarm(),
    )
  })

  it('q99', () => {
    testSection(
      sectionMapping,
      'o12-99',
      new PractitionerAnalysisScenarios('THINKING_BEHAVIOURS_ATTITUDES').riskOfReoffending(),
    )
  })
})
