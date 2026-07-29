/** Port of oasys/datamapping/v1/LifestyleAssociatesTest.kt. */

import { Field, Value } from '../../codes'
import { LifestyleAssociates } from '../../v1/lifestyleAssociates'
import { Given, testSection } from '../support/given'
import { PractitionerAnalysisScenarios } from '../support/practitionerAnalysisScenarios'

describe('LifestyleAssociates', () => {
  const sectionMapping = new LifestyleAssociates()

  it('q2', () => {
    testSection(sectionMapping, 'o7-2', [
      new Given().expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_OFFENDING_ACTIVITIES, null).expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_OFFENDING_ACTIVITIES, Value.NO_OFFENDING_ACTIVITIES).expect('0'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_OFFENDING_ACTIVITIES, Value.SOMETIMES_OFFENDING_ACTIVITIES).expect(
        '1',
      ),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_OFFENDING_ACTIVITIES, Value.YES_OFFENDING_ACTIVITIES).expect('2'),
    ])
  })

  it('q3', () => {
    testSection(sectionMapping, 'o7-3', [
      new Given().expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_PEER_PRESSURE, Value.YES).expect('0'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_PEER_PRESSURE, Value.SOME).expect('1'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_PEER_PRESSURE, Value.NO).expect('2'),
    ])
  })

  it('q4', () => {
    testSection(sectionMapping, 'o7-4', [
      new Given().expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_MANIPULATIVE_PREDATORY_BEHAVIOUR, Value.YES).expect('2'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_MANIPULATIVE_PREDATORY_BEHAVIOUR, Value.SOME).expect('1'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_MANIPULATIVE_PREDATORY_BEHAVIOUR, Value.NO).expect('0'),
    ])
  })

  it('q5', () => {
    testSection(sectionMapping, 'o7-5', [
      new Given().expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_STABLE_BEHAVIOUR, Value.YES).expect('0'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_STABLE_BEHAVIOUR, Value.SOMETIMES).expect('1'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_STABLE_BEHAVIOUR, Value.NO).expect('2'),
    ])
  })

  it('q97', () => {
    testSection(sectionMapping, 'o7-97', new PractitionerAnalysisScenarios('THINKING_BEHAVIOURS_ATTITUDES').notes())
  })

  it('q98', () => {
    testSection(
      sectionMapping,
      'o7-98',
      new PractitionerAnalysisScenarios('THINKING_BEHAVIOURS_ATTITUDES').riskOfSeriousHarm(),
    )
  })

  it('q99', () => {
    testSection(
      sectionMapping,
      'o7-99',
      new PractitionerAnalysisScenarios('THINKING_BEHAVIOURS_ATTITUDES').riskOfReoffending(),
    )
  })
})
