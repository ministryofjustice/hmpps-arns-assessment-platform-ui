/** Port of oasys/datamapping/v1/FinancialManagement.kt. */

import { Field, Value } from '../codes'
import { SectionMapping, type FieldsToMap } from '../common/sectionMapping'
import { PractitionerAnalysis } from './practitionerAnalysis'

export class FinancialManagement extends SectionMapping {
  getFieldsToMap(): FieldsToMap {
    return {
      'o5-3': this.q3,
      'o5-4': this.q4,
      'o5-5': this.q5,
      'o5-6': this.q6,
      'o5-97': this.q97,
      'o5-98': this.q98,
      'o5-99': this.q99,
      o5_SAN_STRENGTH: this.qStrength,
    }
  }

  private q3 = (): unknown => {
    switch (this.ap.answer(Field.FINANCE_MONEY_MANAGEMENT).value) {
      case this.ap.get(Value.GOOD):
      case this.ap.get(Value.FAIRLY_GOOD):
        return '0'
      case this.ap.get(Value.FAIRLY_BAD):
        return '1'
      case this.ap.get(Value.BAD):
        return '2'
      default:
        return null
    }
  }

  private q4 = (): unknown => {
    const income = this.ap.answer(Field.FINANCE_INCOME).values

    if (income == null) return null
    if (income.includes(this.ap.get(Value.OFFENDING))) {
      return income.length === 1 ? '2' : '1'
    }
    if (income.includes(this.ap.get(Value.UNKNOWN))) return 'M'
    return '0'
  }

  private q5 = (): unknown => {
    const income = this.ap.answer(Field.FINANCE_INCOME).values
    const containsFamilyOrFriends = income?.includes(this.ap.get(Value.FAMILY_OR_FRIENDS))

    if (containsFamilyOrFriends === undefined || income == null) return null
    if (containsFamilyOrFriends) {
      switch (this.ap.answer(Field.FAMILY_OR_FRIENDS_DETAILS).value) {
        case this.ap.get(Value.YES):
          return '2'
        case this.ap.get(Value.UNKNOWN):
          return 'M'
        default:
          return '0'
      }
    }
    return '0'
  }

  private q6 = (): unknown => {
    switch (this.ap.answer(Field.FINANCE_MONEY_MANAGEMENT).value) {
      case this.ap.get(Value.GOOD):
      case this.ap.get(Value.FAIRLY_GOOD):
        return '0'
      default:
        return null
    }
  }

  private q97 = (): unknown => new PractitionerAnalysis('FINANCE', this.ap).notes()

  private q98 = (): unknown => new PractitionerAnalysis('FINANCE', this.ap).riskOfSeriousHarm()

  private q99 = (): unknown => new PractitionerAnalysis('FINANCE', this.ap).riskOfReoffending()

  private qStrength = (): unknown => new PractitionerAnalysis('FINANCE', this.ap).strengthsOrProtectiveFactors()
}
