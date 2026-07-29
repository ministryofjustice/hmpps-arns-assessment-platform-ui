/** Port of oasys/datamapping/v1/Attitudes.kt. */

import { Field, Value } from '../codes'
import { SectionMapping, type FieldsToMap } from '../common/sectionMapping'
import { PractitionerAnalysis } from './practitionerAnalysis'

export class Attitudes extends SectionMapping {
  getFieldsToMap(): FieldsToMap {
    return {
      'o12-1': this.q1,
      'o12-3': this.q3,
      'o12-4': this.q4,
      'o12-9': this.q9,
      'o12-97': this.q97,
      'o12-98': this.q98,
      'o12-99': this.q99,
    }
  }

  private q1 = (): unknown => {
    switch (this.ap.answer(Field.THINKING_BEHAVIOURS_ATTITUDES_CRIMINAL_BEHAVIOUR).value) {
      case this.ap.get(Value.NO):
        return '0'
      case this.ap.get(Value.SOMETIMES):
        return '1'
      case this.ap.get(Value.YES):
        return '2'
      default:
        return null
    }
  }

  private q3 = (): unknown => {
    switch (this.ap.answer(Field.THINKING_BEHAVIOURS_ATTITUDES_POSITIVE_ATTITUDE).value) {
      case this.ap.get(Value.YES_POSITIVE):
        return '0'
      case this.ap.get(Value.NEGATIVE_ATTITUDE_NO_CONCERNS):
        return '1'
      case this.ap.get(Value.NEGATIVE_ATTITUDE_AND_CONCERNS):
        return '2'
      default:
        return null
    }
  }

  private q4 = (): unknown => {
    switch (this.ap.answer(Field.THINKING_BEHAVIOURS_ATTITUDES_SUPERVISION).value) {
      case this.ap.get(Value.YES_SUPERVISION):
        return '0'
      case this.ap.get(Value.UNSURE_SUPERVISION):
        return '1'
      case this.ap.get(Value.NO_SUPERVISION):
        return '2'
      default:
        return null
    }
  }

  private q9 = (): unknown => {
    switch (this.ap.answer(Field.THINKING_BEHAVIOURS_ATTITUDES_HOSTILE_ORIENTATION).value) {
      case this.ap.get(Value.NO):
        return '0'
      case this.ap.get(Value.SOME):
        return '1'
      case this.ap.get(Value.YES):
        return '2'
      default:
        return null
    }
  }

  private q97 = (): unknown => new PractitionerAnalysis('THINKING_BEHAVIOURS_ATTITUDES', this.ap).notes()

  private q98 = (): unknown => new PractitionerAnalysis('THINKING_BEHAVIOURS_ATTITUDES', this.ap).riskOfSeriousHarm()

  private q99 = (): unknown => new PractitionerAnalysis('THINKING_BEHAVIOURS_ATTITUDES', this.ap).riskOfReoffending()
}
