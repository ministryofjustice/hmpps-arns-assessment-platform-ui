/** Port of oasys/datamapping/v1/ThinkingBehaviours.kt. */

import { Field, Value } from '../codes'
import { SectionMapping, type FieldsToMap } from '../common/sectionMapping'
import { PractitionerAnalysis } from './practitionerAnalysis'

export class ThinkingBehaviours extends SectionMapping {
  getFieldsToMap(): FieldsToMap {
    return {
      'o11-2': this.q2,
      'o11-3': this.q3,
      'o11-4': this.q4,
      'o11-6': this.q6,
      'o11-7': this.q7,
      'o11-9': this.q9,
      'o11-11': this.q11,
      'o11-12': this.q12,
      'o11-97': this.q97,
      'o11-98': this.q98,
      'o11-99': this.q99,
    }
  }

  private q2 = (): unknown => {
    switch (this.ap.answer(Field.THINKING_BEHAVIOURS_ATTITUDES_IMPULSIVE_BEHAVIOUR).value) {
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
    switch (this.ap.answer(Field.THINKING_BEHAVIOURS_ATTITUDES_VIOLENCE_CONTROLLING_BEHAVIOUR).value) {
      case this.ap.get(Value.NO_VIOLENCE):
        return '0'
      case this.ap.get(Value.SOMETIMES):
        return '1'
      case this.ap.get(Value.YES_VIOLENCE):
        return '2'
      default:
        return null
    }
  }

  private q4 = (): unknown => {
    switch (this.ap.answer(Field.THINKING_BEHAVIOURS_ATTITUDES_TEMPER_MANAGEMENT).value) {
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

  private q6 = (): unknown => {
    switch (this.ap.answer(Field.THINKING_BEHAVIOURS_ATTITUDES_PROBLEM_SOLVING).value) {
      case this.ap.get(Value.YES):
        return '0'
      case this.ap.get(Value.LIMITED_PROBLEM_SOLVING):
        return '1'
      case this.ap.get(Value.NO):
        return '2'
      default:
        return null
    }
  }

  private q7 = (): unknown => {
    switch (this.ap.answer(Field.THINKING_BEHAVIOURS_ATTITUDES_CONSEQUENCES).value) {
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

  private q9 = (): unknown => {
    switch (this.ap.answer(Field.THINKING_BEHAVIOURS_ATTITUDES_PEOPLES_VIEWS).value) {
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

  private q11 = (): unknown => {
    switch (this.ap.answer(Field.THINKING_BEHAVIOURS_ATTITUDES_SEXUAL_PREOCCUPATION).value) {
      case this.ap.get(Value.YES):
        return '2'
      case this.ap.get(Value.SOMETIMES):
        return '1'
      case this.ap.get(Value.NO):
        return '0'
      default:
        return null
    }
  }

  private q12 = (): unknown => {
    switch (this.ap.answer(Field.THINKING_BEHAVIOURS_ATTITUDES_OFFENCE_RELATED_SEXUAL_INTEREST).value) {
      case this.ap.get(Value.YES_OFFENCE_RELATED_SEXUAL_INTEREST):
        return '2'
      case this.ap.get(Value.SOME_OFFENCE_RELATED_SEXUAL_INTEREST):
        return '1'
      case this.ap.get(Value.NO_OFFENCE_RELATED_SEXUAL_INTEREST):
        return '0'
      default:
        return null
    }
  }

  private q97 = (): unknown => new PractitionerAnalysis('THINKING_BEHAVIOURS_ATTITUDES', this.ap).notes()

  private q98 = (): unknown => new PractitionerAnalysis('THINKING_BEHAVIOURS_ATTITUDES', this.ap).riskOfSeriousHarm()

  private q99 = (): unknown => new PractitionerAnalysis('THINKING_BEHAVIOURS_ATTITUDES', this.ap).riskOfReoffending()
}
