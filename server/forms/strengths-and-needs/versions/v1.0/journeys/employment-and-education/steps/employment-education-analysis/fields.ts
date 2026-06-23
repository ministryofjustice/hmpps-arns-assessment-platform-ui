import { Answer } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKSummaryList,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import {
  employmentStatusSummary, strengthsProtectiveFactors,
} from '../employment-education-summary/fields'
import { CaseData } from '../../../../constants/formVersion'
import { Question } from '../../constants/question'
import { Step } from '../../constants/step'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import { contentFor } from '../../locales'
import { commonContentFor } from '../../../../locales'
import { linkedToReoffending, linkedToSeriousHarm } from '../../../finance/steps/finance-summary/fields'
import { getDisplayTextForItems } from '../../../../../../i18n'

// --- Practitioner Analysis Summary Group ---

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    {
      key: {
        text: contentFor(
          'question.employment_education_strengths_protective_factors.text',
          CaseData.ForenamePossessive,
        ),
      },
      value: {
        blocks: [
          getDisplayTextForItems(
            Question.employment_education_strengths_protective_factors,
            strengthsProtectiveFactors.items,
          ),
          GovUKBody({ text: Answer(Question.employment_education_strengths_protective_factors_details), size: 's' }),
          GovUKBody({ text: Answer(Question.employment_education_no_strengths_protective_factors_details), size: 's' }),
        ].flat(),
      },
      actions: {
        items: [
          {
            href: `${Step.employment_education_summary.path}#practitioner-analysis`,
            text: commonContentFor('change'),
            visuallyHiddenText: 'name',
          },
        ],
      },
    },
    {
      key: {
        text: contentFor('question.employment_education_linked_to_serious_harm.text', CaseData.ForenamePossessive),
      },
      value: {
        blocks: [
          getDisplayTextForItems(
            Question.employment_education_linked_to_serious_harm,
            linkedToSeriousHarm.items,
          ),
          GovUKBody({ text: Answer(Question.employment_education_serious_harm_details), size: 's' }),
          GovUKBody({ text: Answer(Question.employment_education_no_serious_harm_details), size: 's' }),
        ].flat(),
      },
      actions: {
        items: [
          {
            href: `${Step.employment_education_summary.path}#practitioner-analysis`,
            text: commonContentFor('change'),
            visuallyHiddenText: 'name',
          },
        ],
      },
    },
    {
      key: {
        text: contentFor('question.employment_education_linked_to_reoffending.text', CaseData.ForenamePossessive),
      },
      value: {
        blocks: [
          getDisplayTextForItems(
            Question.employment_education_linked_to_reoffending,
            linkedToReoffending.items,
          ),
          GovUKBody({ text: Answer(Question.employment_education_risk_of_reoffending_details), size: 's' }),
          GovUKBody({ text: Answer(Question.employment_education_no_risk_of_reoffending_details), size: 's' }),
        ].flat(),
      },
      actions: {
        items: [
          {
            href: `${Step.employment_education_summary.path}#practitioner-analysis`,
            text: commonContentFor('change'),
            visuallyHiddenText: 'name',
          },
        ],
      },
    },
  ],
})

export const employmentStatusAnalysisSummaryTab = GovUKTabs({
  id: 'final-employment-education-analysis',
  items: [
    {
      id: 'summary-analysis',
      label: commonContentFor('summary'),
      panel: {
        blocks: [employmentStatusSummary, goToPractitionerAnalysisButton(Step.employment_education_summary.path)],
      },
    },
    {
      id: 'practitioner-analysis-summary',
      label: commonContentFor('practitioner_analysis'),
      panel: { blocks: [practitionerAnalysisSummary] },
    },
  ],
})
