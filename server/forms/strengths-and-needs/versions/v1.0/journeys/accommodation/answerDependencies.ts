import { AnswerDependency } from '../../../../effects/assessment/answerDependency'
import { Question } from './constants/question'
import { Option } from './constants/option'

/**
 * Mirrors the `dependentWhen` expressions in `section.ts` for answers that sit on
 * a different step from the answer that governs them. Keep the two in step.
 */
export const accommodationAnswerDependencies: readonly AnswerDependency[] = [
  {
    // Mirrors `hasAccommodation`.
    appliesWhen: [{ answer: Question.current_accommodation, isOneOf: [Option.settled, Option.temporary] }],
    codes: [
      Question.suitable_housing_location,
      Question.suitable_housing_location_concerns,
      Question.suitable_housing_location_concerns_other_details,
      Question.suitable_housing,
      Question.suitable_housing_concerns,
      Question.suitable_housing_concerns_other_details,
      Question.unsuitable_housing_concerns,
      Question.unsuitable_housing_concerns_other_details,
    ],
  },
  {
    // Mirrors `noAccommodation`.
    appliesWhen: [{ answer: Question.current_accommodation, isOneOf: [Option.no_accommodation] }],
    codes: [
      Question.no_accommodation_reason,
      Question.no_accommodation_reason_other_details,
      Question.past_accommodation_details,
    ],
  },
  {
    // Mirrors `suitableHousingPlannedApplies`.
    appliesWhen: [{ answer: Question.current_accommodation, isOneOf: [Option.temporary, Option.no_accommodation] }],
    codes: [
      Question.suitable_housing_planned,
      Question.future_accommodation_type,
      Question.future_accommodation_type_awaiting_assessment_details,
      Question.future_accommodation_type_awaiting_placement_details,
      Question.future_accommodation_type_other_details,
    ],
  },
  {
    // Mirrors `livingWithApplies` — two governing answers, so two conditions.
    appliesWhen: [
      { answer: Question.type_of_temporary_accommodation, isOneOf: [Option.immigration, Option.short_term] },
      { answer: Question.current_accommodation, isOneOf: [Option.settled] },
    ],
    codes: [Question.living_with, Question.living_with_partner_details, Question.living_with_other_details],
  },
]
