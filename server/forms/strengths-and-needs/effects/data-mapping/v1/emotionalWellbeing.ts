/** Port of oasys/datamapping/v1/EmotionalWellbeing.kt. */

import { Field, Value } from '../codes'
import { SectionMapping, type FieldsToMap } from '../common/sectionMapping'
import { PractitionerAnalysis } from './practitionerAnalysis'

export class EmotionalWellbeing extends SectionMapping {
  getFieldsToMap(): FieldsToMap {
    return {
      'o10-1': this.q1,
      'o10-2': this.q2,
      'o10-4': this.q4,
      'o10-5': this.q5,
      'o10-6': this.q6,
      'o10-7_V2_CHILDHOOD': this.qChildhoodBehaviouralProblems,
      'o10-7_V2_HISTHEADINJ': this.qHistoryOfHeadInjury,
      'o10-7_V2_HISTPSYCH': this.qHistoryOfPsychTreatment,
      'o10-7_V2_PSYCHTREAT': this.qCurrentPsychTreatment,
      'o10-97': this.q97,
      'o10-98': this.q98,
      'o10-99': this.q99,
      o10_SAN_STRENGTH: this.qStrength,
    }
  }

  private q1 = (): unknown => {
    switch (this.ap.answer(Field.HEALTH_WELLBEING_COPING_DAY_TO_DAY_LIFE).value) {
      case this.ap.get(Value.YES):
        return '0'
      case this.ap.get(Value.YES_SOME_DIFFICULTIES):
        return '1'
      case this.ap.get(Value.NO):
        return '2'
      default:
        return null
    }
  }

  private q2 = (): unknown => {
    switch (this.ap.answer(Field.HEALTH_WELLBEING_MENTAL_HEALTH_CONDITION).value) {
      case this.ap.get(Value.YES_ONGOING_SEVERE):
        return '2'
      case this.ap.get(Value.YES_ONGOING):
      case this.ap.get(Value.YES_IN_THE_PAST):
        return '1'
      case this.ap.get(Value.NO):
        return '0'
      default:
        return null
    }
  }

  private q4 = (): unknown => {
    switch (this.ap.answer(Field.HEALTH_WELLBEING_ATTITUDE_TOWARDS_SELF).value) {
      case this.ap.get(Value.POSITIVE):
        return '0'
      case this.ap.get(Value.SOME_NEGATIVE_ASPECTS):
        return '1'
      case this.ap.get(Value.NEGATIVE):
        return '2'
      default:
        return null
    }
  }

  private q5 = (): unknown => {
    const values = [
      ((): string | null => {
        switch (this.ap.answer(Field.HEALTH_WELLBEING_ATTEMPTED_SUICIDE_OR_SUICIDAL_THOUGHTS).value) {
          case this.ap.get(Value.YES):
            return 'YES'
          case this.ap.get(Value.NO):
            return 'NO'
          default:
            return null
        }
      })(),
      ((): string | null => {
        switch (this.ap.answer(Field.HEALTH_WELLBEING_SELF_HARMED).value) {
          case this.ap.get(Value.YES):
            return 'YES'
          case this.ap.get(Value.NO):
            return 'NO'
          default:
            return null
        }
      })(),
    ]

    if (values.some(v => v === 'YES')) return 'YES'
    if (values.some(v => v === 'NO')) return 'NO'
    return null
  }

  private q6 = (): unknown => {
    switch (this.ap.answer(Field.HEALTH_WELLBEING_MENTAL_HEALTH_CONDITION).value) {
      case this.ap.get(Value.YES_ONGOING_SEVERE):
        return '2'
      case this.ap.get(Value.YES_ONGOING):
      case this.ap.get(Value.YES_IN_THE_PAST):
        return '1'
      case this.ap.get(Value.NO):
        return '0'
      default:
        return null
    }
  }

  private qChildhoodBehaviouralProblems = (): unknown => {
    switch (this.ap.answer(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_CHILDHOOD_BEHAVIOUR).value) {
      case this.ap.get(Value.YES):
        return 'YES'
      case this.ap.get(Value.NO):
        return 'NO'
      default:
        return null
    }
  }

  private qHistoryOfHeadInjury = (): unknown => {
    switch (this.ap.answer(Field.HEALTH_WELLBEING_HEAD_INJURY_OR_ILLNESS).value) {
      case this.ap.get(Value.YES):
        return 'YES'
      case this.ap.get(Value.NO):
        return 'NO'
      default:
        return null
    }
  }

  private qHistoryOfPsychTreatment = (): unknown => {
    switch (this.ap.answer(Field.HEALTH_WELLBEING_MENTAL_HEALTH_CONDITION).value) {
      case this.ap.get(Value.YES_ONGOING_SEVERE):
      case this.ap.get(Value.YES_ONGOING):
      case this.ap.get(Value.YES_IN_THE_PAST):
        return 'YES'
      case this.ap.get(Value.NO):
      case this.ap.get(Value.UNKNOWN):
        return 'NO'
      default:
        return null
    }
  }

  private qCurrentPsychTreatment = (): unknown => {
    switch (this.ap.answer(Field.HEALTH_WELLBEING_MENTAL_HEALTH_CONDITION).value) {
      case this.ap.get(Value.NO):
      case this.ap.get(Value.UNKNOWN):
        return 'NO'
      default:
        switch (this.ap.answer(Field.HEALTH_WELLBEING_PSYCHIATRIC_TREATMENT).value) {
          case this.ap.get(Value.YES):
          case this.ap.get(Value.PENDING_TREATMENT):
            return 'YES'
          case this.ap.get(Value.NO):
          case this.ap.get(Value.UNKNOWN):
            return 'NO'
          default:
            return null
        }
    }
  }

  private q97 = (): unknown => new PractitionerAnalysis('HEALTH_WELLBEING', this.ap).notes()

  private q98 = (): unknown => new PractitionerAnalysis('HEALTH_WELLBEING', this.ap).riskOfSeriousHarm()

  private q99 = (): unknown => new PractitionerAnalysis('HEALTH_WELLBEING', this.ap).riskOfReoffending()

  private qStrength = (): unknown =>
    new PractitionerAnalysis('HEALTH_WELLBEING', this.ap).strengthsOrProtectiveFactors()
}
