export const Option = {
  // Q: Are there any children in [subject]'s life?
  yes_children_living_with_pop: 'YES_CHILDREN_LIVING_WITH_POP',
  yes_children_not_living_with_pop: 'YES_CHILDREN_NOT_LIVING_WITH_POP',
  yes_children_visiting: 'YES_CHILDREN_VISITING',
  no_children: 'NO_CHILDREN',

  // Q: Who are the important people in [subject]'s life?
  partner_intimate_relationship: 'PARTNER_INTIMATE_RELATIONSHIP',
  child_parental_responsibilities: 'CHILD_PARENTAL_RESPONSIBILITIES',
  other_children: 'OTHER_CHILDREN',
  family: 'FAMILY',
  friends: 'FRIENDS',
  other: 'OTHER',

  // Q: Is [subject] happy with their current relationship status?
  happy_relationship: 'HAPPY_RELATIONSHIP',
  concerns_happy_relationship: 'CONCERNS_HAPPY_RELATIONSHIP',
  unhappy_relationship: 'UNHAPPY_RELATIONSHIP',

  // Q: What is [subject]'s history of intimate relationships?
  stable_relationships: 'STABLE_RELATIONSHIPS',
  positive_and_negative_relationships: 'POSITIVE_AND_NEGATIVE_RELATIONSHIPS',
  unstable_relationships: 'UNSTABLE_RELATIONSHIPS',

  // Q: Is [subject] able to manage their parenting responsibilities?
  // YES, NO, UNKNOWN from CommonOption
  sometimes: 'SOMETIMES',

  // Q: What is [subject]'s current relationship like with their family?
  // UNKNOWN from CommonOption
  stable_relationship: 'STABLE_RELATIONSHIP',
  mixed_relationship: 'MIXED_RELATIONSHIP',
  unstable_relationship: 'UNSTABLE_RELATIONSHIP',

  // Q: What was [subject]'s experience of their childhood?
  positive_childhood: 'POSITIVE_CHILDHOOD',
  mixed_childhood: 'MIXED_CHILDHOOD',
  negative_childhood: 'NEGATIVE_CHILDHOOD',

  // Q: Did [subject] have any childhood behavioural problems?
  // YES, NO from CommonOption

  // Q: Is [subject] part of any groups or communities that gives them a sense of belonging? (optional)
  // Textarea, no options

  // Q: Is [subject] able to resolve any challenges in their intimate relationships?
  // Textarea, no options

  // Q: Does [subject] want to make changes to their personal relationships and community?
  // All options from CommonOption
} as const
