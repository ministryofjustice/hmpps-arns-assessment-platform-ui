import { basePath } from './formVersion'

export const SectionStatus = {
  complete: 'COMPLETE',
  incomplete: 'INCOMPLETE',
}

export const Section = {
  accommodation: {
    code: 'accommodation',
    path: '/accommodation',
    sideNavHref: `${basePath}/accommodation/current-accommodation`,
    statusKey: 'accommodation_section_status',
  },
  employment_and_education: {
    code: 'employment-and-education',
    path: '/employment-and-education',
    sideNavHref: `${basePath}/employment-and-education/current-employment?resume=true`,
    statusKey: 'employment_section_status',
  },
  finances: {
    code: 'finances',
    path: '',
    sideNavHref: `${basePath}/finances/finance`,
    statusKey: 'finances_section_status',
  },
  drug_use: {
    code: 'drug-use',
    path: '',
    sideNavHref: `${basePath}/drug-use/drug-use`,
    statusKey: 'drugs_section_status',
  },
  alcohol_use: {
    code: 'alcohol-use',
    path: '',
    sideNavHref: `${basePath}/alcohol-use/alcohol-use`,
    statusKey: 'alcohol_section_status',
  },
  health_and_wellbeing: {
    code: 'health-and-wellbeing',
    path: '',
    sideNavHref: `${basePath}/health-and-wellbeing/physical-health`,
    statusKey: 'health_section_status',
  },
  personal_relationships_and_community: {
    code: 'personal-relationships-and-community',
    path: '',
    sideNavHref: `${basePath}/personal-relationships-and-community/personal-relationships`,
    statusKey: 'relationship_section_status',
  },
  thinking_behaviours_and_attitudes: {
    code: 'thinking-behaviours-and-attitudes',
    path: '',
    sideNavHref: `${basePath}/thinking-behaviours-and-attitudes/thinking-behaviours`,
    statusKey: 'thinking_behaviour_section_status',
  },
  offence_analysis: {
    code: 'offence-analysis',
    path: '',
    sideNavHref: `${basePath}/offence-analysis/offence-analysis`,
    statusKey: 'offences_section_status',
  },
}
