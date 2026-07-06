import { Locale } from '../../../../../i18n'
import { Question } from '../constants/question'
import { Step } from '../constants/step'
import { Option } from '../constants/option'

export const english = {
  step: {
    [Step.current_accommodation.code]: 'Current accommodation',
    [Step.accommodation_details.code]: 'Accommodation details',
    [Step.accommodation_summary.code]: 'Accommodation summary',
    [Step.accommodation_analysis.code]: 'Accommodation analysis',
  },
  question: {
    [Question.short_term_accommodation_end_date]: {
      text: 'Enter expected end date (optional)',
    },
    [Question.approved_premises_end_date]: {
      text: 'Enter expected end date (optional)',
    },
    [Question.cas2_end_date]: {
      text: 'Enter expected end date (optional)',
    },
    [Question.cas3_end_date]: {
      text: 'Enter expected end date (optional)',
    },
    [Question.immigration_accommodation_end_date]: {
      text: 'Enter expected end date (optional)',
    },
    [Question.type_of_settled_accommodation]: {
      text: 'Select the type of settled accommodation',
      option: {
        [Option.homeowner]: 'Homeowner',
        [Option.friends_or_family]: 'Living with friends or family',
        [Option.renting_privately]: 'Renting privately',
        [Option.renting_other]: 'Renting from social, local authority or other',
        [Option.residential_healthcare]: 'Residential healthcare',
        [Option.supported_accommodation]: 'Supported accommodation',
      },
      validation: 'Select the type of settled accommodation',
    },
    [Question.type_of_temporary_accommodation]: {
      text: 'Select the type of temporary accommodation',
      option: {
        [Option.approved_premises]: 'Approved premises',
        [Option.cas2]: 'Community Accommodation Service Tier 2 (CAS2)',
        [Option.cas3]: 'Community Accommodation Service Tier 3 (CAS3)',
        [Option.immigration]: {
          text: 'Immigration accommodation',
          hint: "<div class=\"govuk-grid-column-full\">" +
                  "<p class=\"govuk-hint\">This includes:</p>" +
                  "<ul class=\"govuk-hint govuk-list govuk-list--bullet\">" +
                    "<li class=\" govuk-!-margin-bottom-5\">Schedule 10 - Home Office provides accommodation under the Immigration Act 2016</li>" +
                    "<li>Schedule 4 - Home Office provides accommodation for those on immigration bail, prior to the Immigration Act 2016</li>" +
                  "</ul>" +
                "</div>",
        },
        [Option.short_term]: {
          text: 'Short term accommodation',
          hint: 'Includes living with friends or family.',
        },
      },
      validation: 'Select the type of temporary accommodation',
    },
    [Question.type_of_no_accommodation]: {
      text: 'Select the type of no accommodation',
      option: {
        [Option.campsite]: 'Campsite',
        [Option.emergency_hostel]: 'Emergency hostel',
        [Option.homeless]: 'Homeless - includes squatting',
        [Option.rough_sleeping]: 'Rough sleeping',
        [Option.shelter]: 'Shelter',
      },
      validation: 'Select the type of no accommodation',
    },
    [Question.current_accommodation]: {
      text: 'What type of accommodation does %1 currently have?',
      option: {
        [Option.settled]: 'Settled',
        [Option.temporary]: 'Temporary',
        [Option.no_accommodation]: 'No accommodation',
      },
      validation: 'Select the type of accommodation they currently have',
    },
    [Question.living_with]: {
      text: 'Who is %1 living with?',
      option: {
        [Option.family]: 'Family',
        [Option.friends]: 'Friends',
        [Option.partner]: 'Partner',
        [Option.person_under_18]: 'Person under 18 years old',
        [Option.alone]: 'Alone',
      },
      validation: `Select who they are living with, or select 'Alone'`,
    },
    [Question.suitable_housing_location_concerns]: {
      text: 'What are the concerns with the location?',
      option: {
        [Option.criminal_associates]: 'Close to criminal associates',
        [Option.victimisation]: 'Close to someone who has victimised them',
        [Option.victim_proximity]: 'Close to victim or possible victims',
        [Option.neighbour_difficulty]: 'Difficulty with neighbours',
        [Option.area_safety]: 'Safety of the area',
      },
    },
    [Question.suitable_housing_location]: {
      text: `Is the location of %1's accommodation suitable?`,
      validation: 'Select if the location of the accommodation is suitable',
    },
    [Question.suitable_housing_concerns]: {
      text: 'What are the concerns?',
      option: {
        [Option.facilities]: 'Issues with the property - for example, poor kitchen or bathroom facilities',
        [Option.overcrowding]: 'Overcrowding',
        [Option.exploitation]: 'Risk of their accommodation being exploited by others - for example, cuckooing',
        [Option.safety]: 'Safety of accommodation',
        [Option.lives_with_victim]: 'Victim lives with them',
        [Option.victimisation]: 'Victimised by someone living with them',
      },
    },
    [Question.unsuitable_housing_concerns]: {
      text: 'What are the concerns?',
    },
    [Question.suitable_housing]: {
      text: `Is %1's accommodation suitable?`,
      hint: 'This includes things like safety or having appropriate amenities.',
      option: {
        [Option.yes_with_concerns]: 'Yes, with concerns',
      },
      validation: 'Select if the accommodation is suitable',
    },
    [Question.accommodation_changes]: {
      text: 'Does %1 want to make changes to their accommodation?',
      validation: 'Select if they want to make changes to their accommodation',
    },
    [Question.suitable_housing_planned]: {
      text: 'Does %1 have future accommodation planned?',
      validation: 'Select if they have future accommodation planned',
    },
    [Question.future_accommodation_type]: {
      text: 'What is the type of future accommodation?',
      option: {
        [Option.awaiting_assessment]: 'Awaiting assessment',
        [Option.awaiting_placement]: 'Awaiting placement',
        [Option.buying_house]: 'Buy a house',
        [Option.living_with_friends_or_family]: 'Living with friends or family',
        [Option.rent_privately]: 'Rent privately',
        [Option.rent_social]: 'Rent from social, local authority or other',
        [Option.residential_healthcare]: 'Residential healthcare',
        [Option.supported_accommodation]: 'Supported accommodation',
      },
      validation: 'Select the type of future accommodation',
    },
    [Question.no_accommodation_reason]: {
      text: 'Why does %1 have no accommodation?',
      hint:
        "<div class=\"govuk-!-width-two-thirds\">" +
          "<p class=\"govuk-hint\">Consider current and past homelessness issues.</p>" +
          "<p class=\"govuk-hint\">Select all that apply.</p>" +
        "</div>",
      option: {
        [Option.alcohol_problems]: 'Alcohol related problems',
        [Option.drug_problems]: 'Drug related problems',
        [Option.financial_difficulties]: 'Financial difficulties',
        [Option.risk_to_others]: 'Left previous accommodation due to risk to others',
        [Option.safety]: 'Left previous accommodation for their own safety',
        [Option.prison_release]: 'No accommodation when released from prison',
      },
      validation: 'Select why they have no accommodation',
    },
    [Question.past_accommodation_details]: {
      text: `What's helped %1 stay in accommodation in the past? (optional)`,
    },
    [Question.accommodation_strengths_protective_factors]: {
      text: 'Are there any strengths or protective factors related to %1 accommodation?',
      hint: 'Include any strategies, people or support networks that helped.',
      validation: 'Select if there are any strengths or protective factors',
    },
    [Question.accommodation_strengths_protective_factors_details]: {
      validation: 'Give details on strengths or protective factors related to their accommodation',
    },
    [Question.accommodation_linked_to_serious_harm]: {
      text: 'Is %1 accommodation linked to risk of serious harm?',
      validation: 'Select if linked to risk of serious harm',
    },
    [Question.accommodation_serious_harm_details]: {
      validation: 'Give details on the risk of serious harm',
    },
    [Question.accommodation_linked_to_reoffending]: {
      text: 'Is %1 accommodation linked to risk of reoffending?',
      validation: 'Select if linked to risk of reoffending',
    },
    [Question.accommodation_risk_of_reoffending_details]: {
      validation: 'Give details on the risk of reoffending',
    },
    [Question.living_with_partner_details]: {
      hint: 'Include name, age and gender.',
    },
    [Question.future_accommodation_type_other_details]: {
      hint: 'Include where and who with.',
    },
  },
  expected_end_date: 'Expected end date:',
  not_provided: 'Not provided',
} as const

export type AccommodationLocale = Locale<typeof english>
