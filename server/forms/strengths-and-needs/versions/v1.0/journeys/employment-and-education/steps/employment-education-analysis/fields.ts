import { Answer, Format } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKBody, GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { SANGenerators } from '../../../../../../generators'
import { locale } from '../../constants/locale'
import {
  employmentOrEducationLinkedReoffending,
  employmentOrEducationLinkedToSeriousHarm,
  employmentStatusSummary,
  strengthsProtectiveFactors,
} from '../employment-education-summary/fields'
import { CaseData } from '../../../../constants/formVersion'
import { Question } from '../../constants/question'
import { Step } from '../../constants/step'
import { commonLocale } from '../../../../constants/locale'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'

// --- Practitioner Analysis Summary Group ---

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    {
      key: {
        text: Format(
          locale.question[Question.employment_education_strengths_protective_factors],
          CaseData.ForenamePossessive,
        ),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              strengthsProtectiveFactors.items,
              Answer(Question.employment_education_strengths_protective_factors),
            ),
          }),
          GovUKBody({ text: Answer(Question.employment_education_strengths_protective_factors_details), size: 's' }),
          GovUKBody({ text: Answer(Question.employment_education_no_strengths_protective_factors_details), size: 's' }),
        ],
      },
      actions: {
        items: [
          {
            href: `${Step.employment_education_summary.path}#practitioner-analysis`,
            text: commonLocale.change,
            visuallyHiddenText: 'name',
          },
        ],
      },
    },
    {
      key: {
        text: Format(
          locale.question[Question.employment_education_linked_to_serious_harm],
          CaseData.ForenamePossessive,
        ),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              employmentOrEducationLinkedToSeriousHarm.items,
              Answer(Question.employment_education_linked_to_serious_harm),
            ),
          }),
          GovUKBody({ text: Answer(Question.employment_education_serious_harm_details), size: 's' }),
          GovUKBody({ text: Answer(Question.employment_education_no_serious_harm_details), size: 's' }),
        ],
      },
      actions: {
        items: [
          {
            href: `${Step.employment_education_summary.path}#practitioner-analysis`,
            text: commonLocale.change,
            visuallyHiddenText: 'name',
          },
        ],
      },
    },
    {
      key: {
        text: Format(locale.question[Question.employment_education_linked_to_reoffending], CaseData.ForenamePossessive),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              employmentOrEducationLinkedReoffending.items,
              Answer(Question.employment_education_linked_to_reoffending),
            ),
          }),
          GovUKBody({ text: Answer(Question.employment_education_risk_of_reoffending_details), size: 's' }),
          GovUKBody({ text: Answer(Question.employment_education_no_risk_of_reoffending_details), size: 's' }),
        ],
      },
      actions: {
        items: [
          {
            href: `${Step.employment_education_summary.path}#practitioner-analysis`,
            text: commonLocale.change,
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
      label: commonLocale.summary,
      panel: {
        blocks: [employmentStatusSummary, goToPractitionerAnalysisButton(Step.employment_education_summary.path)],
      },
    },
    {
      id: 'practitioner-analysis-summary',
      label: commonLocale.practitioner_analysis,
      panel: { blocks: [practitionerAnalysisSummary] },
    },
  ],
})
