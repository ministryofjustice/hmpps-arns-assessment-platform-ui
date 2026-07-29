/** Port of oasys/datamapping/v1/LifestyleAssociates.kt. */

import { Field, Value } from '../codes'
import { SectionMapping, type FieldsToMap } from '../common/sectionMapping'
import { PractitionerAnalysis } from './practitionerAnalysis'

export class LifestyleAssociates extends SectionMapping {
  getFieldsToMap(): FieldsToMap {
    return {
      'o7-2': this.q2,
      'o7-3': this.q3,
      'o7-4': this.q4,
      'o7-5': this.q5,
      'o7-97': this.q97,
      'o7-98': this.q98,
      'o7-99': this.q99,
    }
  }

  private q2 = (): unknown => {
    switch (this.ap.answer(Field.THINKING_BEHAVIOURS_ATTITUDES_OFFENDING_ACTIVITIES).value) {
      case this.ap.get(Value.NO_OFFENDING_ACTIVITIES):
        return '0'
      case this.ap.get(Value.SOMETIMES_OFFENDING_ACTIVITIES):
        return '1'
      case this.ap.get(Value.YES_OFFENDING_ACTIVITIES):
        return '2'
      default:
        return null
    }
  }

  private q3 = (): unknown => {
    switch (this.ap.answer(Field.THINKING_BEHAVIOURS_ATTITUDES_PEER_PRESSURE).value) {
      case this.ap.get(Value.YES):
        return '0'
      case this.ap.get(Value.SOME):
        return '1'
      case this.ap.get(Value.NO):
        return '2'
      default:
        return null
    }
  }

  private q4 = (): unknown => {
    switch (this.ap.answer(Field.THINKING_BEHAVIOURS_ATTITUDES_MANIPULATIVE_PREDATORY_BEHAVIOUR).value) {
      case this.ap.get(Value.YES):
        return '2'
      case this.ap.get(Value.SOME):
        return '1'
      case this.ap.get(Value.NO):
        return '0'
      default:
        return null
    }
  }

  private q5 = (): unknown => {
    switch (this.ap.answer(Field.THINKING_BEHAVIOURS_ATTITUDES_STABLE_BEHAVIOUR).value) {
      case this.ap.get(Value.YES):
        return '0'
      case this.ap.get(Value.SOMETIMES):
        return '1'
      case this.ap.get(Value.NO):
        return '2'
      default:
        return null
    }
  }

  private q97 = (): unknown => new PractitionerAnalysis('THINKING_BEHAVIOURS_ATTITUDES', this.ap).notes()

  private q98 = (): unknown => new PractitionerAnalysis('THINKING_BEHAVIOURS_ATTITUDES', this.ap).riskOfSeriousHarm()

  private q99 = (): unknown => new PractitionerAnalysis('THINKING_BEHAVIOURS_ATTITUDES', this.ap).riskOfReoffending()
}
