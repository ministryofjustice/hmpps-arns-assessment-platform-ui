/** Port of oasys/datamapping/v1/DrugsTest.kt. */

import { Field, Value } from '../../codes'
import { Drugs } from '../../v1.0/drugs'
import { Given, testSection } from '../support/given'
import { PractitionerAnalysisScenarios } from '../support/practitionerAnalysisScenarios'

describe('Drugs', () => {
  const sectionMapping = new Drugs()

  it('q1', () => {
    testSection(sectionMapping, 'o8-1', [
      new Given().expect(null),
      new Given(Field.DRUG_USE, null).expect(null),
      new Given(Field.DRUG_USE, Value.YES).expect('YES'),
      new Given(Field.DRUG_USE, Value.NO).expect('NO'),
    ])
  })

  it('q2011', () => {
    testSection(sectionMapping, 'o8-2-1-1', [
      new Given().expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HEROIN, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HEROIN, Value.DAILY).expect('100'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HEROIN, Value.WEEKLY).expect('110'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HEROIN, Value.MONTHLY).expect('120'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HEROIN, Value.OCCASIONALLY).expect('130'),
    ])
  })

  it('q2013', () => {
    testSection(sectionMapping, 'o8-2-1-3', [
      new Given().expect(null),
      new Given(Field.DRUG_LAST_USED_HEROIN, null).expect(null),
      new Given(Field.DRUG_LAST_USED_HEROIN, Value.LAST_SIX).expect(null),
      new Given(Field.DRUG_LAST_USED_HEROIN, Value.MORE_THAN_SIX).expect('YES'),
    ])
  })

  it('q2012', () => {
    testSection(sectionMapping, 'o8-2-1-2', [
      new Given().expect(null),
      new Given(Field.DRUGS_INJECTED_HEROIN, null).expect(null),
      new Given(Field.DRUGS_INJECTED_HEROIN, []).expect(null),
      new Given(Field.DRUGS_INJECTED_HEROIN, [Value.MORE_THAN_SIX]).expect(null),
      new Given(Field.DRUGS_INJECTED_HEROIN, [Value.LAST_SIX]).expect('YES'),
    ])
  })

  it('q2014', () => {
    testSection(sectionMapping, 'o8-2-1-4', [
      new Given().expect(null),
      new Given(Field.DRUGS_INJECTED_HEROIN, null).expect(null),
      new Given(Field.DRUGS_INJECTED_HEROIN, []).expect(null),
      new Given(Field.DRUGS_INJECTED_HEROIN, [Value.LAST_SIX]).expect(null),
      new Given(Field.DRUGS_INJECTED_HEROIN, [Value.MORE_THAN_SIX]).expect('YES'),
    ])
  })

  it('q2021', () => {
    testSection(sectionMapping, 'o8-2-2-1', [
      new Given().expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_METHADONE_NOT_PRESCRIBED, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_METHADONE_NOT_PRESCRIBED, Value.DAILY).expect('100'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_METHADONE_NOT_PRESCRIBED, Value.WEEKLY).expect('110'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_METHADONE_NOT_PRESCRIBED, Value.MONTHLY).expect('120'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_METHADONE_NOT_PRESCRIBED, Value.OCCASIONALLY).expect('130'),
    ])
  })

  it('q2023', () => {
    testSection(sectionMapping, 'o8-2-2-3', [
      new Given().expect(null),
      new Given(Field.DRUG_LAST_USED_METHADONE_NOT_PRESCRIBED, null).expect(null),
      new Given(Field.DRUG_LAST_USED_METHADONE_NOT_PRESCRIBED, Value.LAST_SIX).expect(null),
      new Given(Field.DRUG_LAST_USED_METHADONE_NOT_PRESCRIBED, Value.MORE_THAN_SIX).expect('YES'),
    ])
  })

  it('q2022', () => {
    testSection(sectionMapping, 'o8-2-2-2', [
      new Given().expect(null),
      new Given(Field.DRUGS_INJECTED_METHADONE_NOT_PRESCRIBED, null).expect(null),
      new Given(Field.DRUGS_INJECTED_METHADONE_NOT_PRESCRIBED, []).expect(null),
      new Given(Field.DRUGS_INJECTED_METHADONE_NOT_PRESCRIBED, [Value.MORE_THAN_SIX]).expect(null),
      new Given(Field.DRUGS_INJECTED_METHADONE_NOT_PRESCRIBED, [Value.LAST_SIX]).expect('YES'),
    ])
  })

  it('q2024', () => {
    testSection(sectionMapping, 'o8-2-2-4', [
      new Given().expect(null),
      new Given(Field.DRUGS_INJECTED_METHADONE_NOT_PRESCRIBED, null).expect(null),
      new Given(Field.DRUGS_INJECTED_METHADONE_NOT_PRESCRIBED, []).expect(null),
      new Given(Field.DRUGS_INJECTED_METHADONE_NOT_PRESCRIBED, [Value.LAST_SIX]).expect(null),
      new Given(Field.DRUGS_INJECTED_METHADONE_NOT_PRESCRIBED, [Value.MORE_THAN_SIX]).expect('YES'),
    ])
  })

  it('q2031', () => {
    testSection(sectionMapping, 'o8-2-3-1', [
      new Given().expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_OPIATES, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_OPIATES, Value.DAILY).expect('100'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_OPIATES, Value.WEEKLY).expect('110'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_OPIATES, Value.MONTHLY).expect('120'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_OPIATES, Value.OCCASIONALLY).expect('130'),
    ])
  })

  it('q2033', () => {
    testSection(sectionMapping, 'o8-2-3-3', [
      new Given().expect(null),
      new Given(Field.DRUG_LAST_USED_OTHER_OPIATES, null).expect(null),
      new Given(Field.DRUG_LAST_USED_OTHER_OPIATES, Value.LAST_SIX).expect(null),
      new Given(Field.DRUG_LAST_USED_OTHER_OPIATES, Value.MORE_THAN_SIX).expect('YES'),
    ])
  })

  it('q2032', () => {
    testSection(sectionMapping, 'o8-2-3-2', [
      new Given().expect(null),
      new Given(Field.DRUGS_INJECTED_OTHER_OPIATES, null).expect(null),
      new Given(Field.DRUGS_INJECTED_OTHER_OPIATES, []).expect(null),
      new Given(Field.DRUGS_INJECTED_OTHER_OPIATES, [Value.MORE_THAN_SIX]).expect(null),
      new Given(Field.DRUGS_INJECTED_OTHER_OPIATES, [Value.LAST_SIX]).expect('YES'),
    ])
  })

  it('q2034', () => {
    testSection(sectionMapping, 'o8-2-3-4', [
      new Given().expect(null),
      new Given(Field.DRUGS_INJECTED_OTHER_OPIATES, null).expect(null),
      new Given(Field.DRUGS_INJECTED_OTHER_OPIATES, []).expect(null),
      new Given(Field.DRUGS_INJECTED_OTHER_OPIATES, [Value.LAST_SIX]).expect(null),
      new Given(Field.DRUGS_INJECTED_OTHER_OPIATES, [Value.MORE_THAN_SIX]).expect('YES'),
    ])
  })

  it('q2041', () => {
    testSection(sectionMapping, 'o8-2-4-1', [
      new Given().expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CRACK, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CRACK, Value.DAILY).expect('100'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CRACK, Value.WEEKLY).expect('110'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CRACK, Value.MONTHLY).expect('120'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CRACK, Value.OCCASIONALLY).expect('130'),
    ])
  })

  it('q2043', () => {
    testSection(sectionMapping, 'o8-2-4-3', [
      new Given().expect(null),
      new Given(Field.DRUG_LAST_USED_CRACK, null).expect(null),
      new Given(Field.DRUG_LAST_USED_CRACK, Value.LAST_SIX).expect(null),
      new Given(Field.DRUG_LAST_USED_CRACK, Value.MORE_THAN_SIX).expect('YES'),
    ])
  })

  it('q2042', () => {
    testSection(sectionMapping, 'o8-2-4-2', [
      new Given().expect(null),
      new Given(Field.DRUGS_INJECTED_CRACK, null).expect(null),
      new Given(Field.DRUGS_INJECTED_CRACK, []).expect(null),
      new Given(Field.DRUGS_INJECTED_CRACK, [Value.MORE_THAN_SIX]).expect(null),
      new Given(Field.DRUGS_INJECTED_CRACK, [Value.LAST_SIX]).expect('YES'),
    ])
  })

  it('q2044', () => {
    testSection(sectionMapping, 'o8-2-4-4', [
      new Given().expect(null),
      new Given(Field.DRUGS_INJECTED_CRACK, null).expect(null),
      new Given(Field.DRUGS_INJECTED_CRACK, []).expect(null),
      new Given(Field.DRUGS_INJECTED_CRACK, [Value.LAST_SIX]).expect(null),
      new Given(Field.DRUGS_INJECTED_CRACK, [Value.MORE_THAN_SIX]).expect('YES'),
    ])
  })

  it('q2051', () => {
    testSection(sectionMapping, 'o8-2-5-1', [
      new Given().expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_COCAINE, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_COCAINE, Value.DAILY).expect('100'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_COCAINE, Value.WEEKLY).expect('110'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_COCAINE, Value.MONTHLY).expect('120'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_COCAINE, Value.OCCASIONALLY).expect('130'),
    ])
  })

  it('q2053', () => {
    testSection(sectionMapping, 'o8-2-5-3', [
      new Given().expect(null),
      new Given(Field.DRUG_LAST_USED_COCAINE, null).expect(null),
      new Given(Field.DRUG_LAST_USED_COCAINE, Value.LAST_SIX).expect(null),
      new Given(Field.DRUG_LAST_USED_COCAINE, Value.MORE_THAN_SIX).expect('YES'),
    ])
  })

  it('q2052', () => {
    testSection(sectionMapping, 'o8-2-5-2', [
      new Given().expect(null),
      new Given(Field.DRUGS_INJECTED_COCAINE, null).expect(null),
      new Given(Field.DRUGS_INJECTED_COCAINE, []).expect(null),
      new Given(Field.DRUGS_INJECTED_COCAINE, [Value.MORE_THAN_SIX]).expect(null),
      new Given(Field.DRUGS_INJECTED_COCAINE, [Value.LAST_SIX]).expect('YES'),
    ])
  })

  it('q2054', () => {
    testSection(sectionMapping, 'o8-2-5-4', [
      new Given().expect(null),
      new Given(Field.DRUGS_INJECTED_COCAINE, null).expect(null),
      new Given(Field.DRUGS_INJECTED_COCAINE, []).expect(null),
      new Given(Field.DRUGS_INJECTED_COCAINE, [Value.LAST_SIX]).expect(null),
      new Given(Field.DRUGS_INJECTED_COCAINE, [Value.MORE_THAN_SIX]).expect('YES'),
    ])
  })

  it('q2061', () => {
    testSection(sectionMapping, 'o8-2-6-1', [
      new Given().expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_MISUSED_PRESCRIBED_DRUGS, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_MISUSED_PRESCRIBED_DRUGS, Value.DAILY).expect('100'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_MISUSED_PRESCRIBED_DRUGS, Value.WEEKLY).expect('110'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_MISUSED_PRESCRIBED_DRUGS, Value.MONTHLY).expect('120'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_MISUSED_PRESCRIBED_DRUGS, Value.OCCASIONALLY).expect('130'),
    ])
  })

  it('q2063', () => {
    testSection(sectionMapping, 'o8-2-6-3', [
      new Given().expect(null),
      new Given(Field.DRUG_LAST_USED_MISUSED_PRESCRIBED_DRUGS, null).expect(null),
      new Given(Field.DRUG_LAST_USED_MISUSED_PRESCRIBED_DRUGS, Value.LAST_SIX).expect(null),
      new Given(Field.DRUG_LAST_USED_MISUSED_PRESCRIBED_DRUGS, Value.MORE_THAN_SIX).expect('YES'),
    ])
  })

  it('q2062', () => {
    testSection(sectionMapping, 'o8-2-6-2', [
      new Given().expect(null),
      new Given(Field.DRUGS_INJECTED_MISUSED_PRESCRIBED_DRUGS, null).expect(null),
      new Given(Field.DRUGS_INJECTED_MISUSED_PRESCRIBED_DRUGS, []).expect(null),
      new Given(Field.DRUGS_INJECTED_MISUSED_PRESCRIBED_DRUGS, [Value.MORE_THAN_SIX]).expect(null),
      new Given(Field.DRUGS_INJECTED_MISUSED_PRESCRIBED_DRUGS, [Value.LAST_SIX]).expect('YES'),
    ])
  })

  it('q2064', () => {
    testSection(sectionMapping, 'o8-2-6-4', [
      new Given().expect(null),
      new Given(Field.DRUGS_INJECTED_MISUSED_PRESCRIBED_DRUGS, null).expect(null),
      new Given(Field.DRUGS_INJECTED_MISUSED_PRESCRIBED_DRUGS, []).expect(null),
      new Given(Field.DRUGS_INJECTED_MISUSED_PRESCRIBED_DRUGS, [Value.LAST_SIX]).expect(null),
      new Given(Field.DRUGS_INJECTED_MISUSED_PRESCRIBED_DRUGS, [Value.MORE_THAN_SIX]).expect('YES'),
    ])
  })

  it('q2071', () => {
    testSection(sectionMapping, 'o8-2-7-1', [
      new Given().expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_BENZODIAZEPINES, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_BENZODIAZEPINES, Value.DAILY).expect('100'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_BENZODIAZEPINES, Value.WEEKLY).expect('110'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_BENZODIAZEPINES, Value.MONTHLY).expect('120'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_BENZODIAZEPINES, Value.OCCASIONALLY).expect('130'),
    ])
  })

  it('q2073', () => {
    testSection(sectionMapping, 'o8-2-7-3', [
      new Given().expect(null),
      new Given(Field.DRUG_LAST_USED_BENZODIAZEPINES, null).expect(null),
      new Given(Field.DRUG_LAST_USED_BENZODIAZEPINES, Value.LAST_SIX).expect(null),
      new Given(Field.DRUG_LAST_USED_BENZODIAZEPINES, Value.MORE_THAN_SIX).expect('YES'),
    ])
  })

  it('q2072', () => {
    testSection(sectionMapping, 'o8-2-7-2', [
      new Given().expect(null),
      new Given(Field.DRUGS_INJECTED_BENZODIAZEPINES, null).expect(null),
      new Given(Field.DRUGS_INJECTED_BENZODIAZEPINES, []).expect(null),
      new Given(Field.DRUGS_INJECTED_BENZODIAZEPINES, [Value.MORE_THAN_SIX]).expect(null),
      new Given(Field.DRUGS_INJECTED_BENZODIAZEPINES, [Value.LAST_SIX]).expect('YES'),
    ])
  })

  it('q2074', () => {
    testSection(sectionMapping, 'o8-2-7-4', [
      new Given().expect(null),
      new Given(Field.DRUGS_INJECTED_BENZODIAZEPINES, null).expect(null),
      new Given(Field.DRUGS_INJECTED_BENZODIAZEPINES, []).expect(null),
      new Given(Field.DRUGS_INJECTED_BENZODIAZEPINES, [Value.LAST_SIX]).expect(null),
      new Given(Field.DRUGS_INJECTED_BENZODIAZEPINES, [Value.MORE_THAN_SIX]).expect('YES'),
    ])
  })

  it('q2081', () => {
    testSection(sectionMapping, 'o8-2-8-1', [
      new Given().expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_AMPHETAMINES, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_AMPHETAMINES, Value.DAILY).expect('100'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_AMPHETAMINES, Value.WEEKLY).expect('110'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_AMPHETAMINES, Value.MONTHLY).expect('120'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_AMPHETAMINES, Value.OCCASIONALLY).expect('130'),
    ])
  })

  it('q2083', () => {
    testSection(sectionMapping, 'o8-2-8-3', [
      new Given().expect(null),
      new Given(Field.DRUG_LAST_USED_AMPHETAMINES, null).expect(null),
      new Given(Field.DRUG_LAST_USED_AMPHETAMINES, Value.LAST_SIX).expect(null),
      new Given(Field.DRUG_LAST_USED_AMPHETAMINES, Value.MORE_THAN_SIX).expect('YES'),
    ])
  })

  it('q2082', () => {
    testSection(sectionMapping, 'o8-2-8-2', [
      new Given().expect(null),
      new Given(Field.DRUGS_INJECTED_AMPHETAMINES, null).expect(null),
      new Given(Field.DRUGS_INJECTED_AMPHETAMINES, []).expect(null),
      new Given(Field.DRUGS_INJECTED_AMPHETAMINES, [Value.MORE_THAN_SIX]).expect(null),
      new Given(Field.DRUGS_INJECTED_AMPHETAMINES, [Value.LAST_SIX]).expect('YES'),
    ])
  })

  it('q2084', () => {
    testSection(sectionMapping, 'o8-2-8-4', [
      new Given().expect(null),
      new Given(Field.DRUGS_INJECTED_AMPHETAMINES, null).expect(null),
      new Given(Field.DRUGS_INJECTED_AMPHETAMINES, []).expect(null),
      new Given(Field.DRUGS_INJECTED_AMPHETAMINES, [Value.LAST_SIX]).expect(null),
      new Given(Field.DRUGS_INJECTED_AMPHETAMINES, [Value.MORE_THAN_SIX]).expect('YES'),
    ])
  })

  it('q2091', () => {
    testSection(sectionMapping, 'o8-2-9-1', [
      new Given().expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HALLUCINOGENICS, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HALLUCINOGENICS, Value.DAILY).expect('100'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HALLUCINOGENICS, Value.WEEKLY).expect('110'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HALLUCINOGENICS, Value.MONTHLY).expect('120'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HALLUCINOGENICS, Value.OCCASIONALLY).expect('130'),
    ])
  })

  it('q2093', () => {
    testSection(sectionMapping, 'o8-2-9-3', [
      new Given().expect(null),
      new Given(Field.DRUG_LAST_USED_HALLUCINOGENICS, null).expect(null),
      new Given(Field.DRUG_LAST_USED_HALLUCINOGENICS, Value.LAST_SIX).expect(null),
      new Given(Field.DRUG_LAST_USED_HALLUCINOGENICS, Value.MORE_THAN_SIX).expect('YES'),
    ])
  })

  it('q2101', () => {
    testSection(sectionMapping, 'o8-2-10-1', [
      new Given().expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_ECSTASY, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_ECSTASY, Value.DAILY).expect('100'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_ECSTASY, Value.WEEKLY).expect('110'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_ECSTASY, Value.MONTHLY).expect('120'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_ECSTASY, Value.OCCASIONALLY).expect('130'),
    ])
  })

  it('q2103', () => {
    testSection(sectionMapping, 'o8-2-10-3', [
      new Given().expect(null),
      new Given(Field.DRUG_LAST_USED_ECSTASY, null).expect(null),
      new Given(Field.DRUG_LAST_USED_ECSTASY, Value.LAST_SIX).expect(null),
      new Given(Field.DRUG_LAST_USED_ECSTASY, Value.MORE_THAN_SIX).expect('YES'),
    ])
  })

  it('q2111', () => {
    testSection(sectionMapping, 'o8-2-11-1', [
      new Given().expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CANNABIS, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CANNABIS, Value.DAILY).expect('100'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CANNABIS, Value.WEEKLY).expect('110'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CANNABIS, Value.MONTHLY).expect('120'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CANNABIS, Value.OCCASIONALLY).expect('130'),
    ])
  })

  it('q2113', () => {
    testSection(sectionMapping, 'o8-2-11-3', [
      new Given().expect(null),
      new Given(Field.DRUG_LAST_USED_CANNABIS, null).expect(null),
      new Given(Field.DRUG_LAST_USED_CANNABIS, Value.LAST_SIX).expect(null),
      new Given(Field.DRUG_LAST_USED_CANNABIS, Value.MORE_THAN_SIX).expect('YES'),
    ])
  })

  it('q2121', () => {
    testSection(sectionMapping, 'o8-2-12-1', [
      new Given().expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SOLVENTS, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SOLVENTS, Value.DAILY).expect('100'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SOLVENTS, Value.WEEKLY).expect('110'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SOLVENTS, Value.MONTHLY).expect('120'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SOLVENTS, Value.OCCASIONALLY).expect('130'),
    ])
  })

  it('q2123', () => {
    testSection(sectionMapping, 'o8-2-12-3', [
      new Given().expect(null),
      new Given(Field.DRUG_LAST_USED_SOLVENTS, null).expect(null),
      new Given(Field.DRUG_LAST_USED_SOLVENTS, Value.LAST_SIX).expect(null),
      new Given(Field.DRUG_LAST_USED_SOLVENTS, Value.MORE_THAN_SIX).expect('YES'),
    ])
  })

  it('q2131', () => {
    testSection(sectionMapping, 'o8-2-13-1', [
      new Given().expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_STEROIDS, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_STEROIDS, Value.DAILY).expect('100'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_STEROIDS, Value.WEEKLY).expect('110'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_STEROIDS, Value.MONTHLY).expect('120'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_STEROIDS, Value.OCCASIONALLY).expect('130'),
    ])
  })

  it('q2133', () => {
    testSection(sectionMapping, 'o8-2-13-3', [
      new Given().expect(null),
      new Given(Field.DRUG_LAST_USED_STEROIDS, null).expect(null),
      new Given(Field.DRUG_LAST_USED_STEROIDS, Value.LAST_SIX).expect(null),
      new Given(Field.DRUG_LAST_USED_STEROIDS, Value.MORE_THAN_SIX).expect('YES'),
    ])
  })

  it('q2132', () => {
    testSection(sectionMapping, 'o8-2-13-2', [
      new Given().expect(null),
      new Given(Field.DRUGS_INJECTED_STEROIDS, null).expect(null),
      new Given(Field.DRUGS_INJECTED_STEROIDS, []).expect(null),
      new Given(Field.DRUGS_INJECTED_STEROIDS, [Value.MORE_THAN_SIX]).expect(null),
      new Given(Field.DRUGS_INJECTED_STEROIDS, [Value.LAST_SIX]).expect('YES'),
    ])
  })

  it('q2134', () => {
    testSection(sectionMapping, 'o8-2-13-4', [
      new Given().expect(null),
      new Given(Field.DRUGS_INJECTED_STEROIDS, null).expect(null),
      new Given(Field.DRUGS_INJECTED_STEROIDS, []).expect(null),
      new Given(Field.DRUGS_INJECTED_STEROIDS, [Value.LAST_SIX]).expect(null),
      new Given(Field.DRUGS_INJECTED_STEROIDS, [Value.MORE_THAN_SIX]).expect('YES'),
    ])
  })

  it('q2151', () => {
    testSection(sectionMapping, 'o8-2-15-1', [
      new Given().expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SPICE, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SPICE, Value.DAILY).expect('100'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SPICE, Value.WEEKLY).expect('110'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SPICE, Value.MONTHLY).expect('120'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SPICE, Value.OCCASIONALLY).expect('130'),
    ])
  })

  it('q2153', () => {
    testSection(sectionMapping, 'o8-2-15-3', [
      new Given().expect(null),
      new Given(Field.DRUG_LAST_USED_SPICE, null).expect(null),
      new Given(Field.DRUG_LAST_USED_SPICE, Value.LAST_SIX).expect(null),
      new Given(Field.DRUG_LAST_USED_SPICE, Value.MORE_THAN_SIX).expect('YES'),
    ])
  })

  it('q2141', () => {
    testSection(sectionMapping, 'o8-2-14-1', [
      new Given().expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_DRUG, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_DRUG, Value.DAILY).expect('100'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_DRUG, Value.WEEKLY).expect('110'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_DRUG, Value.MONTHLY).expect('120'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_DRUG, Value.OCCASIONALLY).expect('130'),
    ])
  })

  it('q2143', () => {
    testSection(sectionMapping, 'o8-2-14-3', [
      new Given().expect(null),
      new Given(Field.DRUG_LAST_USED_OTHER_DRUG, null).expect(null),
      new Given(Field.DRUG_LAST_USED_OTHER_DRUG, Value.LAST_SIX).expect(null),
      new Given(Field.DRUG_LAST_USED_OTHER_DRUG, Value.MORE_THAN_SIX).expect('YES'),
    ])
  })

  it('q2142', () => {
    testSection(sectionMapping, 'o8-2-14-2', [
      new Given().expect(null),
      new Given(Field.DRUGS_INJECTED_OTHER_DRUG, null).expect(null),
      new Given(Field.DRUGS_INJECTED_OTHER_DRUG, []).expect(null),
      new Given(Field.DRUGS_INJECTED_OTHER_DRUG, [Value.MORE_THAN_SIX]).expect(null),
      new Given(Field.DRUGS_INJECTED_OTHER_DRUG, [Value.LAST_SIX]).expect('YES'),
    ])
  })

  it('q2144', () => {
    testSection(sectionMapping, 'o8-2-14-4', [
      new Given().expect(null),
      new Given(Field.DRUGS_INJECTED_OTHER_DRUG, null).expect(null),
      new Given(Field.DRUGS_INJECTED_OTHER_DRUG, []).expect(null),
      new Given(Field.DRUGS_INJECTED_OTHER_DRUG, [Value.LAST_SIX]).expect(null),
      new Given(Field.DRUGS_INJECTED_OTHER_DRUG, [Value.MORE_THAN_SIX]).expect('YES'),
    ])
  })

  it('q214t', () => {
    testSection(sectionMapping, 'o8-2-14-t', [
      new Given().expect(null),
      new Given(Field.OTHER_DRUG_NAME, null).expect(null),
      new Given(Field.OTHER_DRUG_NAME, '').expect(''),
      new Given(Field.OTHER_DRUG_NAME, 'some text').expect('some text'),
    ])
  })

  it('q4', () => {
    testSection(sectionMapping, 'o8-4', [
      new Given().expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HEROIN, null).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_METHADONE_NOT_PRESCRIBED, null).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_OPIATES, null).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CRACK, null).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_COCAINE, null).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_MISUSED_PRESCRIBED_DRUGS, null).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HEROIN, Value.DAILY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_METHADONE_NOT_PRESCRIBED, Value.DAILY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_OPIATES, Value.DAILY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CRACK, Value.DAILY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_COCAINE, Value.DAILY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_MISUSED_PRESCRIBED_DRUGS, Value.DAILY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HEROIN, Value.WEEKLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_METHADONE_NOT_PRESCRIBED, Value.WEEKLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_OPIATES, Value.WEEKLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CRACK, Value.WEEKLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_COCAINE, Value.WEEKLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_MISUSED_PRESCRIBED_DRUGS, Value.WEEKLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HEROIN, Value.MONTHLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_METHADONE_NOT_PRESCRIBED, Value.MONTHLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_OPIATES, Value.MONTHLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CRACK, Value.MONTHLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_COCAINE, Value.MONTHLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_MISUSED_PRESCRIBED_DRUGS, Value.MONTHLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HEROIN, Value.OCCASIONALLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_METHADONE_NOT_PRESCRIBED, Value.OCCASIONALLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_OPIATES, Value.OCCASIONALLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CRACK, Value.OCCASIONALLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_COCAINE, Value.OCCASIONALLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_MISUSED_PRESCRIBED_DRUGS, Value.OCCASIONALLY).expect('2'),
    ])
  })

  it('q5', () => {
    testSection(sectionMapping, 'o8-5', [
      // TODO: Check these, as "M" seems to have been repurposed.
      new Given().expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HEROIN, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_METHADONE_NOT_PRESCRIBED, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_OPIATES, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CRACK, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_COCAINE, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_MISUSED_PRESCRIBED_DRUGS, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_BENZODIAZEPINES, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_AMPHETAMINES, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HALLUCINOGENICS, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_ECSTASY, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CANNABIS, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SOLVENTS, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_STEROIDS, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SPICE, null).expect(null),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_DRUG, null).expect(null),

      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HEROIN, Value.DAILY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_METHADONE_NOT_PRESCRIBED, Value.DAILY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_OPIATES, Value.DAILY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CRACK, Value.DAILY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_COCAINE, Value.DAILY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_MISUSED_PRESCRIBED_DRUGS, Value.DAILY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_BENZODIAZEPINES, Value.DAILY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_AMPHETAMINES, Value.DAILY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HALLUCINOGENICS, Value.DAILY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_ECSTASY, Value.DAILY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CANNABIS, Value.DAILY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SOLVENTS, Value.DAILY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_STEROIDS, Value.DAILY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SPICE, Value.DAILY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_DRUG, Value.DAILY).expect('2'),

      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HEROIN, Value.WEEKLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_METHADONE_NOT_PRESCRIBED, Value.WEEKLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_OPIATES, Value.WEEKLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CRACK, Value.WEEKLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_COCAINE, Value.WEEKLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_MISUSED_PRESCRIBED_DRUGS, Value.WEEKLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_BENZODIAZEPINES, Value.WEEKLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_AMPHETAMINES, Value.WEEKLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HALLUCINOGENICS, Value.WEEKLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_ECSTASY, Value.WEEKLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CANNABIS, Value.WEEKLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SOLVENTS, Value.WEEKLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_STEROIDS, Value.WEEKLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SPICE, Value.WEEKLY).expect('2'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_DRUG, Value.WEEKLY).expect('2'),

      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HEROIN, Value.MONTHLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_METHADONE_NOT_PRESCRIBED, Value.MONTHLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_OPIATES, Value.MONTHLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CRACK, Value.MONTHLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_COCAINE, Value.MONTHLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_MISUSED_PRESCRIBED_DRUGS, Value.MONTHLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_BENZODIAZEPINES, Value.MONTHLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_AMPHETAMINES, Value.MONTHLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HALLUCINOGENICS, Value.MONTHLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_ECSTASY, Value.MONTHLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CANNABIS, Value.MONTHLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SOLVENTS, Value.MONTHLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_STEROIDS, Value.MONTHLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SPICE, Value.MONTHLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_DRUG, Value.MONTHLY).expect('0'),

      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HEROIN, Value.OCCASIONALLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_METHADONE_NOT_PRESCRIBED, Value.OCCASIONALLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_OPIATES, Value.OCCASIONALLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CRACK, Value.OCCASIONALLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_COCAINE, Value.OCCASIONALLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_MISUSED_PRESCRIBED_DRUGS, Value.OCCASIONALLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_BENZODIAZEPINES, Value.OCCASIONALLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_AMPHETAMINES, Value.OCCASIONALLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HALLUCINOGENICS, Value.OCCASIONALLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_ECSTASY, Value.OCCASIONALLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CANNABIS, Value.OCCASIONALLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SOLVENTS, Value.OCCASIONALLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_STEROIDS, Value.OCCASIONALLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SPICE, Value.OCCASIONALLY).expect('0'),
      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_DRUG, Value.OCCASIONALLY).expect('0'),

      new Given(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HEROIN, Value.DAILY)
        .and(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_COCAINE, Value.MONTHLY)
        .expect('2'),

      new Given(Field.DRUG_LAST_USED_AMPHETAMINES, Value.LAST_SIX).expect('M'),
      new Given(Field.DRUG_LAST_USED_BENZODIAZEPINES, Value.LAST_SIX).expect('M'),
      new Given(Field.DRUG_LAST_USED_CANNABIS, Value.LAST_SIX).expect('M'),
      new Given(Field.DRUG_LAST_USED_COCAINE, Value.LAST_SIX).expect('M'),
      new Given(Field.DRUG_LAST_USED_CRACK, Value.LAST_SIX).expect('M'),
      new Given(Field.DRUG_LAST_USED_ECSTASY, Value.LAST_SIX).expect('M'),
      new Given(Field.DRUG_LAST_USED_HALLUCINOGENICS, Value.LAST_SIX).expect('M'),
      new Given(Field.DRUG_LAST_USED_HEROIN, Value.LAST_SIX).expect('M'),
      new Given(Field.DRUG_LAST_USED_METHADONE_NOT_PRESCRIBED, Value.LAST_SIX).expect('M'),
      new Given(Field.DRUG_LAST_USED_MISUSED_PRESCRIBED_DRUGS, Value.LAST_SIX).expect('M'),
      new Given(Field.DRUG_LAST_USED_OTHER_OPIATES, Value.LAST_SIX).expect('M'),
      new Given(Field.DRUG_LAST_USED_SOLVENTS, Value.LAST_SIX).expect('M'),
      new Given(Field.DRUG_LAST_USED_STEROIDS, Value.LAST_SIX).expect('M'),
      new Given(Field.DRUG_LAST_USED_SPICE, Value.LAST_SIX).expect('M'),
      new Given(Field.DRUG_LAST_USED_OTHER_DRUG, Value.LAST_SIX).expect('M'),

      new Given(Field.DRUG_LAST_USED_AMPHETAMINES, Value.MORE_THAN_SIX).expect('0'),
      new Given(Field.DRUG_LAST_USED_BENZODIAZEPINES, Value.MORE_THAN_SIX).expect('0'),
      new Given(Field.DRUG_LAST_USED_CANNABIS, Value.MORE_THAN_SIX).expect('0'),
      new Given(Field.DRUG_LAST_USED_COCAINE, Value.MORE_THAN_SIX).expect('0'),
      new Given(Field.DRUG_LAST_USED_CRACK, Value.MORE_THAN_SIX).expect('0'),
      new Given(Field.DRUG_LAST_USED_ECSTASY, Value.MORE_THAN_SIX).expect('0'),
      new Given(Field.DRUG_LAST_USED_HALLUCINOGENICS, Value.MORE_THAN_SIX).expect('0'),
      new Given(Field.DRUG_LAST_USED_HEROIN, Value.MORE_THAN_SIX).expect('0'),
      new Given(Field.DRUG_LAST_USED_METHADONE_NOT_PRESCRIBED, Value.MORE_THAN_SIX).expect('0'),
      new Given(Field.DRUG_LAST_USED_MISUSED_PRESCRIBED_DRUGS, Value.MORE_THAN_SIX).expect('0'),
      new Given(Field.DRUG_LAST_USED_OTHER_OPIATES, Value.MORE_THAN_SIX).expect('0'),
      new Given(Field.DRUG_LAST_USED_SOLVENTS, Value.MORE_THAN_SIX).expect('0'),
      new Given(Field.DRUG_LAST_USED_STEROIDS, Value.MORE_THAN_SIX).expect('0'),
      new Given(Field.DRUG_LAST_USED_SPICE, Value.MORE_THAN_SIX).expect('0'),
      new Given(Field.DRUG_LAST_USED_OTHER_DRUG, Value.MORE_THAN_SIX).expect('0'),
    ])
  })

  it('q6', () => {
    testSection(sectionMapping, 'o8-6', [
      new Given().expect('0'),

      new Given(Field.DRUGS_INJECTED_HEROIN, null).expect('0'),
      new Given(Field.DRUGS_INJECTED_METHADONE_NOT_PRESCRIBED, null).expect('0'),
      new Given(Field.DRUGS_INJECTED_OTHER_OPIATES, null).expect('0'),
      new Given(Field.DRUGS_INJECTED_CRACK, null).expect('0'),
      new Given(Field.DRUGS_INJECTED_COCAINE, null).expect('0'),
      new Given(Field.DRUGS_INJECTED_MISUSED_PRESCRIBED_DRUGS, null).expect('0'),
      new Given(Field.DRUGS_INJECTED_BENZODIAZEPINES, null).expect('0'),
      new Given(Field.DRUGS_INJECTED_AMPHETAMINES, null).expect('0'),
      new Given(Field.DRUGS_INJECTED_STEROIDS, null).expect('0'),
      new Given(Field.DRUGS_INJECTED_OTHER_DRUG, null).expect('0'),

      new Given(Field.DRUGS_INJECTED_HEROIN, []).expect('0'),
      new Given(Field.DRUGS_INJECTED_METHADONE_NOT_PRESCRIBED, []).expect('0'),
      new Given(Field.DRUGS_INJECTED_OTHER_OPIATES, []).expect('0'),
      new Given(Field.DRUGS_INJECTED_CRACK, []).expect('0'),
      new Given(Field.DRUGS_INJECTED_COCAINE, []).expect('0'),
      new Given(Field.DRUGS_INJECTED_MISUSED_PRESCRIBED_DRUGS, []).expect('0'),
      new Given(Field.DRUGS_INJECTED_BENZODIAZEPINES, []).expect('0'),
      new Given(Field.DRUGS_INJECTED_AMPHETAMINES, []).expect('0'),
      new Given(Field.DRUGS_INJECTED_STEROIDS, []).expect('0'),
      new Given(Field.DRUGS_INJECTED_OTHER_DRUG, []).expect('0'),

      new Given(Field.DRUGS_INJECTED_HEROIN, [Value.LAST_SIX]).expect('2'),
      new Given(Field.DRUGS_INJECTED_METHADONE_NOT_PRESCRIBED, [Value.LAST_SIX]).expect('2'),
      new Given(Field.DRUGS_INJECTED_OTHER_OPIATES, [Value.LAST_SIX]).expect('2'),
      new Given(Field.DRUGS_INJECTED_CRACK, [Value.LAST_SIX]).expect('2'),
      new Given(Field.DRUGS_INJECTED_COCAINE, [Value.LAST_SIX]).expect('2'),
      new Given(Field.DRUGS_INJECTED_MISUSED_PRESCRIBED_DRUGS, [Value.LAST_SIX]).expect('2'),
      new Given(Field.DRUGS_INJECTED_BENZODIAZEPINES, [Value.LAST_SIX]).expect('2'),
      new Given(Field.DRUGS_INJECTED_AMPHETAMINES, [Value.LAST_SIX]).expect('2'),
      new Given(Field.DRUGS_INJECTED_STEROIDS, [Value.LAST_SIX]).expect('2'),
      new Given(Field.DRUGS_INJECTED_OTHER_DRUG, [Value.LAST_SIX]).expect('2'),

      new Given(Field.DRUGS_INJECTED_HEROIN, [Value.MORE_THAN_SIX]).expect('1'),
      new Given(Field.DRUGS_INJECTED_METHADONE_NOT_PRESCRIBED, [Value.MORE_THAN_SIX]).expect('1'),
      new Given(Field.DRUGS_INJECTED_OTHER_OPIATES, [Value.MORE_THAN_SIX]).expect('1'),
      new Given(Field.DRUGS_INJECTED_CRACK, [Value.MORE_THAN_SIX]).expect('1'),
      new Given(Field.DRUGS_INJECTED_COCAINE, [Value.MORE_THAN_SIX]).expect('1'),
      new Given(Field.DRUGS_INJECTED_MISUSED_PRESCRIBED_DRUGS, [Value.MORE_THAN_SIX]).expect('1'),
      new Given(Field.DRUGS_INJECTED_BENZODIAZEPINES, [Value.MORE_THAN_SIX]).expect('1'),
      new Given(Field.DRUGS_INJECTED_AMPHETAMINES, [Value.MORE_THAN_SIX]).expect('1'),
      new Given(Field.DRUGS_INJECTED_STEROIDS, [Value.MORE_THAN_SIX]).expect('1'),
      new Given(Field.DRUGS_INJECTED_OTHER_DRUG, [Value.MORE_THAN_SIX]).expect('1'),

      new Given(Field.DRUGS_INJECTED, [Value.AMPHETAMINES]).expect('1'),
      new Given(Field.DRUGS_INJECTED, [Value.BENZODIAZEPINES]).expect('1'),
      new Given(Field.DRUGS_INJECTED, [Value.COCAINE]).expect('1'),
      new Given(Field.DRUGS_INJECTED, [Value.CRACK]).expect('1'),
      new Given(Field.DRUGS_INJECTED, [Value.HEROIN]).expect('1'),
      new Given(Field.DRUGS_INJECTED, [Value.METHADONE_NOT_PRESCRIBED]).expect('1'),
      new Given(Field.DRUGS_INJECTED, [Value.MISUSED_PRESCRIBED_DRUGS]).expect('1'),
      new Given(Field.DRUGS_INJECTED, [Value.OTHER_OPIATES]).expect('1'),
      new Given(Field.DRUGS_INJECTED, [Value.STEROIDS]).expect('1'),
      new Given(Field.DRUGS_INJECTED, [Value.OTHER_DRUG]).expect('1'),

      new Given(Field.DRUGS_INJECTED_HEROIN, [Value.MORE_THAN_SIX])
        .and(Field.DRUGS_INJECTED_COCAINE, [Value.LAST_SIX])
        .expect('2'),
    ])
  })

  it('q8', () => {
    testSection(sectionMapping, 'o8-8', [
      new Given().expect(null),
      new Given(Field.DRUGS_PRACTITIONER_ANALYSIS_MOTIVATED_TO_STOP, null).expect(null),
      new Given(Field.DRUGS_PRACTITIONER_ANALYSIS_MOTIVATED_TO_STOP, Value.FULL_MOTIVATION).expect('0'),
      new Given(Field.DRUGS_PRACTITIONER_ANALYSIS_MOTIVATED_TO_STOP, Value.PARTIAL_MOTIVATION).expect('1'),
      new Given(Field.DRUGS_PRACTITIONER_ANALYSIS_MOTIVATED_TO_STOP, Value.NO_MOTIVATION).expect('2'),
      new Given(Field.DRUGS_PRACTITIONER_ANALYSIS_MOTIVATED_TO_STOP, Value.UNKNOWN).expect('M'),
    ])
  })

  it('q97', () => {
    testSection(sectionMapping, 'o8-97', new PractitionerAnalysisScenarios('DRUG_USE').notes())
  })

  it('q98', () => {
    testSection(sectionMapping, 'o8-98', new PractitionerAnalysisScenarios('DRUG_USE').riskOfSeriousHarm())
  })

  it('q99', () => {
    testSection(sectionMapping, 'o8-99', new PractitionerAnalysisScenarios('DRUG_USE').riskOfReoffending())
  })

  it('qStrength', () => {
    testSection(
      sectionMapping,
      'o8_SAN_STRENGTH',
      new PractitionerAnalysisScenarios('DRUG_USE').strengthsOrProtectiveFactors(),
    )
  })
})
