/** Port of oasys/datamapping/v1/PractitionerAnalysisScenarios.kt. */

import { fieldFromName, Value } from '../../codes'
import { Given } from './given'

export class PractitionerAnalysisScenarios {
  constructor(private readonly sectionPrefix: string) {}

  notes(): Given[] {
    return [
      new Given().expect(null),
      new Given(fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_SERIOUS_HARM`), Value.YES)
        .and(
          fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_SERIOUS_HARM_YES_DETAILS`),
          'Details 2 go here',
        )
        .and(fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_STRENGTHS_OR_PROTECTIVE_FACTORS`), Value.YES)
        .and(
          fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_STRENGTHS_OR_PROTECTIVE_FACTORS_YES_DETAILS`),
          'Details 1 go here',
        )
        .and(fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_REOFFENDING`), Value.YES)
        .and(
          fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_REOFFENDING_YES_DETAILS`),
          'Details 3 go here',
        )
        .expect(
          [
            'Strengths and protective factor notes - Details 1 go here',
            'Area linked to serious harm notes - Details 2 go here',
            'Risk of reoffending notes - Details 3 go here',
          ].join('\n'),
        ),
      new Given(fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_SERIOUS_HARM`), Value.NO)
        .and(fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_STRENGTHS_OR_PROTECTIVE_FACTORS`), Value.NO)
        .and(fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_REOFFENDING`), Value.NO)
        .expect(null),
      new Given(fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_SERIOUS_HARM`), Value.NO)
        .and(
          fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_SERIOUS_HARM_NO_DETAILS`),
          'Details 2 go here',
        )
        .and(fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_STRENGTHS_OR_PROTECTIVE_FACTORS`), Value.NO)
        .and(
          fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_STRENGTHS_OR_PROTECTIVE_FACTORS_NO_DETAILS`),
          'Details 1 go here',
        )
        .and(fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_REOFFENDING`), Value.NO)
        .and(
          fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_REOFFENDING_NO_DETAILS`),
          'Details 3 go here',
        )
        .expect(
          [
            'Area not linked to strengths and positive factors notes - Details 1 go here',
            'Area not linked to serious harm notes - Details 2 go here',
            'Area not linked to reoffending notes - Details 3 go here',
          ].join('\n'),
        ),
      new Given(fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_SERIOUS_HARM`), Value.YES)
        .and(
          fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_SERIOUS_HARM_YES_DETAILS`),
          'Details 2 go here',
        )
        .and(fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_STRENGTHS_OR_PROTECTIVE_FACTORS`), Value.NO)
        .and(fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_REOFFENDING`), Value.YES)
        .and(
          fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_REOFFENDING_YES_DETAILS`),
          'Details 3 go here',
        )
        .expect(
          [
            'Area linked to serious harm notes - Details 2 go here',
            'Risk of reoffending notes - Details 3 go here',
          ].join('\n'),
        ),
    ]
  }

  riskOfSeriousHarm(): Given[] {
    return [
      new Given().expect(null),
      new Given(fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_SERIOUS_HARM`), Value.YES).expect(
        'YES',
      ),
      new Given(fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_SERIOUS_HARM`), Value.NO).expect(
        'NO',
      ),
    ]
  }

  riskOfReoffending(): Given[] {
    return [
      new Given().expect(null),
      new Given(fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_REOFFENDING`), Value.YES).expect(
        'YES',
      ),
      new Given(fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_RISK_OF_REOFFENDING`), Value.NO).expect(
        'NO',
      ),
    ]
  }

  strengthsOrProtectiveFactors(): Given[] {
    return [
      new Given().expect(null),
      new Given(
        fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_STRENGTHS_OR_PROTECTIVE_FACTORS`),
        Value.YES,
      ).expect('YES'),
      new Given(
        fieldFromName(`${this.sectionPrefix}_PRACTITIONER_ANALYSIS_STRENGTHS_OR_PROTECTIVE_FACTORS`),
        Value.NO,
      ).expect('NO'),
    ]
  }
}
