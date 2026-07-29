/** Port of oasys/datamapping/v1/ThinkingBehavioursTest.kt. */

import { Field, Value } from '../../codes'
import { ThinkingBehaviours } from '../../v1/thinkingBehaviours'
import { Given, testSection } from '../support/given'
import { PractitionerAnalysisScenarios } from '../support/practitionerAnalysisScenarios'

describe('ThinkingBehaviours', () => {
  const sectionMapping = new ThinkingBehaviours()

  it('q2', () => {
    testSection(sectionMapping, 'o11-2', [
      new Given().expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_IMPULSIVE_BEHAVIOUR, null).expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_IMPULSIVE_BEHAVIOUR, Value.NO).expect('0'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_IMPULSIVE_BEHAVIOUR, Value.SOMETIMES).expect('1'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_IMPULSIVE_BEHAVIOUR, Value.YES).expect('2'),
    ])
  })

  it('q3', () => {
    testSection(sectionMapping, 'o11-3', [
      new Given().expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_VIOLENCE_CONTROLLING_BEHAVIOUR, null).expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_VIOLENCE_CONTROLLING_BEHAVIOUR, Value.NO_VIOLENCE).expect('0'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_VIOLENCE_CONTROLLING_BEHAVIOUR, Value.SOMETIMES).expect('1'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_VIOLENCE_CONTROLLING_BEHAVIOUR, Value.YES_VIOLENCE).expect('2'),
    ])
  })

  it('q4', () => {
    testSection(sectionMapping, 'o11-4', [
      new Given().expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_TEMPER_MANAGEMENT, null).expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_TEMPER_MANAGEMENT, Value.YES).expect('0'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_TEMPER_MANAGEMENT, Value.SOMETIMES).expect('1'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_TEMPER_MANAGEMENT, Value.NO).expect('2'),
    ])
  })

  it('q6', () => {
    testSection(sectionMapping, 'o11-6', [
      new Given().expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_PROBLEM_SOLVING, null).expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_PROBLEM_SOLVING, Value.YES).expect('0'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_PROBLEM_SOLVING, Value.LIMITED_PROBLEM_SOLVING).expect('1'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_PROBLEM_SOLVING, Value.NO).expect('2'),
    ])
  })

  it('q7', () => {
    testSection(sectionMapping, 'o11-7', [
      new Given().expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_CONSEQUENCES, null).expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_CONSEQUENCES, Value.YES).expect('0'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_CONSEQUENCES, Value.SOMETIMES).expect('1'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_CONSEQUENCES, Value.NO).expect('2'),
    ])
  })

  it('q9', () => {
    testSection(sectionMapping, 'o11-9', [
      new Given().expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_PEOPLES_VIEWS, null).expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_PEOPLES_VIEWS, Value.YES).expect('0'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_PEOPLES_VIEWS, Value.SOMETIMES).expect('1'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_PEOPLES_VIEWS, Value.NO).expect('2'),
    ])
  })

  it('q11', () => {
    testSection(sectionMapping, 'o11-11', [
      new Given().expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_SEXUAL_PREOCCUPATION, null).expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_SEXUAL_PREOCCUPATION, Value.YES).expect('2'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_SEXUAL_PREOCCUPATION, Value.SOMETIMES).expect('1'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_SEXUAL_PREOCCUPATION, Value.NO).expect('0'),
    ])
  })

  it('q12', () => {
    testSection(sectionMapping, 'o11-12', [
      new Given().expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_OFFENCE_RELATED_SEXUAL_INTEREST, null).expect(null),
      new Given(
        Field.THINKING_BEHAVIOURS_ATTITUDES_OFFENCE_RELATED_SEXUAL_INTEREST,
        Value.YES_OFFENCE_RELATED_SEXUAL_INTEREST,
      ).expect('2'),
      new Given(
        Field.THINKING_BEHAVIOURS_ATTITUDES_OFFENCE_RELATED_SEXUAL_INTEREST,
        Value.SOME_OFFENCE_RELATED_SEXUAL_INTEREST,
      ).expect('1'),
      new Given(
        Field.THINKING_BEHAVIOURS_ATTITUDES_OFFENCE_RELATED_SEXUAL_INTEREST,
        Value.NO_OFFENCE_RELATED_SEXUAL_INTEREST,
      ).expect('0'),
    ])
  })

  it('q97', () => {
    testSection(sectionMapping, 'o11-97', new PractitionerAnalysisScenarios('THINKING_BEHAVIOURS_ATTITUDES').notes())
  })

  it('q98', () => {
    testSection(
      sectionMapping,
      'o11-98',
      new PractitionerAnalysisScenarios('THINKING_BEHAVIOURS_ATTITUDES').riskOfSeriousHarm(),
    )
  })

  it('q99', () => {
    testSection(
      sectionMapping,
      'o11-99',
      new PractitionerAnalysisScenarios('THINKING_BEHAVIOURS_ATTITUDES').riskOfReoffending(),
    )
  })
})
