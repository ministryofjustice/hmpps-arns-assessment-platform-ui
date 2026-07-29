/** Port of oasys/datamapping/v1/PractitionerAnalysis.kt. */

import { fieldFromName, Value } from '../codes'
import type { AnswersProvider } from '../common/answersProvider'

function isNullOrBlank(value: string | null | undefined): boolean {
  return value == null || value.trim() === ''
}

export class PractitionerAnalysis {
  constructor(
    private readonly sectionPrefix: string,
    private readonly ap: AnswersProvider,
  ) {}

  private strengthsOrProtectiveFactorsNotes(): string | null {
    const yesDetails = this.ap.answer(
      fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_STRENGTHS_OR_PROTECTIVE_FACTORS_YES_DETAILS`),
    ).value
    const noDetails = this.ap.answer(
      fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_STRENGTHS_OR_PROTECTIVE_FACTORS_NO_DETAILS`),
    ).value

    if (!isNullOrBlank(yesDetails)) return `Strengths and protective factor notes - ${yesDetails}`
    if (!isNullOrBlank(noDetails)) return `Area not linked to strengths and positive factors notes - ${noDetails}`
    return null
  }

  private seriousHarmNotes(): string | null {
    const yesDetails = this.ap.answer(
      fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_SERIOUS_HARM_YES_DETAILS`),
    ).value
    const noDetails = this.ap.answer(
      fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_SERIOUS_HARM_NO_DETAILS`),
    ).value

    if (!isNullOrBlank(yesDetails)) return `Area linked to serious harm notes - ${yesDetails}`
    if (!isNullOrBlank(noDetails)) return `Area not linked to serious harm notes - ${noDetails}`
    return null
  }

  private reoffendingNotes(): string | null {
    const yesDetails = this.ap.answer(
      fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_REOFFENDING_YES_DETAILS`),
    ).value
    const noDetails = this.ap.answer(
      fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_REOFFENDING_NO_DETAILS`),
    ).value

    if (!isNullOrBlank(yesDetails)) return `Risk of reoffending notes - ${yesDetails}`
    if (!isNullOrBlank(noDetails)) return `Area not linked to reoffending notes - ${noDetails}`
    return null
  }

  notes(): string | null {
    const notes = [this.strengthsOrProtectiveFactorsNotes(), this.seriousHarmNotes(), this.reoffendingNotes()].filter(
      (note): note is string => note !== null,
    )
    const joined = notes.join('\n')
    return joined === '' ? null : joined
  }

  riskOfSeriousHarm(): string | null {
    switch (this.ap.answer(fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_SERIOUS_HARM`)).value) {
      case this.ap.get(Value.YES):
        return 'YES'
      case this.ap.get(Value.NO):
        return 'NO'
      default:
        return null
    }
  }

  riskOfReoffending(): string | null {
    switch (this.ap.answer(fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_REOFFENDING`)).value) {
      case this.ap.get(Value.YES):
        return 'YES'
      case this.ap.get(Value.NO):
        return 'NO'
      default:
        return null
    }
  }

  strengthsOrProtectiveFactors(): string | null {
    switch (
      this.ap.answer(fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_STRENGTHS_OR_PROTECTIVE_FACTORS`)).value
    ) {
      case this.ap.get(Value.YES):
        return 'YES'
      case this.ap.get(Value.NO):
        return 'NO'
      default:
        return null
    }
  }
}
