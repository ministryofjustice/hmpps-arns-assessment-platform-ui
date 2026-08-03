/** Port of oasys/datamapping/v1/Relationships.kt. */

import { Field, Value } from '../codes'
import { SectionMapping, type FieldsToMap } from '../common/sectionMapping'
import { PractitionerAnalysis } from './practitionerAnalysis'

export class Relationships extends SectionMapping {
  getFieldsToMap(): FieldsToMap {
    return {
      'o6-1': this.q1,
      'o6-3': this.q3,
      'o6-4': this.q4,
      'o6-6': this.q6,
      'o6-7da': this.q7da,
      'o6-7-1-1da': this.q711da,
      'o6-7-1-2da': this.q712da,
      'o6-7-2-1da': this.q721da,
      'o6-7-2-2da': this.q722da,
      'o6-8': this.q8,
      'o6-9': this.q9,
      'o6-10': this.q10,
      'o6-11': this.q11,
      'o6-12': this.q12,
      'o6-97': this.q97,
      'o6-98': this.q98,
      'o6-99': this.q99,
      o6_SAN_STRENGTH: this.qStrength,
    }
  }

  private q1 = (): unknown => {
    const answer = this.ap.answer(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_FAMILY_RELATIONSHIP).value
    if (answer == null) return null
    switch (answer) {
      case this.ap.get(Value.UNSTABLE_RELATIONSHIP):
        return '2'
      case this.ap.get(Value.MIXED_RELATIONSHIP):
        return '1'
      case this.ap.get(Value.STABLE_RELATIONSHIP):
        return '0'
      default:
        return 'M'
    }
  }

  private q3 = (): unknown => {
    switch (this.ap.answer(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_CHILDHOOD).value) {
      case this.ap.get(Value.POSITIVE_CHILDHOOD):
        return '0'
      case this.ap.get(Value.MIXED_CHILDHOOD):
        return '1'
      case this.ap.get(Value.NEGATIVE_CHILDHOOD):
        return '2'
      default:
        return null
    }
  }

  private q4 = (): unknown => {
    switch (this.ap.answer(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_CURRENT_RELATIONSHIP).value) {
      case this.ap.get(Value.HAPPY_RELATIONSHIP):
        return '0'
      case this.ap.get(Value.CONCERNS_HAPPY_RELATIONSHIP):
        return '1'
      case this.ap.get(Value.UNHAPPY_RELATIONSHIP):
        return '2'
      default:
        return null
    }
  }

  private q6 = (): unknown => {
    switch (this.ap.answer(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_INTIMATE_RELATIONSHIP).value) {
      case this.ap.get(Value.STABLE_RELATIONSHIPS):
        return '0'
      case this.ap.get(Value.POSITIVE_AND_NEGATIVE_RELATIONSHIPS):
        return '1'
      case this.ap.get(Value.UNSTABLE_RELATIONSHIPS):
        return '2'
      default:
        return null
    }
  }

  private q7da = (): unknown => {
    const perpetrator = ((): string | null => {
      switch (this.ap.answer(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE).value) {
        case this.ap.get(Value.YES):
          return 'YES'
        case this.ap.get(Value.NO):
          return 'NO'
        default:
          return null
      }
    })()
    const victim = ((): string | null => {
      switch (this.ap.answer(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE).value) {
        case this.ap.get(Value.YES):
          return 'YES'
        case this.ap.get(Value.NO):
          return 'NO'
        default:
          return null
      }
    })()

    if (perpetrator === 'YES' || victim === 'YES') return 'YES'
    if (perpetrator === 'NO' && victim === 'NO') return 'NO'
    return null
  }

  private q711da = (): unknown => {
    switch (this.ap.answer(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE).value) {
      case this.ap.get(Value.YES):
        switch (this.ap.answer(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE_TYPE).value) {
          case this.ap.get(Value.INTIMATE_PARTNER):
          case this.ap.get(Value.FAMILY_MEMBER_AND_INTIMATE_PARTNER):
            return 'YES'
          case this.ap.get(Value.FAMILY_MEMBER):
            return 'NO'
          default:
            return null
        }
      case this.ap.get(Value.NO):
        return 'NO'
      default:
        return null
    }
  }

  private q712da = (): unknown => {
    switch (this.ap.answer(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE).value) {
      case this.ap.get(Value.YES):
        switch (this.ap.answer(Field.OFFENCE_ANALYSIS_VICTIM_OF_DOMESTIC_ABUSE_TYPE).value) {
          case this.ap.get(Value.FAMILY_MEMBER):
          case this.ap.get(Value.FAMILY_MEMBER_AND_INTIMATE_PARTNER):
            return 'YES'
          case this.ap.get(Value.INTIMATE_PARTNER):
            return 'NO'
          default:
            return null
        }
      case this.ap.get(Value.NO):
        return 'NO'
      default:
        return null
    }
  }

  private q721da = (): unknown => {
    switch (this.ap.answer(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE).value) {
      case this.ap.get(Value.YES):
        switch (this.ap.answer(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE_TYPE).value) {
          case this.ap.get(Value.INTIMATE_PARTNER):
          case this.ap.get(Value.FAMILY_MEMBER_AND_INTIMATE_PARTNER):
            return 'YES'
          case this.ap.get(Value.FAMILY_MEMBER):
            return 'NO'
          default:
            return null
        }
      case this.ap.get(Value.NO):
        return 'NO'
      default:
        return null
    }
  }

  private q722da = (): unknown => {
    switch (this.ap.answer(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE).value) {
      case this.ap.get(Value.YES):
        switch (this.ap.answer(Field.OFFENCE_ANALYSIS_PERPETRATOR_OF_DOMESTIC_ABUSE_TYPE).value) {
          case this.ap.get(Value.FAMILY_MEMBER):
          case this.ap.get(Value.FAMILY_MEMBER_AND_INTIMATE_PARTNER):
            return 'YES'
          case this.ap.get(Value.INTIMATE_PARTNER):
            return 'NO'
          default:
            return null
        }
      case this.ap.get(Value.NO):
        return 'NO'
      default:
        return null
    }
  }

  private q8 = (): unknown => {
    if ((this.ap.answer(Field.LIVING_WITH).values ?? []).includes(this.ap.get(Value.PARTNER))) return '1'
    if (
      (this.ap.answer(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_IMPORTANT_PEOPLE).values ?? []).includes(
        this.ap.get(Value.PARTNER_INTIMATE_RELATIONSHIP),
      )
    ) {
      return '2'
    }
    return '3'
  }

  private q9 = (): unknown => {
    const answer = this.ap.answer(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_IMPORTANT_PEOPLE).values
    if (answer == null) return null
    return answer.includes(this.ap.get(Value.CHILD_PARENTAL_RESPONSIBILITIES)) ? 'YES' : 'NO'
  }

  private q10 = (): unknown => {
    switch (this.ap.answer(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_PARENTAL_RESPONSIBILITIES).value) {
      case this.ap.get(Value.NO):
        return 'Significantproblems'
      case this.ap.get(Value.SOMETIMES):
        return 'Someproblems'
      case this.ap.get(Value.YES):
        return 'Noproblems'
      default:
        return null
    }
  }

  private q11 = (): unknown => {
    switch (this.ap.answer(Field.THINKING_BEHAVIOURS_ATTITUDES_RISK_SEXUAL_HARM).value) {
      case this.ap.get(Value.YES):
        return 'YES'
      case this.ap.get(Value.NO):
        return 'NO'
      default:
        return null
    }
  }

  private q12 = (): unknown => {
    switch (this.ap.answer(Field.THINKING_BEHAVIOURS_ATTITUDES_EMOTIONAL_INTIMACY).value) {
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

  private q97 = (): unknown => new PractitionerAnalysis('PERSONAL_RELATIONSHIPS_COMMUNITY', this.ap).notes()

  private q98 = (): unknown => new PractitionerAnalysis('PERSONAL_RELATIONSHIPS_COMMUNITY', this.ap).riskOfSeriousHarm()

  private q99 = (): unknown => new PractitionerAnalysis('PERSONAL_RELATIONSHIPS_COMMUNITY', this.ap).riskOfReoffending()

  private qStrength = (): unknown =>
    new PractitionerAnalysis('PERSONAL_RELATIONSHIPS_COMMUNITY', this.ap).strengthsOrProtectiveFactors()
}
