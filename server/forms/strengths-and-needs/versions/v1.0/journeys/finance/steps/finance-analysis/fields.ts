import { Answer, Request } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKLinkButton,
  GovUKSummaryList,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { SANGenerators } from '../../../../../../generators'
import {
  financeSummary,
  linkedToReoffending,
  linkedToSeriousHarm,
  strengthsOrProtectiveFactors,
} from '../finance-summary/fields'
import { CaseData } from '../../../../constants/formVersion'
import { contentFor } from '../../locales'
import { commonContentFor } from '../../../../locales'

const goToPractitionerAnalysisButton = GovUKLinkButton({
  text: 'Go to practitioner analysis',
  href: 'finance-analysis#practitioner-analysis-summary',
  classes: 'govuk-button--secondary',
})

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    {
      key: {
        text: contentFor('question.finance_strengths_protective_factors.text', CaseData.ForenamePossessive),
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
        items: [
          {
            href: 'finance-summary#practitioner-analysis',
            text: commonContentFor('change'),
            visuallyHiddenText: `"${contentFor(
              'question.finance_strengths_protective_factors.text',
              CaseData.ForenamePossessive,
            )}"`,
          },
        ],
      },
    },
    {
      key: {
        text: contentFor(
          'question.finance_linked_to_serious_harm.text',

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
        items: [
          {
            href: 'finance-summary#practitioner-analysis',
            text: commonContentFor('change'),
            visuallyHiddenText: `"${contentFor(
              'question.finance_linked_to_serious_harm.text',
              CaseData.ForenamePossessive,
            )}"`,
          },
        ],
      },
    },
    {
      key: {
        text: contentFor('question.finance_linked_to_reoffending.text', CaseData.ForenamePossessive),
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
        items: [
          {
            href: 'finance-summary#practitioner-analysis',
            text: commonContentFor('change'),
            visuallyHiddenText: `"${contentFor(
              'question.finance_linked_to_reoffending.text',
              CaseData.ForenamePossessive,
            )}"`,
          },
        ],
      },
    },
  ],
})

export const employmentStatusAnalysisSummaryTab = GovUKTabs({
  id: 'finance-analysis',
  items: [
    {
      id: 'summary-analysis',
      label: commonContentFor('summary'),
      panel: { blocks: [financeSummary, goToPractitionerAnalysisButton] },
    },
    {
      id: 'practitioner-analysis-summary',
      label: commonContentFor('practitioner_analysis'),
      panel: { blocks: [practitionerAnalysisSummary] },
    },
  ],
})
