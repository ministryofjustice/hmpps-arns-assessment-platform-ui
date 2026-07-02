import { Answer } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKBody, GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { SANGenerators } from '../../../../../../generators'
import { CaseData } from '../../../../constants/formVersion'
import { Question } from '../../constants/question'
import { Step } from '../../constants/step'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import {
  accommodationLinkedReoffending,
  accommodationLinkedToSeriousHarm,
  accommodationStrengthsProtectiveFactors,
  accommodationSummary,
} from '../accommodation-summary/fields'
import { contentFor } from '../../locales'
import { commonContentFor } from '../../../../locales'

// --- Practitioner Analysis Summary Group ---

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    {
      key: {
        text: contentFor('question.accommodation_strengths_protective_factors.text', CaseData.ForenamePossessive),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              accommodationStrengthsProtectiveFactors.items,
              Answer(Question.accommodation_strengths_protective_factors),
            ),
          }),
          GovUKBody({ text: Answer(Question.accommodation_strengths_protective_factors_details), size: 's' }),
          GovUKBody({ text: Answer(Question.accommodation_no_strengths_protective_factors_details), size: 's' }),
        ],
      },
      actions: {
        items: [
          {
            href: `${Step.accommodation_summary.path}#practitioner-analysis`,
            text: commonContentFor('change'),
            visuallyHiddenText: 'name',
          },
        ],
      },
    },
    {
      key: {
        text: contentFor('question.accommodation_linked_to_serious_harm.text', CaseData.ForenamePossessive),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              accommodationLinkedToSeriousHarm.items,
              Answer(Question.accommodation_linked_to_serious_harm),
            ),
          }),
          GovUKBody({ text: Answer(Question.accommodation_serious_harm_details), size: 's' }),
          GovUKBody({ text: Answer(Question.accommodation_no_serious_harm_details), size: 's' }),
        ],
      },
      actions: {
        items: [
          {
            href: `${Step.accommodation_summary.path}#practitioner-analysis`,
            text: commonContentFor('change'),
            visuallyHiddenText: 'name',
          },
        ],
      },
    },
    {
      key: {
        text: contentFor('question.accommodation_linked_to_reoffending.text', CaseData.ForenamePossessive),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              accommodationLinkedReoffending.items,
              Answer(Question.accommodation_linked_to_reoffending),
            ),
          }),
          GovUKBody({ text: Answer(Question.accommodation_risk_of_reoffending_details), size: 's' }),
          GovUKBody({ text: Answer(Question.accommodation_no_risk_of_reoffending_details), size: 's' }),
        ],
      },
      actions: {
        items: [
          {
            href: `${Step.accommodation_summary.path}#practitioner-analysis`,
            text: commonContentFor('change'),
            visuallyHiddenText: 'name',
          },
        ],
      },
    },
  ],
})

export const accommodationPractitionerAnalysisSummaryTab = GovUKTabs({
  id: 'final-accommodation-practitioner-analysis',
  items: [
    {
      id: 'summary-analysis',
      label: commonContentFor('summary'),
      panel: {
        blocks: [accommodationSummary, goToPractitionerAnalysisButton(Step.accommodation_analysis.path)],
      },
    },
    {
      id: 'practitioner-analysis-summary',
      label: commonContentFor('practitioner_analysis'),
      panel: { blocks: [practitionerAnalysisSummary] },
    },
  ],
})
