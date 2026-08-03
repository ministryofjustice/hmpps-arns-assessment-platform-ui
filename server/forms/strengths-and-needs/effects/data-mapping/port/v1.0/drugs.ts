/** Port of oasys/datamapping/v1/Drugs.kt. */

import { Field, Value } from '../codes'
import { SectionMapping, type FieldsToMap } from '../common/sectionMapping'
import { PractitionerAnalysis } from './practitionerAnalysis'

export class Drugs extends SectionMapping {
  getFieldsToMap(): FieldsToMap {
    return {
      'o8-1': this.q1,
      'o8-2-1-1': this.q2011,
      'o8-2-1-3': this.q2013,
      'o8-2-1-2': this.q2012,
      'o8-2-1-4': this.q2014,
      'o8-2-2-1': this.q2021,
      'o8-2-2-3': this.q2023,
      'o8-2-2-2': this.q2022,
      'o8-2-2-4': this.q2024,
      'o8-2-3-1': this.q2031,
      'o8-2-3-3': this.q2033,
      'o8-2-3-2': this.q2032,
      'o8-2-3-4': this.q2034,
      'o8-2-4-1': this.q2041,
      'o8-2-4-2': this.q2042,
      'o8-2-4-3': this.q2043,
      'o8-2-4-4': this.q2044,
      'o8-2-5-1': this.q2051,
      'o8-2-5-2': this.q2052,
      'o8-2-5-3': this.q2053,
      'o8-2-5-4': this.q2054,
      'o8-2-6-1': this.q2061,
      'o8-2-6-2': this.q2062,
      'o8-2-6-3': this.q2063,
      'o8-2-6-4': this.q2064,
      'o8-2-7-1': this.q2071,
      'o8-2-7-3': this.q2073,
      'o8-2-7-2': this.q2072,
      'o8-2-7-4': this.q2074,
      'o8-2-8-1': this.q2081,
      'o8-2-8-2': this.q2082,
      'o8-2-8-3': this.q2083,
      'o8-2-8-4': this.q2084,
      'o8-2-9-1': this.q2091,
      'o8-2-9-3': this.q2093,
      'o8-2-10-1': this.q2101,
      'o8-2-10-3': this.q2103,
      'o8-2-11-1': this.q2111,
      'o8-2-11-3': this.q2113,
      'o8-2-12-1': this.q2121,
      'o8-2-12-3': this.q2123,
      'o8-2-13-1': this.q2131,
      'o8-2-13-2': this.q2132,
      'o8-2-13-3': this.q2133,
      'o8-2-13-4': this.q2134,
      'o8-2-15-1': this.q2151,
      'o8-2-15-3': this.q2153,
      'o8-2-14-1': this.q2141,
      'o8-2-14-2': this.q2142,
      'o8-2-14-3': this.q2143,
      'o8-2-14-4': this.q2144,
      'o8-2-14-t': this.q214t,
      'o8-4': this.q4,
      'o8-5': this.q5,
      'o8-6': this.q6,
      'o8-8': this.q8,
      'o8-97': this.q97,
      'o8-98': this.q98,
      'o8-99': this.q99,
      o8_SAN_STRENGTH: this.qStrength,
    }
  }

  private getUsageFrequencyScore(field: Field): string | null {
    switch (this.ap.answer(field).value) {
      case this.ap.get(Value.DAILY):
        return '100'
      case this.ap.get(Value.WEEKLY):
        return '110'
      case this.ap.get(Value.MONTHLY):
        return '120'
      case this.ap.get(Value.OCCASIONALLY):
        return '130'
      default:
        return null
    }
  }

  private isUsing(field: Field, frequencies: Value[]): boolean {
    const usage = this.ap.answer(field).value
    if (usage == null) return false
    return frequencies.map(f => this.ap.get(f)).includes(usage)
  }

  private isMoreThanSix(field: Field): boolean {
    return this.ap.answer(field).value === this.ap.get(Value.MORE_THAN_SIX)
  }

  private isLastSix(field: Field): boolean {
    return this.ap.answer(field).value === this.ap.get(Value.LAST_SIX)
  }

  private containsMoreThanSix(field: Field): boolean {
    return (this.ap.answer(field).values ?? []).includes(this.ap.get(Value.MORE_THAN_SIX))
  }

  private containsLastSix(field: Field): boolean {
    return (this.ap.answer(field).values ?? []).includes(this.ap.get(Value.LAST_SIX))
  }

  private hasInjected(value: Value): boolean {
    return (this.ap.answer(Field.DRUGS_INJECTED).values ?? []).includes(this.ap.get(value))
  }

  private yesIfContains(field: Field, value: Value): string | null {
    const values = this.ap.answer(field).values
    if (values == null) return null
    return values.includes(this.ap.get(value)) ? 'YES' : null
  }

  private q1 = (): unknown => {
    switch (this.ap.answer(Field.DRUG_USE).value) {
      case this.ap.get(Value.YES):
        return 'YES'
      case this.ap.get(Value.NO):
        return 'NO'
      default:
        return null
    }
  }

  private q2011 = (): unknown => this.getUsageFrequencyScore(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HEROIN)

  private q2013 = (): unknown => (this.isMoreThanSix(Field.DRUG_LAST_USED_HEROIN) ? 'YES' : null)

  private q2012 = (): unknown => this.yesIfContains(Field.DRUGS_INJECTED_HEROIN, Value.LAST_SIX)

  private q2014 = (): unknown => this.yesIfContains(Field.DRUGS_INJECTED_HEROIN, Value.MORE_THAN_SIX)

  private q2021 = (): unknown =>
    this.getUsageFrequencyScore(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_METHADONE_NOT_PRESCRIBED)

  private q2023 = (): unknown => (this.isMoreThanSix(Field.DRUG_LAST_USED_METHADONE_NOT_PRESCRIBED) ? 'YES' : null)

  private q2022 = (): unknown => this.yesIfContains(Field.DRUGS_INJECTED_METHADONE_NOT_PRESCRIBED, Value.LAST_SIX)

  private q2024 = (): unknown => this.yesIfContains(Field.DRUGS_INJECTED_METHADONE_NOT_PRESCRIBED, Value.MORE_THAN_SIX)

  private q2031 = (): unknown => this.getUsageFrequencyScore(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_OPIATES)

  private q2033 = (): unknown => (this.isMoreThanSix(Field.DRUG_LAST_USED_OTHER_OPIATES) ? 'YES' : null)

  private q2032 = (): unknown => this.yesIfContains(Field.DRUGS_INJECTED_OTHER_OPIATES, Value.LAST_SIX)

  private q2034 = (): unknown => this.yesIfContains(Field.DRUGS_INJECTED_OTHER_OPIATES, Value.MORE_THAN_SIX)

  private q2041 = (): unknown => this.getUsageFrequencyScore(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CRACK)

  private q2043 = (): unknown => (this.isMoreThanSix(Field.DRUG_LAST_USED_CRACK) ? 'YES' : null)

  private q2042 = (): unknown => this.yesIfContains(Field.DRUGS_INJECTED_CRACK, Value.LAST_SIX)

  private q2044 = (): unknown => this.yesIfContains(Field.DRUGS_INJECTED_CRACK, Value.MORE_THAN_SIX)

  private q2051 = (): unknown => this.getUsageFrequencyScore(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_COCAINE)

  private q2053 = (): unknown => (this.isMoreThanSix(Field.DRUG_LAST_USED_COCAINE) ? 'YES' : null)

  private q2052 = (): unknown => this.yesIfContains(Field.DRUGS_INJECTED_COCAINE, Value.LAST_SIX)

  private q2054 = (): unknown => this.yesIfContains(Field.DRUGS_INJECTED_COCAINE, Value.MORE_THAN_SIX)

  private q2061 = (): unknown =>
    this.getUsageFrequencyScore(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_MISUSED_PRESCRIBED_DRUGS)

  private q2063 = (): unknown => (this.isMoreThanSix(Field.DRUG_LAST_USED_MISUSED_PRESCRIBED_DRUGS) ? 'YES' : null)

  private q2062 = (): unknown => this.yesIfContains(Field.DRUGS_INJECTED_MISUSED_PRESCRIBED_DRUGS, Value.LAST_SIX)

  private q2064 = (): unknown => this.yesIfContains(Field.DRUGS_INJECTED_MISUSED_PRESCRIBED_DRUGS, Value.MORE_THAN_SIX)

  private q2071 = (): unknown => this.getUsageFrequencyScore(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_BENZODIAZEPINES)

  private q2073 = (): unknown => (this.isMoreThanSix(Field.DRUG_LAST_USED_BENZODIAZEPINES) ? 'YES' : null)

  private q2072 = (): unknown => this.yesIfContains(Field.DRUGS_INJECTED_BENZODIAZEPINES, Value.LAST_SIX)

  private q2074 = (): unknown => this.yesIfContains(Field.DRUGS_INJECTED_BENZODIAZEPINES, Value.MORE_THAN_SIX)

  private q2081 = (): unknown => this.getUsageFrequencyScore(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_AMPHETAMINES)

  private q2083 = (): unknown => (this.isMoreThanSix(Field.DRUG_LAST_USED_AMPHETAMINES) ? 'YES' : null)

  private q2082 = (): unknown => this.yesIfContains(Field.DRUGS_INJECTED_AMPHETAMINES, Value.LAST_SIX)

  private q2084 = (): unknown => this.yesIfContains(Field.DRUGS_INJECTED_AMPHETAMINES, Value.MORE_THAN_SIX)

  private q2091 = (): unknown => this.getUsageFrequencyScore(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HALLUCINOGENICS)

  private q2093 = (): unknown => (this.isMoreThanSix(Field.DRUG_LAST_USED_HALLUCINOGENICS) ? 'YES' : null)

  private q2101 = (): unknown => this.getUsageFrequencyScore(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_ECSTASY)

  private q2103 = (): unknown => (this.isMoreThanSix(Field.DRUG_LAST_USED_ECSTASY) ? 'YES' : null)

  private q2111 = (): unknown => this.getUsageFrequencyScore(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CANNABIS)

  private q2113 = (): unknown => (this.isMoreThanSix(Field.DRUG_LAST_USED_CANNABIS) ? 'YES' : null)

  private q2121 = (): unknown => this.getUsageFrequencyScore(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SOLVENTS)

  private q2123 = (): unknown => (this.isMoreThanSix(Field.DRUG_LAST_USED_SOLVENTS) ? 'YES' : null)

  private q2131 = (): unknown => this.getUsageFrequencyScore(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_STEROIDS)

  private q2133 = (): unknown => (this.isMoreThanSix(Field.DRUG_LAST_USED_STEROIDS) ? 'YES' : null)

  private q2132 = (): unknown => this.yesIfContains(Field.DRUGS_INJECTED_STEROIDS, Value.LAST_SIX)

  private q2134 = (): unknown => this.yesIfContains(Field.DRUGS_INJECTED_STEROIDS, Value.MORE_THAN_SIX)

  private q2151 = (): unknown => this.getUsageFrequencyScore(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SPICE)

  private q2153 = (): unknown => (this.isMoreThanSix(Field.DRUG_LAST_USED_SPICE) ? 'YES' : null)

  private q2141 = (): unknown => this.getUsageFrequencyScore(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_DRUG)

  private q2143 = (): unknown => (this.isMoreThanSix(Field.DRUG_LAST_USED_OTHER_DRUG) ? 'YES' : null)

  private q2142 = (): unknown => this.yesIfContains(Field.DRUGS_INJECTED_OTHER_DRUG, Value.LAST_SIX)

  private q2144 = (): unknown => this.yesIfContains(Field.DRUGS_INJECTED_OTHER_DRUG, Value.MORE_THAN_SIX)

  private q214t = (): unknown => this.ap.answer(Field.OTHER_DRUG_NAME).value

  private q4 = (): unknown => {
    const frequencies = [Value.DAILY, Value.WEEKLY, Value.MONTHLY, Value.OCCASIONALLY]
    const anyUsing =
      this.isUsing(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HEROIN, frequencies) ||
      this.isUsing(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_METHADONE_NOT_PRESCRIBED, frequencies) ||
      this.isUsing(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_OPIATES, frequencies) ||
      this.isUsing(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CRACK, frequencies) ||
      this.isUsing(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_COCAINE, frequencies) ||
      this.isUsing(Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_MISUSED_PRESCRIBED_DRUGS, frequencies)
    return anyUsing ? '2' : '0'
  }

  private q5 = (): unknown => {
    const dailyOrWeekly = [Value.DAILY, Value.WEEKLY]
    const monthlyOrOccasionally = [Value.MONTHLY, Value.OCCASIONALLY]
    const drugs = [
      Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HEROIN,
      Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_METHADONE_NOT_PRESCRIBED,
      Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_OPIATES,
      Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CRACK,
      Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_COCAINE,
      Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_MISUSED_PRESCRIBED_DRUGS,
      Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_BENZODIAZEPINES,
      Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_AMPHETAMINES,
      Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_HALLUCINOGENICS,
      Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_ECSTASY,
      Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_CANNABIS,
      Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SOLVENTS,
      Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_STEROIDS,
      Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_SPICE,
      Field.HOW_OFTEN_USED_LAST_SIX_MONTHS_OTHER_DRUG,
    ]

    const drugsLastUsed = [
      Field.DRUG_LAST_USED_AMPHETAMINES,
      Field.DRUG_LAST_USED_BENZODIAZEPINES,
      Field.DRUG_LAST_USED_CANNABIS,
      Field.DRUG_LAST_USED_COCAINE,
      Field.DRUG_LAST_USED_CRACK,
      Field.DRUG_LAST_USED_ECSTASY,
      Field.DRUG_LAST_USED_HALLUCINOGENICS,
      Field.DRUG_LAST_USED_HEROIN,
      Field.DRUG_LAST_USED_METHADONE_NOT_PRESCRIBED,
      Field.DRUG_LAST_USED_MISUSED_PRESCRIBED_DRUGS,
      Field.DRUG_LAST_USED_OTHER_OPIATES,
      Field.DRUG_LAST_USED_SOLVENTS,
      Field.DRUG_LAST_USED_STEROIDS,
      Field.DRUG_LAST_USED_SPICE,
      Field.DRUG_LAST_USED_OTHER_DRUG,
    ]

    if (drugs.some(field => this.isUsing(field, dailyOrWeekly))) return '2'
    if (drugs.some(field => this.isUsing(field, monthlyOrOccasionally))) return '0'
    if (drugsLastUsed.some(field => this.isLastSix(field))) return 'M'
    if (drugsLastUsed.some(field => this.isMoreThanSix(field))) return '0'
    return null
  }

  private q6 = (): unknown => {
    const drugsInjected = [
      Field.DRUGS_INJECTED_HEROIN,
      Field.DRUGS_INJECTED_METHADONE_NOT_PRESCRIBED,
      Field.DRUGS_INJECTED_OTHER_OPIATES,
      Field.DRUGS_INJECTED_CRACK,
      Field.DRUGS_INJECTED_COCAINE,
      Field.DRUGS_INJECTED_MISUSED_PRESCRIBED_DRUGS,
      Field.DRUGS_INJECTED_BENZODIAZEPINES,
      Field.DRUGS_INJECTED_AMPHETAMINES,
      Field.DRUGS_INJECTED_STEROIDS,
      Field.DRUGS_INJECTED_OTHER_DRUG,
    ]

    const injectableDrugs = [
      Value.AMPHETAMINES,
      Value.BENZODIAZEPINES,
      Value.COCAINE,
      Value.CRACK,
      Value.HEROIN,
      Value.METHADONE_NOT_PRESCRIBED,
      Value.MISUSED_PRESCRIBED_DRUGS,
      Value.OTHER_OPIATES,
      Value.STEROIDS,
      Value.OTHER_DRUG,
    ]

    if (drugsInjected.some(field => this.containsLastSix(field))) return '2'
    if (
      drugsInjected.some(field => this.containsMoreThanSix(field)) ||
      injectableDrugs.some(value => this.hasInjected(value))
    )
      return '1'
    return '0'
  }

  private q8 = (): unknown => {
    switch (this.ap.answer(Field.DRUGS_PRACTITIONER_ANALYSIS_MOTIVATED_TO_STOP).value) {
      case this.ap.get(Value.FULL_MOTIVATION):
        return '0'
      case this.ap.get(Value.PARTIAL_MOTIVATION):
        return '1'
      case this.ap.get(Value.NO_MOTIVATION):
        return '2'
      case this.ap.get(Value.UNKNOWN):
        return 'M'
      default:
        return null
    }
  }

  private q97 = (): unknown => new PractitionerAnalysis('DRUG_USE', this.ap).notes()

  private q98 = (): unknown => new PractitionerAnalysis('DRUG_USE', this.ap).riskOfSeriousHarm()

  private q99 = (): unknown => new PractitionerAnalysis('DRUG_USE', this.ap).riskOfReoffending()

  private qStrength = (): unknown => new PractitionerAnalysis('DRUG_USE', this.ap).strengthsOrProtectiveFactors()
}
