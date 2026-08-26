import { GovUKBody, GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Answer, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { commonContentFor } from '../../../../locales'
import { Step } from '../../constants/step'
import { contentFor } from '../../locales'
import { Question } from '../../constants/question'
import { SANGenerators } from '../../../../../../generators'
import { Option } from '../../constants/option'
import { CommonOption } from '../../../../constants/commonOption'
import { offenceAnalysisWhoWasTheOffenceCommittedAgainst } from '../offence-analysis-involved-parties/fields'
import {
  offenceAnalysisLeader,
  offenceAnalysisPerpetratorOfDomesticAbuse,
  offenceAnalysisPerpetratorOfDomesticAbuseType,
  offenceAnalysisRisk,
  offenceAnalysisVictimOfDomesticAbuseType,
  offenceImpactOnVictims,
} from '../offence-analysis-impact/fields'
import { CaseData } from '../../../../constants/formVersion'
import { victimCards } from '../offence-analysis-victim-summary/fields'

export const offenceAnalysisSummary = GovUKSummaryList({
  rows: [
    {
      key: { text: contentFor('question.offence_analysis_description_of_offence.text') },
      value: {
        blocks: [
          GovUKBody({
            text: Answer(Question.offence_analysis_description_of_offence),
          }),
        ],
      },
      actions: {
        items: [{ href: Step.offence_analysis.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.offence_analysis_elements.text') },
      value: {
        blocks: [
          GovUKBody({
            text: contentFor('question.offence_analysis_elements.option.ARSON'),
            visibleWhen: Answer(Question.offence_analysis_elements).match(Condition.Array.Contains(Option.arson)),
          }),
          GovUKBody({
            text: contentFor('question.offence_analysis_elements.option.DOMESTIC_ABUSE'),
            visibleWhen: Answer(Question.offence_analysis_elements).match(
              Condition.Array.Contains(Option.domestic_abuse),
            ),
          }),
          GovUKBody({
            text: contentFor('question.offence_analysis_elements.option.EXCESSIVE_VIOLENCE_SADISTIC'),
            visibleWhen: Answer(Question.offence_analysis_elements).match(
              Condition.Array.Contains(Option.excessive_violence_sadistic),
            ),
          }),
          GovUKBody({
            text: contentFor('question.offence_analysis_elements.option.HATRED_IDENTIFIABLE_GROUPS'),
            visibleWhen: Answer(Question.offence_analysis_elements).match(
              Condition.Array.Contains(Option.hatred_identifiable_groups),
            ),
          }),
          GovUKBody({
            text: contentFor('question.offence_analysis_elements.option.PHYSICAL_DAMAGE_PROPERTY'),
            visibleWhen: Answer(Question.offence_analysis_elements).match(
              Condition.Array.Contains(Option.physical_damage_property),
            ),
          }),
          GovUKBody({
            text: contentFor('question.offence_analysis_elements.option.SEXUAL_ELEMENT'),
            visibleWhen: Answer(Question.offence_analysis_elements).match(
              Condition.Array.Contains(Option.sexual_element),
            ),
          }),
          GovUKBody({
            text: contentFor('question.offence_analysis_elements.option.VICTIM_TARGETED'),
            visibleWhen: Answer(Question.offence_analysis_elements).match(
              Condition.Array.Contains(Option.victim_targeted),
            ),
          }),
          GovUKBody({
            text: Answer(Question.offence_victim_details),
            size: 's',
          }),
          GovUKBody({
            text: contentFor('question.offence_analysis_elements.option.VIOLENCE_THREAT_COERCION'),
            visibleWhen: Answer(Question.offence_analysis_elements).match(
              Condition.Array.Contains(Option.violence_threat_coercion),
            ),
          }),
          GovUKBody({
            text: contentFor('question.offence_analysis_elements.option.WEAPON'),
            visibleWhen: Answer(Question.offence_analysis_elements).match(Condition.Array.Contains(Option.weapon)),
          }),
          GovUKBody({
            text: Answer(Question.offence_weapon_details),
            size: 's',
          }),
          GovUKBody({
            text: commonContentFor('option.NONE'),
            visibleWhen: Answer(Question.offence_analysis_elements).match(Condition.Array.Contains(CommonOption.none)),
          }),
        ],
      },
      actions: {
        items: [{ href: Step.offence_analysis.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.offence_analysis_why_offence_happened.text') },
      value: {
        blocks: [
          GovUKBody({
            text: Answer(Question.offence_analysis_why_offence_happened),
          }),
        ],
      },
      actions: {
        items: [{ href: Step.offence_analysis.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.offence_analysis_motivations.text') },
      value: {
        blocks: [
          GovUKBody({
            text: contentFor('question.offence_analysis_motivations.option.ADDICTIONS_PERCEIVED_NEEDS'),
            visibleWhen: Answer(Question.offence_analysis_elements).match(
              Condition.Array.Contains(Option.addictions_perceived_needs),
            ),
          }),
          GovUKBody({
            text: contentFor('question.offence_analysis_motivations.option.PRESSURISED_LED_BY_OTHERS'),
            visibleWhen: Answer(Question.offence_analysis_elements).match(
              Condition.Array.Contains(Option.pressurised_led_by_others),
            ),
          }),
          GovUKBody({
            text: contentFor('question.offence_analysis_motivations.option.EMOTIONAL_STATE_CHRISTY'),
            visibleWhen: Answer(Question.offence_analysis_elements).match(
              Condition.Array.Contains(Option.emotional_state_christy),
            ),
          }),
          GovUKBody({
            text: contentFor('question.offence_analysis_motivations.option.FINANCIAL_MOTIVATION'),
            visibleWhen: Answer(Question.offence_analysis_motivations).match(
              Condition.Array.Contains(Option.financial_motivation),
            ),
          }),
          GovUKBody({
            text: contentFor('question.offence_analysis_motivations.option.HATRED_IDENTIFIABLE_GROUPS'),
            visibleWhen: Answer(Question.offence_analysis_motivations).match(
              Condition.Array.Contains(Option.hatred_identifiable_groups),
            ),
          }),
          GovUKBody({
            text: contentFor('question.offence_analysis_motivations.option.SEEKING_EXERTING_POWER'),
            visibleWhen: Answer(Question.offence_analysis_motivations).match(
              Condition.Array.Contains(Option.seeking_exerting_power),
            ),
          }),
          GovUKBody({
            text: contentFor('question.offence_analysis_motivations.option.SEXUAL_MOTIVATION'),
            visibleWhen: Answer(Question.offence_analysis_motivations).match(
              Condition.Array.Contains(Option.sexual_motivation),
            ),
          }),
          GovUKBody({
            text: contentFor('question.offence_analysis_motivations.option.THRILL_SEEKING'),
            visibleWhen: Answer(Question.offence_analysis_motivations).match(
              Condition.Array.Contains(Option.thrill_seeking),
            ),
          }),
          GovUKBody({
            text: commonContentFor('option.OTHER'),
            visibleWhen: Answer(Question.offence_analysis_motivations).match(
              Condition.Array.Contains(CommonOption.other),
            ),
          }),
          GovUKBody({
            text: Answer(Question.offence_analysis_motivations_other_details),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [{ href: Step.offence_analysis.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.offence_analysis_commited_against.text') },
      value: {
        blocks: [
          GovUKBody({
            text: contentFor('question.offence_analysis_commited_against.option.ONE_OR_MORE_PEOPLE'),
            visibleWhen: Answer(Question.offence_analysis_commited_against).match(
              Condition.Array.Contains(Option.one_or_more_people),
            ),
          }),
          GovUKBody({
            text: commonContentFor('option.OTHER'),
            visibleWhen: Answer(Question.offence_analysis_commited_against).match(
              Condition.Array.Contains(CommonOption.other),
            ),
          }),
          GovUKBody({
            text: Answer(Question.offence_analysis_commited_against_other_details),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [{ href: Step.offence_analysis.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.offence_analysis_who_was_the_victim.text') },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              offenceAnalysisWhoWasTheOffenceCommittedAgainst.items,
              Answer(Question.offence_analysis_who_was_the_victim),
            ),
          }),
        ],
      },
      actions: {
        items: [{ href: Step.offence_analysis_involved_parties.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.offence_analysis_leader.text', CaseData.Forename) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              offenceAnalysisLeader.items,
              Answer(Question.offence_analysis_leader),
            ),
          }),
          GovUKBody({
            text: Answer(Question.offence_analysis_leader_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.no_offence_analysis_leader_details),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [{ href: Step.offence_analysis_impact.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.offence_analysis_perpetrator_of_domestic_abuse.text', CaseData.Forename) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              offenceAnalysisPerpetratorOfDomesticAbuse.items,
              Answer(Question.offence_analysis_perpetrator_of_domestic_abuse),
            ),
          }),
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              offenceAnalysisPerpetratorOfDomesticAbuseType.items,
              Answer(Question.offence_analysis_perpetrator_of_domestic_abuse_type),
            ),
          }),
          GovUKBody({
            text: Answer(Question.offence_analysis_perpetrator_of_domestic_abuse_type_family_member_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.offence_analysis_perpetrator_of_domestic_abuse_type_intimate_partner_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(
              Question.offence_analysis_perpetrator_of_domestic_abuse_type_family_member_and_partner_details,
            ),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [{ href: Step.offence_analysis_impact.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.offence_analysis_impact_on_victims.text', CaseData.Forename) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              offenceImpactOnVictims.items,
              Answer(Question.offence_analysis_impact_on_victims),
            ),
          }),
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              offenceAnalysisVictimOfDomesticAbuseType.items,
              Answer(Question.offence_analysis_victim_of_domestic_abuse_type),
            ),
          }),
          GovUKBody({
            text: Answer(Question.offence_analysis_victim_of_domestic_abuse_type_family_member_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.offence_analysis_victim_of_domestic_abuse_type_intimate_partner_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.offence_analysis_victim_of_domestic_abuse_type_family_member_and_partner_details),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [{ href: Step.offence_analysis_impact.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.offence_analysis_patterns_of_offending.text', CaseData.Forename) },
      value: {
        blocks: [
          GovUKBody({
            text: Answer(Question.offence_analysis_patterns_of_offending),
          }),
        ],
      },
      actions: {
        items: [{ href: Step.offence_analysis_impact.path, text: commonContentFor('change') }],
      },
    },
    {
      key: { text: contentFor('question.offence_analysis_risk.text', CaseData.Forename) },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(
              offenceAnalysisRisk.items,
              Answer(Question.offence_analysis_risk),
            ),
          }),
          GovUKBody({
            text: Answer(Question.offence_analysis_risk_details),
            size: 's',
          }),
          GovUKBody({
            text: Answer(Question.no_offence_analysis_risk_details),
            size: 's',
          }),
        ],
      },
      actions: {
        items: [{ href: Step.offence_analysis_impact.path, text: commonContentFor('change') }],
      },
    },
  ],
})

export const offenceAnalysisSummaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: {
        blocks: [offenceAnalysisSummary, victimCards],
      },
    },
  ],
})
