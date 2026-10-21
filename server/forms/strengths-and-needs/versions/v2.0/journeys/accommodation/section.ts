import { Answer, Condition, not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKBody } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../constants/formVersion'
import { CommonOption } from '../../constants/commonOption'
import { checkboxField, question, QuestionFormat, radioField, SummaryRow } from '../../../../constants/questionContent'
import { commonContentFor } from '../../locales'
import { SANGenerators } from '../../../../generators'
import { contentFor } from './locales'
import { Question } from './constants/question'
import { Step } from './constants/step'
import { Option } from './constants/option'
import { Section } from '../../constants/section'
import { CharacterLimit } from '../../../../constants/characterLimit'
import {
  changeLinkActions,
  itemisedSummaryRow,
  optionalDetails,
  requiredDetails,
  yesNo,
} from '../../constants/questionContent'

export const hasAccommodation = Answer(Question.community_current_accommodation).not.match(
  Condition.Equals(Option.no_accommodation),
)

export const isNotSuitableHousingLocation = Answer(Question.community_suitable_housing_location).not.match(
  Condition.Equals(CommonOption.yes),
)

export const isSuitableAccommodation = Answer(Question.community_suitable_housing).match(
  Condition.Equals(CommonOption.yes),
)
export const isSuitableWithConcernsAccommodation = Answer(Question.community_suitable_housing).match(
  Condition.Equals(Option.yes_with_concerns),
)
export const isNotSuitableAccommodation = Answer(Question.community_suitable_housing).match(
  Condition.Equals(CommonOption.no),
)

const currentAccommodation = question({
  content: {
    code: Question.community_current_accommodation,
    format: QuestionFormat.RADIO,
    text: contentFor('question.community_current_accommodation.text', CaseData.Forename),
    options: [
      {
        value: Option.settled,
        text: contentFor('question.community_current_accommodation.option.SETTLED'),
      },
      {
        value: Option.temporary,
        text: contentFor('question.community_current_accommodation.option.TEMPORARY'),
      },
      {
        value: Option.no_accommodation,
        text: contentFor('question.community_current_accommodation.option.NO_ACCOMMODATION'),
      },
    ],
    validationMessage: contentFor('question.community_current_accommodation.validation'),
  },
  displayModes: {
    field: radioField({ legendClasses: 'govuk-fieldset__legend--l' }),
    // Bespoke row: the revealed type radios show their selected label rather
    // than itemised bodies, and the temporary types append a formatted
    // "expected end date" line — neither of which a standard row projects.
    summaryRow: (content): SummaryRow => ({
      key: { text: content.text },
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(content.options, Answer(content.code)),
          }),
        ],
      },
      actions: changeLinkActions(Step.community_current_accommodation.path, content),
    }),
  },
})

const settledAccommodation = question({
  content: {
    code: Question.community_current_accommodation_settled,
    format: QuestionFormat.RADIO,
    text: contentFor('question.community_current_accommodation_settled.text', CaseData.ForenamePossessive),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
      },
      {
        value: Option.temporary,
        text: commonContentFor('option.NO'),
      },
    ],
    validationMessage: contentFor('question.community_current_accommodation_settled.validation'),
  },
  displayModes: {
    field: radioField({ legendClasses: 'govuk-fieldset__legend--l' }),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.community_current_accommodation_settled.path,
      visibleWhen: hasAccommodation,
    }),
  },
})

const suitableHousingLocation = question({
  content: {
    code: Question.community_suitable_housing_location,
    format: QuestionFormat.RADIO,
    text: contentFor('question.community_suitable_housing_location.text', CaseData.ForenamePossessive),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
      },
      {
        value: CommonOption.no,
        text: commonContentFor('option.NO'),
      },
    ],
    validationMessage: contentFor('question.community_suitable_housing_location.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.community_suitable_housing_location.path,
      visibleWhen: hasAccommodation,
    }),
  },
})

const suitableHousingLocationConcerns = question({
  content: {
    code: Question.community_suitable_housing_location_concerns,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.community_suitable_housing_location_concerns.text'),
    options: [
      {
        value: Option.criminal_associates,
        text: contentFor('question.community_suitable_housing_location_concerns.option.CRIMINAL_ASSOCIATES'),
      },
      {
        value: Option.victimisation,
        text: contentFor('question.community_suitable_housing_location_concerns.option.VICTIMISATION'),
      },
      {
        value: Option.victim_proximity,
        text: contentFor('question.community_suitable_housing_location_concerns.option.VICTIM_PROXIMITY'),
      },
      {
        value: Option.neighbour_difficulty,
        text: contentFor('question.community_suitable_housing_location_concerns.option.NEIGHBOUR_DIFFICULTY'),
      },
      {
        value: Option.area_safety,
        text: contentFor('question.community_suitable_housing_location_concerns.option.AREA_SAFETY'),
      },
      {
        value: CommonOption.other,
        text: commonContentFor('option.OTHER'),
        reveals: requiredDetails({
          code: Question.community_suitable_housing_location_concerns_other_details,
          validationMessage: commonContentFor('validation.enter_details'),
        }),
      },
    ],
    validationMessage: contentFor('question.community_suitable_housing_location_concerns.validation'),
  },
  displayModes: {
    field: checkboxField({ dependentWhen: isNotSuitableHousingLocation, visibleWhen: isNotSuitableHousingLocation }),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.community_suitable_housing_location_concerns.path,
      visibleWhen: isNotSuitableHousingLocation,
    }),
  },
})

const suitableAccommodation = question({
  content: {
    code: Question.community_suitable_housing,
    format: QuestionFormat.RADIO,
    text: contentFor('question.community_suitable_housing.text', CaseData.Forename),
    hint: contentFor('question.community_suitable_housing.hint'),
    options: [
      { value: CommonOption.yes, text: commonContentFor('option.YES') },
      {
        value: Option.yes_with_concerns,
        text: contentFor('question.community_suitable_housing.option.YES_WITH_CONCERNS'),
      },
      {
        value: CommonOption.no,
        text: commonContentFor('option.NO'),
      },
    ],
    validationMessage: contentFor('question.community_suitable_housing.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.community_suitable_housing.path,
      visibleWhen: hasAccommodation,
    }),
  },
})

const suitableAccommodationConcerns = question({
  content: {
    code: Question.community_suitable_housing_concerns,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.community_suitable_housing_concerns.text', CaseData.ForenamePossessive),
    hint: commonContentFor('select_all_that_apply'),
    options: [
      {
        value: Option.facilities,
        text: contentFor('question.community_suitable_housing_concerns.option.FACILITIES'),
      },
      {
        value: Option.overcrowding,
        text: contentFor('question.community_suitable_housing_concerns.option.OVERCROWDING'),
      },
      {
        value: Option.exploitation,
        text: contentFor('question.community_suitable_housing_concerns.option.EXPLOITATION'),
      },
      {
        value: Option.safety,
        text: contentFor('question.community_suitable_housing_concerns.option.SAFETY'),
      },
      {
        value: Option.lives_with_victim,
        text: contentFor('question.community_suitable_housing_concerns.option.LIVES_WITH_VICTIM'),
      },
      {
        value: Option.victimisation,
        text: contentFor('question.community_suitable_housing_concerns.option.VICTIMISATION'),
      },
      {
        value: CommonOption.other,
        text: commonContentFor('option.OTHER'),
        reveals: requiredDetails({
          code: Question.community_suitable_housing_concerns_other_details,
          validationMessage: commonContentFor('validation.enter_details'),
        }),
      },
    ],
    validationMessage: contentFor('question.community_suitable_housing_concerns.validation'),
  },
  displayModes: {
    field: checkboxField({
      dependentWhen: isSuitableWithConcernsAccommodation,
      visibleWhen: isSuitableWithConcernsAccommodation,
    }),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.community_suitable_housing_concerns.path,
      visibleWhen: isSuitableWithConcernsAccommodation,
    }),
  },
})

const unsuitableAccommodationConcerns = question({
  content: {
    code: Question.community_unsuitable_housing_concerns,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.community_unsuitable_housing_concerns.text'),
    hint: commonContentFor('select_all_that_apply'),
    options: [
      {
        value: Option.facilities,
        text: contentFor('question.community_unsuitable_housing_concerns.option.FACILITIES'),
      },
      {
        value: Option.overcrowding,
        text: contentFor('question.community_unsuitable_housing_concerns.option.OVERCROWDING'),
      },
      {
        value: Option.exploitation,
        text: contentFor('question.community_unsuitable_housing_concerns.option.EXPLOITATION'),
      },
      {
        value: Option.safety,
        text: contentFor('question.community_unsuitable_housing_concerns.option.SAFETY'),
      },
      {
        value: Option.lives_with_victim,
        text: contentFor('question.community_unsuitable_housing_concerns.option.LIVES_WITH_VICTIM'),
      },
      {
        value: Option.victimisation,
        text: contentFor('question.community_unsuitable_housing_concerns.option.VICTIMISATION'),
      },
      {
        value: CommonOption.other,
        text: commonContentFor('option.OTHER'),
        reveals: requiredDetails({
          code: Question.community_unsuitable_housing_concerns_other_details,
          validationMessage: commonContentFor('validation.enter_details'),
        }),
      },
    ],
    validationMessage: contentFor('question.community_unsuitable_housing_concerns.validation'),
  },
  displayModes: {
    field: checkboxField({ dependentWhen: isNotSuitableAccommodation, visibleWhen: isNotSuitableAccommodation }),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.community_suitable_housing_concerns.path,
      visibleWhen: isNotSuitableAccommodation,
    }),
  },
})

const noAccommodationReason = question({
  content: {
    code: Question.community_no_accommodation_reason,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.community_no_accommodation_reason.text', CaseData.Forename),
    hint: { html: contentFor('question.community_no_accommodation_reason.hint') },
    options: [
      {
        value: Option.alcohol_problems,
        text: contentFor('question.community_no_accommodation_reason.option.ALCOHOL_PROBLEMS'),
      },
      {
        value: Option.drug_problems,
        text: contentFor('question.community_no_accommodation_reason.option.DRUG_PROBLEMS'),
      },
      {
        value: Option.financial_difficulties,
        text: contentFor('question.community_no_accommodation_reason.option.FINANCIAL_DIFFICULTIES'),
      },
      {
        value: Option.risk_to_others,
        text: contentFor('question.community_no_accommodation_reason.option.RISK_TO_OTHERS'),
      },
      {
        value: Option.safety,
        text: contentFor('question.community_no_accommodation_reason.option.SAFETY'),
      },
      {
        value: Option.prison_release,
        text: contentFor('question.community_no_accommodation_reason.option.PRISON_RELEASE'),
      },
      {
        value: CommonOption.other,
        text: commonContentFor('option.OTHER'),
        reveals: requiredDetails({
          code: Question.community_no_accommodation_reason_other_details,
          validationMessage: commonContentFor('validation.enter_details'),
        }),
      },
    ],
    validationMessage: contentFor('question.community_no_accommodation_reason.validation'),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.community_no_accommodation_reason.path,
      visibleWhen: not(hasAccommodation),
    }),
  },
})

const changes = question({
  content: {
    code: Question.accommodation_changes,
    format: QuestionFormat.RADIO,
    text: contentFor('question.accommodation_changes.text', CaseData.Forename),
    hint: contentFor('question.accommodation_changes.hint', CaseData.Forename),
    options: [
      {
        value: CommonOption.made_changes,
        text: commonContentFor('option.MADE_CHANGES'),
        reveals: optionalDetails({ code: Question.accommodation_changes_made_changes_details }),
      },
      {
        value: CommonOption.making_changes,
        text: commonContentFor('option.MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.accommodation_changes_making_changes_details }),
      },
      {
        value: CommonOption.want_to_make_changes,
        text: commonContentFor('option.WANT_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.accommodation_changes_want_to_make_changes_details }),
      },
      {
        value: CommonOption.needs_help_to_make_changes,
        text: commonContentFor('option.NEEDS_HELP_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.accommodation_changes_needs_help_to_make_changes_details }),
      },
      {
        value: CommonOption.thinking_about_making_changes,
        text: commonContentFor('option.THINKING_ABOUT_MAKING_CHANGES'),
        reveals: optionalDetails({ code: Question.accommodation_changes_thinking_about_making_changes_details }),
      },
      {
        value: CommonOption.does_not_want_to_make_changes,
        text: commonContentFor('option.DOES_NOT_WANT_TO_MAKE_CHANGES'),
        reveals: optionalDetails({ code: Question.accommodation_changes_does_not_want_to_make_changes_details }),
      },
      {
        value: CommonOption.does_not_want_to_answer,
        text: commonContentFor('option.DOES_NOT_WANT_TO_ANSWER'),
        reveals: optionalDetails({ code: Question.accommodation_changes_does_not_want_to_answer_details }),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.not_present, text: commonContentFor('option.NOT_PRESENT', CaseData.Forename) },
      { value: CommonOption.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
    ],
    validationMessage: contentFor('question.accommodation_changes.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changeHref: Step.accommodation_changes.path }),
  },
})

const strengthsOrProtectiveFactors = question({
  content: {
    code: Question.accommodation_practitioner_analysis_strengths_or_protective_factors,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.accommodation_practitioner_analysis_strengths_or_protective_factors.text',
      CaseData.ForenamePossessive,
    ),
    hint: contentFor('question.accommodation_practitioner_analysis_strengths_or_protective_factors.hint'),
    options: yesNo({
      yes: requiredDetails({
        code: Question.accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details,
        validationMessage: contentFor(
          'question.accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.accommodation_practitioner_analysis_strengths_or_protective_factors_no_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor(
      'question.accommodation_practitioner_analysis_strengths_or_protective_factors.validation',
    ),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.accommodation_summary.path,
    }),
  },
})

const riskOfSeriousHarm = question({
  content: {
    code: Question.accommodation_practitioner_analysis_risk_of_serious_harm,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.accommodation_practitioner_analysis_risk_of_serious_harm.text',
      CaseData.ForenamePossessive,
    ),
    options: yesNo({
      yes: requiredDetails({
        code: Question.accommodation_practitioner_analysis_risk_of_serious_harm_yes_details,
        validationMessage: contentFor(
          'question.accommodation_practitioner_analysis_risk_of_serious_harm_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1425,
      }),
      no: optionalDetails({
        code: Question.accommodation_practitioner_analysis_risk_of_serious_harm_no_details,
        maxLength: CharacterLimit.c1425,
      }),
    }),
    validationMessage: contentFor('question.accommodation_practitioner_analysis_risk_of_serious_harm.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.accommodation_summary.path,
    }),
  },
})

const riskOfReoffending = question({
  content: {
    code: Question.accommodation_practitioner_analysis_risk_of_reoffending,
    format: QuestionFormat.RADIO,
    text: contentFor(
      'question.accommodation_practitioner_analysis_risk_of_reoffending.text',
      CaseData.ForenamePossessive,
    ),
    options: yesNo({
      yes: requiredDetails({
        code: Question.accommodation_practitioner_analysis_risk_of_reoffending_yes_details,
        validationMessage: contentFor(
          'question.accommodation_practitioner_analysis_risk_of_reoffending_yes_details.validation',
        ),
        maxLength: CharacterLimit.c1000,
      }),
      no: optionalDetails({
        code: Question.accommodation_practitioner_analysis_risk_of_reoffending_no_details,
        maxLength: CharacterLimit.c1000,
      }),
    }),
    validationMessage: contentFor('question.accommodation_practitioner_analysis_risk_of_reoffending.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({
      changeHref: Step.accommodation_summary.path,
    }),
  },
})

export const accommodationSection = {
  code: Section.accommodation.code,
  questions: {
    currentAccommodation,
    settledAccommodation,
    suitableHousingLocation,
    suitableHousingLocationConcerns,
    suitableAccommodation,
    suitableAccommodationConcerns,
    unsuitableAccommodationConcerns,
    noAccommodationReason,
    changes,
  },
  practitionerAnalysis: {
    strengthsOrProtectiveFactors,
    riskOfSeriousHarm,
    riskOfReoffending,
  },
}
