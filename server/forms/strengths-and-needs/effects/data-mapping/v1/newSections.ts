/** Port of oasys/datamapping/v1/NewSections.kt. */

import { Field, Value } from '../codes'
import { SectionMapping, type FieldsToMap } from '../common/sectionMapping'
import { PractitionerAnalysis } from './practitionerAnalysis'

export class NewSections extends SectionMapping {
  getFieldsToMap(): FieldsToMap {
    return {
      'o1-30': this.q30,
      oTBA_SAN_LINKED_ROSH: this.qLinkedToRosh,
      oTBA_SAN_LINKED_REOFFEND: this.qLinkedToReoffending,
      oTBA_SAN_STRENGTH: this.qStrength,
      oAC_SAN_SECTION_COMP: this.qAccommodationComplete,
      oEE_SAN_SECTION_COMP: this.qEducationEmploymentComplete,
      oFI_SAN_SECTION_COMP: this.qFinanceComplete,
      oSMD_SAN_SECTION_COMP: this.qDrugsComplete,
      oSMA_SAN_SECTION_COMP: this.qAlcoholCompletes,
      oHW_SAN_SECTION_COMP: this.qHealthWellbeingComplete,
      oPRC_SAN_SECTION_COMP: this.qPersonalRelationshipsComplete,
      oTBA_SAN_SECTION_COMP: this.qThinkingBehavioursAttitudesComplete,
      oOA_SAN_SECTION_COMP: this.qOffenceAnalysisComplete,
    }
  }

  private q30 = (): unknown => {
    const sexualElements = (this.ap.answer(Field.OFFENCE_ANALYSIS_ELEMENTS).values ?? []).includes(
      this.ap.get(Value.SEXUAL_ELEMENT),
    )
    const sexualMotivation = (this.ap.answer(Field.OFFENCE_ANALYSIS_MOTIVATIONS).values ?? []).includes(
      this.ap.get(Value.SEXUAL_MOTIVATION),
    )

    return sexualElements || sexualMotivation ? 'YES' : null
  }

  private qLinkedToRosh = (): unknown =>
    new PractitionerAnalysis('THINKING_BEHAVIOURS_ATTITUDES', this.ap).riskOfSeriousHarm()

  private qLinkedToReoffending = (): unknown =>
    new PractitionerAnalysis('THINKING_BEHAVIOURS_ATTITUDES', this.ap).riskOfReoffending()

  private qStrength = (): unknown =>
    new PractitionerAnalysis('THINKING_BEHAVIOURS_ATTITUDES', this.ap).strengthsOrProtectiveFactors()

  private qAccommodationComplete = (): unknown =>
    this.ap.answer(Field.ACCOMMODATION_SECTION_COMPLETE).value === this.ap.get(Value.YES) ? 'YES' : 'NO'

  private qEducationEmploymentComplete = (): unknown =>
    this.ap.answer(Field.EMPLOYMENT_EDUCATION_SECTION_COMPLETE).value === this.ap.get(Value.YES) ? 'YES' : 'NO'

  private qFinanceComplete = (): unknown =>
    this.ap.answer(Field.FINANCE_SECTION_COMPLETE).value === this.ap.get(Value.YES) ? 'YES' : 'NO'

  private qDrugsComplete = (): unknown =>
    this.ap.answer(Field.DRUG_USE_SECTION_COMPLETE).value === this.ap.get(Value.YES) ? 'YES' : 'NO'

  private qAlcoholCompletes = (): unknown =>
    this.ap.answer(Field.ALCOHOL_USE_SECTION_COMPLETE).value === this.ap.get(Value.YES) ? 'YES' : 'NO'

  private qHealthWellbeingComplete = (): unknown =>
    this.ap.answer(Field.HEALTH_WELLBEING_SECTION_COMPLETE).value === this.ap.get(Value.YES) ? 'YES' : 'NO'

  private qPersonalRelationshipsComplete = (): unknown =>
    this.ap.answer(Field.PERSONAL_RELATIONSHIPS_COMMUNITY_SECTION_COMPLETE).value === this.ap.get(Value.YES)
      ? 'YES'
      : 'NO'

  private qThinkingBehavioursAttitudesComplete = (): unknown =>
    this.ap.answer(Field.THINKING_BEHAVIOURS_ATTITUDES_SECTION_COMPLETE).value === this.ap.get(Value.YES) ? 'YES' : 'NO'

  private qOffenceAnalysisComplete = (): unknown =>
    this.ap.answer(Field.OFFENCE_ANALYSIS_SECTION_COMPLETE).value === this.ap.get(Value.YES) ? 'YES' : 'NO'
}
