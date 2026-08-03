/** Port of oasys/datamapping/v1/AccommodationTest.kt. */

import { Field, Value } from '../../codes'
import { Accommodation } from '../../v1.0/accommodation'
import { Given, testSection } from '../support/given'
import { PractitionerAnalysisScenarios } from '../support/practitionerAnalysisScenarios'

describe('Accommodation', () => {
  const sectionMapping = new Accommodation()

  it('q3', () => {
    testSection(sectionMapping, 'o3-3', [
      new Given().expect(null),
      new Given(Field.CURRENT_ACCOMMODATION, null).expect(null),
      new Given(Field.CURRENT_ACCOMMODATION, Value.TEMPORARY).expect('NO'),
      new Given(Field.CURRENT_ACCOMMODATION, Value.NO_ACCOMMODATION).expect('YES'),
      new Given(Field.CURRENT_ACCOMMODATION, Value.SETTLED).expect('NO'),
    ])
  })

  it('q4', () => {
    testSection(sectionMapping, 'o3-4', [
      new Given().expect(null),
      new Given(Field.CURRENT_ACCOMMODATION, Value.NO_ACCOMMODATION).expect('2'),
      new Given(Field.CURRENT_ACCOMMODATION, Value.NO_ACCOMMODATION).and(Field.SUITABLE_HOUSING, Value.YES).expect('2'),
      new Given(Field.SUITABLE_HOUSING, null).expect(null),
      new Given(Field.SUITABLE_HOUSING, Value.YES).expect('0'),
      new Given(Field.SUITABLE_HOUSING, Value.YES_WITH_CONCERNS).expect('1'),
      new Given(Field.SUITABLE_HOUSING, Value.NO).expect('2'),
    ])
  })

  it('q5', () => {
    testSection(sectionMapping, 'o3-5', [
      new Given().expect(null),
      new Given(Field.CURRENT_ACCOMMODATION, Value.TEMPORARY)
        .and(Field.TYPE_OF_TEMPORARY_ACCOMMODATION, Value.SHORT_TERM)
        .expect('2'),
      new Given(Field.CURRENT_ACCOMMODATION, Value.NO_ACCOMMODATION).expect('2'),
      new Given(Field.CURRENT_ACCOMMODATION, Value.SETTLED).expect('0'),
    ])
  })

  it('q6', () => {
    testSection(sectionMapping, 'o3-6', [
      new Given().expect(null),
      new Given(Field.CURRENT_ACCOMMODATION, Value.NO_ACCOMMODATION).expect('2'),
      new Given(Field.SUITABLE_HOUSING_LOCATION, Value.YES).expect('0'),
      new Given(Field.SUITABLE_HOUSING_LOCATION, Value.NO).expect('2'),
      new Given(Field.CURRENT_ACCOMMODATION, Value.NO_ACCOMMODATION)
        .and(Field.SUITABLE_HOUSING_LOCATION, Value.YES)
        .expect('2'),
      new Given(Field.CURRENT_ACCOMMODATION, Value.TEMPORARY).expect(null),
    ])
  })

  it('q97', () => {
    testSection(sectionMapping, 'o3-97', new PractitionerAnalysisScenarios('ACCOMMODATION').notes())
  })

  it('q98', () => {
    testSection(sectionMapping, 'o3-98', new PractitionerAnalysisScenarios('ACCOMMODATION').riskOfSeriousHarm())
  })

  it('q99', () => {
    testSection(sectionMapping, 'o3-99', new PractitionerAnalysisScenarios('ACCOMMODATION').riskOfReoffending())
  })

  it('qStrength', () => {
    testSection(
      sectionMapping,
      'o3_SAN_STRENGTH',
      new PractitionerAnalysisScenarios('ACCOMMODATION').strengthsOrProtectiveFactors(),
    )
  })
})
