/** Port of oasys/datamapping/v1/RelationshipsTest.kt. */

import { Field, Value } from '../../codes'
import { Relationships } from '../../v1.0/relationships'
import { Given, testSection } from '../support/given'
import { PractitionerAnalysisScenarios } from '../support/practitionerAnalysisScenarios'

describe('Relationships', () => {
  const sectionMapping = new Relationships()

  it('q1', () => {
    testSection(sectionMapping, 'o6-1', [
      new Given().expect(null),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_FAMILY_RELATIONSHIP, Value.UNSTABLE_RELATIONSHIP).expect('2'),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_FAMILY_RELATIONSHIP, Value.MIXED_RELATIONSHIP).expect('1'),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_FAMILY_RELATIONSHIP, Value.STABLE_RELATIONSHIP).expect('0'),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_FAMILY_RELATIONSHIP, Value.UNKNOWN).expect('M'),
    ])
  })

  it('q3', () => {
    testSection(sectionMapping, 'o6-3', [
      new Given().expect(null),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_CHILDHOOD, Value.POSITIVE_CHILDHOOD).expect('0'),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_CHILDHOOD, Value.MIXED_CHILDHOOD).expect('1'),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_CHILDHOOD, Value.NEGATIVE_CHILDHOOD).expect('2'),
    ])
  })

  it('q4', () => {
    testSection(sectionMapping, 'o6-4', [
      new Given().expect(null),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_CURRENT_RELATIONSHIP, Value.HAPPY_RELATIONSHIP).expect('0'),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_CURRENT_RELATIONSHIP, Value.CONCERNS_HAPPY_RELATIONSHIP).expect(
        '1',
      ),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_CURRENT_RELATIONSHIP, Value.UNHAPPY_RELATIONSHIP).expect('2'),
    ])
  })

  it('q6', () => {
    testSection(sectionMapping, 'o6-6', [
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_INTIMATE_RELATIONSHIP, Value.STABLE_RELATIONSHIPS).expect('0'),
      new Given(
        Field.PERSONAL_RELATIONSHIPS_COMMUNITY_INTIMATE_RELATIONSHIP,
        Value.POSITIVE_AND_NEGATIVE_RELATIONSHIPS,
      ).expect('1'),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_INTIMATE_RELATIONSHIP, Value.UNSTABLE_RELATIONSHIPS).expect('2'),
    ])
  })

  it('q7da', () => {
    testSection(sectionMapping, 'o6-7da', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE, null).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE, null).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE, Value.YES).expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE, Value.YES).expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE, Value.YES)
        .and(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE, Value.NO)
        .expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE, Value.YES)
        .and(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE, Value.NO)
        .expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE, Value.NO).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE, Value.NO).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE, Value.NO)
        .and(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE, Value.NO)
        .expect('NO'),
    ])
  })

  it('q711da', () => {
    testSection(sectionMapping, 'o6-7-1-1da', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE, null).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE, Value.NO).expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE, Value.YES)
        .and(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE_TYPE, null)
        .expect(null),
      new Given(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE, Value.YES)
        .and(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE_TYPE, Value.INTIMATE_PARTNER)
        .expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE, Value.YES)
        .and(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE_TYPE, Value.FAMILY_MEMBER_AND_INTIMATE_PARTNER)
        .expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE, Value.YES)
        .and(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE_TYPE, Value.FAMILY_MEMBER)
        .expect('NO'),
    ])
  })

  it('q712da', () => {
    testSection(sectionMapping, 'o6-7-1-2da', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE, null).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE, Value.NO).expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE, Value.YES)
        .and(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE_TYPE, null)
        .expect(null),
      new Given(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE, Value.YES)
        .and(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE_TYPE, Value.FAMILY_MEMBER)
        .expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE, Value.YES)
        .and(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE_TYPE, Value.FAMILY_MEMBER_AND_INTIMATE_PARTNER)
        .expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE, Value.YES)
        .and(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE_TYPE, Value.INTIMATE_PARTNER)
        .expect('NO'),
    ])
  })

  it('q721da', () => {
    testSection(sectionMapping, 'o6-7-2-1da', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE, null).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE, Value.NO).expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE, Value.YES)
        .and(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE_TYPE, null)
        .expect(null),
      new Given(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE, Value.YES)
        .and(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE_TYPE, Value.INTIMATE_PARTNER)
        .expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE, Value.YES)
        .and(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE_TYPE, Value.FAMILY_MEMBER_AND_INTIMATE_PARTNER)
        .expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE, Value.YES)
        .and(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE_TYPE, Value.FAMILY_MEMBER)
        .expect('NO'),
    ])
  })

  it('q722da', () => {
    testSection(sectionMapping, 'o6-7-2-2da', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE, null).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE, Value.NO).expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE, Value.YES)
        .and(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE_TYPE, null)
        .expect(null),
      new Given(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE, Value.YES)
        .and(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE_TYPE, Value.FAMILY_MEMBER)
        .expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE, Value.YES)
        .and(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE_TYPE, Value.FAMILY_MEMBER_AND_INTIMATE_PARTNER)
        .expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE, Value.YES)
        .and(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE_TYPE, Value.INTIMATE_PARTNER)
        .expect('NO'),
    ])
  })

  it('q8', () => {
    testSection(sectionMapping, 'o6-8', [
      new Given().expect('3'),
      new Given(Field.LIVING_WITH, []).expect('3'),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_IMPORTANT_PEOPLE, []).expect('3'),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_IMPORTANT_PEOPLE, [Value.PARTNER_INTIMATE_RELATIONSHIP]).expect(
        '2',
      ),
      new Given(Field.LIVING_WITH, [Value.PARTNER]).expect('1'),
      new Given(Field.LIVING_WITH, [])
        .and(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_IMPORTANT_PEOPLE, [Value.PARTNER_INTIMATE_RELATIONSHIP])
        .expect('2'),
      new Given(Field.LIVING_WITH, []).and(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_IMPORTANT_PEOPLE, []).expect('3'),
    ])
  })

  it('q9', () => {
    testSection(sectionMapping, 'o6-9', [
      new Given().expect(null),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_IMPORTANT_PEOPLE, []).expect('NO'),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_IMPORTANT_PEOPLE, [
        Value.CHILD_PARENTAL_RESPONSIBILITIES,
      ]).expect('YES'),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_IMPORTANT_PEOPLE, [
        Value.OTHER,
        Value.CHILD_PARENTAL_RESPONSIBILITIES,
      ]).expect('YES'),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_IMPORTANT_PEOPLE, [Value.FAMILY]).expect('NO'),
    ])
  })

  it('q10', () => {
    testSection(sectionMapping, 'o6-10', [
      new Given().expect(null),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_PARENTAL_RESPONSIBILITIES, Value.NO).expect(
        'Significantproblems',
      ),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_PARENTAL_RESPONSIBILITIES, Value.SOMETIMES).expect(
        'Someproblems',
      ),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_PARENTAL_RESPONSIBILITIES, Value.YES).expect('Noproblems'),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_PARENTAL_RESPONSIBILITIES, Value.UNKNOWN).expect(null),
    ])
  })

  it('q11', () => {
    testSection(sectionMapping, 'o6-11', [
      new Given().expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_RISK_SEXUAL_HARM, Value.YES).expect('YES'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_RISK_SEXUAL_HARM, Value.NO).expect('NO'),
    ])
  })

  it('q12', () => {
    testSection(sectionMapping, 'o6-12', [
      new Given().expect(null),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_EMOTIONAL_INTIMACY, Value.YES).expect('2'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_EMOTIONAL_INTIMACY, Value.SOMETIMES).expect('1'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_EMOTIONAL_INTIMACY, Value.NO).expect('0'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_EMOTIONAL_INTIMACY, Value.UNKNOWN).expect(null),
    ])
  })

  it('q97', () => {
    testSection(sectionMapping, 'o6-97', new PractitionerAnalysisScenarios('PERSONAL_RELATIONSHIPS_COMMUNITY').notes())
  })

  it('q98', () => {
    testSection(
      sectionMapping,
      'o6-98',
      new PractitionerAnalysisScenarios('PERSONAL_RELATIONSHIPS_COMMUNITY').riskOfSeriousHarm(),
    )
  })

  it('q99', () => {
    testSection(
      sectionMapping,
      'o6-99',
      new PractitionerAnalysisScenarios('PERSONAL_RELATIONSHIPS_COMMUNITY').riskOfReoffending(),
    )
  })

  it('qStrength', () => {
    testSection(
      sectionMapping,
      'o6_SAN_STRENGTH',
      new PractitionerAnalysisScenarios('PERSONAL_RELATIONSHIPS_COMMUNITY').strengthsOrProtectiveFactors(),
    )
  })
})
