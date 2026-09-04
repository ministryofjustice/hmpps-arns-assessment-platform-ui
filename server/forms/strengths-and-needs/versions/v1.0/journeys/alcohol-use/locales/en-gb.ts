import { Locale } from '../../../../../i18n'
import { Question } from '../constants/question'
import { Option } from '../constants/option'

export const english = {
  question: {
    [Question.alcohol_use]: {
      text: 'Has %1 ever drunk alcohol?',
      option: {
        [Option.yes_within_last_three_months]: 'Yes, including the last 3 months',
        [Option.yes_not_in_last_three_months]: 'Yes, but not in the last 3 months',
      },
      validation: 'Select if they have ever drunk alcohol',
    },
    [Question.alcohol_frequency]: {
      text: 'How often has %1 drunk alcohol in the last 3 months?',
      option: {
        [Option.once_a_month_or_less]: 'Once a month or less',
        [Option.multiple_times_a_month]: '2 to 4 times a month',
        [Option.less_than_4_times_a_week]: '2 to 3 times a week',
        [Option.more_than_4_times_a_week]: 'More than 4 times a week',
      },
      validation: 'Select how often they drunk alcohol in the last 3 months',
    },
    [Question.alcohol_units]: {
      text: 'How many units of alcohol does %1 have on a typical day of drinking?',
      hint: `
        <details class="govuk-details" data-module="govuk-details">
          <summary class="govuk-details__summary">
            <span class="govuk-details__summary-text">Help with alcohol units</span>
          </summary>
          <div class="govuk-details__text">
            <table class="govuk-table">
              <thead class="govuk-table__head">
                <tr class="govuk-table__row">
                  <th scope="col" class="govuk-table__header govuk-!-width-one-half">Type of drink</th>
                  <th scope="col" class="govuk-table__header govuk-!-width-one-half govuk-table__header--numeric">Number of alcohol units</th>
                </tr>
              </thead>
              <tbody class="govuk-table__body">
                <tr class="govuk-table__row">
                  <td class="govuk-table__cell">Single small shot of spirits<br>(25ml, ABV 40%)<br>For example, whisky or vodka.</td>
                  <td class="govuk-table__cell govuk-table__cell--numeric">1 unit</td>
                </tr>
                <tr class="govuk-table__row">
                  <td class="govuk-table__cell">Alcopop (275ml, ABV 5.5%)</td>
                  <td class="govuk-table__cell govuk-table__cell--numeric">1.5 units</td>
                </tr>
                <tr class="govuk-table__row">
                  <td class="govuk-table__cell">Small glass of red/white/rosé<br>wine (125ml, ABV 12%)</td>
                  <td class="govuk-table__cell govuk-table__cell--numeric">1.5 units</td>
                </tr>
                <tr class="govuk-table__row">
                  <td class="govuk-table__cell">Bottle of lager/beer/cider<br>(330ml, ABV 5%)</td>
                  <td class="govuk-table__cell govuk-table__cell--numeric">1.7 units</td>
                </tr>
                <tr class="govuk-table__row">
                  <td class="govuk-table__cell">Can of lager/beer/cider<br>(440ml, ABV 5.5%)</td>
                  <td class="govuk-table__cell govuk-table__cell--numeric">2.4 units</td>
                </tr>
                <tr class="govuk-table__row">
                  <td class="govuk-table__cell">Pint of lower-strength lager/<br>beer/cider (ABV 3.6%)</td>
                  <td class="govuk-table__cell govuk-table__cell--numeric">2 units</td>
                </tr>
                <tr class="govuk-table__row">
                  <td class="govuk-table__cell">Standard glass of red/white/rosé<br>wine (175ml, ABV 12%)</td>
                  <td class="govuk-table__cell govuk-table__cell--numeric">2.1 units</td>
                </tr>
                <tr class="govuk-table__row">
                  <td class="govuk-table__cell">Pint of higher-strength lager/<br>beer/cider (ABV 5.2%)</td>
                  <td class="govuk-table__cell govuk-table__cell--numeric">3 units</td>
                </tr>
                <tr class="govuk-table__row">
                  <td class="govuk-table__cell">Large glass of red/white/rosé<br>wine (250ml, ABV 12%)</td>
                  <td class="govuk-table__cell govuk-table__cell--numeric">3 units</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      `,
      option: {
        [Option.units_1_to_2]: '1 to 2 units',
        [Option.units_3_to_4]: '3 to 4 units',
        [Option.units_5_to_6]: '5 to 6 units',
        [Option.units_7_to_9]: '7 to 9 units',
        [Option.units_10_or_more]: '10 or more units',
      },
      validation: 'Select how many units of alcohol they have on a typical day of drinking',
    },
    [Question.alcohol_binge_drinking]: {
      // The binge threshold is gender-based: 8 units for men, 6 for others.
      text_male: 'Has %1 had 8 or more units within a single day of drinking in the last 3 months?',
      text_other: 'Has %1 had 6 or more units within a single day of drinking in the last 3 months?',
      validation_male: 'Select if they had 8 or more units within a single day of drinking in the last 3 months',
      validation_other: 'Select if they had 6 or more units within a single day of drinking in the last 3 months',
    },
    [Question.alcohol_binge_drinking_frequency]: {
      text: 'Select how often',
      option: {
        [Option.less_than_a_month]: 'Less than a month',
        [Option.monthly]: 'Monthly',
        [Option.weekly]: 'Weekly',
        [Option.daily]: 'Daily or almost daily',
      },
      validation: 'Select how often',
    },
    [Question.alcohol_evidence_of_excess_drinking]: {
      text: 'Has %1 shown evidence of binge drinking or excessive alcohol use in the last 6 months?',
      option: {
        [Option.no_evidence]: 'No evidence of binge drinking or excessive alcohol use',
        [Option.yes_with_some_evidence]: {
          text: 'Some evidence of binge drinking or excessive alcohol use',
          hint: 'There is a pattern of alcohol use but has not caused any serious problems.',
        },
        [Option.yes_with_evidence]: {
          text: 'Evidence of binge drinking or excessive alcohol use',
          hint: 'There is a detrimental effect on other areas of their life and is often directly related to offending.',
        },
      },
      validation: "Select if there's evidence of binge drinking or excessive alcohol use in the last 6 months",
    },
    [Question.alcohol_past_issues]: {
      text: 'Does %1 have any past issues with alcohol?',
      validation: 'Select if they have any past issues with alcohol',
    },
    [Question.alcohol_past_issues_yes_details]: {
      validation: 'Enter details',
    },
    [Question.alcohol_reasons_for_use]: {
      text: 'Why does %1 drink alcohol?',
      option: {
        [Option.cultural_or_religious]: 'Cultural or religious practice',
        [Option.curiosity_or_experimentation]: 'Curiosity or experimentation',
        [Option.enjoyment]: 'Enjoyment',
        [Option.managing_emotional_issues]: 'Manage stress or emotional issues',
        [Option.special_occasions]: 'On special occasions',
        [Option.peer_pressure]: 'Peer pressure or social influence',
        [Option.self_medication]: {
          text: 'Self-medication or mood altering',
          hint: 'Includes pain management or emotional regulation.',
        },
        [Option.social]: 'Socially',
      },
      validation: 'Select why they drink alcohol',
    },
    [Question.alcohol_impact_of_use]: {
      text: "What's the impact of %1 drinking alcohol?",
      option: {
        [Option.behavioural]: {
          text: 'Behavioural',
          hint: 'Includes unemployment, disruption on education or lack of productivity.',
        },
        [Option.community]: {
          text: 'Community',
          hint: 'Includes limited opportunities or judgement from others.',
        },
        [Option.finances]: {
          text: 'Finances',
          hint: 'Includes having no money or difficulties.',
        },
        [Option.links_to_reoffending]: 'Links to offending',
        [Option.physical_or_mental_health]: {
          text: 'Physical or mental health',
          hint: 'Includes overdose.',
        },
        [Option.relationships]: {
          text: 'Relationships',
          hint: 'Includes isolation or neglecting responsibilities.',
        },
        [Option.no_negative_impact]: 'No impact',
      },
      validation: "Select the impact of them drinking alcohol, or select 'No impact'",
    },
    [Question.alcohol_impact_of_use_other_details]: {
      hint: 'Consider impact on themselves or others.',
    },
    [Question.alcohol_stopped_or_reduced]: {
      text: 'Has anything helped %1 to stop or reduce drinking alcohol in the past?',
      hint: 'Consider strategies, people or support networks that may have helped.',
      validation: 'Select if anything has helped them to stop or reduce drinking alcohol in the past',
    },
    [Question.alcohol_stopped_or_reduced_yes_details]: {
      validation: 'Enter details',
    },
    [Question.alcohol_use_changes]: {
      text: 'Does %1 want to make changes to their alcohol use?',
      validation: 'Select if they want to make changes to their alcohol use',
    },
    [Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors]: {
      text: 'Are there any strengths or protective factors related to %1 alcohol use?',
      hint: 'Include any strategies, people or support networks that helped.',
      validation: 'Select if there are any strengths or protective factors',
    },
    [Question.alcohol_use_practitioner_analysis_strengths_or_protective_factors_yes_details]: {
      validation: 'Give details on strengths or protective factors related to their alcohol use',
    },
    [Question.alcohol_use_practitioner_analysis_risk_of_serious_harm]: {
      text: 'Is %1 alcohol use linked to risk of serious harm?',
      validation: 'Select if linked to risk of serious harm',
    },
    [Question.alcohol_use_practitioner_analysis_risk_of_serious_harm_yes_details]: {
      validation: 'Give details on the risk of serious harm',
    },
    [Question.alcohol_use_practitioner_analysis_risk_of_reoffending]: {
      text: 'Is %1 alcohol use linked to risk of reoffending?',
      validation: 'Select if linked to risk of reoffending',
    },
    [Question.alcohol_use_practitioner_analysis_risk_of_reoffending_yes_details]: {
      validation: 'Give details on the risk of reoffending',
    },
  },
} as const

export type AlcoholLocale = Locale<typeof english>
