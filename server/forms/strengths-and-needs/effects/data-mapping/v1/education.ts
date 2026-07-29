/** Port of oasys/datamapping/v1/Education.kt. */

import { Field, Value } from '../codes'
import { SectionMapping, type FieldsToMap } from '../common/sectionMapping'
import { PractitionerAnalysis } from './practitionerAnalysis'

export class Education extends SectionMapping {
  getFieldsToMap(): FieldsToMap {
    return {
      'o4-2': this.q2,
      'o4-3': this.q3,
      'o4-4': this.q4,
      'o4-7': this.q7,
      'o4-7-1': this.q71,
      'o4-8': this.q8,
      'o4-9': this.q9,
      'o4-10': this.q10,
      'o4-94': this.q94,
      'o4-96': this.q96,
      'o4-98': this.q98,
      o4_SAN_STRENGTH: this.qStrength,
      oSC2: this.qSC2,
      'oSC2-t': this.qSC2t,
      oSC3: this.qSC3,
      oSC4: this.qSC4,
      oSC5: this.qSC5,
      oSC8: this.qSC8,
    }
  }

  private q2 = (): unknown => {
    switch (this.ap.answer(Field.EMPLOYMENT_STATUS).value) {
      case this.ap.get(Value.UNEMPLOYED_LOOKING_FOR_WORK):
      case this.ap.get(Value.UNEMPLOYED_NOT_LOOKING_FOR_WORK):
        return 'YES'
      case this.ap.get(Value.EMPLOYED):
      case this.ap.get(Value.SELF_EMPLOYED):
        return 'NO'
      case this.ap.get(Value.RETIRED):
      case this.ap.get(Value.CURRENTLY_UNAVAILABLE_FOR_WORK):
        return 'NA'
      default:
        return null
    }
  }

  private getEmploymentHistory(): string | null {
    switch (this.ap.answer(Field.EMPLOYMENT_HISTORY).value) {
      case this.ap.get(Value.STABLE):
        return '0'
      case this.ap.get(Value.PERIODS_OF_INSTABILITY):
        return '1'
      case this.ap.get(Value.UNSTABLE):
        return '2'
      case this.ap.get(Value.UNKNOWN):
        return 'M'
      default:
        return null
    }
  }

  private q3 = (): unknown => {
    switch (this.ap.answer(Field.EMPLOYMENT_STATUS).value) {
      case this.ap.get(Value.UNEMPLOYED_NOT_LOOKING_FOR_WORK):
      case this.ap.get(Value.UNEMPLOYED_LOOKING_FOR_WORK):
        switch (this.ap.answer(Field.HAS_BEEN_EMPLOYED).value) {
          case this.ap.get(Value.NO):
            return '2'
          default:
            return this.getEmploymentHistory()
        }
      default:
        return this.getEmploymentHistory()
    }
  }

  private q4 = (): unknown => {
    switch (this.ap.answer(Field.EDUCATION_TRANSFERABLE_SKILLS).value) {
      case this.ap.get(Value.NO):
        return '2'
      case this.ap.get(Value.YES_SOME_SKILLS):
        return '1'
      case this.ap.get(Value.YES):
        return '0'
      default:
        return null
    }
  }

  private getSeverityOf(field: Field): number | null {
    switch (this.ap.answer(field).value) {
      case this.ap.get(Value.SIGNIFICANT_DIFFICULTIES):
        return 2
      case this.ap.get(Value.SOME_DIFFICULTIES):
        return 1
      default:
        return null
    }
  }

  private q7 = (): unknown => {
    const difficulties = this.ap.answer(Field.EDUCATION_DIFFICULTIES).values ?? []

    const categoryFields = [
      Field.EDUCATION_DIFFICULTIES_READING_SEVERITY,
      Field.EDUCATION_DIFFICULTIES_WRITING_SEVERITY,
      Field.EDUCATION_DIFFICULTIES_NUMERACY_SEVERITY,
    ]

    if (difficulties.includes(this.ap.get(Value.NONE))) return '0'
    if (difficulties.length > 0) {
      const severities = categoryFields
        .map(field => this.getSeverityOf(field))
        .filter((severity): severity is number => severity !== null)
      if (severities.length === 0) return null
      return Math.max(...severities).toString()
    }
    return null
  }

  private q71 = (): unknown => {
    const difficulties = this.ap.answer(Field.EDUCATION_DIFFICULTIES).values

    if (difficulties == null) return null
    if (difficulties.length === 0) return null
    if (difficulties.includes(this.ap.get(Value.NONE))) return null
    return difficulties
  }

  private q8 = (): unknown => {
    switch (this.ap.answer(Field.HEALTH_WELLBEING_LEARNING_DIFFICULTIES).value) {
      case this.ap.get(Value.YES_SIGNIFICANT_DIFFICULTIES):
        return '2'
      case this.ap.get(Value.YES_SOME_DIFFICULTIES):
        return '1'
      case this.ap.get(Value.NO):
        return '0'
      default:
        return null
    }
  }

  private q9 = (): unknown => {
    switch (this.ap.answer(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED).value) {
      case this.ap.get(Value.LEVEL_1):
      case this.ap.get(Value.ENTRY_LEVEL):
      case this.ap.get(Value.NONE_OF_THESE):
        switch (this.ap.answer(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS).value) {
          case this.ap.get(Value.YES):
            return '0'
          case this.ap.get(Value.NO):
            return '2'
          default:
            return null
        }
      case this.ap.get(Value.LEVEL_2):
      case this.ap.get(Value.LEVEL_3):
      case this.ap.get(Value.LEVEL_4):
      case this.ap.get(Value.LEVEL_5):
      case this.ap.get(Value.LEVEL_6):
      case this.ap.get(Value.LEVEL_7):
      case this.ap.get(Value.LEVEL_8):
        return '0'
      case this.ap.get(Value.NOT_SURE):
      case null:
      case undefined:
        switch (this.ap.answer(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS).value) {
          case this.ap.get(Value.YES):
            return '0'
          default:
            return null
        }
      default:
        return null
    }
  }

  private q10 = (): unknown => {
    switch (this.ap.answer(Field.EDUCATION_EXPERIENCE).value) {
      case this.ap.get(Value.POSITIVE):
      case this.ap.get(Value.MOSTLY_POSITIVE):
        return '0'
      case this.ap.get(Value.POSITIVE_AND_NEGATIVE):
        return '1'
      case this.ap.get(Value.NEGATIVE):
      case this.ap.get(Value.MOSTLY_NEGATIVE):
        return '2'
      default:
        return null
    }
  }

  private q94 = (): unknown => new PractitionerAnalysis('EMPLOYMENT_EDUCATION', this.ap).notes()

  private q96 = (): unknown => new PractitionerAnalysis('EMPLOYMENT_EDUCATION', this.ap).riskOfSeriousHarm()

  private q98 = (): unknown => new PractitionerAnalysis('EMPLOYMENT_EDUCATION', this.ap).riskOfReoffending()

  private qStrength = (): unknown =>
    new PractitionerAnalysis('EMPLOYMENT_EDUCATION', this.ap).strengthsOrProtectiveFactors()

  private qSC2 = (): unknown => {
    switch (this.ap.answer(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS).value) {
      case this.ap.get(Value.YES):
        return 'YES'
      case this.ap.get(Value.NO):
        return 'NO'
      default:
        return null
    }
  }

  private qSC2t = (): unknown =>
    this.ap.answer(Field.EDUCATION_PROFESSIONAL_OR_VOCATIONAL_QUALIFICATIONS_YES_DETAILS).value

  private qSC3 = (): unknown => {
    switch (this.ap.answer(Field.EDUCATION_HIGHEST_LEVEL_COMPLETED).value) {
      case this.ap.get(Value.ENTRY_LEVEL):
        return 'ANYOTHER'
      case this.ap.get(Value.LEVEL_1):
      case this.ap.get(Value.LEVEL_2):
      case this.ap.get(Value.LEVEL_3):
      case this.ap.get(Value.LEVEL_4):
      case this.ap.get(Value.LEVEL_5):
      case this.ap.get(Value.LEVEL_6):
      case this.ap.get(Value.LEVEL_7):
      case this.ap.get(Value.LEVEL_8):
        return 'MATHSENGLISH'
      case this.ap.get(Value.NONE_OF_THESE):
        return 'NOQUAL'
      default:
        return null
    }
  }

  private qSC4 = (): unknown => {
    switch (this.ap.answer(Field.EMPLOYMENT_STATUS).value) {
      case this.ap.get(Value.RETIRED):
        return 'FULLTIME'
      case this.ap.get(Value.EMPLOYED):
        switch (this.ap.answer(Field.EMPLOYMENT_TYPE).value) {
          case this.ap.get(Value.FULL_TIME):
            return 'FULLTIME'
          case this.ap.get(Value.PART_TIME):
          case this.ap.get(Value.TEMPORARY_OR_CASUAL):
          case this.ap.get(Value.APPRENTICESHIP):
            return 'PARTTIME'
          default:
            return null
        }
      case this.ap.get(Value.CURRENTLY_UNAVAILABLE_FOR_WORK):
      case this.ap.get(Value.UNEMPLOYED_LOOKING_FOR_WORK):
      case this.ap.get(Value.UNEMPLOYED_NOT_LOOKING_FOR_WORK):
        switch (this.ap.answer(Field.HAS_BEEN_EMPLOYED).value) {
          case this.ap.get(Value.NO):
            return 'UNEMPLOYED'
          default:
            return null
        }
      default:
        return null
    }
  }

  private qSC5 = (): unknown => {
    switch (this.ap.answer(Field.EMPLOYMENT_STATUS).value) {
      case this.ap.get(Value.EMPLOYED):
      case this.ap.get(Value.SELF_EMPLOYED):
        return 'YES'
      case this.ap.get(Value.UNEMPLOYED_LOOKING_FOR_WORK):
      case this.ap.get(Value.UNEMPLOYED_NOT_LOOKING_FOR_WORK):
        return 'NO'
      default:
        return null
    }
  }

  private qSC8 = (): unknown => {
    switch (this.ap.answer(Field.FINANCE_MONEY_MANAGEMENT).value) {
      case this.ap.get(Value.GOOD):
        return 'YES'
      case this.ap.get(Value.FAIRLY_GOOD):
        return 'SOMETIMES'
      case this.ap.get(Value.FAIRLY_BAD):
      case this.ap.get(Value.BAD):
        return 'NOTCONFIDENT'
      default:
        return null
    }
  }
}
