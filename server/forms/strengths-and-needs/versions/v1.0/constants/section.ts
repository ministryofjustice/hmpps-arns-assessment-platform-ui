export enum SectionComplete {
  yes = 'YES',
  no = 'NO',
}

export const Section = {
  accommodation: {
    code: 'accommodation',
    path: '/accommodation',
    sideNavHref: `accommodation/current-accommodation`,
    statusKey: 'accommodation_section_complete',
  },
  employment_and_education: {
    code: 'employment-and-education',
    path: '/employment-and-education',
    sideNavHref: `employment-and-education/current-employment`,
    statusKey: 'employment_education_section_complete',
  },
  finance: {
    code: 'finance',
    path: '/finances',
    sideNavHref: `finances/finance`,
    statusKey: 'finance_section_complete',
  },
  drug_use: {
    code: 'drug-use',
    path: '/drug-use',
    sideNavHref: `drug-use/drug-use`,
    statusKey: 'drug_use_section_complete',
  },
  alcohol_use: {
    code: 'alcohol-use',
    path: '/alcohol-use',
    sideNavHref: `alcohol-use/alcohol-use`,
    statusKey: 'alcohol_use_section_complete',
  },
  health_and_wellbeing: {
    code: 'health-and-wellbeing',
    path: '/health-and-wellbeing',
    sideNavHref: `health-and-wellbeing/health-wellbeing`,
    statusKey: 'health_wellbeing_section_complete',
  },
  personal_relationships_and_community: {
    code: 'personal-relationships-and-community',
    path: '/personal-relationships-and-community',
    sideNavHref: `personal-relationships-and-community/personal-relationships-children-information`,
    statusKey: 'personal_relationships_community_section_complete',
  },
  thinking_behaviours_and_attitudes: {
    code: 'thinking-behaviours-and-attitudes',
    path: '/thinking-behaviours-and-attitudes',
    sideNavHref: `thinking-behaviours-and-attitudes/thinking-behaviours`,
    statusKey: 'thinking_behaviours_attitudes_section_complete',
  },
  offence_analysis: {
    code: 'offence-analysis',
    path: '/offence-analysis',
    sideNavHref: `offence-analysis/offence-analysis`,
    statusKey: 'offence_analysis_section_complete',
  },
} as const
