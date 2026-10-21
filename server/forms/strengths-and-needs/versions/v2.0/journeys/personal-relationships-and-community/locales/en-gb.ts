import { Locale } from '../../../../../i18n'
import { Question } from '../constants/question'
import { Option } from '../constants/option'
import { CommonOption } from '../../../constants/commonOption'

const enChildrenDetailsOptionLabel = 'Include the name, age and sex of any children, and their relationship to %1.'
const enIntimateRelationshipDetailsHint = 'Consider patterns and quality of any significant relationships.'

export const english = {
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
    [Question.personal_relationships_community_any_parenting_responsibilities]: {
      text: 'Does %1 have any parenting responsibilities?',
      validation: 'Select if they have parent responsibilities',
    },
    [Question.personal_relationships_community_parental_responsibilities]: {
      text: 'Is %1 able to manage their parenting responsibilities?',
      hint: 'If there are parenting concerns, it does not always mean there are child wellbeing concerns. They may just require some help or support.',
      validation: 'Select if they’re able to manage their parenting responsibilities',
      option: {
        [CommonOption.yes]: {
          text: 'Yes, manages parenting responsibilities well',
        },
        [Option.sometimes]: {
          text: 'Sometimes manages parenting responsibilities well',
        },
        [CommonOption.no]: {
          text: 'No, is not able to manage parenting responsibilities',
        },
      },
    },
    [Question.personal_relationships_community_family_relationship]: {
      text: 'What is %1 current relationship like with their family?',
      hint: 'Consider any relationships that may act like family support.',
      validation: 'Select what their current relationship is like with their family',
      option: {
        [Option.stable_relationship]: {
          text: 'Stable, supportive, positive and rewarding relationship',
        },
        [Option.mixed_relationship]: {
          text: 'Both positive and negative relationship',
        },
        [Option.unstable_relationship]: {
          text: 'Unstable and unsupportive relationship',
          hint: 'This includes those who have little or no contact with their family.',
        },
      },
    },
    [Question.personal_relationships_community_childhood]: {
      text: 'What was %1 experience of their childhood?',
      hint: 'Childhood is the period up to and including 18 years old.',
      validation: 'Select their experience of childhood',
      option: {
        [Option.positive_childhood]: {
          text: 'Positive experience',
        },
        [Option.mixed_childhood]: {
          text: 'Both positive and negative experience',
        },
        [Option.negative_childhood]: {
          text: 'Negative experience',
          hint: 'This includes things like permanent or long-term separation from their parents or guardians, inconsistent care, neglect or abuse.',
        },
      },
    },
    [Question.personal_relationships_community_childhood_behaviour]: {
      text: 'Did %1 have any childhood behavioural problems?',
      hint: 'Consider any adverse experiences and trauma, as well as neurodiversity that could lead to behavioural problems.',
      validation: 'Select if they had childhood behavioural problems',
    },
    [Question.personal_relationships_community_belonging]: {
      text: 'Is %1 part of any groups or communities that gives them a sense of belonging? (optional)',
      hint: 'For example, online social media or community groups.',
    },
    [Question.personal_relationships_community_in_relationship]: {
      text: 'Is %1 in a relationship?',
      validation: 'Select if they are in a relationship',
      option: {
        [Option.in_relationship_living_together]: {
          text: 'In a relationship, living together',
        },
        [Option.in_relationship_not_living_together]: {
          text: 'In a relationship, not living together',
        },
        [Option.no_relationship]: {
          text: 'Not in a relationship',
        },
      },
    },
    [Question.personal_relationships_community_current_relationship]: {
      text: 'Is %1 happy with their current relationship status?',
      validation: 'Select if they are happy with their current relationship status',
      option: {
        [Option.happy_relationship]: {
          text: 'Happy and positive about their relationship status or their relationship is likely to act as a protective factor',
        },
        [Option.concerns_happy_relationship]: {
          text: 'Has some concerns about their relationship status but is overall happy',
        },
        [Option.unhappy_relationship]: {
          text: 'Unhappy about their relationship status or their relationship is unhealthy and directly linked to offending',
        },
      },
    },
    [Question.personal_relationships_community_intimate_relationship]: {
      text: 'What is %1 history of intimate relationships?',
      hint: 'An intimate relationship is one that involves physical and/or emotional closeness.',
      validation: 'Select their history of intimate relationships',
      option: {
        [Option.stable_relationships]: {
          text: 'History of stable, supportive, positive and rewarding relationships',
          hint: 'This includes if they do not have a history of relationships but appear capable of starting and maintaining one.',
          detailsHint: enIntimateRelationshipDetailsHint,
        },
        [Option.positive_and_negative_relationships]: {
          text: 'History of both positive and negative relationships',
          detailsHint: enIntimateRelationshipDetailsHint,
        },
        [Option.unstable_relationships]: {
          text: 'History of unstable, unsupportive and destructive relationships',
          hint: 'This includes if they are single and have never had a relationship but would like one.',
          detailsHint: enIntimateRelationshipDetailsHint,
        },
      },
    },
    [Question.personal_relationships_community_domestic_abuse_perpetrator]: {
      text: 'Is there evidence that %1 has been a perpetrator of domestic abuse?',
      validation: 'Select if there is evidence they have been a perpetrator of domestic abuse',
    },
    [Question.personal_relationships_community_domestic_abuse_against]: {
      text: 'Who did %1 abuse?',
      validation: 'Select who they abused',
      option: {
        [Option.family_member]: {
          text: 'Family member',
          validation: 'Enter details of abuse against family member',
        },
        [Option.intimate_partner]: {
          text: 'Intimate partner',
          validation: 'Enter details of abuse against intimate partner',
        },
        [Option.family_member_and_intimate_partner]: {
          text: 'Family member and intimate partner',
          validation: 'Enter details of abuse against family member and intimate partner',
        },
      },
    },
    [Question.personal_relationships_community_coercive_behaviour]: {
      text: 'Is there evidence of coercive behaviour?',
      validation: 'Select if there is evidence of coercive behaviour',
    },
    [Question.personal_relationships_community_coercive_behaviour_yes_details]: {
      validation: 'Give details on coercive behaviour',
    },
    [Question.personal_relationships_community_strangulation]: {
      text: 'Is there evidence of strangulation?',
      validation: 'Select if there is evidence of strangulation',
    },
    [Question.personal_relationships_community_strangulation_yes_details]: {
      validation: 'Give details on strangulation',
    },
    [Question.personal_relationships_community_domestic_abuse_victim]: {
      text: 'Is there evidence that %1 has been a victim of domestic abuse?',
      validation: 'Select if there is evidence they have been a victim of domestic abuse',
    },
    [Question.personal_relationships_community_domestic_abuse_victim_by]: {
      text: 'Who has abused them?',
      validation: 'Select who abused them',
      option: {
        [Option.family_member]: {
          text: 'Family member',
          validation: 'Enter details of family member who abused them',
        },
        [Option.intimate_partner]: {
          text: 'Intimate partner',
          validation: 'Enter details of intimate partner who abused them',
        },
        [Option.family_member_and_intimate_partner]: {
          text: 'Family member and intimate partner',
          validation: 'Enter details of family member and intimate partner who abused them',
        },
      },
    },
    [Question.personal_relationships_community_changes]: {
      text: 'Does %1 want to make changes to their personal relationships and community?',
    },
    [Question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors]: {
      text: 'Are there any strengths or protective factors related to %1 personal relationships and community?',
      hint: 'Include any strategies, people or support networks that helped.',
      validation: 'Select if there are any strengths or protective factors',
    },
    [Question.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_yes_details]: {
      validation:
        'Give details on strengths or protective factors related to their personal relationships and community',
    },
    [Question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm]: {
      text: 'Is %1 personal relationships and community linked to risk of serious harm?',
      validation: 'Select if linked to risk of serious harm',
    },
    [Question.personal_relationships_community_practitioner_analysis_risk_of_serious_harm_yes_details]: {
      validation: 'Give details on the risk of serious harm',
    },
    [Question.personal_relationships_community_practitioner_analysis_risk_of_reoffending]: {
      text: 'Is %1 personal relationships and community linked to risk of reoffending?',
      validation: 'Select if linked to risk of reoffending',
    },
    [Question.personal_relationships_community_practitioner_analysis_risk_of_reoffending_yes_details]: {
      validation: 'Give details on the risk of reoffending',
    },
  },
}

export type PersonalRelationshipsAndCommunityLocale = Locale<typeof english>
