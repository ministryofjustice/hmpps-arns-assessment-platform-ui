import { Answer } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKBody, GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import {
  alcoholLinkedReoffending,
  alcoholLinkedToSeriousHarm,
  alcoholStrengthsProtectiveFactors,
  alcoholSummary,
} from '../alcohol-use-summary/fields'
import { CaseData } from '../../../../constants/formVersion'
import { Question } from '../../constants/question'
import { Step } from '../../constants/step'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import { contentFor } from '../../locales'
import { commonContentFor } from '../../../../locales'
import { getDisplayTextForItems } from '../../../../../../i18n'

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    {
      key: {
        text: contentFor(
          'question.alcohol_use_practitioner_analysis_strengths_or_protective_factors.text',
          CaseData.ForenamePossessive,
        ),
      },
      value: {
        blocks: [
          getDisplayTextForItems(
            Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors,
            alcoholStrengthsProtectiveFactors.items,
          ),
          GovUKBody({
            text: Answer(Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors_yes_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors_no_details),
            size: 's',
          }),
        ].flat(),
      },
      actions: {
        items: [
          {
            href: `${Step.alcohol_use_summary.path}#${Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors}`,
            text: commonContentFor('change'),
            visuallyHiddenText: 'name',
          },
        ],
      },
    },
    {
      key: {
        text: contentFor(
          'question.alcohol_use_practitioner_analysis_risk_of_serious_harm.text',
          CaseData.ForenamePossessive,
        ),
      },
      value: {
        blocks: [
          getDisplayTextForItems(
            Question.alcohol_use_practitioner_analysis_risk_of_serious_harm,
            alcoholLinkedToSeriousHarm.items,
          ),
          GovUKBody({
            text: Answer(Question.alcohol_use_practitioner_analysis_risk_of_serious_harm_yes_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.alcohol_use_practitioner_analysis_risk_of_serious_harm_no_details),
            size: 's',
          }),
        ].flat(),
      },
      actions: {
        items: [
          {
            href: `${Step.alcohol_use_summary.path}#${Question.alcohol_use_practitioner_analysis_risk_of_serious_harm}`,
            text: commonContentFor('change'),
            visuallyHiddenText: 'name',
          },
        ],
      },
    },
    {
      key: {
        text: contentFor(
          'question.alcohol_use_practitioner_analysis_risk_of_reoffending.text',
          CaseData.ForenamePossessive,
        ),
      },
      value: {
        blocks: [
          getDisplayTextForItems(
            Question.alcohol_use_practitioner_analysis_risk_of_reoffending,
            alcoholLinkedReoffending.items,
          ),
          GovUKBody({
            text: Answer(Question.alcohol_use_practitioner_analysis_risk_of_reoffending_yes_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.alcohol_use_practitioner_analysis_risk_of_reoffending_no_details),
            size: 's',
          }),
        ].flat(),
      },
      actions: {
        items: [
          {
            href: `${Step.alcohol_use_summary.path}#${Question.alcohol_use_practitioner_analysis_risk_of_reoffending}`,
            text: commonContentFor('change'),
            visuallyHiddenText: 'name',
          },
        ],
      },
    },
  ],
})

export const alcoholPractitionerAnalysisSummaryTab = GovUKTabs({
  id: 'final-alcohol-practitioner-analysis',
  items: [
    {
      id: 'summary-analysis',
      label: commonContentFor('summary'),
      panel: {
        blocks: [
          alcoholSummary,
          goToPractitionerAnalysisButton(Step.alcohol_use_analysis.path, 'practitioner-analysis-summary'),
        ],
      },
    },
    {
      id: 'practitioner-analysis-summary',
      label: commonContentFor('practitioner_analysis'),
      panel: { blocks: [practitionerAnalysisSummary] },
    },
  ],
})
