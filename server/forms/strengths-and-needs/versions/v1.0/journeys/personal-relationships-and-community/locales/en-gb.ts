import { Locale } from '../../../../../i18n'
import { Step } from '../constants/step'
import { Question } from '../constants/question'
import { Option } from '../constants/option'

const enChildrenDetailsOptionLabel = 'Include the name, age and sex of any children, and their relationship to %1.'

export const english = {
  step: {
    [Step.personal_relationships_children_information.code]: 'Personal Relationships: Children Information',
    [Step.personal_relationships.code]: 'Personal Relationships',
    [Step.personal_relationships_community.code]: 'Personal Relationships and Community',
    [Step.personal_relationships_community_summary.code]: 'Personal Relationships and Community Summary',
    [Step.personal_relationships_community_analysis.code]: 'Personal Relationships and Community Analysis',
  },
  question: {
    [Question.personal_relationships_community_children_details]: {
      text: 'Are there any children in %1 life?',
      hint: `This refers to any children (under 18 years) %1 has regular contact with, even if they do not have parental responsibility.<br><br> Select all that apply.`,
      option: {
        [Option.yes_children_living_with_pop]: {
          text: 'Yes, children that live with them',
          label: enChildrenDetailsOptionLabel,
          validation: 'Enter details of any children that live with them',
        },
        [Option.yes_children_not_living_with_pop]: {
          text: 'Yes, children that do not live with them',
          label: enChildrenDetailsOptionLabel,
          validation: 'Enter details of any children that do not live with them',
        },
        [Option.yes_children_visiting]: {
          text: 'Yes, children that visit them regularly',
          label: enChildrenDetailsOptionLabel,
          validation: 'Enter details of any children that visit them regularly',
        },
        [Option.no_children]: {
          text: 'No, there are no children in %1 life',
        },
      },
    },
  },
}

export type PersonalRelationshipsAndCommunityLocale = Locale<typeof english>
