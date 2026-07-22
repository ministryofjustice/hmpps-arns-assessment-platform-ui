import { validation, Self, Answer, Condition, and, or } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKCharacterCount, GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsConditions } from '../../../../../../conditions'
import { CaseData } from '../../../../constants/formVersion'
import { contentFor } from '../../locales'
import { Question } from '../../constants/question'
import { commonContentFor } from '../../../../locales'
import { Option } from '../../constants/option'
import { CommonOption } from '../../../../constants/commonOption'

const DEFAULT_CHARACTER_COUNT = 2000

const toDetailsField =
  (parent: string) =>
  ({ code, option, mandatory = false }: { code: string; option: string; mandatory?: boolean }) =>
    GovUKCharacterCount({
      code,
      label: mandatory ? commonContentFor('required_details') : commonContentFor('optional_details'),
      maxLength: DEFAULT_CHARACTER_COUNT,
      dependentWhen: and(
        Answer(parent).match(Condition.IsRequired()),
        or(
          and(
            Answer(parent).match(StrengthsAndNeedsConditions.IsArray()),
            Answer(parent).match(Condition.Array.Contains(option)),
          ),
          and(
            Answer(parent).not.match(StrengthsAndNeedsConditions.IsArray()),
            Answer(parent).match(Condition.Equals(option)),
          ),
        ),
      ),
    })

const thinkingBehavioursPeerPressureYesDetails = toDetailsField(Question.thinking_behaviours_attitudes_peer_pressure)({
  option: Option.yes_peer_pressure,
  code: Question.thinking_behaviours_attitudes_peer_pressure_yes_details,
})

const thinkingBehavioursPeerPressureSomeDetails = toDetailsField(Question.thinking_behaviours_attitudes_peer_pressure)({
  option: Option.some_peer_pressure,
  code: Question.thinking_behaviours_attitudes_peer_pressure_some_details,
})

const thinkingBehavioursPeerPressureNoDetails = toDetailsField(Question.thinking_behaviours_attitudes_peer_pressure)({
  option: Option.no_peer_pressure,
  code: Question.thinking_behaviours_attitudes_peer_pressure_no_details,
})

export const thinkingBehavioursConsequences = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_consequences,
  fieldset: {
    legend: {
      text: contentFor('question.thinking_behaviours_attitudes_consequences.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.thinking_behaviours_attitudes_consequences.hint'),
  items: [
    {
      text: contentFor('question.thinking_behaviours_attitudes_consequences.option.YES_CONSEQUENCES'),
      value: Option.yes_consequences,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_consequences.option.SOMETIMES_CONSEQUENCES'),
      value: Option.sometimes_consequences,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_consequences.option.NO_CONSEQUENCES'),
      value: Option.no_consequences,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_consequences.validation'),
    }),
  ],
})

export const thinkingBehavioursStableBehaviour = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_stable_behaviour,
  fieldset: {
    legend: {
      text: contentFor('question.thinking_behaviours_attitudes_stable_behaviour.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.thinking_behaviours_attitudes_stable_behaviour.hint'),
  items: [
    {
      text: contentFor('question.thinking_behaviours_attitudes_stable_behaviour.option.YES_STABLE'),
      value: Option.yes_stable,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_stable_behaviour.option.SOMETIMES_STABLE'),
      value: Option.sometimes_stable,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_stable_behaviour.option.NO_STABLE'),
      value: Option.no_stable,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_stable_behaviour.validation'),
    }),
  ],
})

export const thinkingBehavioursOffendingActivities = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_offending_activities,
  fieldset: {
    legend: {
      text: contentFor('question.thinking_behaviours_attitudes_offending_activities.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      text: contentFor('question.thinking_behaviours_attitudes_offending_activities.option.NO_OFFENDING_ACTIVITIES'),
      value: Option.no_offending_activities,
    },
    {
      text: contentFor(
        'question.thinking_behaviours_attitudes_offending_activities.option.SOMETIMES_OFFENDING_ACTIVITIES',
      ),
      value: Option.sometimes_offending_activities,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_offending_activities.option.YES_OFFENDING_ACTIVITIES'),
      value: Option.yes_offending_activities,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_offending_activities.validation'),
    }),
  ],
})

export const thinkingBehavioursPeerPressure = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_peer_pressure,
  fieldset: {
    legend: {
      text: contentFor('question.thinking_behaviours_attitudes_peer_pressure.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      text: contentFor('question.thinking_behaviours_attitudes_peer_pressure.option.YES_PEER_PRESSURE'),
      value: Option.yes_peer_pressure,
      block: [thinkingBehavioursPeerPressureYesDetails],
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_peer_pressure.option.SOME_PEER_PRESSURE'),
      value: Option.some_peer_pressure,
      block: [thinkingBehavioursPeerPressureSomeDetails],
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_peer_pressure.option.NO_PEER_PRESSURE'),
      value: Option.no_peer_pressure,
      block: [thinkingBehavioursPeerPressureNoDetails],
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_peer_pressure.validation'),
    }),
  ],
})

export const thinkingBehavioursProblemSolving = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_problem_solving,
  fieldset: {
    legend: {
      text: contentFor('question.thinking_behaviours_attitudes_problem_solving.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      text: contentFor('question.thinking_behaviours_attitudes_problem_solving.option.YES_PROBLEM_SOLVING'),
      value: Option.yes_problem_solving,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_problem_solving.option.LIMITED_PROBLEM_SOLVING'),
      value: Option.limited_problem_solving,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_problem_solving.option.NO_PROBLEM_SOLVING'),
      value: Option.no_problem_solving,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_problem_solving.validation'),
    }),
  ],
})

export const thinkingBehavioursPeoplesViews = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_peoples_views,
  fieldset: {
    legend: {
      text: contentFor('question.thinking_behaviours_attitudes_peoples_views.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      text: contentFor('question.thinking_behaviours_attitudes_peoples_views.option.YES_PEOPLES_VIEWS'),
      value: Option.yes_peoples_views,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_peoples_views.option.SOMETIMES_PEOPLES_VIEWS'),
      value: Option.sometimes_peoples_views,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_peoples_views.option.NO_PEOPLES_VIEWS'),
      value: Option.no_peoples_views,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_peoples_views.validation'),
    }),
  ],
})

export const thinkingBehavioursManipulativePredatoryBehaviour = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_manipulative_predatory_behaviour,
  fieldset: {
    legend: {
      text: contentFor(
        'question.thinking_behaviours_attitudes_manipulative_predatory_behaviour.text',
        CaseData.Forename,
      ),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      text: contentFor(
        'question.thinking_behaviours_attitudes_manipulative_predatory_behaviour.option.NO_MANIPULATIVE',
      ),
      value: Option.no_manipulative,
    },
    {
      text: contentFor(
        'question.thinking_behaviours_attitudes_manipulative_predatory_behaviour.option.SOME_MANIPULATIVE',
      ),
      value: Option.some_manipulative,
    },
    {
      text: contentFor(
        'question.thinking_behaviours_attitudes_manipulative_predatory_behaviour.option.YES_MANIPULATIVE',
      ),
      value: Option.yes_manipulative,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_manipulative_predatory_behaviour.validation'),
    }),
  ],
})

export const thinkingBehavioursTemperManagement = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_temper_management,
  fieldset: {
    legend: {
      text: contentFor('question.thinking_behaviours_attitudes_temper_management.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      text: contentFor('question.thinking_behaviours_attitudes_temper_management.option.YES_TEMPER'),
      value: Option.yes_temper,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_temper_management.option.SOMETIMES_TEMPER'),
      value: Option.sometimes_temper,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_temper_management.option.NO_TEMPER.text'),
      hint: contentFor('question.thinking_behaviours_attitudes_temper_management.option.NO_TEMPER.hint'),
      value: Option.no_temper,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_temper_management.validation'),
    }),
  ],
})

export const thinkingBehavioursViolenceControllingBehaviour = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_violence_controlling_behaviour,
  fieldset: {
    legend: {
      text: contentFor('question.thinking_behaviours_attitudes_violence_controlling_behaviour.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      text: contentFor('question.thinking_behaviours_attitudes_violence_controlling_behaviour.option.NO_VIOLENCE'),
      value: Option.no_violence,
    },
    {
      text: contentFor(
        'question.thinking_behaviours_attitudes_violence_controlling_behaviour.option.SOMETIMES_VIOLENCE',
      ),
      value: Option.sometimes_violence,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_violence_controlling_behaviour.option.YES_VIOLENCE'),
      value: Option.yes_violence,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_violence_controlling_behaviour.validation'),
    }),
  ],
})

export const thinkingBehavioursImpulsiveBehaviour = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_impulsive_behaviour,
  fieldset: {
    legend: {
      text: contentFor('question.thinking_behaviours_attitudes_impulsive_behaviour.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      text: contentFor('question.thinking_behaviours_attitudes_impulsive_behaviour.option.NO_IMPULSIVE'),
      value: Option.no_impulsive,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_impulsive_behaviour.option.SOMETIMES_IMPULSIVE'),
      value: Option.sometimes_impulsive,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_impulsive_behaviour.option.YES_IMPULSIVE'),
      value: Option.yes_impulsive,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_impulsive_behaviour.validation'),
    }),
  ],
})

export const thinkingBehavioursPositiveAttitude = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_positive_attitude,
  fieldset: {
    legend: {
      text: contentFor('question.thinking_behaviours_attitudes_positive_attitude.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      text: contentFor('question.thinking_behaviours_attitudes_positive_attitude.option.YES_POSITIVE_ATTITUDE'),
      value: Option.yes_positive_attitude,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_positive_attitude.option.NEGATIVE_ATTITUDE_NO_CONCERNS'),
      value: Option.negative_attitude_no_concerns,
    },
    {
      text: contentFor(
        'question.thinking_behaviours_attitudes_positive_attitude.option.NEGATIVE_ATTITUDE_AND_CONCERNS',
      ),
      value: Option.negative_attitude_and_concerns,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_positive_attitude.validation'),
    }),
  ],
})

export const thinkingBehavioursHostileOrientation = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_hostile_orientation,
  fieldset: {
    legend: {
      text: contentFor('question.thinking_behaviours_attitudes_hostile_orientation.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      text: contentFor('question.thinking_behaviours_attitudes_hostile_orientation.option.NO_HOSTILE'),
      value: Option.no_hostile,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_hostile_orientation.option.SOME_HOSTILE'),
      value: Option.some_hostile,
    },
    {
      text: 'There is evidence of suspicious, angry and vengeful thinking and behaviour',
      html: contentFor('question.thinking_behaviours_attitudes_hostile_orientation.option.YES_HOSTILE'),
      value: Option.yes_hostile,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_hostile_orientation.validation'),
    }),
  ],
})

export const thinkingBehavioursSupervision = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_supervision,
  fieldset: {
    legend: {
      text: contentFor('question.thinking_behaviours_attitudes_supervision.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      text: contentFor('question.thinking_behaviours_attitudes_supervision.option.YES_SUPERVISION'),
      value: Option.yes_supervision,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_supervision.option.UNSURE_SUPERVISION'),
      value: Option.unsure_supervision,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_supervision.option.NO_SUPERVISION'),
      value: Option.no_supervision,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_supervision.validation'),
    }),
  ],
})

export const thinkingBehavioursCriminalBehaviour = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_criminal_behaviour,
  fieldset: {
    legend: {
      text: contentFor('question.thinking_behaviours_attitudes_criminal_behaviour.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      text: contentFor('question.thinking_behaviours_attitudes_criminal_behaviour.option.NO_CRIMINAL_BEHAVIOUR'),
      value: Option.no_criminal_behaviour,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_criminal_behaviour.option.SOMETIMES_CRIMINAL_BEHAVIOUR'),
      value: Option.sometimes_criminal_behaviour,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_criminal_behaviour.option.YES_CRIMINAL_BEHAVIOUR'),
      value: Option.yes_criminal_behaviour,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_criminal_behaviour.validation'),
    }),
  ],
})

export const thinkingBehavioursRiskSexualHarm = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_risk_sexual_harm,
  fieldset: {
    legend: {
      text: contentFor('question.thinking_behaviours_attitudes_risk_sexual_harm.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      text: contentFor('question.thinking_behaviours_attitudes_risk_sexual_harm.option.YES_RISK_SEXUAL_HARM.text'),
      hint: contentFor('question.thinking_behaviours_attitudes_risk_sexual_harm.option.YES_RISK_SEXUAL_HARM.hint'),
      value: Option.yes_risk_sexual_harm,
    },
    {
      text: contentFor('question.thinking_behaviours_attitudes_risk_sexual_harm.option.NO_RISK_SEXUAL_HARM'),
      value: Option.no_risk_sexual_harm,
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_risk_sexual_harm.validation'),
    }),
  ],
})

const [
  hasMadePositiveChangesDetails,
  isActivelyMakingChangesDetails,
  wantsToMakeChangesKnowsHowDetails,
  wantsToMakeChangesNeedsHelpDetails,
  thinkingAboutMakingChangesDetails,
  doesNotWantToMakeChangesDetails,
  doesNotWantToAnswerChangesDetails,
] = [
  {
    option: CommonOption.has_made_changes,
    code: Question.thinking_behaviours_attitudes_changes_has_made_changes_details,
  },
  {
    option: CommonOption.is_making_changes,
    code: Question.thinking_behaviours_attitudes_changes_is_making_changes_details,
  },
  {
    option: CommonOption.wants_to_make_changes_knows_how_to,
    code: Question.thinking_behaviours_attitudes_changes_wants_to_make_changes_knows_how_to_details,
  },
  {
    option: CommonOption.wants_to_make_changes_needs_help,
    code: Question.thinking_behaviours_attitudes_changes_wants_to_make_changes_needs_help_details,
  },
  {
    option: CommonOption.thinking_about_making_changes,
    code: Question.thinking_behaviours_attitudes_changes_thinking_about_making_changes_details,
  },
  {
    option: CommonOption.does_not_want_to_make_changes,
    code: Question.thinking_behaviours_attitudes_changes_does_not_want_to_make_changes_details,
  },
  {
    option: CommonOption.does_not_want_to_answer,
    code: Question.thinking_behaviours_attitudes_changes_does_not_want_to_answer_details,
  },
].map(toDetailsField(Question.thinking_behaviours_attitudes_changes))

export const thinkingBehavioursChanges = GovUKRadioInput({
  code: Question.thinking_behaviours_attitudes_changes,
  fieldset: {
    legend: {
      text: contentFor('question.thinking_behaviours_attitudes_changes.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.thinking_behaviours_attitudes_changes.hint'),
  items: [
    {
      value: CommonOption.has_made_changes,
      text: commonContentFor('option.HAS_MADE_CHANGES'),
      block: hasMadePositiveChangesDetails,
    },
    {
      value: CommonOption.is_making_changes,
      text: commonContentFor('option.IS_MAKING_CHANGES'),
      block: isActivelyMakingChangesDetails,
    },
    {
      value: CommonOption.wants_to_make_changes_knows_how_to,
      text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO'),
      block: wantsToMakeChangesKnowsHowDetails,
    },
    {
      value: CommonOption.wants_to_make_changes_needs_help,
      text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_NEEDS_HELP'),
      block: wantsToMakeChangesNeedsHelpDetails,
    },
    {
      value: CommonOption.thinking_about_making_changes,
      text: commonContentFor('option.THINKING_ABOUT_MAKING_CHANGES'),
      block: thinkingAboutMakingChangesDetails,
    },
    {
      value: CommonOption.does_not_want_to_make_changes,
      text: commonContentFor('option.DOES_NOT_WANT_TO_MAKE_CHANGES'),
      block: doesNotWantToMakeChangesDetails,
    },
    {
      value: CommonOption.does_not_want_to_answer,
      text: commonContentFor('option.DOES_NOT_WANT_TO_ANSWER'),
      block: doesNotWantToAnswerChangesDetails,
    },
    { divider: commonContentFor('or') },
    { value: CommonOption.not_present, text: commonContentFor('option.NOT_PRESENT', CaseData.Forename) },
    { value: CommonOption.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: contentFor('question.thinking_behaviours_attitudes_changes.validation'),
    }),
  ],
})
