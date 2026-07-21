import { Answer, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKBody, GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'

import { CaseData } from '../../../../constants/formVersion'
import { commonContentFor } from '../../../../locales'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Question } from '../../constants/question'
import {
  drugsPractitionerAnalysisMotivatedToStop,
  drugsSummaryPartOne,
  drugsSummaryPartThree,
  drugsSummaryPartTwo,
  moreInformationHeading,
  notUsedInLastSixMonthsSection,
  riskOfReoffending,
  riskOfSeriousHarm,
  strengthsOrProtectiveFactors,
} from '../drug-use-summary/fields'
import { usedInLastSixMonthsSection } from '../drug-details/fields'
import { SANGenerators } from '../../../../../../generators'
import { contentFor } from '../../locales'
import { CommonOption } from '../../../../constants/commonOption'

// --- Practitioner Analysis: Motivated to stop (drug-use specific) ---

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    {
      key: {
        text: contentFor('question.drugs_practitioner_analysis_motivated_to_stop.text', CaseData.Forename),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              drugsPractitionerAnalysisMotivatedToStop.items,
              Answer(Question.drugs_practitioner_analysis_motivated_to_stop),
            ),
          }),
        ],
      },
      actions: {
        items: [
          {
            href: `${Step.drug_use_summary.path}#practitioner-analysis`,
            text: commonContentFor('change'),
          },
        ],
      },
      visibleWhen: Answer('drug_use').match(Condition.Equals(CommonOption.yes)),
    },
    {
      key: {
        text: contentFor(
          'question.drug_use_practitioner_analysis_strengths_or_protective_factors.text',
          CaseData.ForenamePossessive,
        ),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              strengthsOrProtectiveFactors.items,
              Answer(Question.drug_use_practitioner_analysis_strengths_or_protective_factors),
            ),
          }),
          GovUKBody({
            text: Answer(Question.drug_use_practitioner_analysis_strengths_or_protective_factors_yes_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.drug_use_practitioner_analysis_strengths_or_protective_factors_no_details),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [
          {
            href: `${Step.drug_use_summary.path}#practitioner-analysis`,
            text: commonContentFor('change'),
          },
        ],
      },
    },
    {
      key: {
        text: contentFor(
          'question.drug_use_practitioner_analysis_risk_of_serious_harm.text',
          CaseData.ForenamePossessive,
        ),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              riskOfSeriousHarm.items,
              Answer(Question.drug_use_practitioner_analysis_risk_of_serious_harm),
            ),
          }),
          GovUKBody({
            text: Answer(Question.drug_use_practitioner_analysis_risk_of_serious_harm_yes_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.drug_use_practitioner_analysis_risk_of_serious_harm_no_details),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [
          {
            href: `${Step.drug_use_summary.path}#practitioner-analysis`,
            text: commonContentFor('change'),
            visuallyHiddenText: 'name',
          },
        ],
      },
    },
    {
      key: {
        text: contentFor(
          'question.drug_use_practitioner_analysis_risk_of_reoffending.text',
          CaseData.ForenamePossessive,
        ),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              riskOfReoffending.items,
              Answer(Question.drug_use_practitioner_analysis_risk_of_reoffending),
            ),
          }),
          GovUKBody({
            text: Answer(Question.drug_use_practitioner_analysis_risk_of_reoffending_yes_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.drug_use_practitioner_analysis_risk_of_reoffending_no_details),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [
          {
            href: `${Step.drug_use_summary.path}#practitioner-analysis`,
            text: commonContentFor('change'),
            visuallyHiddenText: 'name',
          },
        ],
      },
    },
  ],
})

export const drugsSummaryAnalysisTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: {
        blocks: [
          drugsSummaryPartOne,
          usedInLastSixMonthsSection,
          notUsedInLastSixMonthsSection,
          drugsSummaryPartTwo,
          moreInformationHeading,
          drugsSummaryPartThree,
          goToPractitionerAnalysisButton(Step.drug_use_summary.path),
        ],
      },
    },
    {
      id: 'practitioner-analysis',
      label: commonContentFor('practitioner_analysis'),
      panel: {
        blocks: [practitionerAnalysisSummary],
      },
    },
  ],
})
