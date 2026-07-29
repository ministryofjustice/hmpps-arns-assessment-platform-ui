/** Port of oasys/datamapping/v1/EducationTest.kt. */

import { Field, Value } from '../../codes'
import { Education } from '../../v1/education'
import { Given, testSection } from '../support/given'
import { PractitionerAnalysisScenarios } from '../support/practitionerAnalysisScenarios'

describe('Education', () => {
  const sectionMapping = new Education()

  it('q2', () => {
    testSection(sectionMapping, 'o4-2', [
      new Given().expect(null),
      new Given(Field.EMPLOYMENT_STATUS, null).expect(null),
      new Given(Field.EMPLOYMENT_STATUS, Value.UNEMPLOYED_LOOKING_FOR_WORK).expect('YES'),
      new Given(Field.EMPLOYMENT_STATUS, Value.UNEMPLOYED_NOT_LOOKING_FOR_WORK).expect('YES'),
      new Given(Field.EMPLOYMENT_STATUS, Value.EMPLOYED).expect('NO'),
      new Given(Field.EMPLOYMENT_STATUS, Value.SELF_EMPLOYED).expect('NO'),
      new Given(Field.EMPLOYMENT_STATUS, Value.RETIRED).expect('NA'),
      new Given(Field.EMPLOYMENT_STATUS, Value.CURRENTLY_UNAVAILABLE_FOR_WORK).expect('NA'),
    ])
  })

  it('q3', () => {
    testSection(sectionMapping, 'o4-3', [
      new Given().expect(null),
      new Given(Field.EMPLOYMENT_STATUS, null).expect(null),
      new Given(Field.EMPLOYMENT_STATUS, Value.UNEMPLOYED_NOT_LOOKING_FOR_WORK)
        .and(Field.HAS_BEEN_EMPLOYED, Value.NO)
        .expect('2'),
      new Given(Field.EMPLOYMENT_STATUS, Value.UNEMPLOYED_LOOKING_FOR_WORK)
        .and(Field.HAS_BEEN_EMPLOYED, Value.NO)
        .expect('2'),
      new Given(Field.EMPLOYMENT_HISTORY, Value.STABLE).expect('0'),
      new Given(Field.EMPLOYMENT_HISTORY, Value.PERIODS_OF_INSTABILITY).expect('1'),
      new Given(Field.EMPLOYMENT_HISTORY, Value.UNSTABLE).expect('2'),
      new Given(Field.EMPLOYMENT_HISTORY, Value.UNKNOWN).expect('M'),
    ])
  })

  it('q4', () => {
    testSection(sectionMapping, 'o4-4', [
      new Given().expect(null),
      new Given(Field.EDUCATION_TRANSFERABLE_SKILLS, null).expect(null),
      new Given(Field.EDUCATION_TRANSFERABLE_SKILLS, Value.NO).expect('2'),
      new Given(Field.EDUCATION_TRANSFERABLE_SKILLS, Value.YES_SOME_SKILLS).expect('1'),
      new Given(Field.EDUCATION_TRANSFERABLE_SKILLS, Value.YES).expect('0'),
    ])
  })

  it('q7', () => {
    testSection(sectionMapping, 'o4-7', [
      new Given().expect(null),
      new Given(Field.EDUCATION_DIFFICULTIES, []).expect(null),
      new Given(Field.EDUCATION_DIFFICULTIES, [Value.NONE]).expect('0'),
      new Given(Field.EDUCATION_DIFFICULTIES, [Value.READING])
        .and(Field.EDUCATION_DIFFICULTIES_READING_SEVERITY, null)
        .expect(null),
      new Given(Field.EDUCATION_DIFFICULTIES, [Value.READING])
        .and(Field.EDUCATION_DIFFICULTIES_READING_SEVERITY, Value.SIGNIFICANT_DIFFICULTIES)
        .expect('2'),
      new Given(Field.EDUCATION_DIFFICULTIES, [Value.READING]).and(Field.EDUCATION_DIFFICULTIES_WRITING_SEVERITY, null).expect(null),
      new Given(Field.EDUCATION_DIFFICULTIES, [Value.WRITING])
        .and(Field.EDUCATION_DIFFICULTIES_WRITING_SEVERITY, Value.SIGNIFICANT_DIFFICULTIES)
        .expect('2'),
      new Given(Field.EDUCATION_DIFFICULTIES, [Value.NUMERACY]).and(Field.EDUCATION_DIFFICULTIES_NUMERACY_SEVERITY, null).expect(null),
      new Given(Field.EDUCATION_DIFFICULTIES, [Value.NUMERACY])
        .and(Field.EDUCATION_DIFFICULTIES_NUMERACY_SEVERITY, Value.SIGNIFICANT_DIFFICULTIES)
        .expect('2'),
      new Given(Field.EDUCATION_DIFFICULTIES, [Value.READING]).and(Field.EDUCATION_DIFFICULTIES_READING_SEVERITY, null).expect(null),
      new Given(Field.EDUCATION_DIFFICULTIES, [Value.READING])
        .and(Field.EDUCATION_DIFFICULTIES_READING_SEVERITY, Value.SOME_DIFFICULTIES)
        .expect('1'),
      new Given(Field.EDUCATION_DIFFICULTIES, [Value.WRITING]).and(Field.EDUCATION_DIFFICULTIES_WRITING_SEVERITY, null).expect(null),
      new Given(Field.EDUCATION_DIFFICULTIES, [Value.WRITING])
        .and(Field.EDUCATION_DIFFICULTIES_WRITING_SEVERITY, Value.SOME_DIFFICULTIES)
        .expect('1'),
      new Given(Field.EDUCATION_DIFFICULTIES, [Value.NUMERACY]).and(Field.EDUCATION_DIFFICULTIES_NUMERACY_SEVERITY, null).expect(null),
      new Given(Field.EDUCATION_DIFFICULTIES, [Value.NUMERACY])
        .and(Field.EDUCATION_DIFFICULTIES_NUMERACY_SEVERITY, Value.SOME_DIFFICULTIES)
        .expect('1'),
      new Given(Field.EDUCATION_DIFFICULTIES, [Value.READING, Value.NUMERACY])
        .and(Field.EDUCATION_DIFFICULTIES_READING_SEVERITY, Value.SIGNIFICANT_DIFFICULTIES)
        .and(Field.EDUCATION_DIFFICULTIES_NUMERACY_SEVERITY, Value.SOME_DIFFICULTIES)
        .expect('2'),
    ])
  })

  it('q71', () => {
    testSection(sectionMapping, 'o4-7-1', [
      new Given().expect(null),
      new Given(Field.EDUCATION_DIFFICULTIES, []).expect(null),
      new Given(Field.EDUCATION_DIFFICULTIES, [Value.NONE]).expect(null),
      new Given(Field.EDUCATION_DIFFICULTIES, [Value.READING]).expect(['READING']),
      new Given(Field.EDUCATION_DIFFICULTIES, [Value.WRITING]).expect(['WRITING']),
      new Given(Field.EDUCATION_DIFFICULTIES, [Value.NUMERACY]).expect(['NUMERACY']),
      new Given(Field.EDUCATION_DIFFICULTIES, [Value.READING, Value.WRITING, Value.NUMERACY]).expect([
        'READING',
        'WRITING',
        'NUMERACY',
      ]),
    ])
  })

  it('q8', () => {
    testSection(sectionMapping, 'o4-8', [
      new Given().expect(null),
      new Given(Field.HEALTH_WELLBEING_LEARNING_DIFFICULTIES, null).expect(null),
      new Given(Field.HEALTH_WELLBEING_LEARNING_DIFFICULTIES, Value.YES_SIGNIFICANT_DIFFICULTIES).expect('2'),
      new Given(Field.HEALTH_WELLBEING_LEARNING_DIFFICULTIES, Value.YES_SOME_DIFFICULTIES).expect('1'),
      new Given(Field.HEALTH_WELLBEING_LEARNING_DIFFICULTIES, Value.NO).expect('0'),
    ])
  })

  it('q9', () => {
    testSection(sectionMapping, 'o4-9', [
      // Generic scenarios
      new Given().expect(null),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, null).expect(null),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, null)
        .and(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS, null)
        .expect(null),
      // Education qualification OR professional or vocational qualification
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.LEVEL_2).expect('0'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.LEVEL_3).expect('0'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.LEVEL_4).expect('0'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.LEVEL_5).expect('0'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.LEVEL_6).expect('0'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.LEVEL_7).expect('0'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.LEVEL_8).expect('0'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.LEVEL_1)
        .and(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS, Value.YES)
        .expect('0'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.NONE_OF_THESE)
        .and(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS, Value.YES)
        .expect('0'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.ENTRY_LEVEL)
        .and(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS, Value.YES)
        .expect('0'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.NOT_SURE)
        .and(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS, Value.YES)
        .expect('0'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, null).and(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS, Value.YES).expect('0'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.NOT_SURE)
        .and(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS, Value.YES)
        .expect('0'),
      // Unknown education qualification and no/unknown professional or vocational qualification
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, null).and(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS, Value.NO).expect(null),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, null).and(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS, null).expect(null),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.NOT_SURE)
        .and(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS, Value.NO)
        .expect(null),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.NOT_SURE)
        .and(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS, null)
        .expect(null),
      // No education qualification AND unknown professional or vocational qualification
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.LEVEL_1).expect(null),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.NONE_OF_THESE).expect(null),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.ENTRY_LEVEL).expect(null),
      // No education qualification AND no professional or vocational qualification
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.LEVEL_1).and(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS, Value.NO).expect('2'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.NONE_OF_THESE)
        .and(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS, Value.NO)
        .expect('2'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.ENTRY_LEVEL)
        .and(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS, Value.NO)
        .expect('2'),
    ])
  })

  it('q10', () => {
    testSection(sectionMapping, 'o4-10', [
      new Given().expect(null),
      new Given(Field.EDUCATION_EXPERIENCE, null).expect(null),
      new Given(Field.EDUCATION_EXPERIENCE, Value.POSITIVE).expect('0'),
      new Given(Field.EDUCATION_EXPERIENCE, Value.MOSTLY_POSITIVE).expect('0'),
      new Given(Field.EDUCATION_EXPERIENCE, Value.POSITIVE_AND_NEGATIVE).expect('1'),
      new Given(Field.EDUCATION_EXPERIENCE, Value.MOSTLY_NEGATIVE).expect('2'),
      new Given(Field.EDUCATION_EXPERIENCE, Value.NEGATIVE).expect('2'),
    ])
  })

  it('q94', () => {
    testSection(sectionMapping, 'o4-94', new PractitionerAnalysisScenarios('EMPLOYMENT_EDUCATION').notes())
  })

  it('q96', () => {
    testSection(sectionMapping, 'o4-96', new PractitionerAnalysisScenarios('EMPLOYMENT_EDUCATION').riskOfSeriousHarm())
  })

  it('q98', () => {
    testSection(sectionMapping, 'o4-98', new PractitionerAnalysisScenarios('EMPLOYMENT_EDUCATION').riskOfReoffending())
  })

  it('qStrength', () => {
    testSection(
      sectionMapping,
      'o4_SAN_STRENGTH',
      new PractitionerAnalysisScenarios('EMPLOYMENT_EDUCATION').strengthsOrProtectiveFactors(),
    )
  })

  it('qSC2', () => {
    testSection(sectionMapping, 'oSC2', [
      new Given().expect(null),
      new Given(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS, Value.YES).expect('YES'),
      new Given(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS, Value.NO).expect('NO'),
    ])
  })

  it('qSC2t', () => {
    testSection(sectionMapping, 'oSC2-t', [
      new Given().expect(null),
      new Given(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS_YES_DETAILS, 'Some details').expect(
        'Some details',
      ),
    ])
  })

  it('qSC3', () => {
    testSection(sectionMapping, 'oSC3', [
      new Given().expect(null),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.NONE_OF_THESE).expect('NOQUAL'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.LEVEL_1).expect('MATHSENGLISH'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.LEVEL_2).expect('MATHSENGLISH'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.LEVEL_3).expect('MATHSENGLISH'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.LEVEL_4).expect('MATHSENGLISH'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.LEVEL_5).expect('MATHSENGLISH'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.LEVEL_6).expect('MATHSENGLISH'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.LEVEL_7).expect('MATHSENGLISH'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.LEVEL_8).expect('MATHSENGLISH'),
      new Given(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED, Value.ENTRY_LEVEL).expect('ANYOTHER'),
    ])
  })

  it('qSC4', () => {
    testSection(sectionMapping, 'oSC4', [
      new Given().expect(null),
      new Given(Field.EMPLOYMENT_STATUS, Value.RETIRED).expect('FULLTIME'),
      new Given(Field.EMPLOYMENT_STATUS, Value.EMPLOYED).and(Field.EMPLOYMENT_TYPE, Value.FULL_TIME).expect('FULLTIME'),
      new Given(Field.EMPLOYMENT_STATUS, Value.EMPLOYED).and(Field.EMPLOYMENT_TYPE, Value.PART_TIME).expect('PARTTIME'),
      new Given(Field.EMPLOYMENT_STATUS, Value.EMPLOYED)
        .and(Field.EMPLOYMENT_TYPE, Value.TEMPORARY_OR_CASUAL)
        .expect('PARTTIME'),
      new Given(Field.EMPLOYMENT_STATUS, Value.EMPLOYED)
        .and(Field.EMPLOYMENT_TYPE, Value.APPRENTICESHIP)
        .expect('PARTTIME'),
      new Given(Field.EMPLOYMENT_STATUS, Value.CURRENTLY_UNAVAILABLE_FOR_WORK)
        .and(Field.HAS_BEEN_EMPLOYED, Value.NO)
        .expect('UNEMPLOYED'),
      new Given(Field.EMPLOYMENT_STATUS, Value.UNEMPLOYED_LOOKING_FOR_WORK)
        .and(Field.HAS_BEEN_EMPLOYED, Value.NO)
        .expect('UNEMPLOYED'),
      new Given(Field.EMPLOYMENT_STATUS, Value.UNEMPLOYED_NOT_LOOKING_FOR_WORK)
        .and(Field.HAS_BEEN_EMPLOYED, Value.NO)
        .expect('UNEMPLOYED'),
    ])
  })

  it('qSC5', () => {
    testSection(sectionMapping, 'oSC5', [
      new Given().expect(null),
      new Given(Field.EMPLOYMENT_STATUS, Value.EMPLOYED).expect('YES'),
      new Given(Field.EMPLOYMENT_STATUS, Value.SELF_EMPLOYED).expect('YES'),
      new Given(Field.EMPLOYMENT_STATUS, Value.UNEMPLOYED_LOOKING_FOR_WORK).expect('NO'),
      new Given(Field.EMPLOYMENT_STATUS, Value.UNEMPLOYED_NOT_LOOKING_FOR_WORK).expect('NO'),
    ])
  })

  it('qSC8', () => {
    testSection(sectionMapping, 'oSC8', [
      new Given().expect(null),
      new Given(Field.FINANCE_MONEY_MANAGEMENT, Value.GOOD).expect('YES'),
      new Given(Field.FINANCE_MONEY_MANAGEMENT, Value.FAIRLY_GOOD).expect('SOMETIMES'),
      new Given(Field.FINANCE_MONEY_MANAGEMENT, Value.FAIRLY_BAD).expect('NOTCONFIDENT'),
      new Given(Field.FINANCE_MONEY_MANAGEMENT, Value.BAD).expect('NOTCONFIDENT'),
    ])
  })
})
