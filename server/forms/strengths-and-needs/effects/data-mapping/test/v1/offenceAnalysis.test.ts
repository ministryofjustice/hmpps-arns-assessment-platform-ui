/** Port of oasys/datamapping/v1/OffenceAnalysisTest.kt. */

import { Field, fieldLower, Value } from '../../codes'
import { AnswerType, type Answers } from '../../answers'
import { OffenceAnalysis } from '../../v1/offenceAnalysis'
import { Given, testSection } from '../support/given'

describe('OffenceAnalysis', () => {
  const sectionMapping = new OffenceAnalysis()

  it('q1', () => {
    testSection(sectionMapping, 'o2-1', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_DESCRIPTION_OF_OFFENCE, null).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_DESCRIPTION_OF_OFFENCE, 'Test').expect('Test'),
    ])
  })

  it('q2Weapon', () => {
    testSection(sectionMapping, 'o2-2_V2_WEAPON', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, null).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, []).expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, [Value.WEAPON]).expect('YES'),
    ])
  })

  it('q2ViolenceOrCoercion', () => {
    testSection(sectionMapping, 'o2-2_V2_ANYVIOL', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, []).expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, [Value.VIOLENCE_OR_COERCION]).expect('YES'),
    ])
  })

  it('q2Arson', () => {
    testSection(sectionMapping, 'o2-2_V2_ARSON', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, []).expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, [Value.ARSON]).expect('YES'),
    ])
  })

  it('q2DomesticAbuse', () => {
    testSection(sectionMapping, 'o2-2_V2_DOM_ABUSE', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, []).expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, [Value.DOMESTIC_ABUSE]).expect('YES'),
    ])
  })

  it('q2ExcessiveOrSadisticViolence', () => {
    testSection(sectionMapping, 'o2-2_V2_EXCESSIVE', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, []).expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, [Value.EXCESSIVE_OR_SADISTIC_VIOLENCE]).expect('YES'),
    ])
  })

  it('q2PhysicalDamageToProperty', () => {
    testSection(sectionMapping, 'o2-2_V2_PHYSICALDAM', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, []).expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, [Value.PHYSICAL_DAMAGE_TO_PROPERTY]).expect('YES'),
    ])
  })

  it('q2SexualElement', () => {
    testSection(sectionMapping, 'o2-2_V2_SEXUAL', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, []).expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, [Value.SEXUAL_ELEMENT]).expect('YES'),
    ])
  })

  it('q3', () => {
    testSection(sectionMapping, 'o2-3', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, []).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, [Value.VICTIM_TARGETED]).expect('DIRECTCONT'),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, [Value.HATRED_OF_IDENTIFIABLE_GROUPS]).expect('HATE'),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, [Value.VICTIM_TARGETED, Value.HATRED_OF_IDENTIFIABLE_GROUPS]).expect(
        'DIRECTCONT,HATE',
      ),
      Given.aCollectionOf(Field.OFFENCE_ANALYSIS_VICTIMS_COLLECTION, [
        {
          [fieldLower(Field.OFFENCE_ANALYSIS_VICTIM_RELATIONSHIP)]: {
            type: AnswerType.RADIO,
            description: '',
            value: 'STRANGER',
          },
        },
      ]).expect('STRANGERS'),
      Given.aCollectionOf(Field.OFFENCE_ANALYSIS_VICTIMS_COLLECTION, [
        {
          [fieldLower(Field.OFFENCE_ANALYSIS_VICTIM_RELATIONSHIP)]: {
            type: AnswerType.RADIO,
            description: '',
            value: 'STRANGER',
          },
        },
      ])
        .and(Field.OFFENCE_ANALYSIS_ELEMENTS, [Value.VICTIM_TARGETED, Value.HATRED_OF_IDENTIFIABLE_GROUPS])
        .expect('DIRECTCONT,HATE,STRANGERS'),
    ])
  })

  it('q6', () => {
    testSection(sectionMapping, 'o2-6', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_IMPACT_ON_VICTIMS, '').expect(null),
      new Given(Field.OFFENCE_ANALYSIS_IMPACT_ON_VICTIMS, Value.YES).expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_IMPACT_ON_VICTIMS, Value.NO).expect('NO'),
    ])
  })

  it('q7', () => {
    testSection(sectionMapping, 'o2-7', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED, '').expect(null),
      new Given(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED, Value.NONE).expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED, Value.ONE).expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED, Value.TWO).expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED, Value.THREE).expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED, Value.FOUR).expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED, Value.FIVE).expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED, Value.SIX_TO_10).expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED, Value.ELEVEN_TO_15).expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED, Value.MORE_THAN_15).expect('YES'),
    ])
  })

  it('q71', () => {
    testSection(sectionMapping, 'o2-7-1', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED, '').expect(null),
      new Given(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED, Value.NONE).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED, Value.ONE).expect('110'),
      new Given(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED, Value.TWO).expect('120'),
      new Given(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED, Value.THREE).expect('130'),
      new Given(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED, Value.FOUR).expect('140'),
      new Given(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED, Value.FIVE).expect('150'),
      new Given(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED, Value.SIX_TO_10).expect('160'),
      new Given(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED, Value.ELEVEN_TO_15).expect('170'),
      new Given(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED, Value.MORE_THAN_15).expect('180'),
    ])
  })

  it('q72', () => {
    testSection(sectionMapping, 'o2-7-2', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS, []).expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS, [Value.PRESSURISED_BY_OTHERS]).expect('YES'),
    ])
  })

  it('q73', () => {
    testSection(sectionMapping, 'o2-7-3', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_LEADER, null).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_LEADER, Value.NO).expect('No'),
      new Given(Field.OFFENCE_ANALYSIS_LEADER, Value.NO)
        .and(Field.OFFENCE_ANALYSIS_LEADER_NO_DETAILS, 'some details')
        .expect('No - some details'),
      new Given(Field.OFFENCE_ANALYSIS_LEADER, Value.YES).expect('Yes'),
      new Given(Field.OFFENCE_ANALYSIS_LEADER, Value.YES)
        .and(Field.OFFENCE_ANALYSIS_LEADER_YES_DETAILS, 'some details')
        .expect('Yes - some details'),
    ])
  })

  it('q8', () => {
    testSection(sectionMapping, 'o2-8', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_REASON, null).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_REASON, '').expect(''),
      new Given(Field.OFFENCE_ANALYSIS_REASON, 'Some details').expect('Some details'),
    ])
  })

  it('q9SexualMotivations', () => {
    testSection(sectionMapping, 'o2-9_V2_SEXUAL', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS, []).expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS, [Value.SEXUAL_MOTIVATION]).expect('YES'),
    ])
  })

  it('q9FinancialMotivations', () => {
    testSection(sectionMapping, 'o2-9_V2_FINANCIAL', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS, []).expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS, [Value.FINANCIAL_MOTIVATION]).expect('YES'),
    ])
  })

  it('q9AddictionMotivations', () => {
    testSection(sectionMapping, 'o2-9_V2_ADDICTION', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS, []).expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS, [Value.ADDICTIONS_OR_PERCEIVED_NEEDS]).expect('YES'),
    ])
  })

  it('q9EmotionalMotivations', () => {
    testSection(sectionMapping, 'o2-9_V2_EMOTIONAL', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS, []).expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS, [Value.EMOTIONAL_STATE]).expect('YES'),
    ])
  })

  it('q9RacialMotivations', () => {
    testSection(sectionMapping, 'o2-9_V2_RACIAL', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS, []).expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS, [Value.HATRED_OF_IDENTIFIABLE_GROUPS]).expect('YES'),
    ])
  })

  it('q29ThrillMotivations', () => {
    testSection(sectionMapping, 'o2-9_V2_THRILL', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS, []).expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS, [Value.THRILL_SEEKING]).expect('YES'),
    ])
  })

  it('q29OtherMotivations', () => {
    testSection(sectionMapping, 'o2-9_V2_OTHER', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS, []).expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS, [Value.OTHER]).expect('YES'),
    ])
  })

  it('q29t', () => {
    testSection(sectionMapping, 'o2-9-t_V2', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS_OTHER_DETAILS, null).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS_OTHER_DETAILS, '').expect(''),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS_OTHER_DETAILS, 'Some details').expect('Some details'),
    ])
  })

  it('q11', () => {
    testSection(sectionMapping, 'o2-11', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_ACCEPT_RESPONSIBILITY, null).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_ACCEPT_RESPONSIBILITY, 'YES').expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_ACCEPT_RESPONSIBILITY, 'NO').expect('NO'),
    ])
  })

  it('q11t', () => {
    testSection(sectionMapping, 'o2-11-t', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_ACCEPT_RESPONSIBILITY, null).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_ACCEPT_RESPONSIBILITY, '').expect(null),
      new Given(Field.OFFENCE_ANALYSIS_ACCEPT_RESPONSIBILITY, 'YES')
        .and(Field.OFFENCE_ANALYSIS_ACCEPT_RESPONSIBILITY_YES_DETAILS, 'Some details')
        .expect('Some details'),
      new Given(Field.OFFENCE_ANALYSIS_ACCEPT_RESPONSIBILITY, 'NO')
        .and(Field.OFFENCE_ANALYSIS_ACCEPT_RESPONSIBILITY_NO_DETAILS, 'Some details')
        .expect('Some details'),
    ])
  })

  it('q12', () => {
    testSection(sectionMapping, 'o2-12', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_PATTERNS_OF_OFFENDING, null).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_PATTERNS_OF_OFFENDING, '').expect(''),
      new Given(Field.OFFENCE_ANALYSIS_PATTERNS_OF_OFFENDING, 'Some details').expect('Some details'),
    ])
  })

  it('q13', () => {
    testSection(sectionMapping, 'o2-13', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_ESCALATION, null).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_ESCALATION, '').expect(null),
      new Given(Field.OFFENCE_ANALYSIS_ESCALATION, 'YES').expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_ESCALATION, 'NO').expect('NO'),
    ])
  })

  it('q98', () => {
    testSection(sectionMapping, 'o2-98', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_RISK, null).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_RISK, '').expect(null),
      new Given(Field.OFFENCE_ANALYSIS_RISK, 'YES')
        .and(Field.OFFENCE_ANALYSIS_RISK_YES_DETAILS, 'Some details')
        .expect('Some details'),
      new Given(Field.OFFENCE_ANALYSIS_RISK, 'NO')
        .and(Field.OFFENCE_ANALYSIS_RISK_NO_DETAILS, 'Some details')
        .expect('Some details'),
    ])
  })

  it('q99', () => {
    testSection(sectionMapping, 'o2-99', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_RISK, null).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_RISK, '').expect(null),
      new Given(Field.OFFENCE_ANALYSIS_RISK, 'YES').expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_RISK, 'NO').expect('NO'),
    ])
  })

  it('victimAge', () => {
    const cases: [string, string | null][] = [
      [Value.AGE_0_TO_4_YEARS, '0'],
      [Value.AGE_5_TO_11_YEARS, '1'],
      [Value.AGE_12_TO_15_YEARS, '2'],
      [Value.AGE_16_TO_17_YEARS, '3'],
      [Value.AGE_18_TO_20_YEARS, '4'],
      [Value.AGE_21_TO_25_YEARS, '5'],
      [Value.AGE_26_TO_49_YEARS, '6'],
      [Value.AGE_50_TO_64_YEARS, '7'],
      [Value.AGE_65_AND_OVER, '8'],
    ]

    cases.forEach(([givenValue, expectedValue]) => {
      const entries: Answers[] = [
        {
          [fieldLower(Field.OFFENCE_ANALYSIS_VICTIM_AGE)]: {
            type: AnswerType.RADIO,
            description: '',
            value: givenValue,
          },
        },
      ]

      const expectedEntry = {
        oAGE_OF_VICTIM_ELM: expectedValue,
        oGENDER_ELM: null,
        oETHNIC_CATEGORY_ELM: null,
        oVICTIM_RELATION_ELM: null,
      }

      testSection(sectionMapping, 'victim0', [
        Given.aCollectionOf(Field.OFFENCE_ANALYSIS_VICTIMS_COLLECTION, entries).expect(expectedEntry),
      ])
    })
  })

  it('victimGender', () => {
    const cases: [string, string | null][] = [
      [Value.MALE, '1'],
      [Value.FEMALE, '2'],
      [Value.INTERSEX, null],
      [Value.UNKNOWN, '0'],
    ]

    cases.forEach(([givenValue, expectedValue]) => {
      const entries: Answers[] = [
        {
          [fieldLower(Field.OFFENCE_ANALYSIS_VICTIM_SEX)]: {
            type: AnswerType.RADIO,
            description: '',
            value: givenValue,
          },
        },
      ]

      const expectedEntry = {
        oAGE_OF_VICTIM_ELM: null,
        oGENDER_ELM: expectedValue,
        oETHNIC_CATEGORY_ELM: null,
        oVICTIM_RELATION_ELM: null,
      }

      testSection(sectionMapping, 'victim0', [
        Given.aCollectionOf(Field.OFFENCE_ANALYSIS_VICTIMS_COLLECTION, entries).expect(expectedEntry),
      ])
    })
  })

  it('victimRace', () => {
    const cases: [string, string][] = [
      [Value.WHITE_ENGLISH_WELSH_SCOTTISH_NORTHERN_IRISH_OR_BRITISH, 'W1'],
      [Value.WHITE_IRISH, 'W2'],
      [Value.WHITE_GYPSY_OR_IRISH_TRAVELLER, 'W4'],
      [Value.WHITE_ROMA, 'W5'],
      [Value.WHITE_ANY_OTHER_WHITE_BACKGROUND, 'W9'],
      [Value.MIXED_WHITE_AND_BLACK_CARIBBEAN, 'M1'],
      [Value.MIXED_WHITE_AND_BLACK_AFRICAN, 'M2'],
      [Value.MIXED_WHITE_AND_ASIAN, 'M3'],
      [Value.MIXED_ANY_OTHER_MIXED_OR_MULTIPLE_ETHNIC_BACKGROUND_BACKGROUND, 'M9'],
      [Value.ASIAN_OR_ASIAN_BRITISH_INDIAN, 'A1'],
      [Value.ASIAN_OR_ASIAN_BRITISH_PAKISTANI, 'A2'],
      [Value.ASIAN_OR_ASIAN_BRITISH_BANGLADESHI, 'A3'],
      [Value.ASIAN_OR_ASIAN_BRITISH_CHINESE, 'A4'],
      [Value.ASIAN_OR_ASIAN_BRITISH_ANY_OTHER_ASIAN_BACKGROUND, 'A9'],
      [Value.BLACK_OR_BLACK_BRITISH_CARIBBEAN, 'B1'],
      [Value.BLACK_OR_BLACK_BRITISH_AFRICAN, 'B2'],
      [Value.BLACK_OR_BLACK_BRITISH_ANY_OTHER_BLACK_BACKGROUND, 'B9'],
      [Value.ARAB, 'O2'],
      [Value.ANY_OTHER_ETHNIC_GROUP, 'O9'],
      [Value.UNKNOWN, 'NS'],
    ]

    cases.forEach(([givenValue, expectedValue]) => {
      const entries: Answers[] = [
        {
          [fieldLower(Field.OFFENCE_ANALYSIS_VICTIM_RACE)]: {
            type: AnswerType.RADIO,
            description: '',
            value: givenValue,
          },
        },
      ]

      const expectedEntry = {
        oAGE_OF_VICTIM_ELM: null,
        oGENDER_ELM: null,
        oETHNIC_CATEGORY_ELM: expectedValue,
        oVICTIM_RELATION_ELM: null,
      }

      testSection(sectionMapping, 'victim0', [
        Given.aCollectionOf(Field.OFFENCE_ANALYSIS_VICTIMS_COLLECTION, entries).expect(expectedEntry),
      ])
    })
  })

  it('victimRelationship', () => {
    const cases: [string, string][] = [
      [Value.STRANGER, '0'],
      [Value.CRIMINAL_JUSTICE_STAFF, '12'],
      [Value.POP_PARENT_OR_STEP_PARENT, '14'],
      [Value.POP_EX_PARTNER, '15'],
      [Value.POP_CHILD_OR_STEP_CHILD, '5'],
      [Value.OTHER_FAMILY_MEMBER, '6'],
      [Value.POP_PARTNER, '1'],
      [Value.OTHER, '13'],
    ]

    cases.forEach(([givenValue, expectedValue]) => {
      const entries: Answers[] = [
        {
          [fieldLower(Field.OFFENCE_ANALYSIS_VICTIM_RELATIONSHIP)]: {
            type: AnswerType.RADIO,
            description: '',
            value: givenValue,
          },
        },
      ]

      const expectedEntry = {
        oAGE_OF_VICTIM_ELM: null,
        oGENDER_ELM: null,
        oETHNIC_CATEGORY_ELM: null,
        oVICTIM_RELATION_ELM: expectedValue,
      }

      testSection(sectionMapping, 'victim0', [
        Given.aCollectionOf(Field.OFFENCE_ANALYSIS_VICTIMS_COLLECTION, entries).expect(expectedEntry),
      ])
    })
  })
})
