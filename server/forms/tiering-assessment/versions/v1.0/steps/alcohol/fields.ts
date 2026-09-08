import { GovUKDetails } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'
import { Step } from '../../constants/page'
import { itemisedSummaryRow, question, QuestionFormat, radioField } from '../../../../constants/questionContent'
import { Question } from './constants/question'
import { Option } from './constants/option'
import { commonContentFor } from '../../locales'
import { CommonOption } from '../../constants/commonOption'
import { contentFor } from './locales'
import { AlcoholLocale } from './locales/en-gb'
import { ContentFormatter } from '../../../../generators/htmlContentFormatters'

const formatter = new ContentFormatter<AlcoholLocale>(contentFor)

export const currentAlcoholUseFrequencyQuestion = question({
  content: {
    code: Question.current_alcohol_use,
    format: QuestionFormat.RADIO,
    text: contentFor('question.current_alcohol_use.text', CaseData.Forename),
    options: [
      {
        value: Option.ONCE_A_MONTH,
        text: contentFor('question.current_alcohol_use.option.ONCE_A_MONTH'),
      },
      {
        value: Option.TWO_TO_FOUR_TIMES_A_MONTH,
        text: contentFor('question.current_alcohol_use.option.TWO_TO_FOUR_TIMES_A_MONTH'),
      },
      {
        value: Option.TWO_TO_THREE_TIMES_A_WEEK,
        text: contentFor('question.current_alcohol_use.option.TWO_TO_THREE_TIMES_A_WEEK'),
      },
      {
        value: Option.MORE_THAN_FOUR_TIME_A_WEEK,
        text: contentFor('question.current_alcohol_use.option.MORE_THAN_FOUR_TIME_A_WEEK'),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.alcohol.path }),
  },
})

export const unitsOfAlcoholQuestion = question({
  content: {
    code: Question.units_of_alcohol,
    format: QuestionFormat.RADIO,
    text: contentFor('question.units_of_alcohol.text', CaseData.Forename),
    options: [
      {
        value: Option.ONE_TO_TWO_UNITS,
        text: contentFor('question.units_of_alcohol.option.ONE_TO_TWO_UNITS'),
      },
      {
        value: Option.THREE_TO_FOUR_UNITS,
        text: contentFor('question.units_of_alcohol.option.THREE_TO_FOUR_UNITS'),
      },
      {
        value: Option.FIVE_TO_SIX_UNITS,
        text: contentFor('question.units_of_alcohol.option.FIVE_TO_SIX_UNITS'),
      },
      {
        value: Option.SEVEN_TO_NINE_UNITS,
        text: contentFor('question.units_of_alcohol.option.SEVEN_TO_NINE_UNITS'),
      },
      {
        value: Option.TEN_OR_MORE_UNITS,
        text: contentFor('question.units_of_alcohol.option.TEN_OR_MORE_UNITS'),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.alcohol.path }),
  },
})

export const bingeDrinkingQuestion = question({
  content: {
    code: Question.alcohol_use_binge_drinking,
    format: QuestionFormat.RADIO,
    text: contentFor('question.alcohol_use_binge_drinking.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.no_problems,
        text: contentFor('question.alcohol_use_binge_drinking.option.NO_PROBLEMS.text'),
      },
      {
        value: CommonOption.some_problems,
        text: contentFor('question.alcohol_use_binge_drinking.option.SOME_PROBLEMS.text'),
        hint: contentFor('question.alcohol_use_binge_drinking.option.SOME_PROBLEMS.hint'),
      },
      {
        value: CommonOption.significant_problems,
        text: contentFor('question.alcohol_use_binge_drinking.option.SIGNIFICANT_PROBLEMS.text'),
        hint: contentFor('question.alcohol_use_binge_drinking.option.SIGNIFICANT_PROBLEMS.hint'),
      },
      { divider: commonContentFor('or') },
      { value: CommonOption.unknown, text: commonContentFor('option.UNKNOWN') },
    ],
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.alcohol.path }),
  },
})

// export const alcoholUnitsTable = GovUKDetails({
//   summaryText: contentFor('alcohol_units_table.summary_text'),
//   html: `
// <table class="govuk-table goal-summary-card__steps">
//   <thead class="govuk-table__head">
//     <tr class="govuk-table__row">
//       <th scope="col" class="govuk-table__header">${contentFor('alcohol_units_table.type_of_drink_header')}</th>
//       <th scope="col" class="govuk-table__header">${contentFor('alcohol_units_table.number_of_alcohol_units_header')}</th>
//     </tr>
//   </thead>
//   <tbody class="govuk-table__body">
//     <tr class="govuk-table__row">
//       <td class="govuk-table__cell">${contentFor('alcohol_units_table.single_small_shot_spirit')}</td>
//       <td class="govuk-table__cell">1 ${contentFor('alcohol_units_table.unit')}</td>
//     </tr>
//     <tr class="govuk-table__row">
//       <td class="govuk-table__cell">${contentFor('alcohol_units_table.alcopop')}</td>
//       <td class="govuk-table__cell">1.5 ${contentFor('alcohol_units_table.units')}</td>
//     </tr>
//    <tr class="govuk-table__row">
//       <td class="govuk-table__cell">${contentFor('alcohol_units_table.small_glass_wine')}</td>
//       <td class="govuk-table__cell">1.5 ${contentFor('alcohol_units_table.units')}</td>
//     </tr>
//     <tr class="govuk-table__row">
//       <td class="govuk-table__cell">${contentFor('alcohol_units_table.bottle_of_beer')}</td>
//       <td class="govuk-table__cell">1.7 ${contentFor('alcohol_units_table.units')}</td>
//     </tr>
//     <tr class="govuk-table__row">
//       <td class="govuk-table__cell">${contentFor('alcohol_units_table.can_of_beer')}</td>
//       <td class="govuk-table__cell">2.4 ${contentFor('alcohol_units_table.units')}</td>
//     </tr>
//     <tr class="govuk-table__row">
//       <td class="govuk-table__cell">${contentFor('alcohol_units_table.pint_lower_strength_beer')}</td>
//       <td class="govuk-table__cell">2 ${contentFor('alcohol_units_table.units')}</td>
//     </tr>
//     <tr class="govuk-table__row">
//       <td class="govuk-table__cell">${contentFor('alcohol_units_table.standard_glass_wine')}</td>
//       <td class="govuk-table__cell">2.1 ${contentFor('alcohol_units_table.units')}</td>
//     </tr>
//     <tr class="govuk-table__row">
//       <td class="govuk-table__cell">${contentFor('alcohol_units_table.pint_higher_strength_beer')}</td>
//       <td class="govuk-table__cell">3 ${contentFor('alcohol_units_table.units')}</td>
//     </tr>
//     <tr class="govuk-table__row">
//       <td class="govuk-table__cell">${contentFor('alcohol_units_table.larger_glass_wine')}</td>
//       <td class="govuk-table__cell">3 ${contentFor('alcohol_units_table.units')}</td>
//     </tr>
//   </tbody>
// </table>`,
// })

export const alcoholUnitsTable = GovUKDetails({
  summaryText: contentFor('alcohol_units_table.summary_text'),
  html: formatter.concat(
    formatter.table(
      formatter.thead(
        formatter.tr(
          formatter.th('alcohol_units_table.type_of_drink_header'),
          formatter.th('alcohol_units_table.number_of_alcohol_units_header'),
        ),
      ),
      formatter.tbody(
        formatter.tr(
          formatter.td('alcohol_units_table.single_small_shot_spirit'),
          formatter.td(1, 'alcohol_units_table.unit'),
        ),
        formatter.tr(formatter.td('alcohol_units_table.alcopop'), formatter.td(1.5, 'alcohol_units_table.units')),
        formatter.tr(
          formatter.td('alcohol_units_table.small_glass_wine'),
          formatter.td(1.5, 'alcohol_units_table.units'),
        ),
        formatter.tr(
          formatter.td('alcohol_units_table.bottle_of_beer'),
          formatter.td(1.7, 'alcohol_units_table.units'),
        ),
        formatter.tr(formatter.td('alcohol_units_table.can_of_beer'), formatter.td(2.4, 'alcohol_units_table.units')),
        formatter.tr(
          formatter.td('alcohol_units_table.pint_lower_strength_beer'),
          formatter.td(2, 'alcohol_units_table.units'),
        ),
        formatter.tr(
          formatter.td('alcohol_units_table.standard_glass_wine'),
          formatter.td(2.1, 'alcohol_units_table.units'),
        ),
        formatter.tr(
          formatter.td('alcohol_units_table.pint_higher_strength_beer'),
          formatter.td(3, 'alcohol_units_table.units'),
        ),
        formatter.tr(
          formatter.td('alcohol_units_table.larger_glass_wine'),
          formatter.td(3, 'alcohol_units_table.units'),
        ),
      ),
    ),
  ),
})

export const alcoholFields = {
  code: Step.alcohol.code,
  questions: {
    currentAlcoholUseFrequencyQuestion,
    unitsOfAlcoholQuestion,
    bingeDrinkingQuestion,
  },
}
