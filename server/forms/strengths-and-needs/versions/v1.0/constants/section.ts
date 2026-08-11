import { basePath } from './formVersion'

export enum SectionComplete {
  yes = 'YES',
  no = 'NO',
}

export const Section = {
  accommodation: {
    code: 'accommodation',
    path: '/accommodation',
    sideNavHref: `${basePath}/accommodation/current-accommodation?resume=true`,
    statusKey: 'accommodation_section_complete',
  },
  employment_and_education: {
    code: 'employment-and-education',
    path: '/employment-and-education',
    sideNavHref: `${basePath}/employment-and-education/current-employment?resume=true`,
    statusKey: 'employment_education_section_complete',
  },
  finance: {
    code: 'finance',
    path: '/finances',
    sideNavHref: `${basePath}/finances/finance?resume=true`,
    statusKey: 'finance_section_complete',
  },
  drug_use: {
    code: 'drug-use',
    path: '/drug-use',
    sideNavHref: `${basePath}/drug-use/drug-use?resume=true`,
    statusKey: 'drug_use_section_complete',
  },
  alcohol_use: {
    code: 'alcohol-use',
    path: '/alcohol-use',
    sideNavHref: `${basePath}/alcohol-use/alcohol-use?resume=true`,
    statusKey: 'alcohol_use_section_complete',
  },
  health_and_wellbeing: {
    code: 'health-and-wellbeing',
    path: '/health-and-wellbeing',
    sideNavHref: `${basePath}/health-and-wellbeing/health-wellbeing?resume=true`,
    statusKey: 'health_wellbeing_section_complete',
  },
  personal_relationships_and_community: {
    code: 'personal-relationships-and-community',
    path: '/personal-relationships-and-community',
    sideNavHref: `${basePath}/personal-relationships-and-community/personal-relationships-children-information?resume=true`,
    statusKey: 'personal_relationships_community_section_complete',
  },
  thinking_behaviours_and_attitudes: {
    code: 'thinking-behaviours-and-attitudes',
    path: '/thinking-behaviours-and-attitudes',
    sideNavHref: `${basePath}/thinking-behaviours-and-attitudes/thinking-behaviours?resume=true`,
    statusKey: 'thinking_behaviours_attitudes_section_complete',
  },
  offence_analysis: {
    code: 'offence-analysis',
    path: '/offence-analysis',
    sideNavHref: `${basePath}/offence-analysis/offence-analysis?resume=true`,
    statusKey: 'offence_analysis_section_complete',
  },
} as const
