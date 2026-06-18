import { Data, Transformer } from '@ministryofjustice/hmpps-forge/core/authoring'

export const formVersion = 'v1.0'

/**
 * Centralised data accessors for case data.
 * Use these throughout the form configuration so if paths change, we only update here.
 */
export const CaseData = {
  Forename: Data('caseData.name.forename'),
  ForenamePossessive: Data('caseData.name.forename').pipe(Transformer.String.Possessive()),
  Surname: Data('caseData.name.surname'),
}

const basePath = '/strengths-and-needs/v1.0'

export interface SectionNavItem {
  code: string
  text: string
  href: string
  statusKey: string
}

/**
 * Section navigation items for the MOJ side navigation.
 * Active state is derived in the template from the current section journey.
 */
export const sectionNavItems = [
  {
    code: 'accommodation',
    text: 'Accommodation',
    href: `${basePath}/accommodation/current-accommodation`,
    statusKey: 'accommodation_section_status'
  },
  {
    code: 'employment-and-education',
    text: 'Employment and education',
    href: `${basePath}/employment-and-education/current-employment?resume=true`,
    statusKey: 'employment_section_status'
  },
  {
    code: 'finances',
    text: 'Finances',
    href: `${basePath}/finances/finance`,
    statusKey: 'finances_section_status'
  },
  {
    code: 'drug-use',
    text: 'Drug use',
    href: `${basePath}/drug-use/drug-use`,
    statusKey: 'drugs_section_status'
  },
  {
    code: 'alcohol-use',
    text: 'Alcohol use',
    href: `${basePath}/alcohol-use/alcohol-use`,
    statusKey: 'alcohol_section_status'
  },
  {
    code: 'health-and-wellbeing',
    text: 'Health and wellbeing',
    href: `${basePath}/health-and-wellbeing/health-wellbeing?resume=true`,
    statusKey: 'health_section_status'
  },
  {
    code: 'personal-relationships-and-community',
    text: 'Personal relationships and community',
    href: `${basePath}/personal-relationships-and-community/personal-relationships`,
    statusKey: 'relationship_section_status'
  },
  {
    code: 'thinking-behaviours-and-attitudes',
    text: 'Thinking, behaviours and attitudes',
    href: `${basePath}/thinking-behaviours-and-attitudes/thinking-behaviours`,
    statusKey: 'thinking_behaviour_section_status'
  },
  {
    code: 'offence-analysis',
    text: 'Offence analysis',
    href: `${basePath}/offence-analysis/offence-analysis`,
    statusKey: 'offences_section_status'
  },
] satisfies SectionNavItem[]
