import { and, Answer, Condition, not, or } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKBody } from '@ministryofjustice/hmpps-forge/govuk-components'
import { ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'
import { CaseData } from '../../constants/formVersion'
import { CommonOption } from '../../constants/commonOption'
import {
  checkboxDetails,
  checkboxField,
  question,
  QuestionFormat,
  radioDetails,
  radioField,
  revealedQuestion,
  SummaryRow,

} from '../../../../constants/questionContent'
import { commonContentFor } from '../../locales'
import { SANGenerators } from '../../../../generators'
import { contentFor } from './locales'
import { Question } from './constants/question'
import { Step } from './constants/step'
import { Option } from './constants/option'
import { Section } from '../../constants/section'
import { CharacterLimit } from '../../../../constants/characterLimit'
import {
  characterCountField, createSummaryRowActions,
  itemisedSummaryRow,
  optionalDetails,
  optionalFutureDateDetails,
  requiredDetails,
  textSummaryRow,
  yesNo,
} from '../../constants/questionContent'

// The details questions all hang off the accommodation kind chosen up front.
const settledAccommodation = Answer(Question.current_accommodation).match(Condition.Equals(Option.settled))
const temporaryAccommodation = Answer(Question.current_accommodation).match(Condition.Equals(Option.temporary))
const noAccommodation = Answer(Question.current_accommodation).match(Condition.Equals(Option.no_accommodation))
const hasAccommodation = not(noAccommodation)

const approvedPremisesEndDateRevealed = revealedQuestion({
  content: {
    code: Question.approved_premises_end_date,
    format: QuestionFormat.DATE,
    text: contentFor('question.approved_premises_end_date.text'),
  },
  displayModes: { field: optionalFutureDateDetails() },
})

const cas2EndDateRevealed = revealedQuestion({
  content: {
    code: Question.cas2_end_date,
    format: QuestionFormat.DATE,
    text: contentFor('question.cas2_end_date.text'),
  },
  displayModes: { field: optionalFutureDateDetails() },
})

const cas3EndDateRevealed = revealedQuestion({
  content: {
    code: Question.cas3_end_date,
    format: QuestionFormat.DATE,
    text: contentFor('question.cas3_end_date.text'),
  },
  displayModes: { field: optionalFutureDateDetails() },
})

const immigrationEndDateRevealed = revealedQuestion({
  content: {
    code: Question.immigration_accommodation_end_date,
    format: QuestionFormat.DATE,
    text: contentFor('question.immigration_accommodation_end_date.text'),
  },
  displayModes: { field: optionalFutureDateDetails() },
})

const shortTermEndDateRevealed = revealedQuestion({
  content: {
    code: Question.short_term_accommodation_end_date,
    format: QuestionFormat.DATE,
    text: contentFor('question.short_term_accommodation_end_date.text'),
  },
  displayModes: { field: optionalFutureDateDetails() },
})

const typeOfSettledAccommodationRevealed = revealedQuestion({
  content: {
    code: Question.type_of_settled_accommodation,
    format: QuestionFormat.RADIO,
    text: contentFor('question.type_of_settled_accommodation.text'),
    options: [
      { value: Option.homeowner, text: contentFor('question.type_of_settled_accommodation.option.HOMEOWNER') },
      {
        value: Option.friends_or_family,
        text: contentFor('question.type_of_settled_accommodation.option.FRIENDS_OR_FAMILY'),
      },
      {
        value: Option.renting_privately,
        text: contentFor('question.type_of_settled_accommodation.option.RENTING_PRIVATELY'),
      },
      { value: Option.renting_other, text: contentFor('question.type_of_settled_accommodation.option.RENTING_OTHER') },
      {
        value: Option.residential_healthcare,
        text: contentFor('question.type_of_settled_accommodation.option.RESIDENTIAL_HEALTHCARE'),
      },
      {
        value: Option.supported_accommodation,
        text: contentFor('question.type_of_settled_accommodation.option.SUPPORTED_ACCOMMODATION'),
      },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.type_of_settled_accommodation.validation'),
  },
  displayModes: { field: radioDetails({ legendClasses: 'govuk-visually-hidden' }) },
})

const typeOfTemporaryAccommodationRevealed = revealedQuestion({
  content: {
    code: Question.type_of_temporary_accommodation,
    format: QuestionFormat.RADIO,
    text: contentFor('question.type_of_temporary_accommodation.text'),
    options: [
      {
        value: Option.approved_premises,
        text: contentFor('question.type_of_temporary_accommodation.option.APPROVED_PREMISES'),
        reveals: approvedPremisesEndDateRevealed,
      },
      {
        value: Option.cas2,
        text: contentFor('question.type_of_temporary_accommodation.option.CAS2'),
        reveals: cas2EndDateRevealed,
      },
      {
        value: Option.cas3,
        text: contentFor('question.type_of_temporary_accommodation.option.CAS3'),
        reveals: cas3EndDateRevealed,
      },
      {
        value: Option.immigration,
        text: contentFor('question.type_of_temporary_accommodation.option.IMMIGRATION.text'),
        hint: { html: contentFor('question.type_of_temporary_accommodation.option.IMMIGRATION.hint') },
        reveals: immigrationEndDateRevealed,
      },
      {
        value: Option.short_term,
        text: contentFor('question.type_of_temporary_accommodation.option.SHORT_TERM.text'),
        hint: contentFor('question.type_of_temporary_accommodation.option.SHORT_TERM.hint'),
        reveals: shortTermEndDateRevealed,
      },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.type_of_temporary_accommodation.validation'),
  },
  displayModes: { field: radioDetails({ legendClasses: 'govuk-visually-hidden' }) },
})

const typeOfNoAccommodationRevealed = revealedQuestion({
  content: {
    code: Question.type_of_no_accommodation,
    format: QuestionFormat.RADIO,
    text: contentFor('question.type_of_no_accommodation.text'),
    options: [
      { value: Option.campsite, text: contentFor('question.type_of_no_accommodation.option.CAMPSITE') },
      {
        value: Option.emergency_hostel,
        text: contentFor('question.type_of_no_accommodation.option.EMERGENCY_HOSTEL'),
      },
      { value: Option.homeless, text: contentFor('question.type_of_no_accommodation.option.HOMELESS') },
      { value: Option.rough_sleeping, text: contentFor('question.type_of_no_accommodation.option.ROUGH_SLEEPING') },
      { value: Option.shelter, text: contentFor('question.type_of_no_accommodation.option.SHELTER') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.type_of_no_accommodation.validation'),
  },
  displayModes: { field: radioDetails({ legendClasses: 'govuk-visually-hidden' }) },
})

const temporaryAccommodationEndDates = [
  { optionValue: Option.approved_premises, code: Question.approved_premises_end_date },
  { optionValue: Option.cas2, code: Question.cas2_end_date },
  { optionValue: Option.cas3, code: Question.cas3_end_date },
  { optionValue: Option.immigration, code: Question.immigration_accommodation_end_date },
  { optionValue: Option.short_term, code: Question.short_term_accommodation_end_date },
]

const currentAccommodation = question({
  content: {
    code: Question.current_accommodation,
    format: QuestionFormat.RADIO,
    text: contentFor('question.current_accommodation.text', CaseData.Forename),
    options: [
      {
        value: Option.settled,
        text: contentFor('question.current_accommodation.option.SETTLED'),
        reveals: typeOfSettledAccommodationRevealed,
      },
      {
        value: Option.temporary,
        text: contentFor('question.current_accommodation.option.TEMPORARY'),
        reveals: typeOfTemporaryAccommodationRevealed,
      },
      {
        value: Option.no_accommodation,
        text: contentFor('question.current_accommodation.option.NO_ACCOMMODATION'),
        reveals: typeOfNoAccommodationRevealed,
      },
    ],
    validationMessage: contentFor('question.current_accommodation.validation'),
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
          ...[
            typeOfSettledAccommodationRevealed,
            typeOfTemporaryAccommodationRevealed,
            typeOfNoAccommodationRevealed,
          ].map(revealed =>
            GovUKBody({
              text: SANGenerators.getTextFromListDefinition(revealed.content.options, Answer(revealed.content.code)),
              size: 's',
              visibleWhen: Answer(revealed.content.code).match(Condition.IsRequired()),
            }),
          ),
          GovUKBody({
            text: contentFor('expected_end_date'),
            size: 's',
            visibleWhen: and(
              not(Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(CommonOption.unknown))),
              temporaryAccommodation,
            ),
          }),
          ...temporaryAccommodationEndDates.map(endDate =>
            GovUKBody({
              text: SANGenerators.getFormatterDateFromIso(Answer(endDate.code)),
              size: 's',
              visibleWhen: Answer(Question.type_of_temporary_accommodation).match(
                Condition.Equals(endDate.optionValue),
              ),
            }),
          ),
        ],
      },
      actions: createSummaryRowActions(Step.current_accommodation.path),
    }),
  },
})

const livingWithApplies = or(
  Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.immigration)),
  Answer(Question.type_of_temporary_accommodation).match(Condition.Equals(Option.short_term)),
  settledAccommodation,
)

const livingWith = question({
  content: {
    code: Question.living_with,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.living_with.text', CaseData.Forename),
    hint: commonContentFor('select_all_that_apply'),
    options: [
      { value: Option.family, text: contentFor('question.living_with.option.FAMILY') },
      { value: Option.friends, text: contentFor('question.living_with.option.FRIENDS') },
      {
        value: Option.partner,
        text: contentFor('question.living_with.option.PARTNER'),
        reveals: optionalDetails({
          code: Question.living_with_partner_details,
          hint: contentFor('question.living_with_partner_details.hint'),
        }),
      },
      { value: Option.person_under_18, text: contentFor('question.living_with.option.PERSON_UNDER_18') },
      {
        value: CommonOption.other,
        text: commonContentFor('option.OTHER'),
        reveals: optionalDetails({ code: Question.living_with_other_details }),
      },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
      { divider: commonContentFor('or') },
      { value: Option.alone, text: contentFor('question.living_with.option.ALONE'), behaviour: 'exclusive' as const },
    ],
    validationMessage: contentFor('question.living_with.validation'),
  },
  displayModes: {
    field: checkboxField({ dependentWhen: livingWithApplies, visibleWhen: livingWithApplies }),
    summaryRow: itemisedSummaryRow({
      changePath: Step.accommodation_details.path,
    }),
  },
})

const noAccommodationReason = question({
  content: {
    code: Question.no_accommodation_reason,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.no_accommodation_reason.text', CaseData.Forename),
    hint: { html: contentFor('question.no_accommodation_reason.hint') },
    options: [
      { value: Option.alcohol_problems, text: contentFor('question.no_accommodation_reason.option.ALCOHOL_PROBLEMS') },
      { value: Option.drug_problems, text: contentFor('question.no_accommodation_reason.option.DRUG_PROBLEMS') },
      {
        value: Option.financial_difficulties,
        text: contentFor('question.no_accommodation_reason.option.FINANCIAL_DIFFICULTIES'),
      },
      { value: Option.risk_to_others, text: contentFor('question.no_accommodation_reason.option.RISK_TO_OTHERS') },
      { value: Option.safety, text: contentFor('question.no_accommodation_reason.option.SAFETY') },
      { value: Option.prison_release, text: contentFor('question.no_accommodation_reason.option.PRISON_RELEASE') },
      {
        value: CommonOption.other,
        text: commonContentFor('option.OTHER'),
        reveals: requiredDetails({
          code: Question.no_accommodation_reason_other_details,
          validationMessage: commonContentFor('validation.enter_details'),
        }),
      },
    ],
    validationMessage: contentFor('question.no_accommodation_reason.validation'),
  },
  displayModes: {
    field: checkboxField({ dependentWhen: noAccommodation, visibleWhen: noAccommodation }),
    summaryRow: itemisedSummaryRow({
      changePath: Step.accommodation_details.path,
      visibleWhen: noAccommodation,
    }),
  },
})

const pastAccommodationDetails = question({
  content: {
    code: Question.past_accommodation_details,
    format: QuestionFormat.TEXT,
    text: contentFor('question.past_accommodation_details.text', CaseData.Forename),
  },
  displayModes: {
    field: characterCountField({
      maxLength: CharacterLimit.c2000,
      dependentWhen: noAccommodation,
      visibleWhen: noAccommodation,
    }),
    summaryRow: textSummaryRow({
      changeHref: Step.accommodation_details.path,
      visibleWhen: Answer(Question.past_accommodation_details).match(Condition.IsRequired()),
    }),
  },
})

const suitableHousingLocation = question({
  content: {
    code: Question.suitable_housing_location,
    format: QuestionFormat.RADIO,
    text: contentFor('question.suitable_housing_location.text', CaseData.ForenamePossessive),
    options: yesNo({
      no: revealedQuestion({
        content: {
          code: Question.suitable_housing_location_concerns,
          format: QuestionFormat.CHECKBOX,
          text: contentFor('question.suitable_housing_location_concerns.text'),
          hint: commonContentFor('select_all_that_apply_optional'),
          options: [
            {
              value: Option.criminal_associates,
              text: contentFor('question.suitable_housing_location_concerns.option.CRIMINAL_ASSOCIATES'),
            },
            {
              value: Option.victimisation,
              text: contentFor('question.suitable_housing_location_concerns.option.VICTIMISATION'),
            },
            {
              value: Option.victim_proximity,
              text: contentFor('question.suitable_housing_location_concerns.option.VICTIM_PROXIMITY'),
            },
            {
              value: Option.neighbour_difficulty,
              text: contentFor('question.suitable_housing_location_concerns.option.NEIGHBOUR_DIFFICULTY'),
            },
            {
              value: Option.area_safety,
              text: contentFor('question.suitable_housing_location_concerns.option.AREA_SAFETY'),
            },
            {
              value: CommonOption.other,
              text: commonContentFor('option.OTHER'),
              reveals: requiredDetails({
                code: Question.suitable_housing_location_concerns_other_details,
                validationMessage: commonContentFor('validation.enter_details'),
              }),
            },
          ],
        },
        displayModes: { field: checkboxDetails({ legendClasses: 'govuk-visually-hidden' }) },
      }),
    }),
    validationMessage: contentFor('question.suitable_housing_location.validation'),
  },
  displayModes: {
    field: radioField({ dependentWhen: hasAccommodation, visibleWhen: hasAccommodation }),
    summaryRow: itemisedSummaryRow({
      changePath: Step.accommodation_details.path,
      visibleWhen: hasAccommodation,
    }),
  },
})

// The two housing-concern checkboxes ask the same concerns under different
// codes, depending on whether the housing is suitable-with-concerns or unsuitable.
const housingConcernsRevealed = (content: { code: string; text: ResolvableString; otherDetailsCode: string }) =>
  revealedQuestion({
    content: {
      code: content.code,
      format: QuestionFormat.CHECKBOX,
      text: content.text,
      hint: commonContentFor('select_all_that_apply_optional'),
      options: [
        { value: Option.facilities, text: contentFor('question.suitable_housing_concerns.option.FACILITIES') },
        { value: Option.overcrowding, text: contentFor('question.suitable_housing_concerns.option.OVERCROWDING') },
        { value: Option.exploitation, text: contentFor('question.suitable_housing_concerns.option.EXPLOITATION') },
        { value: Option.safety, text: contentFor('question.suitable_housing_concerns.option.SAFETY') },
        {
          value: Option.lives_with_victim,
          text: contentFor('question.suitable_housing_concerns.option.LIVES_WITH_VICTIM'),
        },
        { value: Option.victimisation, text: contentFor('question.suitable_housing_concerns.option.VICTIMISATION') },
        {
          value: CommonOption.other,
          text: commonContentFor('option.OTHER'),
          reveals: requiredDetails({
            code: content.otherDetailsCode,
            validationMessage: commonContentFor('validation.enter_details'),
          }),
        },
      ],
    },
    displayModes: { field: checkboxDetails({ legendClasses: 'govuk-visually-hidden' }) },
  })

const suitableHousing = question({
  content: {
    code: Question.suitable_housing,
    format: QuestionFormat.RADIO,
    text: contentFor('question.suitable_housing.text', CaseData.ForenamePossessive),
    hint: contentFor('question.suitable_housing.hint'),
    options: [
      { value: CommonOption.yes, text: commonContentFor('option.YES') },
      {
        value: Option.yes_with_concerns,
        text: contentFor('question.suitable_housing.option.YES_WITH_CONCERNS'),
        reveals: housingConcernsRevealed({
          code: Question.suitable_housing_concerns,
          text: contentFor('question.suitable_housing_concerns.text'),
          otherDetailsCode: Question.suitable_housing_concerns_other_details,
        }),
      },
      {
        value: CommonOption.no,
        text: commonContentFor('option.NO'),
        reveals: housingConcernsRevealed({
          code: Question.unsuitable_housing_concerns,
          text: contentFor('question.unsuitable_housing_concerns.text'),
          otherDetailsCode: Question.unsuitable_housing_concerns_other_details,
        }),
      },
    ],
    validationMessage: contentFor('question.suitable_housing.validation'),
  },
  displayModes: {
    field: radioField({ dependentWhen: hasAccommodation, visibleWhen: hasAccommodation }),
    summaryRow: itemisedSummaryRow({
      changePath: Step.accommodation_details.path,
      visibleWhen: hasAccommodation,
    }),
  },
})

const futureAccommodationTypeRevealed = revealedQuestion({
  content: {
    code: Question.future_accommodation_type,
    format: QuestionFormat.RADIO,
    text: contentFor('question.future_accommodation_type.text'),
    options: [
      {
        value: Option.awaiting_assessment,
        text: contentFor('question.future_accommodation_type.option.AWAITING_ASSESSMENT'),
        reveals: requiredDetails({
          code: Question.future_accommodation_type_awaiting_assessment_details,
          validationMessage: commonContentFor('validation.enter_details'),
        }),
      },
      {
        value: Option.awaiting_placement,
        text: contentFor('question.future_accommodation_type.option.AWAITING_PLACEMENT'),
        reveals: requiredDetails({
          code: Question.future_accommodation_type_awaiting_placement_details,
          validationMessage: commonContentFor('validation.enter_details'),
        }),
      },
      { value: Option.buying_house, text: contentFor('question.future_accommodation_type.option.BUYING_HOUSE') },
      {
        value: Option.living_with_friends_or_family,
        text: contentFor('question.future_accommodation_type.option.LIVING_WITH_FRIENDS_OR_FAMILY'),
      },
      { value: Option.rent_privately, text: contentFor('question.future_accommodation_type.option.RENT_PRIVATELY') },
      { value: Option.rent_social, text: contentFor('question.future_accommodation_type.option.RENT_SOCIAL') },
      {
        value: Option.residential_healthcare,
        text: contentFor('question.future_accommodation_type.option.RESIDENTIAL_HEALTHCARE'),
      },
      {
        value: Option.supported_accommodation,
        text: contentFor('question.future_accommodation_type.option.SUPPORTED_ACCOMMODATION'),
      },
      {
        value: CommonOption.other,
        text: commonContentFor('option.OTHER'),
        reveals: requiredDetails({
          code: Question.future_accommodation_type_other_details,
          validationMessage: commonContentFor('validation.enter_details'),
          hint: contentFor('question.future_accommodation_type_other_details.hint'),
        }),
      },
    ],
    validationMessage: contentFor('question.future_accommodation_type.validation'),
  },
  displayModes: { field: radioDetails({ legendClasses: 'govuk-visually-hidden' }) },
})

const suitableHousingPlannedApplies = or(temporaryAccommodation, noAccommodation)

const suitableHousingPlanned = question({
  content: {
    code: Question.suitable_housing_planned,
    format: QuestionFormat.RADIO,
    text: contentFor('question.suitable_housing_planned.text', CaseData.Forename),
    options: [
      { value: CommonOption.yes, text: commonContentFor('option.YES'), reveals: futureAccommodationTypeRevealed },
      { value: CommonOption.no, text: commonContentFor('option.NO') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: contentFor('question.suitable_housing_planned.validation'),
  },
  displayModes: {
    field: radioField({ dependentWhen: suitableHousingPlannedApplies, visibleWhen: suitableHousingPlannedApplies }),
    summaryRow: itemisedSummaryRow({
      changePath: Step.accommodation_details.path,
      visibleWhen: Answer(Question.suitable_housing_planned).match(Condition.IsRequired()),
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
    summaryRow: itemisedSummaryRow({ changePath: Step.accommodation_details.path }),
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
      changePath: Step.accommodation_summary.path,
      changeVisuallyHiddenText: true,
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
      changePath: Step.accommodation_summary.path,
      changeVisuallyHiddenText: true,
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
      changePath: Step.accommodation_summary.path,
      changeVisuallyHiddenText: true,
    }),
  },
})

export const accommodationSection = {
  code: Section.accommodation.code,
  questions: {
    currentAccommodation,
    livingWith,
    noAccommodationReason,
    pastAccommodationDetails,
    suitableHousingLocation,
    suitableHousing,
    suitableHousingPlanned,
    changes,
  },
  practitionerAnalysis: {
    strengthsOrProtectiveFactors,
    riskOfSeriousHarm,
    riskOfReoffending,
  },
}
