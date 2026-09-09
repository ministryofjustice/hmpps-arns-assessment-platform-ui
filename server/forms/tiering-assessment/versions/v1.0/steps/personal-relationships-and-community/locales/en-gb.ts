import { Question } from '../constants/question'
import { Locale } from '../../../../../i18n'
import { CommonOption } from '../../../constants/commonOption'
import { RelationshipOption } from '../constants/RelationshipOption'

export const english = {
  question: {
    [Question.important_relationships]: {
      text: 'Who are the important people in %1 life?',
      option: {
        [RelationshipOption.partner]: "Partner or someone they're in an intimate relationship with",
        [RelationshipOption.children_or_wards]: 'Their children or anyone they have parenting responsibilities for',
        [RelationshipOption.other_children]: 'Other children',
        [RelationshipOption.family_members]: 'Family members',
        [RelationshipOption.friends]: 'Friends',
        [RelationshipOption.other_relationship]: 'Other',
      },
      validation: {
        required: "Select who the important people in %1 life are, or select 'Unknown'",
      },
    },
    [Question.relationship_satisfaction]: {
      text: 'Is %1 happy with their current relationship status?',
      option: {
        [CommonOption.no_problems]:
          'Happy and positive about their relationship status, or their relationship is likely to act as a protective factor',
        [CommonOption.some_problems]: 'Has some concerns about their relationship status but is overall happy',
        [CommonOption.significant_problems]:
          'Unhappy about their relationship status, or their relationship is unhealthy and directly linked to offending',
      },
      validation: {
        required: "Select whether %1 is happy with their current relationship status, or select 'Unknown'",
      },
    },

  },
} as const

export type PersonalRelationshipsLocale = Locale<typeof english>
