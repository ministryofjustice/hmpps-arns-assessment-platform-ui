import { Answer, Condition, Data, when } from '@ministryofjustice/hmpps-forge/core/authoring'

import { CaseData } from '../../constants/formVersion'
import { CharacterLimit } from '../../constants/characterLimit'
import { CommonOption } from '../../constants/commonOption'
import {
  itemisedSummaryRow,
  optionalDetails,
  question,
  radioField,
  requiredDetails,
  yesNo,
} from '../../constants/questionContent'
import { commonContentFor } from '../../locales'
import { contentFor } from './locales'
import { Question } from './constants/question'
import { Step } from './constants/step'
import { Option } from './constants/option'

// The three sexual harm questions are only asked (and summarised) once a risk
// of sexual harm to others has been confirmed.
const riskOfSexualHarmConfirmed = Answer(Question.thinking_behaviours_attitudes_risk_sexual_harm).match(
  Condition.Equals(CommonOption.yes),
)

const consequences = question({
  content: {
    code: Question.thinking_behaviours_attitudes_consequences,
    text: contentFor('question.thinking_behaviours_attitudes_consequences.text', CaseData.Forename),
    hint: contentFor('question.thinking_behaviours_attitudes_consequences.hint'),
    options: [
      {
        value: CommonOption.yes,
        text: contentFor('question.thinking_behaviours_attitudes_consequences.option.YES'),
      },
      {
        value: Option.sometimes,
        text: contentFor('question.thinking_behaviours_attitudes_consequences.option.SOMETIMES'),
      },
      {
        value: CommonOption.no,
        text: contentFor('question.thinking_behaviours_attitudes_consequences.option.NO'),
      },
    ],
    validationMessage: contentFor('question.thinking_behaviours_attitudes_consequences.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.thinkingBehaviours.path }),
  },
})

const stableBehaviour = question({
  content: {
    code: Question.thinking_behaviours_attitudes_stable_behaviour,
    text: contentFor('question.thinking_behaviours_attitudes_stable_behaviour.text', CaseData.Forename),
    hint: contentFor('question.thinking_behaviours_attitudes_stable_behaviour.hint'),
    options: [
      {
        value: CommonOption.yes,
        text: contentFor('question.thinking_behaviours_attitudes_stable_behaviour.option.YES'),
      },
      {
        value: Option.sometimes,
        text: contentFor('question.thinking_behaviours_attitudes_stable_behaviour.option.SOMETIMES'),
      },
      {
        value: CommonOption.no,
        text: contentFor('question.thinking_behaviours_attitudes_stable_behaviour.option.NO'),
      },
    ],
    validationMessage: contentFor('question.thinking_behaviours_attitudes_stable_behaviour.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.thinkingBehaviours.path }),
  },
})

const offendingActivities = question({
  content: {
    code: Question.thinking_behaviours_attitudes_offending_activities,
    text: contentFor('question.thinking_behaviours_attitudes_offending_activities.text', CaseData.Forename),
    options: [
      {
        value: Option.no_offending_activities,
        text: contentFor('question.thinking_behaviours_attitudes_offending_activities.option.NO_OFFENDING_ACTIVITIES'),
      },
      {
        value: Option.sometimes_offending_activities,
        text: contentFor(
          'question.thinking_behaviours_attitudes_offending_activities.option.SOMETIMES_OFFENDING_ACTIVITIES',
        ),
      },
      {
        value: Option.yes_offending_activities,
        text: contentFor('question.thinking_behaviours_attitudes_offending_activities.option.YES_OFFENDING_ACTIVITIES'),
      },
    ],
    validationMessage: contentFor('question.thinking_behaviours_attitudes_offending_activities.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.thinkingBehaviours.path }),
  },
})

const peerPressure = question({
  content: {
    code: Question.thinking_behaviours_attitudes_peer_pressure,
    text: contentFor('question.thinking_behaviours_attitudes_peer_pressure.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.yes,
        text: contentFor('question.thinking_behaviours_attitudes_peer_pressure.option.YES'),
        reveals: optionalDetails({ code: Question.thinking_behaviours_attitudes_peer_pressure_yes_details }),
      },
      {
        value: Option.some,
        text: contentFor('question.thinking_behaviours_attitudes_peer_pressure.option.SOME'),
        reveals: optionalDetails({ code: Question.thinking_behaviours_attitudes_peer_pressure_some_details }),
      },
      {
        value: CommonOption.no,
        text: contentFor('question.thinking_behaviours_attitudes_peer_pressure.option.NO'),
        reveals: optionalDetails({ code: Question.thinking_behaviours_attitudes_peer_pressure_no_details }),
      },
    ],
    validationMessage: contentFor('question.thinking_behaviours_attitudes_peer_pressure.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.thinkingBehaviours.path }),
  },
})

const problemSolving = question({
  content: {
    code: Question.thinking_behaviours_attitudes_problem_solving,
    text: contentFor('question.thinking_behaviours_attitudes_problem_solving.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.yes,
        text: contentFor('question.thinking_behaviours_attitudes_problem_solving.option.YES'),
      },
      {
        value: Option.limited_problem_solving,
        text: contentFor('question.thinking_behaviours_attitudes_problem_solving.option.LIMITED_PROBLEM_SOLVING'),
      },
      {
        value: CommonOption.no,
        text: contentFor('question.thinking_behaviours_attitudes_problem_solving.option.NO'),
      },
    ],
    validationMessage: contentFor('question.thinking_behaviours_attitudes_problem_solving.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.thinkingBehaviours.path }),
  },
})

const peoplesViews = question({
  content: {
    code: Question.thinking_behaviours_attitudes_peoples_views,
    text: contentFor('question.thinking_behaviours_attitudes_peoples_views.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.yes,
        text: contentFor('question.thinking_behaviours_attitudes_peoples_views.option.YES'),
      },
      {
        value: Option.sometimes,
        text: contentFor('question.thinking_behaviours_attitudes_peoples_views.option.SOMETIMES'),
      },
      {
        value: CommonOption.no,
        text: contentFor('question.thinking_behaviours_attitudes_peoples_views.option.NO'),
      },
    ],
    validationMessage: contentFor('question.thinking_behaviours_attitudes_peoples_views.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.thinkingBehaviours.path }),
  },
})

const manipulativePredatoryBehaviour = question({
  content: {
    code: Question.thinking_behaviours_attitudes_manipulative_predatory_behaviour,
    text: contentFor('question.thinking_behaviours_attitudes_manipulative_predatory_behaviour.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.no,
        text: contentFor('question.thinking_behaviours_attitudes_manipulative_predatory_behaviour.option.NO'),
      },
      {
        value: Option.some,
        text: contentFor('question.thinking_behaviours_attitudes_manipulative_predatory_behaviour.option.SOME'),
      },
      {
        value: CommonOption.yes,
        text: contentFor('question.thinking_behaviours_attitudes_manipulative_predatory_behaviour.option.YES'),
      },
    ],
    validationMessage: contentFor('question.thinking_behaviours_attitudes_manipulative_predatory_behaviour.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.thinkingBehaviours.path }),
  },
})

const temperManagement = question({
  content: {
    code: Question.thinking_behaviours_attitudes_temper_management,
    text: contentFor('question.thinking_behaviours_attitudes_temper_management.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.yes,
        text: contentFor('question.thinking_behaviours_attitudes_temper_management.option.YES'),
      },
      {
        value: Option.sometimes,
        text: contentFor('question.thinking_behaviours_attitudes_temper_management.option.SOMETIMES'),
      },
      {
        value: CommonOption.no,
        text: contentFor('question.thinking_behaviours_attitudes_temper_management.option.NO.text'),
        hint: contentFor('question.thinking_behaviours_attitudes_temper_management.option.NO.hint'),
      },
    ],
    validationMessage: contentFor('question.thinking_behaviours_attitudes_temper_management.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.thinkingBehaviours.path }),
  },
})

const violenceControllingBehaviour = question({
  content: {
    code: Question.thinking_behaviours_attitudes_violence_controlling_behaviour,
    text: contentFor('question.thinking_behaviours_attitudes_violence_controlling_behaviour.text', CaseData.Forename),
    options: [
      {
        value: Option.no_violence,
        text: contentFor('question.thinking_behaviours_attitudes_violence_controlling_behaviour.option.NO_VIOLENCE'),
      },
      {
        value: Option.sometimes,
        text: contentFor('question.thinking_behaviours_attitudes_violence_controlling_behaviour.option.SOMETIMES'),
      },
      {
        value: Option.yes_violence,
        text: contentFor('question.thinking_behaviours_attitudes_violence_controlling_behaviour.option.YES_VIOLENCE'),
      },
    ],
    validationMessage: contentFor('question.thinking_behaviours_attitudes_violence_controlling_behaviour.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.thinkingBehaviours.path }),
  },
})

const impulsiveBehaviour = question({
  content: {
    code: Question.thinking_behaviours_attitudes_impulsive_behaviour,
    text: contentFor('question.thinking_behaviours_attitudes_impulsive_behaviour.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.no,
        text: contentFor('question.thinking_behaviours_attitudes_impulsive_behaviour.option.NO'),
      },
      {
        value: Option.sometimes,
        text: contentFor('question.thinking_behaviours_attitudes_impulsive_behaviour.option.SOMETIMES'),
      },
      {
        value: CommonOption.yes,
        text: contentFor('question.thinking_behaviours_attitudes_impulsive_behaviour.option.YES'),
      },
    ],
    validationMessage: contentFor('question.thinking_behaviours_attitudes_impulsive_behaviour.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.thinkingBehaviours.path }),
  },
})

const positiveAttitude = question({
  content: {
    code: Question.thinking_behaviours_attitudes_positive_attitude,
    text: contentFor('question.thinking_behaviours_attitudes_positive_attitude.text', CaseData.Forename),
    options: [
      {
        value: Option.yes_positive,
        text: contentFor('question.thinking_behaviours_attitudes_positive_attitude.option.YES_POSITIVE'),
      },
      {
        value: Option.negative_attitude_no_concerns,
        text: contentFor(
          'question.thinking_behaviours_attitudes_positive_attitude.option.NEGATIVE_ATTITUDE_NO_CONCERNS',
        ),
      },
      {
        value: Option.negative_attitude_and_concerns,
        text: contentFor(
          'question.thinking_behaviours_attitudes_positive_attitude.option.NEGATIVE_ATTITUDE_AND_CONCERNS',
        ),
      },
    ],
    validationMessage: contentFor('question.thinking_behaviours_attitudes_positive_attitude.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.thinkingBehaviours.path }),
  },
})

const hostileOrientation = question({
  content: {
    code: Question.thinking_behaviours_attitudes_hostile_orientation,
    text: contentFor('question.thinking_behaviours_attitudes_hostile_orientation.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.no,
        text: contentFor('question.thinking_behaviours_attitudes_hostile_orientation.option.NO'),
      },
      {
        value: Option.some,
        text: contentFor('question.thinking_behaviours_attitudes_hostile_orientation.option.SOME'),
      },
      {
        value: CommonOption.yes,
        text: contentFor('question.thinking_behaviours_attitudes_hostile_orientation.option.YES.text'),
        html: contentFor('question.thinking_behaviours_attitudes_hostile_orientation.option.YES.html'),
      },
    ],
    validationMessage: contentFor('question.thinking_behaviours_attitudes_hostile_orientation.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.thinkingBehaviours.path }),
  },
})

const supervision = question({
  content: {
    code: Question.thinking_behaviours_attitudes_supervision,
    text: contentFor('question.thinking_behaviours_attitudes_supervision.text', CaseData.Forename),
    options: [
      {
        value: Option.yes_supervision,
        text: contentFor('question.thinking_behaviours_attitudes_supervision.option.YES_SUPERVISION'),
      },
      {
        value: Option.unsure_supervision,
        text: contentFor('question.thinking_behaviours_attitudes_supervision.option.UNSURE_SUPERVISION'),
      },
      {
        value: Option.no_supervision,
        text: contentFor('question.thinking_behaviours_attitudes_supervision.option.NO_SUPERVISION'),
      },
    ],
    validationMessage: contentFor('question.thinking_behaviours_attitudes_supervision.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.thinkingBehaviours.path }),
  },
})

const criminalBehaviour = question({
  content: {
    code: Question.thinking_behaviours_attitudes_criminal_behaviour,
    text: contentFor('question.thinking_behaviours_attitudes_criminal_behaviour.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.no,
        text: contentFor('question.thinking_behaviours_attitudes_criminal_behaviour.option.NO'),
      },
      {
        value: Option.sometimes,
        text: contentFor('question.thinking_behaviours_attitudes_criminal_behaviour.option.SOMETIMES'),
      },
      {
        value: CommonOption.yes,
        text: contentFor('question.thinking_behaviours_attitudes_criminal_behaviour.option.YES'),
      },
    ],
    validationMessage: contentFor('question.thinking_behaviours_attitudes_criminal_behaviour.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.thinkingBehaviours.path }),
  },
})

const changes = question({
  content: {
    code: Question.thinking_behaviours_attitudes_changes,
    text: contentFor('question.thinking_behaviours_attitudes_changes.text', CaseData.Forename),
    hint: contentFor('question.thinking_behaviours_attitudes_changes.hint', CaseData.Forename),
    options: [
      {
        value: CommonOption.has_made_changes,
        text: commonContentFor('option.HAS_MADE_CHANGES'),
        reveals: optionalDetails({ code: Question.thinking_behaviours_attitudes_changes_has_made_changes_details }),
      },
      {
        value: CommonOption.is_making_changes,
        text: commonContentFor('option.IS_MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.thinking_behaviours_attitudes_changes_is_making_changes_details }),
      },
      {
        value: CommonOption.wants_to_make_changes_knows_how_to,
        text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO'),
        reveals: optionalDetails({
          code: Question.thinking_behaviours_attitudes_changes_wants_to_make_changes_knows_how_to_details,
        }),
      },
      {
        value: CommonOption.wants_to_make_changes_needs_help,
        text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_NEEDS_HELP'),
        reveals: optionalDetails({
          code: Question.thinking_behaviours_attitudes_changes_wants_to_make_changes_needs_help_details,
        }),
      },
      {
        value: CommonOption.thinking_about_making_changes,
        text: commonContentFor('option.THINKING_ABOUT_MAKING_CHANGES'),
        reveals: optionalDetails({
          code: Question.thinking_behaviours_attitudes_changes_thinking_about_making_changes_details,
        }),
      },
      {
        value: CommonOption.does_not_want_to_make_changes,
        text: commonContentFor('option.DOES_NOT_WANT_TO_MAKE_CHANGES'),
        reveals: optionalDetails({
          code: Question.thinking_behaviours_attitudes_changes_does_not_want_to_make_changes_details,
        }),
      },
      {
        value: CommonOption.does_not_want_to_answer,
        text: commonContentFor('option.DOES_NOT_WANT_TO_ANSWER'),
        reveals: optionalDetails({
          code: Question.thinking_behaviours_attitudes_changes_does_not_want_to_answer_details,
        }),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.not_present, text: commonContentFor('option.NOT_PRESENT', CaseData.Forename) },
      { value: CommonOption.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
    ],
    validationMessage: contentFor('question.thinking_behaviours_attitudes_changes.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.thinkingBehaviours.path }),
  },
})

const riskSexualHarm = question({
  content: {
    code: Question.thinking_behaviours_attitudes_risk_sexual_harm,
    text: contentFor('question.thinking_behaviours_attitudes_risk_sexual_harm.text', CaseData.Forename),
    // The warning only shows when case data records no sexual or sexually
    // motivated offence history; with such a history the question is asked
    // plainly (and answering "No" is ruled out below).
    hint: {
      html: when(Data('caseData.sexuallyMotivatedOffenceHistory').match(Condition.Equals(CommonOption.no)))
        .then(contentFor('question.thinking_behaviours_attitudes_risk_sexual_harm.hint', CaseData.Forename))
        .else(''),
    },
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        hint: contentFor('question.thinking_behaviours_attitudes_risk_sexual_harm.option.YES.hint'),
      },
      {
        value: CommonOption.no,
        text: commonContentFor('option.NO'),
        disabled: Data('caseData.sexuallyMotivatedOffenceHistory').match(Condition.Equals(CommonOption.yes)),
      },
    ],
    validationMessage: contentFor('question.thinking_behaviours_attitudes_risk_sexual_harm.validation'),
  },
  displayModes: {
    field: radioField({ legendClasses: 'govuk-fieldset__legend--l' }),
    summaryRow: itemisedSummaryRow({ changePath: Step.thinkingBehavioursRiskOfSexualHarm.path }),
  },
})

const sexualPreoccupation = question({
  content: {
    code: Question.thinking_behaviours_attitudes_sexual_preoccupation,
    text: contentFor('question.thinking_behaviours_attitudes_sexual_preoccupation.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.yes,
        text: contentFor('question.thinking_behaviours_attitudes_sexual_preoccupation.option.YES'),
      },
      {
        value: Option.sometimes,
        text: contentFor('question.thinking_behaviours_attitudes_sexual_preoccupation.option.SOMETIMES'),
      },
      {
        value: CommonOption.no,
        text: contentFor('question.thinking_behaviours_attitudes_sexual_preoccupation.option.NO.text'),
        hint: contentFor('question.thinking_behaviours_attitudes_sexual_preoccupation.option.NO.hint'),
      },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.thinking_behaviours_attitudes_sexual_preoccupation.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.thinkingBehavioursSexualHarm.path,
      visibleWhen: riskOfSexualHarmConfirmed,
    }),
  },
})

const offenceRelatedSexualInterest = question({
  content: {
    code: Question.thinking_behaviours_attitudes_offence_related_sexual_interest,
    text: contentFor('question.thinking_behaviours_attitudes_offence_related_sexual_interest.text', CaseData.Forename),
    options: [
      {
        value: Option.yes_offence_related_sexual_interest,
        text: contentFor(
          'question.thinking_behaviours_attitudes_offence_related_sexual_interest.option.YES_OFFENCE_RELATED_SEXUAL_INTEREST.text',
        ),
        hint: contentFor(
          'question.thinking_behaviours_attitudes_offence_related_sexual_interest.option.YES_OFFENCE_RELATED_SEXUAL_INTEREST.hint',
        ),
      },
      {
        value: Option.some_offence_related_sexual_interest,
        text: contentFor(
          'question.thinking_behaviours_attitudes_offence_related_sexual_interest.option.SOME_OFFENCE_RELATED_SEXUAL_INTEREST',
        ),
      },
      {
        value: Option.no_offence_related_sexual_interest,
        text: contentFor(
          'question.thinking_behaviours_attitudes_offence_related_sexual_interest.option.NO_OFFENCE_RELATED_SEXUAL_INTEREST.text',
        ),
        hint: contentFor(
          'question.thinking_behaviours_attitudes_offence_related_sexual_interest.option.NO_OFFENCE_RELATED_SEXUAL_INTEREST.hint',
        ),
      },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.thinking_behaviours_attitudes_offence_related_sexual_interest.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.thinkingBehavioursSexualHarm.path,
      visibleWhen: riskOfSexualHarmConfirmed,
    }),
  },
})

const emotionalIntimacy = question({
  content: {
    code: Question.thinking_behaviours_attitudes_emotional_intimacy,
    text: contentFor('question.thinking_behaviours_attitudes_emotional_intimacy.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.yes,
        text: contentFor('question.thinking_behaviours_attitudes_emotional_intimacy.option.YES'),
      },
      {
        value: Option.sometimes,
        text: contentFor('question.thinking_behaviours_attitudes_emotional_intimacy.option.SOMETIMES'),
      },
      {
        value: CommonOption.no,
        text: contentFor('question.thinking_behaviours_attitudes_emotional_intimacy.option.NO'),
      },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.thinking_behaviours_attitudes_emotional_intimacy.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.thinkingBehavioursSexualHarm.path,
      visibleWhen: riskOfSexualHarmConfirmed,
    }),
  },
})

const strengthsOrProtectiveFactors = question({
  content: {
    code: Question.thinking_behaviours_attitudes_strengths_protective_factors,
    text: contentFor(
      'question.thinking_behaviours_attitudes_strengths_protective_factors.text',
      CaseData.ForenamePossessive,
    ),
    hint: contentFor('question.thinking_behaviours_attitudes_strengths_protective_factors.hint'),
    options: yesNo({
      yes: requiredDetails({
        code: Question.thinking_behaviours_attitudes_strengths_protective_factors_details,
        validationMessage: contentFor(
          'question.thinking_behaviours_attitudes_strengths_protective_factors_details.validation',
        ),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.thinking_behaviours_attitudes_no_strengths_protective_factors_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor('question.thinking_behaviours_attitudes_strengths_protective_factors.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.thinkingBehavioursSummary.path,
      changeVisuallyHiddenText: true,
    }),
  },
})

const linkedToSeriousHarm = question({
  content: {
    code: Question.thinking_behaviours_attitudes_linked_to_serious_harm,
    text: contentFor('question.thinking_behaviours_attitudes_linked_to_serious_harm.text', CaseData.ForenamePossessive),
    options: yesNo({
      yes: requiredDetails({
        code: Question.thinking_behaviours_attitudes_serious_harm_details,
        validationMessage: contentFor('question.thinking_behaviours_attitudes_serious_harm_details.validation'),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.thinking_behaviours_attitudes_no_serious_harm_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor('question.thinking_behaviours_attitudes_linked_to_serious_harm.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.thinkingBehavioursSummary.path,
      changeVisuallyHiddenText: true,
    }),
  },
})

const linkedToReoffending = question({
  content: {
    code: Question.thinking_behaviours_attitudes_linked_to_reoffending,
    text: contentFor('question.thinking_behaviours_attitudes_linked_to_reoffending.text', CaseData.ForenamePossessive),
    options: yesNo({
      yes: requiredDetails({
        code: Question.thinking_behaviours_attitudes_risk_of_reoffending_details,
        validationMessage: contentFor('question.thinking_behaviours_attitudes_risk_of_reoffending_details.validation'),
        maxLength: CharacterLimit.c1000,
      }),
      no: optionalDetails({
        code: Question.thinking_behaviours_attitudes_no_risk_of_reoffending_details,
        maxLength: CharacterLimit.c1000,
      }),
    }),
    validationMessage: contentFor('question.thinking_behaviours_attitudes_linked_to_reoffending.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.thinkingBehavioursSummary.path,
      changeVisuallyHiddenText: true,
    }),
  },
})

export const thinkingBehavioursAttitudesSection = {
  fields: {
    consequences,
    stableBehaviour,
    offendingActivities,
    peerPressure,
    problemSolving,
    peoplesViews,
    manipulativePredatoryBehaviour,
    temperManagement,
    violenceControllingBehaviour,
    impulsiveBehaviour,
    positiveAttitude,
    hostileOrientation,
    supervision,
    criminalBehaviour,
    changes,
    riskSexualHarm,
    sexualPreoccupation,
    offenceRelatedSexualInterest,
    emotionalIntimacy,
    strengthsOrProtectiveFactors,
    linkedToSeriousHarm,
    linkedToReoffending,
  },
}
