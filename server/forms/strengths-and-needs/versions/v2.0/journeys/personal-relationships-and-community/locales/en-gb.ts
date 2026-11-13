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
          text: 'Yes, children they have regular contact with',
          label: enChildrenDetailsOptionLabel,
          validation: 'Enter details of any children that do not live with them',
        },
      },
    },
    [Question.community_personal_relationships_community_parental_responsibilities]: {
      text: 'Does %1 have any parenting responsibilities?',
      validation: 'Select if they have parenting responsibilities',
    },
    [Question.community_personal_relationships_community_manage_parental_responsibilities]: {
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
          text: 'Generally stable and supportive',
          hint: 'No significant concerns identified about care, safety or family relationships.',
        },
        [Option.mixed_childhood]: {
          text: 'Some challenges or instability',
          hint: 'Less severe or temporary challenges, disruption or concerns.',
        },
        [Option.negative_childhood]: {
          text: 'Significant challenges or instability',
          hint: 'Serious or longer-term experiences such as prolonged separation from parents or carers, inconsistent care, neglect or abuse. A single serious experience may also be significant.',
        },
      },
    },
    [Question.personal_relationships_community_childhood_behaviour]: {
      text: 'Is there evidence %1 had any childhood behavioural issues or challenges?',
      hint: 'Consider any experiences, trauma or neurodivergent needs that may have influenced behaviour during childhood',
      validation: 'Select if they had childhood behavioural issues or challenges',
    },
    [Question.personal_relationships_community_sense_of_belonging]: {
      text: 'Are there any people, groups or communities that give %1 a sense of belonging?',
      hint: 'Consider positive and negative influences.  This could include relationships with friends, neighbours, online communities, social groups, faith groups, extremist groups and gangs.',
      option: {
        [CommonOption.yes]: {
          hint: 'Include any positive influences, sources of support, or relationships that may present risks or vulnerabilities.',
        },
      },
      validation: 'Select if there are any people, groups or communities that give them a sense of belonging',
    },
    [Question.personal_relationships_community_relationship_status]: {
      text: 'Does %1 currently have a partner?',
      validation: 'Select if they have a partner',
      option: {
        [Option.in_relationship_living_together]: {
          text: 'Yes, living together',
        },
        [Option.in_relationship_not_living_together]: {
          text: 'Yes, not living together',
        },
      },
    },
    [Question.personal_relationships_community_current_relationship]: {
      text: 'How would you describe %1 current relationship situation?',
      validation: 'Select how you would describe their current relationship situation',
      option: {
        [Option.happy_relationship]: {
          text: 'Positive and supportive',
          hint: 'Their current relationship is positive and supportive, or they are content being single.',
        },
        [Option.concerns_happy_relationship]: {
          text: 'Has some difficulties but remains supportive',
          hint: 'There are some difficulties or concerns, but there remains some support, stability or contentment with the current situation.',
        },
        [Option.unhappy_relationship]: {
          text: 'Difficult or unhealthy',
          hint: 'Their current relationship is causing significant difficulties, is unhealthy, linked to offending, or they are preoccupied with being single.',
        },
      },
    },
    [Question.personal_relationships_community_intimate_relationship]: {
      text: 'How would you describe %1 history of intimate relationships?',
      hint: 'An intimate relationship is one that involves physical and/or emotional closeness.',
      validation: 'Select how you would describe their history of intimate relationships',
      option: {
        [Option.stable_relationships]: {
          text: 'Stable, supportive and rewarding',
          hint: 'This includes having no history of intimate relationships, but they appear capable of starting and maintaining a heathy one.',
          detailsHint: enIntimateRelationshipDetailsHint,
        },
        [Option.positive_and_negative_relationships]: {
          text: 'Both healthy and unhealthy relationships',
          detailsHint: enIntimateRelationshipDetailsHint,
        },
        [Option.unstable_relationships]: {
          text: 'Unstable, unsupportive and destructive',
          hint: 'Includes having no history of relationships and there are concerns about their ability to start or maintain one.',
          detailsHint: enIntimateRelationshipDetailsHint,
        },
      },
    },
    [Question.offence_analysis_perpetrator_of_domestic_abuse]: {
      text: 'Is there evidence that %1 has been a perpetrator of domestic abuse?',
      validation: 'Select if there is evidence they have been a perpetrator of domestic abuse',
    },
    [Question.offence_analysis_perpetrator_of_domestic_abuse_victim]: {
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
      },
    },
    [Question.controlling_coercive_behaviour]: {
      text: 'Is there evidence of coercive behaviour?',
      validation: 'Select if there is evidence of coercive behaviour',
    },
    [Question.controlling_coercive_behaviour_yes_details]: {
      validation: 'Give details on coercive behaviour',
    },
    [Question.evidence_of_strangulation]: {
      text: 'Is there evidence of strangulation?',
      validation: 'Select if there is evidence of strangulation',
    },
    [Question.evidence_of_strangulation_yes_details]: {
      validation: 'Give details on strangulation',
    },
    [Question.offence_analysis_victim_of_domestic_abuse]: {
      text: 'Is there evidence that %1 has been a victim of domestic abuse?',
      validation: 'Select if there is evidence they have been a victim of domestic abuse',
    },
    [Question.offence_analysis_victim_of_domestic_abuse_who_committed_abuse]: {
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
