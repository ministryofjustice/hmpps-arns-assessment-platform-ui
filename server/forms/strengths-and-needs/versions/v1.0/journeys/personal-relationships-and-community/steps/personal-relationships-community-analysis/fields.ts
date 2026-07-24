import { Answer } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKBody, GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { SANGenerators } from '../../../../../../generators'
import { CaseData } from '../../../../constants/formVersion'
import { Question } from '../../constants/question'
import { Step } from '../../constants/step'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import {
  personalRelationshipsCommunityLinkedReoffending,
  personalRelationshipsCommunityLinkedToSeriousHarm,
  personalRelationshipsCommunityStrengthsProtectiveFactors,
  personalRelationshipsCommunitySummary,
} from '../personal-relationships-community-summary/fields'
import { contentFor, prcShortcut } from '../../locales'
import { commonContentFor } from '../../../../locales'

// -------- Practitioner Analysis Summary Group

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    {
      key: {
        text: contentFor(
          `${prcShortcut}practitioner_analysis_strengths_or_protective_factors.text`,
          CaseData.ForenamePossessive,
        ),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              personalRelationshipsCommunityStrengthsProtectiveFactors.items,
              Answer(Question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors),
            ),
          }),
          GovUKBody({
            text: Answer(
              Question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_yes_details,
            ),
            size: 's',
          }),
          GovUKBody({
            text: Answer(
              Question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_no_details,
            ),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [
          {
            href: `${Step.personal_relationships_community_summary.path}#practitioner-analysis`,
            text: commonContentFor('change'),
            visuallyHiddenText: 'name',
          },
        ],
      },
    },
    {
      key: {
        text: contentFor(`${prcShortcut}practitioner_analysis_risk_of_serious_harm.text`, CaseData.ForenamePossessive),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              personalRelationshipsCommunityLinkedToSeriousHarm.items,
              Answer(Question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm),
            ),
          }),
          GovUKBody({
            text: Answer(
              Question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm_yes_details,
            ),
            size: 's',
          }),
          GovUKBody({
            text: Answer(
              Question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm_no_details,
            ),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [
          {
            href: `${Step.personal_relationships_community_summary.path}#practitioner-analysis`,
            text: commonContentFor('change'),
            visuallyHiddenText: 'name',
          },
        ],
      },
    },
    {
      key: {
        text: contentFor(`${prcShortcut}practitioner_analysis_risk_of_reoffending.text`, CaseData.ForenamePossessive),
      },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              personalRelationshipsCommunityLinkedReoffending.items,
              Answer(Question.personal_relationships_community_practitioner_analysis_risk_of_reoffending),
            ),
          }),
          GovUKBody({
            text: Answer(
              Question.personal_relationships_community_practitioner_analysis_risk_of_reoffending_yes_details,
            ),
            size: 's',
          }),
          GovUKBody({
            text: Answer(
              Question.personal_relationships_community_practitioner_analysis_risk_of_reoffending_no_details,
            ),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [
          {
            href: `${Step.personal_relationships_community_summary.path}#practitioner-analysis`,
            text: commonContentFor('change'),
            visuallyHiddenText: 'name',
          },
        ],
      },
    },
  ],
})

export const personalRelationshipsCommunityPractitionerAnalysisSummaryTab = GovUKTabs({
  id: 'personal-relationships-community-summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: {
        blocks: [
          personalRelationshipsCommunitySummary,
          goToPractitionerAnalysisButton(Step.personal_relationships_community_analysis.path),
        ],
      },
    },
    {
      id: 'practitioner-analysis',
      label: commonContentFor('practitioner_analysis'),
      panel: { blocks: [practitionerAnalysisSummary] },
    },
  ],
})
