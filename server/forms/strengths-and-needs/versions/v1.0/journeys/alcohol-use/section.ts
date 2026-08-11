import { and, Answer, Condition, when } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'

import { CaseData } from '../../constants/formVersion'
import { CommonOption } from '../../constants/commonOption'
import { Gender } from '../../../../../shared/constants/gender'
import {
  checkboxField,
  question,
  QuestionFormat,
  radioField,
  requiredValidationOf,
  revealedQuestion,

} from '../../../../constants/questionContent'
import { commonContentFor } from '../../locales'
import { contentFor } from './locales'
import { Question } from './constants/question'
import { Step } from './constants/step'
import { Option } from './constants/option'
import { Section } from '../../constants/section'
import { itemisedSummaryRow, optionalDetails, requiredDetails, yesNo } from '../../constants/questionContent'

// Base usage applies whenever they have drunk alcohol; the recency questions
// (frequency, units, binge drinking) only when they drank in the last 3 months.
const drankAlcohol = Answer(Question.alcohol_use).not.match(Condition.Equals(CommonOption.no))
const drankInLastThreeMonths = Answer(Question.alcohol_use).match(Condition.Equals(Option.yes_within_last_three_months))

const genderIsMale = CaseData.Gender.match(Condition.Equals(Gender.MALE))

const bingeDrinkingFrequencyRevealed = revealedQuestion({
  content: {
    code: Question.alcohol_binge_drinking_frequency,
    format: QuestionFormat.RADIO,
    text: contentFor('question.alcohol_binge_drinking_frequency.text'),
    options: [
      {
        value: Option.less_than_a_month,
        text: contentFor('question.alcohol_binge_drinking_frequency.option.LESS_THAN_A_MONTH'),
      },
      { value: Option.monthly, text: contentFor('question.alcohol_binge_drinking_frequency.option.MONTHLY') },
      { value: Option.weekly, text: contentFor('question.alcohol_binge_drinking_frequency.option.WEEKLY') },
      { value: Option.daily, text: contentFor('question.alcohol_binge_drinking_frequency.option.DAILY') },
    ],
    validationMessage: contentFor('question.alcohol_binge_drinking_frequency.validation'),
  },
  displayModes: {
    // Bespoke projection: the frequency question also requires having drunk in
    // the last 3 months — wiring that reaches outside the parent option
    // context, so a standard details mode cannot derive it.
    field: (content, parent) =>
      GovUKRadioInput({
        code: content.code,
        fieldset: {
          legend: {
            text: content.text,
          },
        },
        dependentWhen: and(drankInLastThreeMonths, parent.selectedWhen),
        items: content.options,
        validWhen: requiredValidationOf(content),
      }),
  },
})

const alcoholUse = question({
  content: {
    code: Question.alcohol_use,
    format: QuestionFormat.RADIO,
    text: contentFor('question.alcohol_use.text', CaseData.Forename),
    options: [
      {
        value: Option.yes_within_last_three_months,
        text: contentFor('question.alcohol_use.option.YES_WITHIN_LAST_THREE_MONTHS'),
      },
      {
        value: Option.yes_not_in_last_three_months,
        text: contentFor('question.alcohol_use.option.YES_NOT_IN_LAST_THREE_MONTHS'),
      },
      { value: CommonOption.no, text: commonContentFor('option.NO') },
    ],
    validationMessage: contentFor('question.alcohol_use.validation'),
  },
  displayModes: {
    field: radioField({ legendClasses: 'govuk-fieldset__legend--l' }),
    summaryRow: itemisedSummaryRow({ changePath: Step.alcohol_use.path }),
  },
})

const frequency = question({
  content: {
    code: Question.alcohol_frequency,
    format: QuestionFormat.RADIO,
    text: contentFor('question.alcohol_frequency.text', CaseData.Forename),
    options: [
      {
        value: Option.once_a_month_or_less,
        text: contentFor('question.alcohol_frequency.option.ONCE_A_MONTH_OR_LESS'),
      },
      {
        value: Option.multiple_times_a_month,
        text: contentFor('question.alcohol_frequency.option.MULTIPLE_TIMES_A_MONTH'),
      },
      {
        value: Option.less_than_4_times_a_week,
        text: contentFor('question.alcohol_frequency.option.LESS_THAN_4_TIMES_A_WEEK'),
      },
      {
        value: Option.more_than_4_times_a_week,
        text: contentFor('question.alcohol_frequency.option.MORE_THAN_4_TIMES_A_WEEK'),
      },
    ],
    validationMessage: contentFor('question.alcohol_frequency.validation'),
  },
  displayModes: {
    field: radioField({
      dependentWhen: drankInLastThreeMonths,
      visibleWhen: drankInLastThreeMonths,
    }),
    summaryRow: itemisedSummaryRow({
      changePath: Step.alcohol_use_details.path,
      visibleWhen: drankInLastThreeMonths,
    }),
  },
})

const units = question({
  content: {
    code: Question.alcohol_units,
    format: QuestionFormat.RADIO,
    text: contentFor('question.alcohol_units.text', CaseData.Forename),
    hint: { html: contentFor('question.alcohol_units.hint') },
    options: [
      { value: Option.units_1_to_2, text: contentFor('question.alcohol_units.option.UNITS_1_TO_2') },
      { value: Option.units_3_to_4, text: contentFor('question.alcohol_units.option.UNITS_3_TO_4') },
      { value: Option.units_5_to_6, text: contentFor('question.alcohol_units.option.UNITS_5_TO_6') },
      { value: Option.units_7_to_9, text: contentFor('question.alcohol_units.option.UNITS_7_TO_9') },
      { value: Option.units_10_or_more, text: contentFor('question.alcohol_units.option.UNITS_10_OR_MORE') },
    ],
    validationMessage: contentFor('question.alcohol_units.validation'),
  },
  displayModes: {
    field: radioField({
      dependentWhen: drankInLastThreeMonths,
      visibleWhen: drankInLastThreeMonths,
    }),
    summaryRow: itemisedSummaryRow({
      changePath: Step.alcohol_use_details.path,
      visibleWhen: drankInLastThreeMonths,
    }),
  },
})

const bingeDrinking = question({
  content: {
    code: Question.alcohol_binge_drinking,
    format: QuestionFormat.RADIO,
    text: when(genderIsMale)
      .then(contentFor('question.alcohol_binge_drinking.text_male', CaseData.Forename))
      .else(contentFor('question.alcohol_binge_drinking.text_other', CaseData.Forename)),
    options: [
      { value: CommonOption.yes, text: commonContentFor('option.YES'), reveals: bingeDrinkingFrequencyRevealed },
      { value: CommonOption.no, text: commonContentFor('option.NO') },
    ],
    validationMessage: when(genderIsMale)
      .then(contentFor('question.alcohol_binge_drinking.validation_male'))
      .else(contentFor('question.alcohol_binge_drinking.validation_other')),
  },
  displayModes: {
    field: radioField({
      dependentWhen: drankInLastThreeMonths,
      visibleWhen: drankInLastThreeMonths,
    }),
    summaryRow: itemisedSummaryRow({
      changePath: Step.alcohol_use_details.path,
      visibleWhen: drankInLastThreeMonths,
    }),
  },
})

const evidenceOfExcessDrinking = question({
  content: {
    code: Question.alcohol_evidence_of_excess_drinking,
    format: QuestionFormat.RADIO,
    text: contentFor('question.alcohol_evidence_of_excess_drinking.text', CaseData.Forename),
    options: [
      {
        value: Option.no_evidence,
        text: contentFor('question.alcohol_evidence_of_excess_drinking.option.NO_EVIDENCE'),
      },
      {
        value: Option.yes_with_some_evidence,
        text: contentFor('question.alcohol_evidence_of_excess_drinking.option.YES_WITH_SOME_EVIDENCE.text'),
        hint: contentFor('question.alcohol_evidence_of_excess_drinking.option.YES_WITH_SOME_EVIDENCE.hint'),
      },
      {
        value: Option.yes_with_evidence,
        text: contentFor('question.alcohol_evidence_of_excess_drinking.option.YES_WITH_EVIDENCE.text'),
        hint: contentFor('question.alcohol_evidence_of_excess_drinking.option.YES_WITH_EVIDENCE.hint'),
      },
    ],
    validationMessage: contentFor('question.alcohol_evidence_of_excess_drinking.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.alcohol_use_details.path,
      visibleWhen: drankAlcohol,
    }),
  },
})

const pastIssues = question({
  content: {
    code: Question.alcohol_past_issues,
    format: QuestionFormat.RADIO,
    text: contentFor('question.alcohol_past_issues.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        reveals: requiredDetails({
          code: Question.alcohol_past_issues_yes_details,
          validationMessage: contentFor('question.alcohol_past_issues_yes_details.validation'),
        }),
      },
      { value: CommonOption.no, text: commonContentFor('option.NO') },
    ],
    validationMessage: contentFor('question.alcohol_past_issues.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.alcohol_use_details.path,
      visibleWhen: drankAlcohol,
    }),
  },
})

const reasonsForUse = question({
  content: {
    code: Question.alcohol_reasons_for_use,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.alcohol_reasons_for_use.text', CaseData.Forename),
    hint: commonContentFor('select_all_that_apply'),
    options: [
      {
        value: Option.cultural_or_religious,
        text: contentFor('question.alcohol_reasons_for_use.option.CULTURAL_OR_RELIGIOUS'),
      },
      {
        value: Option.curiosity_or_experimentation,
        text: contentFor('question.alcohol_reasons_for_use.option.CURIOSITY_OR_EXPERIMENTATION'),
      },
      { value: Option.enjoyment, text: contentFor('question.alcohol_reasons_for_use.option.ENJOYMENT') },
      {
        value: Option.managing_emotional_issues,
        text: contentFor('question.alcohol_reasons_for_use.option.MANAGING_EMOTIONAL_ISSUES'),
      },
      {
        value: Option.special_occasions,
        text: contentFor('question.alcohol_reasons_for_use.option.SPECIAL_OCCASIONS'),
      },
      { value: Option.peer_pressure, text: contentFor('question.alcohol_reasons_for_use.option.PEER_PRESSURE') },
      {
        value: Option.self_medication,
        text: contentFor('question.alcohol_reasons_for_use.option.SELF_MEDICATION.text'),
        hint: contentFor('question.alcohol_reasons_for_use.option.SELF_MEDICATION.hint'),
      },
      { value: Option.social, text: contentFor('question.alcohol_reasons_for_use.option.SOCIAL') },
      {
        value: CommonOption.other,
        text: commonContentFor('option.OTHER'),
        reveals: optionalDetails({ code: Question.alcohol_reasons_for_use_other_details }),
      },
    ],
    validationMessage: contentFor('question.alcohol_reasons_for_use.validation'),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.alcohol_use_details.path,
      visibleWhen: drankAlcohol,
    }),
  },
})

const impactOfUse = question({
  content: {
    code: Question.alcohol_impact_of_use,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.alcohol_impact_of_use.text', CaseData.Forename),
    hint: commonContentFor('select_all_that_apply'),
    options: [
      {
        value: Option.behavioural,
        text: contentFor('question.alcohol_impact_of_use.option.BEHAVIOURAL.text'),
        hint: contentFor('question.alcohol_impact_of_use.option.BEHAVIOURAL.hint'),
      },
      {
        value: Option.community,
        text: contentFor('question.alcohol_impact_of_use.option.COMMUNITY.text'),
        hint: contentFor('question.alcohol_impact_of_use.option.COMMUNITY.hint'),
      },
      {
        value: Option.finances,
        text: contentFor('question.alcohol_impact_of_use.option.FINANCES.text'),
        hint: contentFor('question.alcohol_impact_of_use.option.FINANCES.hint'),
      },
      {
        value: Option.links_to_reoffending,
        text: contentFor('question.alcohol_impact_of_use.option.LINKS_TO_REOFFENDING'),
      },
      {
        value: Option.physical_or_mental_health,
        text: contentFor('question.alcohol_impact_of_use.option.PHYSICAL_OR_MENTAL_HEALTH.text'),
        hint: contentFor('question.alcohol_impact_of_use.option.PHYSICAL_OR_MENTAL_HEALTH.hint'),
      },
      {
        value: Option.relationships,
        text: contentFor('question.alcohol_impact_of_use.option.RELATIONSHIPS.text'),
        hint: contentFor('question.alcohol_impact_of_use.option.RELATIONSHIPS.hint'),
      },
      {
        value: CommonOption.other,
        text: commonContentFor('option.OTHER'),
        reveals: optionalDetails({
          code: Question.alcohol_impact_of_use_other_details,
          hint: contentFor('question.alcohol_impact_of_use_other_details.hint'),
        }),
      },
      { divider: commonContentFor('or') },
      {
        value: Option.no_negative_impact,
        text: contentFor('question.alcohol_impact_of_use.option.NO_NEGATIVE_IMPACT'),
        behaviour: 'exclusive' as const,
      },
    ],
    validationMessage: contentFor('question.alcohol_impact_of_use.validation'),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.alcohol_use_details.path,
      visibleWhen: drankAlcohol,
    }),
  },
})

const stoppedOrReduced = question({
  content: {
    code: Question.alcohol_stopped_or_reduced,
    format: QuestionFormat.RADIO,
    text: contentFor('question.alcohol_stopped_or_reduced.text', CaseData.Forename),
    hint: contentFor('question.alcohol_stopped_or_reduced.hint'),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        reveals: requiredDetails({
          code: Question.alcohol_stopped_or_reduced_yes_details,
          validationMessage: contentFor('question.alcohol_stopped_or_reduced_yes_details.validation'),
        }),
      },
      { value: CommonOption.no, text: commonContentFor('option.NO') },
    ],
    validationMessage: contentFor('question.alcohol_stopped_or_reduced.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.alcohol_use_details.path,
      visibleWhen: drankAlcohol,
    }),
  },
})

const changes = question({
  content: {
    code: Question.alcohol_use_changes,
    format: QuestionFormat.RADIO,
    text: contentFor('question.alcohol_use_changes.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.has_made_changes,
        text: commonContentFor('option.HAS_MADE_CHANGES'),
        reveals: optionalDetails({ code: Question.alcohol_use_changes_made_changes_details }),
      },
      {
        value: CommonOption.is_making_changes,
        text: commonContentFor('option.IS_MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.alcohol_use_changes_making_changes_details }),
      },
      {
        value: CommonOption.wants_to_make_changes_knows_how_to,
        text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO'),
        reveals: optionalDetails({ code: Question.alcohol_use_changes_want_to_make_changes_details }),
      },
      {
        value: CommonOption.wants_to_make_changes_needs_help,
        text: commonContentFor('option.WANTS_TO_MAKE_CHANGES_NEEDS_HELP'),
        reveals: optionalDetails({ code: Question.alcohol_use_changes_needs_help_to_make_changes_details }),
      },
      {
        value: CommonOption.thinking_about_making_changes,
        text: commonContentFor('option.THINKING_ABOUT_MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.alcohol_use_changes_thinking_about_making_changes_details }),
      },
      {
        value: CommonOption.does_not_want_to_make_changes,
        text: commonContentFor('option.DOES_NOT_WANT_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.alcohol_use_changes_does_not_want_to_make_changes_details }),
      },
      {
        value: CommonOption.does_not_want_to_answer,
        text: commonContentFor('option.DOES_NOT_WANT_TO_ANSWER'),
        reveals: optionalDetails({ code: Question.alcohol_use_changes_does_not_want_to_answer_details }),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.not_present, text: commonContentFor('option.NOT_PRESENT', CaseData.Forename) },
      { value: CommonOption.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
    ],
    validationMessage: contentFor('question.alcohol_use_changes.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.alcohol_use_details.path,
      visibleWhen: drankAlcohol,
    }),
  },
})

const strengthsOrProtectiveFactors = question({
  content: {
    code: Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.alcohol_use_practitioner_analysis_strengths_or_protective_factors.text',
      CaseData.ForenamePossessive,
    ),
    hint: contentFor('question.alcohol_use_practitioner_analysis_strengths_or_protective_factors.hint'),
    options: yesNo({
      yes: requiredDetails({
        code: Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors_yes_details,
        validationMessage: contentFor(
          'question.alcohol_use_practitioner_analysis_strengths_or_protective_factors_yes_details.validation',
        ),
      }),
      no: optionalDetails({
        code: Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors_no_details,
      }),
    }),
    validationMessage: contentFor(
      'question.alcohol_use_practitioner_analysis_strengths_or_protective_factors.validation',
    ),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.alcohol_use_summary.path,
      changeVisuallyHiddenText: true,
    }),
  },
})

const riskOfSeriousHarm = question({
  content: {
    code: Question.alcohol_use_practitioner_analysis_risk_of_serious_harm,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.alcohol_use_practitioner_analysis_risk_of_serious_harm.text',
      CaseData.ForenamePossessive,
    ),
    options: yesNo({
      yes: requiredDetails({
        code: Question.alcohol_use_practitioner_analysis_risk_of_serious_harm_yes_details,
        validationMessage: contentFor(
          'question.alcohol_use_practitioner_analysis_risk_of_serious_harm_yes_details.validation',
        ),
      }),
      no: optionalDetails({ code: Question.alcohol_use_practitioner_analysis_risk_of_serious_harm_no_details }),
    }),
    validationMessage: contentFor('question.alcohol_use_practitioner_analysis_risk_of_serious_harm.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.alcohol_use_summary.path,
      changeVisuallyHiddenText: true,
    }),
  },
})

const riskOfReoffending = question({
  content: {
    code: Question.alcohol_use_practitioner_analysis_risk_of_reoffending,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.alcohol_use_practitioner_analysis_risk_of_reoffending.text',
      CaseData.ForenamePossessive,
    ),
    options: yesNo({
      yes: requiredDetails({
        code: Question.alcohol_use_practitioner_analysis_risk_of_reoffending_yes_details,
        validationMessage: contentFor(
          'question.alcohol_use_practitioner_analysis_risk_of_reoffending_yes_details.validation',
        ),
      }),
      no: optionalDetails({ code: Question.alcohol_use_practitioner_analysis_risk_of_reoffending_no_details }),
    }),
    validationMessage: contentFor('question.alcohol_use_practitioner_analysis_risk_of_reoffending.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changePath: Step.alcohol_use_summary.path,
      changeVisuallyHiddenText: true,
    }),
  },
})

export const alcoholUseSection = {
  code: Section.alcohol_use.code,
  fields: {
    alcoholUse,
    frequency,
    units,
    bingeDrinking,
    evidenceOfExcessDrinking,
    pastIssues,
    reasonsForUse,
    impactOfUse,
    stoppedOrReduced,
    changes,
    strengthsOrProtectiveFactors,
    riskOfSeriousHarm,
    riskOfReoffending,
  },
}
