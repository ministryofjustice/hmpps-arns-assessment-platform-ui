/** Port of oasys/datamapping/v1/NewSectionsTest.kt. */

import { Field, Value } from '../../codes'
import { NewSections } from '../../v1.0/newSections'
import { Given, testSection } from '../support/given'
import { PractitionerAnalysisScenarios } from '../support/practitionerAnalysisScenarios'

describe('NewSections', () => {
  const sectionMapping = new NewSections()

  it('q30', () => {
    testSection(sectionMapping, 'o1-30', [
      new Given().expect(null),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, null).and(Field.OFFENCE_ANALYSIS_MOTIVATIONS, null).expect(null),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, [Value.SEXUAL_ELEMENT]).expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_ELEMENTS, [Value.SEXUAL_ELEMENT])
        .and(Field.OFFENCE_ANALYSIS_MOTIVATIONS, null)
        .expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS, [Value.SEXUAL_MOTIVATION]).expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_MOTIVATIONS, [Value.SEXUAL_MOTIVATION])
        .and(Field.OFFENCE_ANALYSIS_ELEMENTS, null)
        .expect('YES'),
    ])
  })

  it('qLinkedToRosh', () => {
    testSection(
      sectionMapping,
      'oTBA_SAN_LINKED_ROSH',
      new PractitionerAnalysisScenarios('THINKING_BEHAVIOURS_ATTITUDES').riskOfSeriousHarm(),
    )
  })

  it('qLinkedToReoffending', () => {
    testSection(sectionMapping, 'oTBA_SAN_LINKED_REOFFEND', [
      new Given().expect(null),
      ...new PractitionerAnalysisScenarios('THINKING_BEHAVIOURS_ATTITUDES').riskOfReoffending(),
    ])
  })

  it('qStrength', () => {
    testSection(sectionMapping, 'oTBA_SAN_STRENGTH', [
      new Given().expect(null),
      ...new PractitionerAnalysisScenarios('THINKING_BEHAVIOURS_ATTITUDES').strengthsOrProtectiveFactors(),
    ])
  })

  it('qAccommodationComplete', () => {
    testSection(sectionMapping, 'oAC_SAN_SECTION_COMP', [
      new Given().expect('NO'),
      new Given(Field.ACCOMMODATION_SECTION_COMPLETE, Value.YES).expect('YES'),
      new Given(Field.ACCOMMODATION_SECTION_COMPLETE, Value.NO).expect('NO'),
    ])
  })

  it('qEducationEmploymentComplete', () => {
    testSection(sectionMapping, 'oEE_SAN_SECTION_COMP', [
      new Given().expect('NO'),
      new Given(Field.EMPLOYMENT_EDUCATION_SECTION_COMPLETE, Value.YES).expect('YES'),
      new Given(Field.EMPLOYMENT_EDUCATION_SECTION_COMPLETE, Value.NO).expect('NO'),
    ])
  })

  it('qFinanceComplete', () => {
    testSection(sectionMapping, 'oFI_SAN_SECTION_COMP', [
      new Given().expect('NO'),
      new Given(Field.FINANCE_SECTION_COMPLETE, Value.YES).expect('YES'),
      new Given(Field.FINANCE_SECTION_COMPLETE, Value.NO).expect('NO'),
    ])
  })

  it('qDrugsComplete', () => {
    testSection(sectionMapping, 'oSMD_SAN_SECTION_COMP', [
      new Given().expect('NO'),
      new Given(Field.DRUG_USE_SECTION_COMPLETE, Value.YES).expect('YES'),
      new Given(Field.DRUG_USE_SECTION_COMPLETE, Value.NO).expect('NO'),
    ])
  })

  it('qAlcoholCompletes', () => {
    testSection(sectionMapping, 'oSMA_SAN_SECTION_COMP', [
      new Given().expect('NO'),
      new Given(Field.ALCOHOL_USE_SECTION_COMPLETE, Value.YES).expect('YES'),
      new Given(Field.ALCOHOL_USE_SECTION_COMPLETE, Value.NO).expect('NO'),
    ])
  })

  it('qHealthWellbeingComplete', () => {
    testSection(sectionMapping, 'oHW_SAN_SECTION_COMP', [
      new Given().expect('NO'),
      new Given(Field.HEALTH_WELLBEING_SECTION_COMPLETE, Value.YES).expect('YES'),
      new Given(Field.HEALTH_WELLBEING_SECTION_COMPLETE, Value.NO).expect('NO'),
    ])
  })

  it('qPersonalRelationshipsComplete', () => {
    testSection(sectionMapping, 'oPRC_SAN_SECTION_COMP', [
      new Given().expect('NO'),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_SECTION_COMPLETE, Value.YES).expect('YES'),
      new Given(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_SECTION_COMPLETE, Value.NO).expect('NO'),
    ])
  })

  it('qThinkingBehavioursAttitudesComplete', () => {
    testSection(sectionMapping, 'oTBA_SAN_SECTION_COMP', [
      new Given().expect('NO'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_SECTION_COMPLETE, Value.YES).expect('YES'),
      new Given(Field.THINKING_BEHAVIOURS_ATTITUDES_SECTION_COMPLETE, Value.NO).expect('NO'),
    ])
  })

  it('qOffenceAnalysisComplete', () => {
    testSection(sectionMapping, 'oOA_SAN_SECTION_COMP', [
      new Given().expect('NO'),
      new Given(Field.OFFENCE_ANALYSIS_SECTION_COMPLETE, Value.YES).expect('YES'),
      new Given(Field.OFFENCE_ANALYSIS_SECTION_COMPLETE, Value.NO).expect('NO'),
    ])
  })
})
