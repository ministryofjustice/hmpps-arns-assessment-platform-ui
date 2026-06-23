import { Answer } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
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
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Question } from '../../constants/question'

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
              Answer(Question.finance_strengths_protective_factors),
            ),
          }),
          GovUKBody({ text: Answer(Question.finance_strengths_protective_factors_details), size: 's' }),
          GovUKBody({ text: Answer(Question.finance_no_strengths_protective_factors_details), size: 's' }),
        ],
      },
      actions: {
        items: [
          {
            href: Step.financeSummary.path + '#practitioner-analysis',
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
              Answer(Question.finance_linked_to_serious_harm),
            ),
          }),
          GovUKBody({ text: Answer(Question.finance_serious_harm_details), size: 's' }),
          GovUKBody({ text: Answer(Question.finance_no_serious_harm_details), size: 's' }),
        ],
      },
      actions: {
        items: [
          {
            href: Step.financeSummary.path + '#practitioner-analysis',
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
              Answer(Question.finance_linked_to_reoffending),
            ),
          }),
          GovUKBody({ text: Answer(Question.finance_risk_of_reoffending_details), size: 's' }),
          GovUKBody({ text: Answer(Question.finance_no_risk_of_reoffending_details), size: 's' }),
        ],
      },
      actions: {
        items: [
          {
            href: Step.financeSummary.path + '#practitioner-analysis',
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
      panel: { blocks: [financeSummary, goToPractitionerAnalysisButton(Step.financeAnalysis.path)] },
    },
    {
      id: 'practitioner-analysis-summary',
      label: commonContentFor('practitioner_analysis'),
      panel: { blocks: [practitionerAnalysisSummary] },
    },
  ],
})
