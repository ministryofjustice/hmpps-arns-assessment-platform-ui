import { Answer, Format, Request } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKLinkButton,
  GovUKSummaryList,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants'
import { SANGenerators } from '../../../../../../generators/customGenerator'
import locale from '../../locale.json'
import {
  financeSummary,
  linkedToReoffending,
  linkedToSeriousHarm,
  strengthsOrProtectiveFactors,
} from '../finance-summary/fields'
import { StrengthsAndNeedsTransformers } from '../../../../../../transformers'

const contentWith =
  (content: Record<string, any>) =>
  (code: string, ...replacements: any[]) =>
    Request.Headers('accept-language').pipe(StrengthsAndNeedsTransformers.ContentFor(content, code, ...replacements))
const contentFor = contentWith(locale)

const goToPractitionerAnalysisButton = GovUKLinkButton({
  text: 'Go to practitioner analysis',
  href: 'finance-analysis#practitioner-analysis-summary',
  classes: 'govuk-button--secondary',
})

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    {
      key: {
        text: contentFor('practitioner_analysis.strengths_protective_factors.text', CaseData.ForenamePossessive),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              strengthsOrProtectiveFactors.items,
              Answer('strengths_protective_factors'),
            ),
          }),
          GovUKBody({ text: Answer('strengths_protective_factors_details'), size: 's' }),
          GovUKBody({ text: Answer('no_strengths_protective_factors_details'), size: 's' }),
        ],
      },
      actions: {
        items: [{ href: 'finance-summary#practitioner-analysis', text: 'Change', visuallyHiddenText: 'name' }],
      },
    },
    {
      key: {
        text: contentFor(
          'practitioner_analysis.finance_linked_to_serious_harm.text',

          CaseData.ForenamePossessive,
        ),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              linkedToSeriousHarm.items,
              Answer('finance_linked_to_serious_harm'),
            ),
          }),
          GovUKBody({ text: Answer('serious_harm_details'), size: 's' }),
          GovUKBody({ text: Answer('no_serious_harm_details'), size: 's' }),
        ],
      },
      actions: {
        items: [{ href: 'finance-summary#practitioner-analysis', text: 'Change', visuallyHiddenText: 'name' }],
      },
    },
    {
      key: {
        text: contentFor('practitioner_analysis.finance_linked_to_reoffending.text', CaseData.ForenamePossessive),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              linkedToReoffending.items,
              Answer('finance_linked_to_reoffending'),
            ),
          }),
          GovUKBody({ text: Answer('risk_of_reoffending_details'), size: 's' }),
          GovUKBody({ text: Answer('no_risk_of_reoffending_details'), size: 's' }),
        ],
      },
      actions: {
        items: [{ href: 'finance-summary#practitioner-analysis', text: 'Change', visuallyHiddenText: 'name' }],
      },
    },
  ],
})

export const employmentStatusAnalysisSummaryTab = GovUKTabs({
  id: 'finance-analysis',
  items: [
    {
      id: 'summary-analysis',
      label: 'Summary',
      panel: { blocks: [financeSummary, goToPractitionerAnalysisButton] },
    },
    {
      id: 'practitioner-analysis-summary',
      label: 'Practitioner analysis',
      panel: { blocks: [practitionerAnalysisSummary] },
    },
  ],
})
