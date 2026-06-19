import {and, Answer, block, Condition, Format, Self, validation} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKButton,
  GovUKCharacterCount,
  GovUKLinkButton,
  GovUKRadioInput,
  GovUKSummaryList,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import {CaseData} from '../../../../constants/formVersion'
import {SANGenerators} from "../../../../../../generators";
import locale from '../../locale.json'
import {healthConditions, mentalHealthProblems} from "../health-wellbeing/fields";
import {
  attitudeTowardsSelf,
  changesToHealthWellbeing,
  copeWithDayToDayLife,
  feelingsAboutFuture,
  headInjuries,
  helpedDuringPeriodsGoodHealthWellbeing,
  impactOnLearningAbilities,
  neurodiverseConditions,
  psychiatricTreatment,
  selfHarm,
  suicidalTendencies
} from "../physical-mental-health/fields";
import {Question} from "../../constants/question";

// --- Health and Wellbeing Summary Group ---

export const healthWellbeingSummary = GovUKSummaryList({
  rows: [
    {
      key: {text: Format(locale.health_wellbeing.health_conditions.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(healthConditions.items, Answer(Question.health_conditions))}),
          GovUKBody({text: Answer(Question.has_health_conditions_details), size: "s" }),
        ]
      },
      actions: {
        items: [{href: 'health-wellbeing', text: 'Change'}],
      },
    },
    {
      key: {text: Format(locale.health_wellbeing.health_conditions.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(mentalHealthProblems.items, Answer(Question.mental_health_problems))}),
          GovUKBody({text: Answer(Question.severe_mental_health_problems_details), size: "s",}),
          GovUKBody({text: Answer(Question.ongoing_duration_unknown_mental_health_problems_details), size: "s" }),
          GovUKBody({text: Answer(Question.past_mental_health_problems_details), size: "s" }),
        ]
      },
      actions: {
        items: [{href: 'health-wellbeing', text: 'Change'}],
      },
    },
    {
      key: {text: Format(locale.phyisical_mental_health.prescribed_physical_health_medications_treatments.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: Answer(Question.prescribed_physical_health_medications_treatments), size: "s" }),
        ]
      },
      actions: {
        items: [{href: 'physical-mental-health', text: 'Change'}],
      },
      visibleWhen: Answer(Question.prescribed_physical_health_medications_treatments).match(Condition.IsRequired()),
    },
    {
      key: {text: Format(locale.phyisical_mental_health.prescribed_mental_health_medications_treatments.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: Answer(Question.prescribed_mental_health_medications_treatments), size: "s" }),
        ]
      },
      actions: {
        items: [{href: 'physical-mental-health', text: 'Change'}],
      },
      visibleWhen: Answer(Question.prescribed_mental_health_medications_treatments).match(Condition.IsRequired()),
    },
    {
      key: {text: Format(locale.phyisical_mental_health.psychiatric_treatment.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(psychiatricTreatment.items, Answer(Question.psychiatric_treatment))})
        ]
      },
      actions: {
        items: [{href: 'physical-mental-health', text: 'Change'}],
      },
      visibleWhen: Answer(Question.psychiatric_treatment).match(Condition.IsRequired()),
    },
    {
      key: {text: Format(locale.phyisical_mental_health.head_injuries.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(headInjuries.items, Answer(Question.head_injuries)), })
        ]
      },
      actions: {
        items: [{href: 'physical-mental-health', text: 'Change'}],
      },
      visibleWhen: Answer(Question.head_injuries).match(Condition.IsRequired()),
    },
    {
      key: {text: Format(locale.phyisical_mental_health.neurodiverse_conditions.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(neurodiverseConditions.items, Answer(Question.neurodiverse_conditions))}),
          GovUKBody({text: Answer(Question.neurodiverse_conditions_details), size: "s" }),
        ]
      },
      actions: {
        items: [{href: 'physical-mental-health', text: 'Change'}],
      },
    },
    {
      key: {text: Format(locale.phyisical_mental_health.impact_on_learning_abilities.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(impactOnLearningAbilities.items, Answer(Question.impact_on_learning_abilities)),
            visibleWhen: Answer(Question.impact_on_learning_abilities).match(Condition.IsRequired())}),
          GovUKBody({text: Answer(Question.learning_abilities_impacted_significantly_details), size: "s",
            visibleWhen: Answer(Question.learning_abilities_impacted_significantly_details).match(Condition.String.HasMinLength(1))}),
          GovUKBody({text: Answer(Question.learning_abilities_impacted_slightly_details), size: "s",
            visibleWhen: Answer(Question.learning_abilities_impacted_slightly_details).match(Condition.String.HasMinLength(1))}),
        ]
      },
      actions: {
        items: [{href: 'physical-mental-health', text: 'Change'}],
      },
    },
    {
      key: {text: Format(locale.phyisical_mental_health.cope_with_day_to_day_life.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(copeWithDayToDayLife.items, Answer(Question.cope_with_day_to_day_life))})
        ]
      },
      actions: {
        items: [{href: 'physical-mental-health', text: 'Change'}],
      },
    },
    {
      key: {text: Format(locale.phyisical_mental_health.attitude_towards_self.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(attitudeTowardsSelf.items, Answer(Question.attitude_towards_self))})
        ]
      },
      actions: {
        items: [{href: 'physical-mental-health', text: 'Change'}],
      },
    },
    {
      key: {text: Format(locale.phyisical_mental_health.self_harm.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(selfHarm.items, Answer(Question.self_harm))}),
          GovUKBody({text: Answer(Question.self_harm_details), size: "s",
            visibleWhen: Answer(Question.self_harm_details).match(Condition.String.HasMinLength(1))}),
        ]
      },
      actions: {
        items: [{href: 'physical-mental-health', text: 'Change'}],
      },
    },
    {
      key: {text: Format(locale.phyisical_mental_health.suicidal_tendencies.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(suicidalTendencies.items, Answer(Question.suicidal_tendencies))}),
          GovUKBody({text: Answer(Question.suicidal_tendencies_details), size: "s",
            visibleWhen: Answer(Question.suicidal_tendencies_details).match(Condition.String.HasMinLength(1))}),
        ]
      },
      actions: {
        items: [{href: 'physical-mental-health', text: 'Change'}],
      },
    },
    {
      key: {text: Format(locale.phyisical_mental_health.feeling_about_future_health_wellbeing.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(feelingsAboutFuture.items, Answer(Question.feeling_about_future_health_wellbeing))})
        ]
      },
      actions: {
        items: [{href: 'physical-mental-health', text: 'Change'}],
      },
    },
    {
      key: {text: Format(locale.phyisical_mental_health.helped_during_periods_good_health_wellbeing.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(helpedDuringPeriodsGoodHealthWellbeing.items, 'ACCOMMODATION'),
            visibleWhen: Answer(Question.helped_during_periods_good_health_wellbeing).match(Condition.Array.Contains('ACCOMMODATION'))}),
          GovUKBody({text: SANGenerators.getTextFromListDefinition(helpedDuringPeriodsGoodHealthWellbeing.items, 'EMPLOYMENT'),
            visibleWhen: Answer(Question.helped_during_periods_good_health_wellbeing).match(Condition.Array.Contains('EMPLOYMENT'))}),
          GovUKBody({text: SANGenerators.getTextFromListDefinition(helpedDuringPeriodsGoodHealthWellbeing.items, 'FAITH_RELIGION'),
            visibleWhen: Answer(Question.helped_during_periods_good_health_wellbeing).match(Condition.Array.Contains('FAITH_RELIGION'))}),
          GovUKBody({text: SANGenerators.getTextFromListDefinition(helpedDuringPeriodsGoodHealthWellbeing.items, 'FEELING_PART_OF_COMMUNITY'),
            visibleWhen: Answer(Question.helped_during_periods_good_health_wellbeing).match(Condition.Array.Contains('FEELING_PART_OF_COMMUNITY'))}),
          GovUKBody({text: SANGenerators.getTextFromListDefinition(helpedDuringPeriodsGoodHealthWellbeing.items, 'MEDICATION_OR_TREATMENT'),
            visibleWhen: Answer(Question.helped_during_periods_good_health_wellbeing).match(Condition.Array.Contains('MEDICATION_OR_TREATMENT'))}),
          GovUKBody({text: SANGenerators.getTextFromListDefinition(helpedDuringPeriodsGoodHealthWellbeing.items, 'MONEY'),
            visibleWhen: Answer(Question.helped_during_periods_good_health_wellbeing).match(Condition.Array.Contains('MONEY'))}),
          GovUKBody({text: SANGenerators.getTextFromListDefinition(helpedDuringPeriodsGoodHealthWellbeing.items, 'RELATIONSHIPS'),
            visibleWhen: Answer(Question.helped_during_periods_good_health_wellbeing).match(Condition.Array.Contains('RELATIONSHIPS'))}),
          GovUKBody({text: SANGenerators.getTextFromListDefinition(helpedDuringPeriodsGoodHealthWellbeing.items, 'OTHER'),
            visibleWhen: Answer(Question.helped_during_periods_good_health_wellbeing).match(Condition.Array.Contains('OTHER'))}),
          GovUKBody({text: Answer(Question.helped_during_periods_good_health_wellbeing_details), size: "s"}),
        ]
      },
      visibleWhen: Answer(Question.helped_during_periods_good_health_wellbeing).match(Condition.IsRequired()),
      actions: {
        items: [{href: 'physical-mental-health', text: 'Change'}],
      },
    },
    {
      key: {text: Format(locale.phyisical_mental_health.changes_to_health_wellbeing.text, CaseData.ForenamePossessive)},
      value: {
        blocks: [
          GovUKBody({text: SANGenerators.getTextFromListDefinition(changesToHealthWellbeing.items, Answer(Question.changes_to_health_wellbeing))}),
          GovUKBody({text: Answer(Question.has_made_positive_changes_health_wellbeing_details), size: "s"}),
          GovUKBody({text: Answer(Question.actively_making_changes_health_wellbeing_details), size: "s"}),
          GovUKBody({text: Answer(Question.wants_to_make_changes_knows_how_to_health_wellbeing_details), size: "s"}),
          GovUKBody({text: Answer(Question.wants_to_make_changes_needs_help_health_wellbeing_details), size: "s"}),
          GovUKBody({text: Answer(Question.thinking_about_making_changes_health_wellbeing_details), size: "s"}),
          GovUKBody({text: Answer(Question.does_not_want_to_make_changes_health_wellbeing_details), size: "s"}),
          GovUKBody({text: Answer(Question.does_not_want_to_answer_health_wellbeing_details), size: "s"}),
        ]
      },
      actions: {
        items: [{href: 'physical-mental-health', text: 'Change'}],
      },
    },
  ],
})

// --- Practitioner Analysis Button Group ---

const goToPractitionerAnalysis = GovUKLinkButton({
  text: 'Go to practitioner analysis',
  href:'health-wellbeing-summary#practitioner-analysis',
  classes: 'govuk-button--secondary'
})

// --- Practitioner Analysis Group ---

// --- Strengths or Protective factors Group ---

const strengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: Question.strengths_protective_factors_health_wellbeing_details,
  label: locale.required_details,
  maxLength: 2000,
  dependentWhen: and(Answer(Question.strengths_protective_factors_health_wellbeing).match(Condition.IsRequired()),
    Answer(Question.strengths_protective_factors_health_wellbeing).match(Condition.Equals('YES'))),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Give details on strengths or protective factors related to their employment and education',
    }),
  ],
})

const noStrengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: Question.no_strengths_protective_factors_health_wellbeing_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.strengths_protective_factors_health_wellbeing).match(Condition.Equals('NO')),
})

export const strengthsProtectiveFactorsHealthWellbeing = GovUKRadioInput({
  code: Question.strengths_protective_factors_health_wellbeing,
  fieldset: {
    legend: {
      text: Format(locale.practitioner_analysis.strengths_protective_factors_health_wellbeing.text, CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint:'Include any strategies, people or support networks that helped.',
  items: [
    { value: 'YES', text: locale.options['YES'], block: strengthsProtectiveFactorsDetails },
    { value: 'NO', text: locale.options['NO'], block: noStrengthsProtectiveFactorsDetails },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select if there are any strengths or protective factors',
    }),
  ],
})

// --- Employment and Education Linked to Risk of Serious Harm Group ---

const seriousHarmDetails = GovUKCharacterCount({
  code: Question.serious_harm_health_wellbeing_details,
  label: locale.required_details,
  maxLength: 2000,
  dependentWhen: and(Answer(Question.serious_harm_health_wellbeing).match(Condition.IsRequired()),
    Answer(Question.serious_harm_health_wellbeing).match(Condition.Equals('YES'))),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Give details on the risk of serious harm',
    }),
  ],
})

const noSeriousHarmDetails = GovUKCharacterCount({
  code: Question.no_serious_harm_health_wellbeing_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.serious_harm_health_wellbeing).match(Condition.Equals('NO')),
})

export const seriousHarmHealthWellbeing = GovUKRadioInput({
  code: Question.serious_harm_health_wellbeing,
  fieldset: {
    legend: {
      text: Format(locale.practitioner_analysis.serious_harm_health_wellbeing.text, CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'YES', text: locale.options['YES'], block: seriousHarmDetails },
    { value: 'NO', text: locale.options['NO'], block: noSeriousHarmDetails },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select if linked to risk of serious harm',
    }),
  ],
})

// --- Employment and Education Linked to Risk of Reoffending Group ---

const riskOfReoffendingDetails = GovUKCharacterCount({
  code: Question.risk_of_reoffending_health_wellbeing_details,
  label: locale.required_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.risk_of_reoffending_health_wellbeing).match(Condition.Equals('YES')),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Give details on the risk of reoffending',
    }),
  ],
})

const noRiskOfReoffendingDetails = GovUKCharacterCount({
  code: Question.no_risk_of_reoffending_health_wellbeing_details,
  label: locale.optional_details,
  maxLength: 2000,
  dependentWhen: Answer(Question.risk_of_reoffending_health_wellbeing).match(Condition.Equals('NO')),
})

export const riskOfReoffendingHealthWellbeing = GovUKRadioInput({
  code: Question.risk_of_reoffending_health_wellbeing,
  fieldset: {
    legend: {
      text: Format(locale.practitioner_analysis.risk_of_reoffending_health_wellbeing.text, CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'YES', text: locale.options['YES'], block: riskOfReoffendingDetails },
    { value: 'NO', text: locale.options['NO'], block: noRiskOfReoffendingDetails },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select if linked to risk of reoffending',
    }),
  ],
})

// --- Mark As Complete Button Group ---

const markAsCompleteButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Mark as complete',
  name: 'action',
  value: 'save',
})

export const healthWellbeingSummaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: 'Summary',
      panel: { blocks: [healthWellbeingSummary, goToPractitionerAnalysis] },
    },
    {
      id: 'practitioner-analysis',
      label: 'Practitioner analysis',
      panel: {
        blocks: [strengthsProtectiveFactorsHealthWellbeing, seriousHarmHealthWellbeing, riskOfReoffendingHealthWellbeing, markAsCompleteButton]
      },
    },
  ],
})
