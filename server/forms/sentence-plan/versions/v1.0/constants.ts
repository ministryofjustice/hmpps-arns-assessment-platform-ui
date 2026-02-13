import { Data } from '@form-engine/form/builders'
import { Transformer } from '@form-engine/registry/transformers'
import { CriminogenicNeedsData } from '../../../../interfaces/coordinator-api/entityAssessment'

/**
 * Centralised data accessors for case data.
 * Use these throughout the form configuration so if paths change, we only update here.
 */
export const CaseData = {
  Forename: Data('caseData.name.forename'),
  ForenamePossessive: Data('caseData.name.forename').pipe(Transformer.String.Possessive()),
  Surname: Data('caseData.name.surname'),
}

/**
 * Canonical plan overview URL.
 */
export const sentencePlanOverviewPath = '/sentence-plan/v1.0/plan/overview'

/**
 * Actor enum values to human-readable labels.
 * Note: 'person_on_probation' is handled specially using the person's name.
 */
export const actorLabels: Record<string, string> = {
  probation_practitioner: 'Probation practitioner',
  prison_offender_manager: 'Prison offender manager',
  programme_staff: 'Programme staff',
  partnership_agency: 'Partnership agency',
  crs_provider: 'Commissioned rehabilitative services (CRS) provider',
  someone_else: 'Someone else',
}

export const actorLabelOptions = [
  { value: '', text: 'Choose someone' },
  { value: 'person_on_probation', text: CaseData.Forename },
  ...Object.entries(actorLabels).map(([value, text]) => ({ value, text })),
]

/**
 * Unified configuration for areas of need.
 *
 * Combines form display properties with API mapping configuration:
 * - slug: URL route parameter (e.g., 'accommodation')
 * - text: Display label (e.g., 'Accommodation')
 * - value: Form field value (e.g., 'area_accommodation')
 * - crimNeedsKey: Key for CriminogenicNeedsData from handover/coordinator APIs
 * - assessmentKey: Key prefix for OASys equivalent fields from coordinator API
 * - handoverPrefix: Prefix for handover API field names (e.g., 'acc' → accLinkedToHarm)
 * - upperBound: Maximum possible score for the area (null for areas without scoring)
 * - threshold: Score above which an area is considered "high scoring" (null for areas without scoring)
 * - goals: Suggested goal templates for practitioners
 */
export const areasOfNeed = [
  {
    slug: 'accommodation',
    text: 'Accommodation',
    value: 'area_accommodation',
    crimNeedsKey: 'accommodation' as keyof CriminogenicNeedsData,
    assessmentKey: 'accommodation',
    handoverPrefix: 'acc',
    upperBound: 6 as number | null,
    threshold: 1 as number | null,
    goals: [
      'I will maintain my current accommodation so that [add why]',
      'I will find accommodation that is more suitable for me because [add why]',
      "I will reduce how much rent I owe ('arrears'), so that [add why]",
      'I will comply with the conditions of my tenancy agreement',
      'I will work towards finding accommodation, so that I am no longer homeless',
    ],
  },
  {
    slug: 'employment-and-education',
    text: 'Employment and education',
    value: 'area_employment_and_education',
    crimNeedsKey: 'educationTrainingEmployability' as keyof CriminogenicNeedsData,
    assessmentKey: 'employment_education',
    handoverPrefix: 'ete',
    upperBound: 4 as number | null,
    threshold: 1 as number | null,
    goals: [
      'I will look to improve my confidence which will help me when looking for a job',
      'I will improve my skills in [add skill area] to help me find a better job',
      'I will find a job, so that [add why]',
      'I will complete [add course or qualification]',
    ],
  },
  {
    slug: 'finances',
    text: 'Finances',
    value: 'area_finances',
    crimNeedsKey: 'finance' as keyof CriminogenicNeedsData,
    assessmentKey: 'finance',
    handoverPrefix: 'finance',
    upperBound: null as number | null,
    threshold: null as number | null,
    goals: [
      'I will reduce my current debt from [a number] to [a number]',
      'I will find new ways to budget my money and keep to my income',
      'I will reduce my [court fines, debts or bills] by [add amount], so that I can improve my finances',
      'I will reduce my gambling by [number of days/financial amount]',
      'I will continue to reduce my gambling so that [add why]',
    ],
  },
  {
    slug: 'drug-use',
    text: 'Drug use',
    value: 'area_drug_use',
    crimNeedsKey: 'drugMisuse' as keyof CriminogenicNeedsData,
    assessmentKey: 'drug_use',
    handoverPrefix: 'drug',
    upperBound: 8 as number | null,
    threshold: 0 as number | null,
    goals: [
      'I will increase the number of days I am drug-free each week from [number of days] to [number of days]',
      'I will continue to [add activity or behaviour] to help me stay drug free',
      'I will improve my understanding of why I use drugs when [add reasons for drug use]',
      'I will reduce my methadone script, so that [add why]',
      'I will reduce my Subutex script, so that [add why]',
      'I will improve my knowledge about safe driving and how drugs affect my body while driving',
    ],
  },
  {
    slug: 'alcohol-use',
    text: 'Alcohol use',
    value: 'area_alcohol_use',
    crimNeedsKey: 'alcoholMisuse' as keyof CriminogenicNeedsData,
    assessmentKey: 'alcohol_use',
    handoverPrefix: 'alcohol',
    upperBound: 4 as number | null,
    threshold: 1 as number | null,
    goals: [
      'I will become alcohol-free, so that [add why]',
      'I will continue to be alcohol-free, so that [add why]',
      'I will reduce the number of days I drink alcohol each week from [number of days] to [number of days]',
      'I will improve my knowledge about safe driving and the effects of alcohol on driving',
      'I will improve my understanding of how drinking alcohol affects my body and behaviour',
    ],
  },
  {
    slug: 'health-and-wellbeing',
    text: 'Health and wellbeing',
    value: 'area_health_and_wellbeing',
    crimNeedsKey: 'healthAndWellbeing' as keyof CriminogenicNeedsData,
    assessmentKey: 'health_wellbeing',
    handoverPrefix: 'emo',
    upperBound: null as number | null,
    threshold: null as number | null,
    goals: [
      'I will learn/find new ways to manage my emotions better so that I can improve my overall wellbeing',
      'I will set aside [add minutes or hours] each week for exercise to help reduce stress and improve my overall wellbeing',
      'I will improve my mental health, so that [add why]',
      'I will improve my physical health, so that [add why]',
      'I will prioritise my wellbeing, so that [add why]',
      'I will improve recognising my emotions, so that I can understand my behaviour better',
      'I will work to better understand my past experiences, so that I can manage my emotions in a safer way',
    ],
  },
  {
    slug: 'personal-relationships-and-community',
    text: 'Personal relationships and community',
    value: 'area_personal_relationships_and_community',
    crimNeedsKey: 'personalRelationshipsAndCommunity' as keyof CriminogenicNeedsData,
    assessmentKey: 'personal_relationships_community',
    handoverPrefix: 'rel',
    upperBound: 6 as number | null,
    threshold: 1 as number | null,
    goals: [
      "I will engage with Children's Services as part of my Children in Need (CIN)/Child Protection (CP) plan, so that I can have a better relationship with my children ",
      "I will continue to engage with Children's Services as part of my Child Protection (CP) plan, so that I can have a better relationship with my children",
      "I will better understand my [partner's, family's, children's, or friends'] needs to help me communicate with them better in a healthy way",
      'I will be a more helpful and supportive [neighbour, partner, mother, father, or friend]',
      'I will identify and address areas of my behaviour I need to improve, so that I have a healthier relationship with my [partner, family, friends or children]',
      'I will gain skills and experience through my [add unpaid work project]',
      'I will [repay or help] my local community through my [add unpaid work project]',
      'I will improve my parenting skills, so that I can work towards [regaining contact with or getting access to] my children',
    ],
  },
  {
    slug: 'thinking-behaviours-and-attitudes',
    text: 'Thinking, behaviours and attitudes',
    value: 'area_thinking_behaviours_and_attitudes',
    crimNeedsKey: 'thinkingBehaviourAndAttitudes' as keyof CriminogenicNeedsData,
    assessmentKey: 'thinking_behaviours_attitudes',
    handoverPrefix: 'think',
    upperBound: 10 as number | null,
    threshold: 2 as number | null,
    goals: [
      'I will understand my own values to give me a better sense of purpose and motivation to achieve my goals',
      'I will learn more about what I enjoy and find things I can spend quality time doing, so that [add why]',
      'I will attend and participate in [add intervention], so that [add why]',
      'I will better understand the impact of my actions when I [add behaviour] and how this makes [others, my family, my partner, or my friends] feel',
      'I will identify people I can talk to when I have a problem, so they can help me deal with it in a positive way',
      'I will follow my [add licence conditions, curfew or exclusion zone]',
    ],
  },
]

export const areaOfNeedSlugs = areasOfNeed.map(a => a.slug)

export type AreaOfNeedSlug = (typeof areaOfNeedSlugs)[number]

export const defaultAreaOfNeed: AreaOfNeedSlug = 'accommodation'
