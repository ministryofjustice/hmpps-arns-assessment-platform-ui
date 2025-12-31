import { Data } from '@form-engine/form/builders'
import { AreaOfNeedSlug } from './effects/types'

/**
 * Centralised data accessors for case data.
 * Use these throughout the form configuration so if paths change, we only update here.
 */
export const CaseData = {
  Forename: Data('caseData.name.forename'),
  Surname: Data('caseData.name.surname'),
}

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

export const areasOfNeed = [
  {
    slug: 'accommodation',
    text: 'Accommodation',
    value: 'area_accommodation',
    goals: [
      'I will maintain my current accommodation by [add how]',
      'I will find accommodation that is more suitable for me because [add why]',
      "I will reduce how much rent I owe ('arrears'), so that [add why]",
      'I will comply with the conditions of my tenancy agreement',
    ],
  },
  {
    slug: 'employment-and-education',
    text: 'Employment and education',
    value: 'area_employment_and_education',
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
    goals: [
      'I will reduce my current debt from [a number] to [a number]',
      'I will find new ways to budget my money and keep to my income',
      'I will reduce my [court fines, debts or bills] by [add amount], so that I can improve my finances',
      'I will identify new ways that can help me reduce my gambling',
      'I will continue to reduce my gambling by [add behaviour or activity]',
    ],
  },
  {
    slug: 'drug-use',
    text: 'Drug use',
    value: 'area_drug_use',
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
    goals: [
      'I will work towards being alcohol-free, so that [add why]',
      'I will continue to [add activity or behaviour] to help me stay alcohol free',
      'I will reduce the number of days I drink alcohol each week from [number of days] to [number of days]',
      'I will improve my knowledge about safe driving and the effects of alcohol on driving',
      'I will improve my understanding of how drinking alcohol affects my body and behaviour',
    ],
  },
  {
    slug: 'health-and-wellbeing',
    text: 'Health and wellbeing',
    value: 'area_health_and_wellbeing',
    goals: [
      'I will manage my emotions better by [add how], so that I can improve my overall wellbeing',
      'I will set aside [add minutes or hours] each week for exercise to help reduce stress and improve my overall wellbeing',
      'I will improve my mental health, so that [add why]',
      'I will improve my physical health, so that [add why]',
      'I will prioritise my wellbeing, so that [add why]',
      'I will improve how I recognise what emotions I am feeling, so that I can understand my behaviour better',
      'I will get support from [add partner agency or organisation] to help me understand my past experiences and how I can manage my emotions in a safer way',
    ],
  },
  {
    slug: 'personal-relationships-and-community',
    text: 'Personal relationships and community',
    value: 'area_personal_relationships_and_community',
    goals: [
      "I will continue to engage with Children's Services as part of my Children in Need (CIN) plan, so that I can have a better relationship with my children",
      "I will continue to engage with Children's Services as part of my Child Protection (CP) plan, so that I can have a better relationship with my children",
      "I will better understand my [partner's, family's, children's, or friends'] needs to help me communicate with them better in a healthy way",
      'I will be a more helpful and supportive [neighbour, partner, mother, father, or friend]',
      'I will identify areas of my behaviour I need to improve, so that I have a healthier relationship with my [partner, family, friends or children]',
      'I will gain skills and experience through my [add unpaid work project]',
      'I will [repay or help] my local community through my [add unpaid work project]',
      'I will improve my parenting skills, so that I can work towards [regaining contact with or getting access to] my children',
    ],
  },
  {
    slug: 'thinking-behaviours-and-attitudes',
    text: 'Thinking, behaviours and attitudes',
    value: 'area_thinking_behaviours_and_attitudes',
    goals: [
      'I will understand my own values to give me a better sense of purpose and motivation to achieve my goals',
      'I will learn more about what I enjoy and find things I can spend quality time doing, so that [add why]',
      'I will attend and participate in [add accredited programme, structure intervention or toolkit], so that [add why]',
      'I will better understand the impact of my actions when I [add behaviour] and how this makes [others, my family, my partner, or my friends] feel',
      'I will identify people I can talk to when I have a problem, so they can help me deal with it in a positive way',
      'I will follow my [add licence conditions, curfew or exclusion zone]',
    ],
  },
]

export const areaOfNeedSlugs = areasOfNeed.map(a => a.slug)

export const defaultAreaOfNeed: AreaOfNeedSlug = 'accommodation'
