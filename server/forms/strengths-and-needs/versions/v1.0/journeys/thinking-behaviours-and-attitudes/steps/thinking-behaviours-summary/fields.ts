import { and, Answer, Condition, not, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKCharacterCount,
  GovUKRadioInput,
  GovUKSummaryList,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import {
  thinkingBehavioursConsequences,
  thinkingBehavioursStableBehaviour,
  thinkingBehavioursOffendingActivities,
  thinkingBehavioursPeerPressure,
  thinkingBehavioursProblemSolving,
  thinkingBehavioursPeoplesViews,
  thinkingBehavioursManipulativePredatoryBehaviour,
  thinkingBehavioursTemperManagement,
  thinkingBehavioursViolenceControllingBehaviour,
  thinkingBehavioursImpulsiveBehaviour,
  thinkingBehavioursPositiveAttitude,
  thinkingBehavioursHostileOrientation,
  thinkingBehavioursSupervision,
  thinkingBehavioursCriminalBehaviour,
  thinkingBehavioursChanges,
} from '../thinking-behaviours/fields'
import {
  thinkingBehavioursSexualPreoccupation,
  thinkingBehavioursOffenceRelatedSexualInterest,
  thinkingBehavioursEmotionalIntimacy,
} from '../thinking-behaviours-sexual-harm/fields'
import { CaseData } from '../../../../constants/formVersion'
import { getDisplayTextForSpecificItem } from '../../../../../../i18n'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { commonContentFor } from '../../../../locales'
import { Step } from '../../constants/step'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { CommonOption } from '../../../../constants/commonOption'
import { contentFor } from '../../locales'
import { thinkingBehavioursRiskSexualHarm } from '../thinking-behaviours-risk-of-sexual-harm/fields'

const PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT = 1425

const createSummaryRowFor = (parent: string, items: any) => (option: string) =>
  getDisplayTextForSpecificItem(parent, items, option)

const createSummaryDetailsRow = (field: string) =>
  GovUKBody({
    text: Answer(field),
    size: 's',
  })

/* ------------------------------------------------------------------ */
/* Summary row creators                                               */
/* ------------------------------------------------------------------ */
const createSummaryRowForConsequences = createSummaryRowFor(
  Question.thinking_behaviours_attitudes_consequences,
  thinkingBehavioursConsequences.items,
)
const createSummaryRowForStableBehaviour = createSummaryRowFor(
  Question.thinking_behaviours_attitudes_stable_behaviour,
  thinkingBehavioursStableBehaviour.items,
)
const createSummaryRowForOffendingActivities = createSummaryRowFor(
  Question.thinking_behaviours_attitudes_offending_activities,
  thinkingBehavioursOffendingActivities.items,
)
const createSummaryRowForPeerPressure = createSummaryRowFor(
  Question.thinking_behaviours_attitudes_peer_pressure,
  thinkingBehavioursPeerPressure.items,
)
const createSummaryRowForProblemSolving = createSummaryRowFor(
  Question.thinking_behaviours_attitudes_problem_solving,
  thinkingBehavioursProblemSolving.items,
)
const createSummaryRowForPeoplesViews = createSummaryRowFor(
  Question.thinking_behaviours_attitudes_peoples_views,
  thinkingBehavioursPeoplesViews.items,
)
const createSummaryRowForManipulativePredatoryBehaviour = createSummaryRowFor(
  Question.thinking_behaviours_attitudes_manipulative_predatory_behaviour,
  thinkingBehavioursManipulativePredatoryBehaviour.items,
)
const createSummaryRowForTemperManagement = createSummaryRowFor(
  Question.thinking_behaviours_attitudes_temper_management,
  thinkingBehavioursTemperManagement.items,
)
const createSummaryRowForViolenceControllingBehaviour = createSummaryRowFor(
  Question.thinking_behaviours_attitudes_violence_controlling_behaviour,
  thinkingBehavioursViolenceControllingBehaviour.items,
)
const createSummaryRowForImpulsiveBehaviour = createSummaryRowFor(
  Question.thinking_behaviours_attitudes_impulsive_behaviour,
  thinkingBehavioursImpulsiveBehaviour.items,
)
const createSummaryRowForPositiveAttitude = createSummaryRowFor(
  Question.thinking_behaviours_attitudes_positive_attitude,
  thinkingBehavioursPositiveAttitude.items,
)
const createSummaryRowForHostileOrientation = createSummaryRowFor(
  Question.thinking_behaviours_attitudes_hostile_orientation,
  thinkingBehavioursHostileOrientation.items,
)
const createSummaryRowForSupervision = createSummaryRowFor(
  Question.thinking_behaviours_attitudes_supervision,
  thinkingBehavioursSupervision.items,
)
const createSummaryRowForCriminalBehaviour = createSummaryRowFor(
  Question.thinking_behaviours_attitudes_criminal_behaviour,
  thinkingBehavioursCriminalBehaviour.items,
)
const createSummaryRowForRiskSexualHarm = createSummaryRowFor(
  Question.thinking_behaviours_attitudes_risk_sexual_harm,
  thinkingBehavioursRiskSexualHarm.items,
)
const createSummaryRowForSexualPreoccupation = createSummaryRowFor(
  Question.thinking_behaviours_attitudes_sexual_preoccupation,
  thinkingBehavioursSexualPreoccupation.items,
)
const createSummaryRowForOffenceRelatedSexualInterest = createSummaryRowFor(
  Question.thinking_behaviours_attitudes_offence_related_sexual_interest,
  thinkingBehavioursOffenceRelatedSexualInterest.items,
)
const createSummaryRowForEmotionalIntimacy = createSummaryRowFor(
  Question.thinking_behaviours_attitudes_emotional_intimacy,
  thinkingBehavioursEmotionalIntimacy.items,
)
const createSummaryRowForChanges = createSummaryRowFor(
  Question.thinking_behaviours_attitudes_changes,
  thinkingBehavioursChanges.items,
)

export const thinkingBehavioursSummary = GovUKSummaryList({
  rows: [
    {
      key: { text: contentFor('question.thinking_behaviours_attitudes_consequences.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForConsequences(CommonOption.yes),
          createSummaryRowForConsequences(Option.sometimes),
          createSummaryRowForConsequences(CommonOption.no),
        ].flat(),
      },
      actions: { items: [{ href: Step.thinkingBehaviours.path, text: commonContentFor('change') }] },
    },
    {
      key: { text: contentFor('question.thinking_behaviours_attitudes_stable_behaviour.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForStableBehaviour(CommonOption.yes),
          createSummaryRowForStableBehaviour(Option.sometimes),
          createSummaryRowForStableBehaviour(CommonOption.no),
        ].flat(),
      },
      actions: { items: [{ href: Step.thinkingBehaviours.path, text: commonContentFor('change') }] },
    },
    {
      key: { text: contentFor('question.thinking_behaviours_attitudes_offending_activities.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForOffendingActivities(Option.no_offending_activities),
          createSummaryRowForOffendingActivities(Option.sometimes_offending_activities),
          createSummaryRowForOffendingActivities(Option.yes_offending_activities),
        ].flat(),
      },
      actions: { items: [{ href: Step.thinkingBehaviours.path, text: commonContentFor('change') }] },
    },
    {
      key: { text: contentFor('question.thinking_behaviours_attitudes_peer_pressure.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForPeerPressure(CommonOption.yes),
          createSummaryDetailsRow(Question.thinking_behaviours_attitudes_peer_pressure_yes_details),
          createSummaryRowForPeerPressure(Option.some),
          createSummaryDetailsRow(Question.thinking_behaviours_attitudes_peer_pressure_some_details),
          createSummaryRowForPeerPressure(CommonOption.no),
          createSummaryDetailsRow(Question.thinking_behaviours_attitudes_peer_pressure_no_details),
        ].flat(),
      },
      actions: { items: [{ href: Step.thinkingBehaviours.path, text: commonContentFor('change') }] },
    },
    {
      key: { text: contentFor('question.thinking_behaviours_attitudes_problem_solving.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForProblemSolving(CommonOption.yes),
          createSummaryRowForProblemSolving(Option.limited_problem_solving),
          createSummaryRowForProblemSolving(CommonOption.no),
        ].flat(),
      },
      actions: { items: [{ href: Step.thinkingBehaviours.path, text: commonContentFor('change') }] },
    },
    {
      key: { text: contentFor('question.thinking_behaviours_attitudes_peoples_views.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForPeoplesViews(CommonOption.yes),
          createSummaryRowForPeoplesViews(Option.sometimes),
          createSummaryRowForPeoplesViews(CommonOption.no),
        ].flat(),
      },
      actions: { items: [{ href: Step.thinkingBehaviours.path, text: commonContentFor('change') }] },
    },
    {
      key: {
        text: contentFor(
          'question.thinking_behaviours_attitudes_manipulative_predatory_behaviour.text',
          CaseData.Forename,
        ),
      },
      value: {
        blocks: [
          createSummaryRowForManipulativePredatoryBehaviour(CommonOption.no),
          createSummaryRowForManipulativePredatoryBehaviour(Option.some),
          createSummaryRowForManipulativePredatoryBehaviour(CommonOption.yes),
        ].flat(),
      },
      actions: { items: [{ href: Step.thinkingBehaviours.path, text: commonContentFor('change') }] },
    },
    {
      key: { text: contentFor('question.thinking_behaviours_attitudes_temper_management.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForTemperManagement(CommonOption.yes),
          createSummaryRowForTemperManagement(Option.sometimes),
          createSummaryRowForTemperManagement(CommonOption.no),
        ].flat(),
      },
      actions: { items: [{ href: Step.thinkingBehaviours.path, text: commonContentFor('change') }] },
    },
    {
      key: {
        text: contentFor(
          'question.thinking_behaviours_attitudes_violence_controlling_behaviour.text',
          CaseData.Forename,
        ),
      },
      value: {
        blocks: [
          createSummaryRowForViolenceControllingBehaviour(Option.no_violence),
          createSummaryRowForViolenceControllingBehaviour(Option.sometimes),
          createSummaryRowForViolenceControllingBehaviour(Option.yes_violence),
        ].flat(),
      },
      actions: { items: [{ href: Step.thinkingBehaviours.path, text: commonContentFor('change') }] },
    },
    {
      key: { text: contentFor('question.thinking_behaviours_attitudes_impulsive_behaviour.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForImpulsiveBehaviour(CommonOption.no),
          createSummaryRowForImpulsiveBehaviour(Option.sometimes),
          createSummaryRowForImpulsiveBehaviour(CommonOption.yes),
        ].flat(),
      },
      actions: { items: [{ href: Step.thinkingBehaviours.path, text: commonContentFor('change') }] },
    },
    {
      key: { text: contentFor('question.thinking_behaviours_attitudes_positive_attitude.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForPositiveAttitude(Option.yes_positive),
          createSummaryRowForPositiveAttitude(Option.negative_attitude_no_concerns),
          createSummaryRowForPositiveAttitude(Option.negative_attitude_and_concerns),
        ].flat(),
      },
      actions: { items: [{ href: Step.thinkingBehaviours.path, text: commonContentFor('change') }] },
    },
    {
      key: { text: contentFor('question.thinking_behaviours_attitudes_hostile_orientation.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForHostileOrientation(CommonOption.no),
          createSummaryRowForHostileOrientation(Option.some),
          createSummaryRowForHostileOrientation(CommonOption.yes),
        ].flat(),
      },
      actions: { items: [{ href: Step.thinkingBehaviours.path, text: commonContentFor('change') }] },
    },
    {
      key: { text: contentFor('question.thinking_behaviours_attitudes_supervision.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForSupervision(Option.yes_supervision),
          createSummaryRowForSupervision(Option.unsure_supervision),
          createSummaryRowForSupervision(Option.no_supervision),
        ].flat(),
      },
      actions: { items: [{ href: Step.thinkingBehaviours.path, text: commonContentFor('change') }] },
    },
    {
      key: { text: contentFor('question.thinking_behaviours_attitudes_criminal_behaviour.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForCriminalBehaviour(CommonOption.no),
          createSummaryRowForCriminalBehaviour(Option.sometimes),
          createSummaryRowForCriminalBehaviour(CommonOption.yes),
        ].flat(),
      },
      actions: { items: [{ href: Step.thinkingBehaviours.path, text: commonContentFor('change') }] },
    },
    {
      key: { text: contentFor('question.thinking_behaviours_attitudes_changes.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForChanges(CommonOption.has_made_changes),
          createSummaryDetailsRow(Question.thinking_behaviours_attitudes_changes_has_made_changes_details),
          createSummaryRowForChanges(CommonOption.is_making_changes),
          createSummaryDetailsRow(Question.thinking_behaviours_attitudes_changes_is_making_changes_details),
          createSummaryRowForChanges(CommonOption.wants_to_make_changes_knows_how_to),
          createSummaryDetailsRow(
            Question.thinking_behaviours_attitudes_changes_wants_to_make_changes_knows_how_to_details,
          ),
          createSummaryRowForChanges(CommonOption.wants_to_make_changes_needs_help),
          createSummaryDetailsRow(
            Question.thinking_behaviours_attitudes_changes_wants_to_make_changes_needs_help_details,
          ),
          createSummaryRowForChanges(CommonOption.thinking_about_making_changes),
          createSummaryDetailsRow(Question.thinking_behaviours_attitudes_changes_thinking_about_making_changes_details),
          createSummaryRowForChanges(CommonOption.does_not_want_to_make_changes),
          createSummaryDetailsRow(Question.thinking_behaviours_attitudes_changes_does_not_want_to_make_changes_details),
          createSummaryRowForChanges(CommonOption.does_not_want_to_answer),
          createSummaryDetailsRow(Question.thinking_behaviours_attitudes_changes_does_not_want_to_answer_details),
          createSummaryRowForChanges(CommonOption.not_present),
          createSummaryRowForChanges(CommonOption.not_applicable),
        ].flat(),
      },
      actions: { items: [{ href: Step.thinkingBehaviours.path, text: commonContentFor('change') }] },
    },
    {
      key: { text: contentFor('question.thinking_behaviours_attitudes_risk_sexual_harm.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForRiskSexualHarm(CommonOption.yes),
          createSummaryRowForRiskSexualHarm(CommonOption.no),
        ].flat(),
      },
      actions: { items: [{ href: Step.thinkingBehavioursRiskOfSexualHarm.path, text: commonContentFor('change') }] },
    },
    {
      key: { text: contentFor('question.thinking_behaviours_attitudes_sexual_preoccupation.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForSexualPreoccupation(CommonOption.yes),
          createSummaryRowForSexualPreoccupation(Option.sometimes),
          createSummaryRowForSexualPreoccupation(CommonOption.no),
          createSummaryRowForSexualPreoccupation(CommonOption.unknown),
        ].flat(),
      },
      actions: { items: [{ href: Step.thinkingBehavioursSexualHarm.path, text: commonContentFor('change') }] },
    },
    {
      key: {
        text: contentFor(
          'question.thinking_behaviours_attitudes_offence_related_sexual_interest.text',
          CaseData.Forename,
        ),
      },
      value: {
        blocks: [
          createSummaryRowForOffenceRelatedSexualInterest(Option.yes_offence_related_sexual_interest),
          createSummaryRowForOffenceRelatedSexualInterest(Option.some_offence_related_sexual_interest),
          createSummaryRowForOffenceRelatedSexualInterest(Option.no_offence_related_sexual_interest),
          createSummaryRowForOffenceRelatedSexualInterest(CommonOption.unknown),
        ].flat(),
      },
      actions: { items: [{ href: Step.thinkingBehavioursSexualHarm.path, text: commonContentFor('change') }] },
    },
    {
      key: { text: contentFor('question.thinking_behaviours_attitudes_emotional_intimacy.text', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForEmotionalIntimacy(CommonOption.yes),
          createSummaryRowForEmotionalIntimacy(Option.sometimes),
          createSummaryRowForEmotionalIntimacy(CommonOption.no),
          createSummaryRowForEmotionalIntimacy(CommonOption.unknown),
        ].flat(),
      },
      actions: { items: [{ href: Step.thinkingBehavioursSexualHarm.path, text: commonContentFor('change') }] },
    },
  ],
})

const strengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: Question.thinking_behaviours_attitudes_strengths_protective_factors_details,
  label: commonContentFor('required_details'),
  maxLength: PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT,
  dependentWhen: and(
    Answer(Question.thinking_behaviours_attitudes_strengths_protective_factors).match(Condition.IsRequired()),
    Answer(Question.thinking_behaviours_attitudes_strengths_protective_factors).match(
      Condition.Equals(CommonOption.yes),
    ),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.thinking_behaviours_attitudes_strengths_protective_factors_details.validation'),
    }),
  ],
})

const noStrengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: Question.thinking_behaviours_attitudes_no_strengths_protective_factors_details,
  label: commonContentFor('optional_details'),
  maxLength: PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT,
  dependentWhen: Answer(Question.thinking_behaviours_attitudes_strengths_protective_factors).match(
    Condition.Equals(CommonOption.no),
  ),
})

export const strengthsOrProtectiveFactors = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_strengths_protective_factors,
  fieldset: {
    legend: {
      text: contentFor(
        'question.thinking_behaviours_attitudes_strengths_protective_factors.text',
        CaseData.ForenamePossessive,
      ),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.thinking_behaviours_attitudes_strengths_protective_factors.hint'),
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: strengthsProtectiveFactorsDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: noStrengthsProtectiveFactorsDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.thinking_behaviours_attitudes_strengths_protective_factors.validation'),
    }),
  ],
})

const seriousHarmDetails = GovUKCharacterCount({
  code: Question.thinking_behaviours_attitudes_serious_harm_details,
  label: commonContentFor('required_details'),
  maxLength: PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT,
  dependentWhen: and(
    Answer(Question.thinking_behaviours_attitudes_linked_to_serious_harm).match(Condition.IsRequired()),
    Answer(Question.thinking_behaviours_attitudes_linked_to_serious_harm).match(Condition.Equals(CommonOption.yes)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.thinking_behaviours_attitudes_serious_harm_details.validation'),
    }),
  ],
})

const noSeriousHarmDetails = GovUKCharacterCount({
  code: Question.thinking_behaviours_attitudes_no_serious_harm_details,
  label: commonContentFor('optional_details'),
  maxLength: PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT,
  dependentWhen: Answer(Question.thinking_behaviours_attitudes_linked_to_serious_harm).match(
    Condition.Equals(CommonOption.no),
  ),
})

export const linkedToSeriousHarm = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_linked_to_serious_harm,
  fieldset: {
    legend: {
      text: contentFor(
        'question.thinking_behaviours_attitudes_linked_to_serious_harm.text',
        CaseData.ForenamePossessive,
      ),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: seriousHarmDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: noSeriousHarmDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.thinking_behaviours_attitudes_linked_to_serious_harm.validation'),
    }),
  ],
})

const riskOfReoffendingDetails = GovUKCharacterCount({
  code: Question.thinking_behaviours_attitudes_risk_of_reoffending_details,
  label: commonContentFor('required_details'),
  maxLength: PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT,
  dependentWhen: and(
    Answer(Question.thinking_behaviours_attitudes_linked_to_reoffending).match(Condition.IsRequired()),
    Answer(Question.thinking_behaviours_attitudes_linked_to_reoffending).match(Condition.Equals(CommonOption.yes)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.thinking_behaviours_attitudes_risk_of_reoffending_details.validation'),
    }),
  ],
})

const noRiskOfReoffendingDetails = GovUKCharacterCount({
  code: Question.thinking_behaviours_attitudes_no_risk_of_reoffending_details,
  label: commonContentFor('optional_details'),
  maxLength: PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT,
  dependentWhen: Answer(Question.thinking_behaviours_attitudes_linked_to_reoffending).match(
    Condition.Equals(CommonOption.no),
  ),
})

export const linkedToReoffending = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_linked_to_reoffending,
  fieldset: {
    legend: {
      text: contentFor(
        'question.thinking_behaviours_attitudes_linked_to_reoffending.text',
        CaseData.ForenamePossessive,
      ),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: CommonOption.yes, text: commonContentFor('option.YES'), block: riskOfReoffendingDetails },
    { value: CommonOption.no, text: commonContentFor('option.NO'), block: noRiskOfReoffendingDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.thinking_behaviours_attitudes_linked_to_reoffending.validation'),
    }),
  ],
})

export const summaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: {
        blocks: [thinkingBehavioursSummary, goToPractitionerAnalysisButton(Step.thinkingBehavioursSummary.path)],
      },
    },
    {
      id: 'practitioner-analysis',
      label: commonContentFor('practitioner_analysis'),
      panel: {
        blocks: [strengthsOrProtectiveFactors, linkedToSeriousHarm, linkedToReoffending, markAsCompleteButton],
      },
    },
  ],
})
