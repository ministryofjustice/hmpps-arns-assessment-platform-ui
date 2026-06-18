import {Answer, Format} from '@ministryofjustice/hmpps-forge/core/authoring'
import {GovUKBody, GovUKLinkButton, GovUKSummaryList, GovUKTabs,} from '@ministryofjustice/hmpps-forge/govuk-components'
import {CaseData} from '../../../../constants'
import {SANGenerators} from "../../../../../../generators/customGenerator";
import locale from '../../locale.json'
import {
  healthWellbeingSummary,
  riskOfReoffendingHealthWellbeing,
  seriousHarmHealthWellbeing,
  strengthsProtectiveFactorsHealthWellbeing
} from "../health-wellbeing-summary/fields";


// --- Practitioner Analysis Button Group ---

const goToPractitionerAnalysis = GovUKLinkButton({
  text: 'Go to practitioner analysis',
  href:'health-wellbeing-analysis#practitioner-analysis',
  classes: 'govuk-button--secondary'
})

// --- Practitioner Analysis Summary Group ---

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    {
      key: {text: Format(locale.practitioner_analysis.strengths_protective_factors_health_wellbeing.text, CaseData.ForenamePossessive)},
      value: {
        blocks:
          [
            GovUKBody({text: SANGenerators.getTextFromListDefinition(strengthsProtectiveFactorsHealthWellbeing.items, Answer('strengths_protective_factors_health_wellbeing'))}),
            GovUKBody({ text: Answer('strengths_protective_factors_health_wellbeing_details'), size: "s" }),
            GovUKBody({ text: Answer('no_strengths_protective_factors_health_wellbeing_details'), size: "s" }),
          ]
      },
      actions: {
        items: [{href: 'health-wellbeing-summary#practitioner-analysis', text: 'Change', visuallyHiddenText: 'name'}],
      },
    },
    {
      key: {text: Format(locale.practitioner_analysis.serious_harm_health_wellbeing.text, CaseData.ForenamePossessive)},
      value: {
        blocks:
          [
            GovUKBody({text: SANGenerators.getTextFromListDefinition(seriousHarmHealthWellbeing.items, Answer('serious_harm_health_wellbeing'))}),
            GovUKBody({ text: Answer('serious_harm_health_wellbeing_details'), size: "s" }),
            GovUKBody({ text: Answer('no_serious_harm_health_wellbeing_details'), size: "s" }),
          ]
      },
      actions: {
        items: [{href: 'health-wellbeing-summary#practitioner-analysis', text: 'Change', visuallyHiddenText: 'name'}],
      },
    },
    {
      key: {text: Format(locale.practitioner_analysis.risk_of_reoffending_health_wellbeing.text, CaseData.ForenamePossessive)},
      value: {
        blocks:
          [
            GovUKBody({text: SANGenerators.getTextFromListDefinition(riskOfReoffendingHealthWellbeing.items, Answer('risk_of_reoffending_health_wellbeing'))}),
            GovUKBody({ text: Answer('risk_of_reoffending_health_wellbeing_details'), size: "s" }),
            GovUKBody({ text: Answer('no_risk_of_reoffending_health_wellbeing_details'), size: "s" }),
          ]
      },
      actions: {
        items: [{href: 'health-wellbeing-summary#practitioner-analysis', text: 'Change', visuallyHiddenText: 'name'}],
      },
    },
  ]
})

export const healthWellbeingAnalysisSummaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: 'Summary',
      panel: { blocks: [healthWellbeingSummary, goToPractitionerAnalysis] },
    },
    {
      id: 'practitioner-analysis',
      label: 'Practitioner analysis',
      panel: {
        blocks: [practitionerAnalysisSummary]
      },
    },
  ],
})
