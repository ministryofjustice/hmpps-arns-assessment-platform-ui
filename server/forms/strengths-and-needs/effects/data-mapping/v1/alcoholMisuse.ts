/** Port of oasys/datamapping/v1/AlcoholMisuse.kt. */

import { Field, Value } from '../codes'
import { SectionMapping, type FieldsToMap } from '../common/sectionMapping'
import { PractitionerAnalysis } from './practitionerAnalysis'

export class AlcoholMisuse extends SectionMapping {
  getFieldsToMap(): FieldsToMap {
    return {
      'o9-1': this.q1,
      'o9-1-t': this.q1t,
      'o9-2': this.q2,
      'o9-97': this.q97,
      'o9-98': this.q98,
      'o9-99': this.q99,
      o9_SAN_STRENGTH: this.qStrength,
    }
  }

  private q1 = (): unknown => {
    switch (this.ap.answer(Field.ALCOHOL_USE).value) {
      case this.ap.get(Value.YES_WITHIN_LAST_THREE_MONTHS): {
        let total = 0
        total = this.calculateFrequencyScore(total)
        total = this.calculateUnitsScore(total)
        return this.calculateOasysScore(total)
      }
      case this.ap.get(Value.NO):
      case this.ap.get(Value.YES_NOT_IN_LAST_THREE_MONTHS):
        return '0'
      default:
        return null
    }
  }

  private calculateOasysScore(total: number): string | null {
    if (total >= 8) return '2'
    if (total >= 5 && total <= 7) return '1'
    if (total >= 0 && total <= 4) return '0'
    return null
  }

  private calculateUnitsScore(total: number): number {
    switch (this.ap.answer(Field.ALCOHOL_UNITS).value) {
      case this.ap.get(Value.UNITS_3_TO_4):
        return total + 1
      case this.ap.get(Value.UNITS_5_TO_6):
        return total + 2
      case this.ap.get(Value.UNITS_7_TO_9):
        return total + 3
      case this.ap.get(Value.UNITS_10_OR_MORE):
        return total + 4
      default:
        return total
    }
  }

  private calculateFrequencyScore(total: number): number {
    switch (this.ap.answer(Field.ALCOHOL_FREQUENCY).value) {
      case this.ap.get(Value.MULTIPLE_TIMES_A_MONTH):
        return total + 1
      case this.ap.get(Value.LESS_THAN_4_TIMES_A_WEEK):
        return total + 3
      case this.ap.get(Value.MORE_THAN_4_TIMES_A_WEEK):
        return total + 4
      default:
        return total
    }
  }

  private q1t = (): unknown => {
    switch (this.ap.answer(Field.ALCOHOL_USE).value) {
      case this.ap.get(Value.YES_WITHIN_LAST_THREE_MONTHS): {
        const frequencyText = ((): string | null => {
          switch (this.ap.answer(Field.ALCOHOL_FREQUENCY).value) {
            case this.ap.get(Value.ONCE_A_MONTH_OR_LESS):
              return 'Only drinks once a month or less'
            case this.ap.get(Value.MULTIPLE_TIMES_A_MONTH):
              return 'Drinks multiple times a month'
            case this.ap.get(Value.LESS_THAN_4_TIMES_A_WEEK):
              return 'Drinks less than four times a week'
            case this.ap.get(Value.MORE_THAN_4_TIMES_A_WEEK):
              return 'Drinks more than four times a week'
            default:
              return null
          }
        })()

        const unitsText = ((): string | null => {
          switch (this.ap.answer(Field.ALCOHOL_UNITS).value) {
            case this.ap.get(Value.UNITS_1_TO_2):
              return 'consumes 1 to 2 units a day, when they drink'
            case this.ap.get(Value.UNITS_3_TO_4):
              return 'consumes 3 to 4 units a day, when they drink'
            case this.ap.get(Value.UNITS_5_TO_6):
              return 'consumes 5 to 6 units a day, when they drink'
            case this.ap.get(Value.UNITS_7_TO_9):
              return 'consumes 7 to 9 units a day, when they drink'
            case this.ap.get(Value.UNITS_10_OR_MORE):
              return 'consumes 10 or more units a day, when they drink'
            default:
              return null
          }
        })()

        return frequencyText !== null && unitsText !== null ? `${frequencyText} and ${unitsText}.` : null
      }
      default:
        return null
    }
  }

  private q2 = (): unknown => {
    switch (this.ap.answer(Field.ALCOHOL_USE).value) {
      case this.ap.get(Value.YES_WITHIN_LAST_THREE_MONTHS):
      case this.ap.get(Value.YES_NOT_IN_LAST_THREE_MONTHS):
        switch (this.ap.answer(Field.ALCOHOL_EVIDENCE_OF_EXCESS_DRINKING).value) {
          case this.ap.get(Value.NO_EVIDENCE):
            return '0'
          case this.ap.get(Value.YES_WITH_SOME_EVIDENCE):
            return '1'
          case this.ap.get(Value.YES_WITH_EVIDENCE):
            return '2'
          default:
            return null
        }
      case this.ap.get(Value.NO):
        return '0'
      default:
        return null
    }
  }

  private q97 = (): unknown => new PractitionerAnalysis('ALCOHOL_USE', this.ap).notes()

  private q98 = (): unknown => new PractitionerAnalysis('ALCOHOL_USE', this.ap).riskOfSeriousHarm()

  private q99 = (): unknown => new PractitionerAnalysis('ALCOHOL_USE', this.ap).riskOfReoffending()

  private qStrength = (): unknown => new PractitionerAnalysis('ALCOHOL_USE', this.ap).strengthsOrProtectiveFactors()
}
