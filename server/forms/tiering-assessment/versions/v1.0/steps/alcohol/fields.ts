import { GovUKDetails, GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Condition, Format, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'

export const currentAlcoholUseFrequencyField = GovUKRadioInput({
  code: 'current-alcohol-use-frequency',
  fieldset: {
    legend: {
      text: Format('How often has %1 drank alcohol in the last 3 months?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    { value: '0', text: 'Once a month or less' },
    { value: '1', text: '2 to 4 times a month' },
    { value: '3', text: '2 to 3 times a week' },
    { value: '4', text: 'More than 4 times a week' },
    { divider: 'or' },
    { value: null, text: 'Unknown' },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
  ],
})

export const unitsOfAlcoholField = GovUKRadioInput({
  code: 'units-of-alcohol',
  fieldset: {
    legend: {
      text: Format('How many units of alcohol does %1 have on a typical day of drinking?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    { value: '0', text: '1 to 2 units' },
    { value: '1', text: '3 to 4 units' },
    { value: '2', text: '5 to 6 units' },
    { value: '3', text: '7 to 9 units' },
    { value: '4', text: '10 or more units' },
    { divider: 'or' },
    { value: null, text: 'Unknown' },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
  ],
})

export const bingeDrinkingField = GovUKRadioInput({
  code: 'binge-drinking',
  fieldset: {
    legend: {
      text: Format(
        'Has %1 shown evidence of binge drinking or excessive alcohol use in the last 6 months?',
        CaseData.Forename,
      ),
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    { value: 'NO_PROBLEMS', text: 'No evidence of binge drinking or excessive alcohol use' },
    {
      value: 'SOME_PROBLEMS',
      text: 'Some evidence of binge drinking or excessive alcohol use',
      hint: 'There is a pattern of alcohol use but has not caused any serious problems',
    },
    {
      value: 'SIGNIFICANT_PROBLEMS',
      text: 'Evidence of binge drinking or excessive alcohol use',
      hint: 'There is a detrimental effect on other areas of their life and is often directly related to offending',
    },
    { divider: 'or' },
    { value: null, text: 'Unknown' },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
  ],
})

export const alcoholUnitsTable = GovUKDetails({
  summaryText: 'Check how many units are consumed',
  html: `
<table class="govuk-table goal-summary-card__steps">
  <thead class="govuk-table__head">
    <tr class="govuk-table__row">
      <th scope="col" class="govuk-table__header">Type of drink</th>
      <th scope="col" class="govuk-table__header">Number of alcohol units</th>
    </tr>
  </thead>
  <tbody class="govuk-table__body">
    <tr class="govuk-table__row">
      <td class="govuk-table__cell">Single small shot of spirits (25ml, ABV 40%) For example, whisky or vodka</td>
      <td class="govuk-table__cell">1 unit</td>
    </tr>
    <tr class="govuk-table__row">
      <td class="govuk-table__cell">Alcopop (275ml, ABV 5.5%)</td>
      <td class="govuk-table__cell">1.5 units</td>
    </tr>
   <tr class="govuk-table__row">
      <td class="govuk-table__cell">Small glass of red/white/rosé wine (125ml, ABV 12%)</td>
      <td class="govuk-table__cell">1.5 units</td>
    </tr>
    <tr class="govuk-table__row">
      <td class="govuk-table__cell">Bottle of lager/beer/cider (330ml, ABV 5%)</td>
      <td class="govuk-table__cell">1.7 units</td>
    </tr>
    <tr class="govuk-table__row">
      <td class="govuk-table__cell">Can of lager/beer/cider (440ml, ABV 5.5%)</td>
      <td class="govuk-table__cell">2.4 units</td>
    </tr>
    <tr class="govuk-table__row">
      <td class="govuk-table__cell">Print of lower-strength lager/beer/cider (ABV 3.6%)</td>
      <td class="govuk-table__cell">2 units</td>
    </tr>
    <tr class="govuk-table__row">
      <td class="govuk-table__cell">Standard glass of red/white/rosé wine (175ml, ABV 12%)</td>
      <td class="govuk-table__cell">2.1 units</td>
    </tr>
    <tr class="govuk-table__row">
      <td class="govuk-table__cell">Print of higher-strength lager/beer/cider (ABV 5.2%)</td>
      <td class="govuk-table__cell">3 units</td>
    </tr>
    <tr class="govuk-table__row">
      <td class="govuk-table__cell">Large glass of red/white/rosé wine (250ml, ABV 12%)</td>
      <td class="govuk-table__cell">3 units</td>
    </tr>
  </tbody>
</table>`,
})
