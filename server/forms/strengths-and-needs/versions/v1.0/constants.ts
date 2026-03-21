import { Data } from '@form-engine/form/builders'
import { Transformer } from '@form-engine/registry/transformers'

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
  },
  {
    code: 'employment-and-education',
    text: 'Employment and education',
    href: `${basePath}/employment-and-education/employment-status`,
  },
  {
    code: 'finances',
    text: 'Finances',
    href: `${basePath}/finances/finance`,
  },
  {
    code: 'drug-use',
    text: 'Drug use',
    href: `${basePath}/drug-use/drug-use`,
  },
  {
    code: 'alcohol-use',
    text: 'Alcohol use',
    href: `${basePath}/alcohol-use/alcohol-use`,
  },
  {
    code: 'health-and-wellbeing',
    text: 'Health and wellbeing',
    href: `${basePath}/health-and-wellbeing/physical-health`,
  },
  {
    code: 'personal-relationships-and-community',
    text: 'Personal relationships and community',
    href: `${basePath}/personal-relationships-and-community/personal-relationships`,
  },
  {
    code: 'thinking-behaviours-and-attitudes',
    text: 'Thinking, behaviours and attitudes',
    href: `${basePath}/thinking-behaviours-and-attitudes/thinking-behaviours`,
  },
  {
    code: 'offence-analysis',
    text: 'Offence analysis',
    href: `${basePath}/offence-analysis/offence-analysis`,
  },
] satisfies SectionNavItem[]
