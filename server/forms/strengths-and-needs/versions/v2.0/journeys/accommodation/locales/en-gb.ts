import { Locale } from '../../../../../i18n'
import { Question } from '../constants/question'
import { Option } from '../constants/option'

export const english = {
  question: {
    [Question.community_current_accommodation]: {
      text: 'Does %1 currently have somewhere to live?',
      validation: 'Select if they currently have somewhere to live',
    },
    [Question.community_current_accommodation_settled]: {
      text: 'Is %1 accommodation settled?',
      validation: 'Select if the accommodation is settled',
    },
    [Question.community_suitable_housing_location]: {
      text: 'Is the location of %1 accommodation suitable?',
      validation: 'Select if the location of the accommodation is suitable',
    },
    [Question.community_suitable_housing_location_concerns]: {
      text: 'What are the concerns with the location?',
      option: {
        [Option.criminal_associates]: 'Close to criminal associates',
        [Option.victimisation]: 'Close to someone who has victimised them',
        [Option.victim_proximity]: 'Close to victim or possible victims',
        [Option.neighbour_difficulty]: 'Difficulty with neighbours',
        [Option.area_safety]: 'Safety of the area',
      },
      validation: 'Select if there are concerns with the location',
    },
    [Question.community_suitable_housing]: {
      text: 'Is %1 accommodation suitable?',
      hint: 'This includes things like safety or having appropriate amenities.',
      option: {
        [Option.yes_with_concerns]: 'Yes, with concerns',
      },
      validation: 'Select if the accommodation is suitable',
    },
    [Question.community_suitable_housing_concerns]: {
      text: 'What are your concerns about the location of %1 accommodation?',
      option: {
        [Option.facilities]: 'Issues with the property - for example, poor kitchen or bathroom facilities',
        [Option.overcrowding]: 'Overcrowding',
        [Option.exploitation]: 'Risk of their accommodation being exploited by others - for example, cuckooing',
        [Option.safety]: 'Safety of accommodation',
        [Option.lives_with_victim]: 'Victim lives with them',
        [Option.victimisation]: 'Victimised by someone living with them',
      },
      validation: 'Select if there are concerns with the accommodation',
    },
    [Question.community_unsuitable_housing_concerns]: {
      text: 'What are the concerns?',
      option: {
        [Option.facilities]: 'Issues with the property - for example, poor kitchen or bathroom facilities',
        [Option.overcrowding]: 'Overcrowding',
        [Option.exploitation]: 'Risk of their accommodation being exploited by others - for example, cuckooing',
        [Option.safety]: 'Safety of accommodation',
        [Option.lives_with_victim]: 'Victim lives with them',
        [Option.victimisation]: 'Victimised by someone living with them',
      },
      validation: 'Select if there are concerns with the accommodation',
    },
    [Question.community_no_accommodation_reason]: {
      text: 'Why does %1 have no accommodation?',
      hint:
        '<div class="govuk-!-width-two-thirds">' +
        '<p class="govuk-hint">Consider current and past homelessness issues.</p>' +
        '<p class="govuk-hint">Select all that apply.</p>' +
        '</div>',
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
    [Question.accommodation_changes]: {
      text: 'Does %1 want to make changes to their accommodation?',
      hint: '%1 must answer this question.',
      validation: 'Select if they want to make changes to their accommodation',
    },

    [Question.accommodation_practitioner_analysis_strengths_or_protective_factors]: {
      text: 'Are there any strengths or protective factors related to %1 accommodation?',
      hint: 'Include any strategies, people or support networks that helped.',
      validation: 'Select if there are any strengths or protective factors',
    },
    [Question.accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details]: {
      validation: 'Give details on strengths or protective factors related to their accommodation',
    },
    [Question.accommodation_practitioner_analysis_risk_of_serious_harm]: {
      text: 'Is %1 accommodation linked to risk of serious harm?',
      validation: 'Select if linked to risk of serious harm',
    },
    [Question.accommodation_practitioner_analysis_risk_of_serious_harm_yes_details]: {
      validation: 'Give details on the risk of serious harm',
    },
    [Question.accommodation_practitioner_analysis_risk_of_reoffending]: {
      text: 'Is %1 accommodation linked to risk of reoffending?',
      validation: 'Select if linked to risk of reoffending',
    },
    [Question.accommodation_practitioner_analysis_risk_of_reoffending_yes_details]: {
      validation: 'Give details on the risk of reoffending',
    },
  },
} as const

export type AccommodationLocale = Locale<typeof english>
