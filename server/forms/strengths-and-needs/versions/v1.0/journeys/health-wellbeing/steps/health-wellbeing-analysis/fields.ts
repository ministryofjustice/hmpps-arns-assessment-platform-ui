import {Answer} from '@ministryofjustice/hmpps-forge/core/authoring'
import {GovUKBody, GovUKLinkButton, GovUKSummaryList, GovUKTabs,} from '@ministryofjustice/hmpps-forge/govuk-components'
import {CaseData} from '../../../../constants/formVersion'
import {SANGenerators} from "../../../../../../generators";
import {
  healthWellbeingSummary,
  riskOfReoffendingHealthWellbeing,
  seriousHarmHealthWellbeing,
  strengthsProtectiveFactorsHealthWellbeing
} from "../health-wellbeing-summary/fields";
import {Question} from "../../constants/question";
import {contentFor} from "../../locales";


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
      key: {text: contentFor('question.strengths_protective_factors_health_wellbeing.text', CaseData.ForenamePossessive)},
      value: {
        blocks:
          [
            GovUKBody({text: SANGenerators.getTextFromListDefinition(strengthsProtectiveFactorsHealthWellbeing.items, Answer(Question.strengths_protective_factors_health_wellbeing))}),
            GovUKBody({ text: Answer(Question.strengths_protective_factors_health_wellbeing_details), size: "s" }),
            GovUKBody({ text: Answer(Question.no_strengths_protective_factors_health_wellbeing_details), size: "s" }),
          ]
      },
      actions: {
        items: [{href: 'health-wellbeing-summary#practitioner-analysis', text: 'Change', visuallyHiddenText: 'name'}],
      },
    },
    {
      key: {text: contentFor('question.serious_harm_health_wellbeing.text', CaseData.ForenamePossessive)},
      value: {
        blocks:
          [
            GovUKBody({text: SANGenerators.getTextFromListDefinition(seriousHarmHealthWellbeing.items, Answer(Question.serious_harm_health_wellbeing))}),
            GovUKBody({ text: Answer(Question.serious_harm_health_wellbeing_details), size: "s" }),
            GovUKBody({ text: Answer(Question.no_serious_harm_health_wellbeing_details), size: "s" }),
          ]
      },
      actions: {
        items: [{href: 'health-wellbeing-summary#practitioner-analysis', text: 'Change', visuallyHiddenText: 'name'}],
      },
    },
    {
      key: {text: contentFor('question.risk_of_reoffending_health_wellbeing.text', CaseData.ForenamePossessive)},
      value: {
        blocks:
          [
            GovUKBody({text: SANGenerators.getTextFromListDefinition(riskOfReoffendingHealthWellbeing.items, Answer(Question.risk_of_reoffending_health_wellbeing))}),
            GovUKBody({ text: Answer(Question.risk_of_reoffending_health_wellbeing_details), size: "s" }),
            GovUKBody({ text: Answer(Question.no_risk_of_reoffending_health_wellbeing_details), size: "s" }),
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
