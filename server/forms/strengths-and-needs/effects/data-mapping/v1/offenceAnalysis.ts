/** Port of oasys/datamapping/v1/OffenceAnalysis.kt. */

import { Field, fieldLower, Value } from '../codes'
import { SectionMapping, type FieldsToMap } from '../common/sectionMapping'
import type { Answers } from '../answers'

export class OffenceAnalysis extends SectionMapping {
  getFieldsToMap(): FieldsToMap {
    return {
      'o2-1': this.q1,
      'o2-2_V2_WEAPON': this.q2Weapon,
      'o2-2_V2_ANYVIOL': this.q2ViolenceOrCoercion,
      'o2-2_V2_ARSON': this.q2Arson,
      'o2-2_V2_DOM_ABUSE': this.q2DomesticAbuse,
      'o2-2_V2_EXCESSIVE': this.q2ExcessiveOrSadisticViolence,
      'o2-2_V2_PHYSICALDAM': this.q2PhysicalDamageToProperty,
      'o2-2_V2_SEXUAL': this.q2SexualElement,
      'o2-3': this.q3,
      'o2-6': this.q6,
      'o2-7': this.q7,
      'o2-7-1': this.q71,
      'o2-7-2': this.q72,
      'o2-7-3': this.q73,
      'o2-8': this.q8,
      'o2-9_V2_SEXUAL': this.q9SexualMotivations,
      'o2-9_V2_FINANCIAL': this.q9FinancialMotivations,
      'o2-9_V2_ADDICTION': this.q9AddictionMotivations,
      'o2-9_V2_EMOTIONAL': this.q9EmotionalMotivations,
      'o2-9_V2_RACIAL': this.q9RacialMotivations,
      'o2-9_V2_THRILL': this.q29ThrillMotivations,
      'o2-9_V2_OTHER': this.q29OtherMotivations,
      'o2-9-t_V2': this.q29t,
      'o2-11': this.q11,
      'o2-11-t': this.q11t,
      'o2-12': this.q12,
      'o2-13': this.q13,
      'o2-98': this.q98,
      'o2-99': this.q99,
      ...this.buildVictimCollectionAnswers(),
    }
  }

  private mapVictimAge(entry: Answers): string | null {
    this.ap.setContext(Field.OFFENCE_ANALYSIS_VICTIM_AGE)
    switch (entry[fieldLower(Field.OFFENCE_ANALYSIS_VICTIM_AGE)]?.value) {
      case this.ap.get(Value.AGE_0_TO_4_YEARS):
        return '0'
      case this.ap.get(Value.AGE_5_TO_11_YEARS):
        return '1'
      case this.ap.get(Value.AGE_12_TO_15_YEARS):
        return '2'
      case this.ap.get(Value.AGE_16_TO_17_YEARS):
        return '3'
      case this.ap.get(Value.AGE_18_TO_20_YEARS):
        return '4'
      case this.ap.get(Value.AGE_21_TO_25_YEARS):
        return '5'
      case this.ap.get(Value.AGE_26_TO_49_YEARS):
        return '6'
      case this.ap.get(Value.AGE_50_TO_64_YEARS):
        return '7'
      case this.ap.get(Value.AGE_65_AND_OVER):
        return '8'
      default:
        return null
    }
  }

  private mapVictimGender(entry: Answers): string | null {
    this.ap.setContext(Field.OFFENCE_ANALYSIS_VICTIM_SEX)
    switch (entry[fieldLower(Field.OFFENCE_ANALYSIS_VICTIM_SEX)]?.value) {
      case this.ap.get(Value.MALE):
        return '1'
      case this.ap.get(Value.FEMALE):
        return '2'
      case this.ap.get(Value.UNKNOWN):
        return '0'
      default:
        return null
    }
  }

  private mapVictimRace(entry: Answers): string | null {
    this.ap.setContext(Field.OFFENCE_ANALYSIS_VICTIM_RACE)
    switch (entry[fieldLower(Field.OFFENCE_ANALYSIS_VICTIM_RACE)]?.value) {
      case this.ap.get(Value.WHITE_ENGLISH_WELSH_SCOTTISH_NORTHERN_IRISH_OR_BRITISH):
        return 'W1'
      case this.ap.get(Value.WHITE_IRISH):
        return 'W2'
      case this.ap.get(Value.WHITE_GYPSY_OR_IRISH_TRAVELLER):
        return 'W4'
      case this.ap.get(Value.WHITE_ROMA):
        return 'W5'
      case this.ap.get(Value.WHITE_ANY_OTHER_WHITE_BACKGROUND):
        return 'W9'
      case this.ap.get(Value.MIXED_WHITE_AND_BLACK_CARIBBEAN):
        return 'M1'
      case this.ap.get(Value.MIXED_WHITE_AND_BLACK_AFRICAN):
        return 'M2'
      case this.ap.get(Value.MIXED_WHITE_AND_ASIAN):
        return 'M3'
      case this.ap.get(Value.MIXED_ANY_OTHER_MIXED_OR_MULTIPLE_ETHNIC_BACKGROUND_BACKGROUND):
        return 'M9'
      case this.ap.get(Value.ASIAN_OR_ASIAN_BRITISH_INDIAN):
        return 'A1'
      case this.ap.get(Value.ASIAN_OR_ASIAN_BRITISH_PAKISTANI):
        return 'A2'
      case this.ap.get(Value.ASIAN_OR_ASIAN_BRITISH_BANGLADESHI):
        return 'A3'
      case this.ap.get(Value.ASIAN_OR_ASIAN_BRITISH_CHINESE):
        return 'A4'
      case this.ap.get(Value.ASIAN_OR_ASIAN_BRITISH_ANY_OTHER_ASIAN_BACKGROUND):
        return 'A9'
      case this.ap.get(Value.BLACK_OR_BLACK_BRITISH_CARIBBEAN):
        return 'B1'
      case this.ap.get(Value.BLACK_OR_BLACK_BRITISH_AFRICAN):
        return 'B2'
      case this.ap.get(Value.BLACK_OR_BLACK_BRITISH_ANY_OTHER_BLACK_BACKGROUND):
        return 'B9'
      case this.ap.get(Value.ARAB):
        return 'O2'
      case this.ap.get(Value.ANY_OTHER_ETHNIC_GROUP):
        return 'O9'
      case this.ap.get(Value.UNKNOWN):
        return 'NS'
      default:
        return null
    }
  }

  private mapVictimRelationship(entry: Answers): string | null {
    this.ap.setContext(Field.OFFENCE_ANALYSIS_VICTIM_RELATIONSHIP)
    switch (entry[fieldLower(Field.OFFENCE_ANALYSIS_VICTIM_RELATIONSHIP)]?.value) {
      case this.ap.get(Value.STRANGER):
        return '0'
      case this.ap.get(Value.CRIMINAL_JUSTICE_STAFF):
        return '12'
      case this.ap.get(Value.POP_PARENT_OR_STEP_PARENT):
        return '14'
      case this.ap.get(Value.POP_EX_PARTNER):
        return '15'
      case this.ap.get(Value.POP_CHILD_OR_STEP_CHILD):
        return '5'
      case this.ap.get(Value.OTHER_FAMILY_MEMBER):
        return '6'
      case this.ap.get(Value.POP_PARTNER):
        return '1'
      case this.ap.get(Value.OTHER):
        return '13'
      default:
        return null
    }
  }

  private buildVictimCollectionAnswers(): FieldsToMap {
    const collection = this.ap.answer(Field.OFFENCE_ANALYSIS_VICTIMS_COLLECTION).collection

    const result: FieldsToMap = {}
    collection.forEach((entry, index) => {
      result[`victim${index}`] = () => ({
        oAGE_OF_VICTIM_ELM: this.mapVictimAge(entry),
        oGENDER_ELM: this.mapVictimGender(entry),
        oETHNIC_CATEGORY_ELM: this.mapVictimRace(entry),
        oVICTIM_RELATION_ELM: this.mapVictimRelationship(entry),
      })
    })
    return result
  }

  private q1 = (): unknown => this.ap.answer(Field.OFFENCE_ANALYSIS_DESCRIPTION_OF_OFFENCE).value

  private q2Weapon = (): unknown => {
    const values = this.ap.answer(Field.OFFENCE_ANALYSIS_ELEMENTS).values
    if (values == null) return null
    return values.includes(this.ap.get(Value.WEAPON)) ? 'YES' : 'NO'
  }

  private q2ViolenceOrCoercion = (): unknown => {
    const values = this.ap.answer(Field.OFFENCE_ANALYSIS_ELEMENTS).values
    if (values == null) return null
    return values.includes(this.ap.get(Value.VIOLENCE_OR_COERCION)) ? 'YES' : 'NO'
  }

  private q2Arson = (): unknown => {
    const values = this.ap.answer(Field.OFFENCE_ANALYSIS_ELEMENTS).values
    if (values == null) return null
    return values.includes(this.ap.get(Value.ARSON)) ? 'YES' : 'NO'
  }

  private q2DomesticAbuse = (): unknown => {
    const values = this.ap.answer(Field.OFFENCE_ANALYSIS_ELEMENTS).values
    if (values == null) return null
    return values.includes(this.ap.get(Value.DOMESTIC_ABUSE)) ? 'YES' : 'NO'
  }

  private q2ExcessiveOrSadisticViolence = (): unknown => {
    const values = this.ap.answer(Field.OFFENCE_ANALYSIS_ELEMENTS).values
    if (values == null) return null
    return values.includes(this.ap.get(Value.EXCESSIVE_OR_SADISTIC_VIOLENCE)) ? 'YES' : 'NO'
  }

  private q2PhysicalDamageToProperty = (): unknown => {
    const values = this.ap.answer(Field.OFFENCE_ANALYSIS_ELEMENTS).values
    if (values == null) return null
    return values.includes(this.ap.get(Value.PHYSICAL_DAMAGE_TO_PROPERTY)) ? 'YES' : 'NO'
  }

  private q2SexualElement = (): unknown => {
    const values = this.ap.answer(Field.OFFENCE_ANALYSIS_ELEMENTS).values
    if (values == null) return null
    return values.includes(this.ap.get(Value.SEXUAL_ELEMENT)) ? 'YES' : 'NO'
  }

  private q3 = (): unknown => {
    const elements = this.ap.answer(Field.OFFENCE_ANALYSIS_ELEMENTS).values ?? []
    const answers: string[] = elements
      .map((it): string | null => {
        switch (it) {
          case this.ap.get(Value.VICTIM_TARGETED):
            return 'DIRECTCONT'
          case this.ap.get(Value.HATRED_OF_IDENTIFIABLE_GROUPS):
            return 'HATE'
          default:
            return null
        }
      })
      .filter((it): it is string => it !== null)

    const hasStrangerVictim = this.ap.answer(Field.OFFENCE_ANALYSIS_VICTIMS_COLLECTION).collection.some(entry => {
      this.ap.setContext(Field.OFFENCE_ANALYSIS_VICTIM_RELATIONSHIP)
      return entry[fieldLower(Field.OFFENCE_ANALYSIS_VICTIM_RELATIONSHIP)]?.value === this.ap.get(Value.STRANGER)
    })
    if (hasStrangerVictim) {
      answers.push('STRANGERS')
    }

    return answers.length > 0 ? answers.join(',') : null
  }

  private q6 = (): unknown => {
    const value = this.ap.answer(Field.OFFENCE_ANALYSIS_IMPACT_ON_VICTIMS).value
    if (value == null) return null
    switch (value) {
      case this.ap.get(Value.YES):
        return 'YES'
      case this.ap.get(Value.NO):
        return 'NO'
      default:
        return null
    }
  }

  private q7 = (): unknown => {
    const value = this.ap.answer(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED).value
    if (value == null) return null
    switch (value) {
      case this.ap.get(Value.ONE):
      case this.ap.get(Value.TWO):
      case this.ap.get(Value.THREE):
      case this.ap.get(Value.FOUR):
      case this.ap.get(Value.FIVE):
      case this.ap.get(Value.SIX_TO_10):
      case this.ap.get(Value.ELEVEN_TO_15):
      case this.ap.get(Value.MORE_THAN_15):
        return 'YES'
      case this.ap.get(Value.NONE):
        return 'NO'
      default:
        return null
    }
  }

  private q71 = (): unknown => {
    const value = this.ap.answer(Field.OFFENCE_ANALYSIS_HOW_MANY_INVOLVED).value
    if (value == null) return null
    switch (value) {
      case this.ap.get(Value.ONE):
        return '110'
      case this.ap.get(Value.TWO):
        return '120'
      case this.ap.get(Value.THREE):
        return '130'
      case this.ap.get(Value.FOUR):
        return '140'
      case this.ap.get(Value.FIVE):
        return '150'
      case this.ap.get(Value.SIX_TO_10):
        return '160'
      case this.ap.get(Value.ELEVEN_TO_15):
        return '170'
      case this.ap.get(Value.MORE_THAN_15):
        return '180'
      default:
        return null
    }
  }

  private q72 = (): unknown => {
    const values = this.ap.answer(Field.OFFENCE_ANALYSIS_MOTIVATIONS).values
    if (values == null) return null
    return values.includes(this.ap.get(Value.PRESSURISED_BY_OTHERS)) ? 'YES' : 'NO'
  }

  private q73 = (): unknown => {
    switch (this.ap.answer(Field.OFFENCE_ANALYSIS_LEADER).value) {
      case this.ap.get(Value.YES): {
        const details = this.ap.answer(Field.OFFENCE_ANALYSIS_LEADER_YES_DETAILS).value
        return ['Yes', details].filter((part): part is string => part != null).join(' - ')
      }
      case this.ap.get(Value.NO): {
        const details = this.ap.answer(Field.OFFENCE_ANALYSIS_LEADER_NO_DETAILS).value
        return ['No', details].filter((part): part is string => part != null).join(' - ')
      }
      default:
        return null
    }
  }

  private q8 = (): unknown => this.ap.answer(Field.OFFENCE_ANALYSIS_REASON).value

  private q9SexualMotivations = (): unknown => {
    const values = this.ap.answer(Field.OFFENCE_ANALYSIS_MOTIVATIONS).values
    if (values == null) return null
    return values.includes(this.ap.get(Value.SEXUAL_MOTIVATION)) ? 'YES' : 'NO'
  }

  private q9FinancialMotivations = (): unknown => {
    const values = this.ap.answer(Field.OFFENCE_ANALYSIS_MOTIVATIONS).values
    if (values == null) return null
    return values.includes(this.ap.get(Value.FINANCIAL_MOTIVATION)) ? 'YES' : 'NO'
  }

  private q9AddictionMotivations = (): unknown => {
    const values = this.ap.answer(Field.OFFENCE_ANALYSIS_MOTIVATIONS).values
    if (values == null) return null
    return values.includes(this.ap.get(Value.ADDICTIONS_OR_PERCEIVED_NEEDS)) ? 'YES' : 'NO'
  }

  private q9EmotionalMotivations = (): unknown => {
    const values = this.ap.answer(Field.OFFENCE_ANALYSIS_MOTIVATIONS).values
    if (values == null) return null
    return values.includes(this.ap.get(Value.EMOTIONAL_STATE)) ? 'YES' : 'NO'
  }

  private q9RacialMotivations = (): unknown => {
    const values = this.ap.answer(Field.OFFENCE_ANALYSIS_MOTIVATIONS).values
    if (values == null) return null
    return values.includes(this.ap.get(Value.HATRED_OF_IDENTIFIABLE_GROUPS)) ? 'YES' : 'NO'
  }

  private q29ThrillMotivations = (): unknown => {
    const values = this.ap.answer(Field.OFFENCE_ANALYSIS_MOTIVATIONS).values
    if (values == null) return null
    return values.includes(this.ap.get(Value.THRILL_SEEKING)) ? 'YES' : 'NO'
  }

  private q29OtherMotivations = (): unknown => {
    const values = this.ap.answer(Field.OFFENCE_ANALYSIS_MOTIVATIONS).values
    if (values == null) return null
    return values.includes(this.ap.get(Value.OTHER)) ? 'YES' : 'NO'
  }

  private q29t = (): unknown => this.ap.answer(Field.OFFENCE_ANALYSIS_MOTIVATIONS_OTHER_DETAILS).value

  private q11 = (): unknown => {
    const value = this.ap.answer(Field.OFFENCE_ANALYSIS_ACCEPT_RESPONSIBILITY).value
    if (value == null) return null
    switch (value) {
      case this.ap.get(Value.YES):
        return 'YES'
      case this.ap.get(Value.NO):
        return 'NO'
      default:
        return null
    }
  }

  private q11t = (): unknown => {
    switch (this.ap.answer(Field.OFFENCE_ANALYSIS_ACCEPT_RESPONSIBILITY).value) {
      case this.ap.get(Value.YES):
        return this.ap.answer(Field.OFFENCE_ANALYSIS_ACCEPT_RESPONSIBILITY_YES_DETAILS).value
      case this.ap.get(Value.NO):
        return this.ap.answer(Field.OFFENCE_ANALYSIS_ACCEPT_RESPONSIBILITY_NO_DETAILS).value
      default:
        return null
    }
  }

  private q12 = (): unknown => this.ap.answer(Field.OFFENCE_ANALYSIS_PATTERNS_OF_OFFENDING).value

  private q13 = (): unknown => {
    const value = this.ap.answer(Field.OFFENCE_ANALYSIS_ESCALATION).value
    if (value == null) return null
    switch (value) {
      case this.ap.get(Value.YES):
        return 'YES'
      case this.ap.get(Value.NO):
        return 'NO'
      default:
        return null
    }
  }

  private q98 = (): unknown => {
    switch (this.ap.answer(Field.OFFENCE_ANALYSIS_RISK).value) {
      case this.ap.get(Value.YES):
        return this.ap.answer(Field.OFFENCE_ANALYSIS_RISK_YES_DETAILS).value
      case this.ap.get(Value.NO):
        return this.ap.answer(Field.OFFENCE_ANALYSIS_RISK_NO_DETAILS).value
      default:
        return null
    }
  }

  private q99 = (): unknown => {
    const value = this.ap.answer(Field.OFFENCE_ANALYSIS_RISK).value
    if (value == null) return null
    switch (value) {
      case this.ap.get(Value.YES):
        return 'YES'
      case this.ap.get(Value.NO):
        return 'NO'
      default:
        return null
    }
  }
}
