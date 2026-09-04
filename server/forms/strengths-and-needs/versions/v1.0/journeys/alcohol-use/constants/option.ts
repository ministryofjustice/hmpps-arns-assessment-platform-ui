export const Option = {
  // alcohol_use
  yes_within_last_three_months: 'YES_WITHIN_LAST_THREE_MONTHS',
  yes_not_in_last_three_months: 'YES_NOT_IN_LAST_THREE_MONTHS',

  // alcohol_frequency
  once_a_month_or_less: 'ONCE_A_MONTH_OR_LESS',
  multiple_times_a_month: 'MULTIPLE_TIMES_A_MONTH',
  less_than_4_times_a_week: 'LESS_THAN_4_TIMES_A_WEEK',
  more_than_4_times_a_week: 'MORE_THAN_4_TIMES_A_WEEK',

  // alcohol_units
  units_1_to_2: 'UNITS_1_TO_2',
  units_3_to_4: 'UNITS_3_TO_4',
  units_5_to_6: 'UNITS_5_TO_6',
  units_7_to_9: 'UNITS_7_TO_9',
  units_10_or_more: 'UNITS_10_OR_MORE',

  // alcohol_binge_drinking_frequency
  less_than_a_month: 'LESS_THAN_A_MONTH',
  monthly: 'MONTHLY',
  weekly: 'WEEKLY',
  daily: 'DAILY',

  // alcohol_evidence_of_excess_drinking
  no_evidence: 'NO_EVIDENCE',
  yes_with_some_evidence: 'YES_WITH_SOME_EVIDENCE',
  yes_with_evidence: 'YES_WITH_EVIDENCE',

  // alcohol_reasons_for_use
  cultural_or_religious: 'CULTURAL_OR_RELIGIOUS',
  curiosity_or_experimentation: 'CURIOSITY_OR_EXPERIMENTATION',
  enjoyment: 'ENJOYMENT',
  managing_emotional_issues: 'MANAGING_EMOTIONAL_ISSUES',
  special_occasions: 'SPECIAL_OCCASIONS',
  peer_pressure: 'PEER_PRESSURE',
  self_medication: 'SELF_MEDICATION',
  social: 'SOCIAL',

  // alcohol_impact_of_use
  behavioural: 'BEHAVIOURAL',
  community: 'COMMUNITY',
  finances: 'FINANCES',
  links_to_reoffending: 'LINKS_TO_REOFFENDING',
  physical_or_mental_health: 'PHYSICAL_OR_MENTAL_HEALTH',
  relationships: 'RELATIONSHIPS',
  no_negative_impact: 'NO_NEGATIVE_IMPACT',
} as const
