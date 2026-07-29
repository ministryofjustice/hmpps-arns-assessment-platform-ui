/** Port of oasys/datamapping/v1/EmotionalWellbeingTest.kt. */

import { Field, Value } from '../../codes'
import { EmotionalWellbeing } from '../../v1/emotionalWellbeing'
import { Given, testSection } from '../support/given'
import { PractitionerAnalysisScenarios } from '../support/practitionerAnalysisScenarios'

describe('EmotionalWellbeing', () => {
  const sectionMapping = new EmotionalWellbeing()

  it('q1', () => {
    testSection(sectionMapping, 'o10-1', [
      new Given().expect(null),
      new Given(Field.HEALTH_WELLBEING_COPING_DAY_TO_DAY_LIFE, Value.YES).expect('0'),
      new Given(Field.HEALTH_WELLBEING_COPING_DAY_TO_DAY_LIFE, Value.YES_SOME_DIFFICULTIES).expect('1'),
      new Given(Field.HEALTH_WELLBEING_COPING_DAY_TO_DAY_LIFE, Value.NO).expect('2'),
    ])
  })

  it('q2', () => {
    testSection(sectionMapping, 'o10-2', [
      new Given().expect(null),
      new Given(Field.HEALTH_WELLBEING_MENTAL_HEALTH_CONDITION, Value.YES_ONGOING_SEVERE).expect('2'),
      new Given(Field.HEALTH_WELLBEING_MENTAL_HEALTH_CONDITION, Value.YES_ONGOING).expect('1'),
      new Given(Field.HEALTH_WELLBEING_MENTAL_HEALTH_CONDITION, Value.YES_IN_THE_PAST).expect('1'),
      new Given(Field.HEALTH_WELLBEING_MENTAL_HEALTH_CONDITION, Value.NO).expect('0'),
    ])
  })

  it('q4', () => {
    testSection(sectionMapping, 'o10-4', [
      new Given().expect(null),
      new Given(Field.HEALTH_WELLBEING_ATTITUDE_TOWARDS_SELF, Value.POSITIVE).expect('0'),
      new Given(Field.HEALTH_WELLBEING_ATTITUDE_TOWARDS_SELF, Value.SOME_NEGATIVE_ASPECTS).expect('1'),
      new Given(Field.HEALTH_WELLBEING_ATTITUDE_TOWARDS_SELF, Value.NEGATIVE).expect('2'),
    ])
  })

  it('q5', () => {
    testSection(sectionMapping, 'o10-5', [
      new Given().expect(null),
      new Given(Field.HEALTH_WELLBEING_ATTEMPTED_SUICIDE_OR_SUICIDAL_THOUGHTS, Value.YES).expect('YES'),
      new Given(Field.HEALTH_WELLBEING_SELF_HARMED, Value.YES).expect('YES'),
      new Given(Field.HEALTH_WELLBEING_SELF_HARMED, Value.NO)
        .and(Field.HEALTH_WELLBEING_ATTEMPTED_SUICIDE_OR_SUICIDAL_THOUGHTS, Value.YES)
        .expect('YES'),
      new Given(Field.HEALTH_WELLBEING_SELF_HARMED, Value.YES)
        .and(Field.HEALTH_WELLBEING_ATTEMPTED_SUICIDE_OR_SUICIDAL_THOUGHTS, Value.NO)
        .expect('YES'),
      new Given(Field.HEALTH_WELLBEING_ATTEMPTED_SUICIDE_OR_SUICIDAL_THOUGHTS, Value.NO).expect('NO'),
      new Given(Field.HEALTH_WELLBEING_SELF_HARMED, Value.NO).expect('NO'),
      new Given(Field.HEALTH_WELLBEING_SELF_HARMED, Value.NO)
        .and(Field.HEALTH_WELLBEING_ATTEMPTED_SUICIDE_OR_SUICIDAL_THOUGHTS, Value.NO)
        .expect('NO'),
    ])
  })

  it('q6', () => {
    testSection(sectionMapping, 'o10-6', [
      new Given().expect(null),
      new Given(Field.HEALTH_WELLBEING_MENTAL_HEALTH_CONDITION, Value.YES_ONGOING_SEVERE).expect('2'),
      new Given(Field.HEALTH_WELLBEING_MENTAL_HEALTH_CONDITION, Value.YES_ONGOING).expect('1'),
      new Given(Field.HEALTH_WELLBEING_MENTAL_HEALTH_CONDITION, Value.YES_IN_THE_PAST).expect('1'),
      new Given(Field.HEALTH_WELLBEING_MENTAL_HEALTH_CONDITION, Value.NO).expect('0'),
    ])
  })

  it('qChildhoodBehaviouralProblems', () => {
    testSection(sectionMapping, 'o10-7_V2_CHILDHOOD', [
      new Given().expect(null),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_CHILDHOOD_BEHAVIOUR, Value.YES).expect('YES'),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_CHILDHOOD_BEHAVIOUR, Value.NO).expect('NO'),
    ])
  })

  it('qHistoryOfHeadInjury', () => {
    testSection(sectionMapping, 'o10-7_V2_HISTHEADINJ', [
      new Given().expect(null),
      new Given(Field.HEALTH_WELLBEING_HEAD_INJURY_OR_ILLNESS, Value.YES).expect('YES'),
      new Given(Field.HEALTH_WELLBEING_HEAD_INJURY_OR_ILLNESS, Value.NO).expect('NO'),
    ])
  })

  it('qHistoryOfPsychTreatment', () => {
    testSection(sectionMapping, 'o10-7_V2_HISTPSYCH', [
      new Given().expect(null),
      new Given(Field.HEALTH_WELLBEING_MENTAL_HEALTH_CONDITION, Value.YES_ONGOING_SEVERE).expect('YES'),
      new Given(Field.HEALTH_WELLBEING_MENTAL_HEALTH_CONDITION, Value.YES_ONGOING).expect('YES'),
      new Given(Field.HEALTH_WELLBEING_MENTAL_HEALTH_CONDITION, Value.YES_IN_THE_PAST).expect('YES'),
      new Given(Field.HEALTH_WELLBEING_MENTAL_HEALTH_CONDITION, Value.NO).expect('NO'),
    ])
  })

  it('qCurrentPsychTreatment', () => {
    testSection(sectionMapping, 'o10-7_V2_PSYCHTREAT', [
      new Given().expect(null),
      new Given(Field.HEALTH_WELLBEING_PSYCHIATRIC_TREATMENT, Value.YES).expect('YES'),
      new Given(Field.HEALTH_WELLBEING_PSYCHIATRIC_TREATMENT, Value.PENDING_TREATMENT).expect('YES'),
      new Given(Field.HEALTH_WELLBEING_PSYCHIATRIC_TREATMENT, Value.NO).expect('NO'),
      new Given(Field.HEALTH_WELLBEING_PSYCHIATRIC_TREATMENT, Value.UNKNOWN).expect('NO'),
      new Given(Field.HEALTH_WELLBEING_MENTAL_HEALTH_CONDITION, Value.NO).expect('NO'),
      new Given(Field.HEALTH_WELLBEING_MENTAL_HEALTH_CONDITION, Value.UNKNOWN).expect('NO'),
      new Given(Field.HEALTH_WELLBEING_MENTAL_HEALTH_CONDITION, Value.NO)
        .and(Field.HEALTH_WELLBEING_PSYCHIATRIC_TREATMENT, Value.YES)
        .expect('NO'),
    ])
  })

  it('q97', () => {
    testSection(sectionMapping, 'o10-97', new PractitionerAnalysisScenarios('HEALTH_WELLBEING').notes())
  })

  it('q98', () => {
    testSection(sectionMapping, 'o10-98', new PractitionerAnalysisScenarios('HEALTH_WELLBEING').riskOfSeriousHarm())
  })

  it('q99', () => {
    testSection(sectionMapping, 'o10-99', new PractitionerAnalysisScenarios('HEALTH_WELLBEING').riskOfReoffending())
  })

  it('qStrength', () => {
    testSection(
      sectionMapping,
      'o10_SAN_STRENGTH',
      new PractitionerAnalysisScenarios('HEALTH_WELLBEING').strengthsOrProtectiveFactors(),
    )
  })
})
