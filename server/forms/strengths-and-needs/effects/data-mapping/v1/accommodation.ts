/** Port of oasys/datamapping/v1/Accommodation.kt. */

import { Field, Value } from '../codes'
import { SectionMapping, type FieldsToMap } from '../common/sectionMapping'
import { PractitionerAnalysis } from './practitionerAnalysis'

export class Accommodation extends SectionMapping {
  getFieldsToMap(): FieldsToMap {
    return {
      'o3-3': this.q3,
      'o3-4': this.q4,
      'o3-5': this.q5,
      'o3-6': this.q6,
      'o3-97': this.q97,
      'o3-98': this.q98,
      'o3-99': this.q99,
      o3_SAN_STRENGTH: this.qStrength,
    }
  }

  private q3 = (): unknown => {
    switch (this.ap.answer(Field.CURRENT_ACCOMMODATION).value) {
      case this.ap.get(Value.NO_ACCOMMODATION):
        return 'YES'
      case this.ap.get(Value.TEMPORARY):
      case this.ap.get(Value.SETTLED):
        return 'NO'
      default:
        return null
    }
  }

  private q4 = (): unknown => {
    const noAccommodation = this.ap.answer(Field.CURRENT_ACCOMMODATION).value === this.ap.get(Value.NO_ACCOMMODATION)
    if (noAccommodation) {
      return '2'
    }
    switch (this.ap.answer(Field.SUITABLE_HOUSING).value) {
      case this.ap.get(Value.YES):
        return '0'
      case this.ap.get(Value.YES_WITH_CONCERNS):
        return '1'
      case this.ap.get(Value.NO):
        return '2'
      default:
        return null
    }
  }

  private q5 = (): unknown => {
    switch (this.ap.answer(Field.CURRENT_ACCOMMODATION).value) {
      case this.ap.get(Value.SETTLED):
        return '0'
      case this.ap.get(Value.NO_ACCOMMODATION):
        return '2'
      case this.ap.get(Value.TEMPORARY):
        switch (this.ap.answer(Field.TYPE_OF_TEMPORARY_ACCOMMODATION).value) {
          case this.ap.get(Value.SHORT_TERM):
            return '2'
          default:
            return null
        }
      default:
        return null
    }
  }

  private q6 = (): unknown => {
    switch (this.ap.answer(Field.CURRENT_ACCOMMODATION).value) {
      case this.ap.get(Value.NO_ACCOMMODATION):
        return '2'
      default:
        switch (this.ap.answer(Field.SUITABLE_HOUSING_LOCATION).value) {
          case this.ap.get(Value.YES):
            return '0'
          case this.ap.get(Value.NO):
            return '2'
          default:
            return null
        }
    }
  }

  private q97 = (): unknown => new PractitionerAnalysis('ACCOMMODATION', this.ap).notes()

  private q98 = (): unknown => new PractitionerAnalysis('ACCOMMODATION', this.ap).riskOfSeriousHarm()

  private q99 = (): unknown => new PractitionerAnalysis('ACCOMMODATION', this.ap).riskOfReoffending()

  private qStrength = (): unknown => new PractitionerAnalysis('ACCOMMODATION', this.ap).strengthsOrProtectiveFactors()
}
