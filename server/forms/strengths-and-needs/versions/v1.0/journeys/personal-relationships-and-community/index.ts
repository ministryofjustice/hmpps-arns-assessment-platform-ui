import { Condition, Data, journey, Query } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Section } from '../../constants/section'
import { commonContentFor } from '../../locales'
import { personalRelationshipsChildrenInformationStep } from './steps/personal-relationships-children-information/step'

// Personal relationships and community journey
// Flow:
// 1. personal_relationships_children_information >
// 2. personal_relationships >
// 3. personal-relationships-community >
// 4. personal-relationships-community-summary >
// 5. personal-relationships-community-analysis

export const personalRelationshipsJourney = journey({
  code: Section.personal_relationships_and_community.code,
  title: 'Personal relationships and community',
  path: Section.personal_relationships_and_community.path,
  reachability: { resumeWhen: Query('resume').match(Condition.Equals('true')) },
  view: {
    locals: {
      sectionTitle: commonContentFor('sectionTitle.personal-relationships-and-community'),
      sectionStatus: Data(Section.personal_relationships_and_community.statusKey),
    },
  },
  steps: [personalRelationshipsChildrenInformationStep],
})
