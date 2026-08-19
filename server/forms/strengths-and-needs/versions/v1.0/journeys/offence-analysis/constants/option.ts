export const Option = {
  // Offence elements
  arson: 'ARSON',
  domestic_abuse: 'DOMESTIC_ABUSE',
  excessive_violence_sadistic: 'EXCESSIVE_VIOLENCE_SADISTIC',
  hatred_identifiable_groups: 'HATRED_IDENTIFIABLE_GROUPS',
  physical_damage_property: 'PHYSICAL_DAMAGE_PROPERTY',
  sexual_element: 'SEXUAL_ELEMENT',
  victim_targeted: 'VICTIM_TARGETED',
  violence_threat_coercion: 'VIOLENCE_THREAT_COERCION',
  weapon: 'WEAPON',
  none: 'NONE',

  // Motivations
  addictions_perceived_needs: 'ADDICTIONS_PERCEIVED_NEEDS',
  pressurised_led_by_others: 'PRESSURISED_LED_BY_OTHERS',
  emotional_state_christy: 'EMOTIONAL_STATE_CHRISTY',
  financial_motivation: 'FINANCIAL_MOTIVATION',
  seeking_exerting_power: 'SEEKING_EXERTING_POWER',
  sexual_motivation: 'SEXUAL_MOTIVATION',
  thrill_seeking: 'THRILL_SEEKING',

  // Offence commited against
  one_or_more_people: 'ONE_OR_MORE_PEOPLE',

  // Victim demographics
  stranger: 'STRANGER',
  criminal_justice_staff: 'CRIMINAL_JUSTICE_STAFF',
  parent_or_step_parent: 'PARENT_OR_STEP_PARENT',
  partner: 'PARTNER',
  ex_partner: 'EX_PARTNER',
  child_or_step_child: 'CHILD_OR_STEP_CHILD',
  other_family_member: 'OTHER_FAMILY_MEMBER',

  // Victim age
  age_0_to_4: 'AGE_0_TO_4',
  age_5_to_11: 'AGE_5_TO_11',
  age_12_to_15: 'AGE_12_TO_15',
  age_16_to_17: 'AGE_16_TO_17',
  age_18_to_20: 'AGE_18_TO_20',
  age_21_to_25: 'AGE_21_TO_25',
  age_26_to_49: 'AGE_26_TO_49',
  age_50_to_64: 'AGE_50_TO_64',
  age_65_and_over: 'AGE_65_AND_OVER',
  age_unknown: 'AGE_UNKNOWN',

  // Victim sex
  male: 'MALE',
  female: 'FEMALE',
  intersex: 'INTERSEX',
  sex_unknown: 'SEX_UNKNOWN',

  // Victim ethnicity
  white_irish: 'WHITE_IRISH',
  white_english_welsh_scottish_northern_irish_or_british: 'WHITE_ENGLISH_WELSH_SCOTTISH_NORTHERN_IRISH_OR_BRITISH',
  white_gypsy_or_irish_traveller: 'WHITE_GYPSY_OR_IRISH_TRAVELLER',
  white_roma: 'WHITE_ROMA',
  white_any_other_white_background: 'WHITE_ANY_OTHER_WHITE_BACKGROUND',
  mixed_any_other_mixed_or_multiple_ethnic_background_background:
    'MIXED_ANY_OTHER_MIXED_OR_MULTIPLE_ETHNIC_BACKGROUND_BACKGROUND',
  mixed_white_and_black_caribbean: 'MIXED_WHITE_AND_BLACK_CARIBBEAN',
  mixed_white_and_black_african: 'MIXED_WHITE_AND_BLACK_AFRICAN',
  mixed_white_and_asian: 'MIXED_WHITE_AND_ASIAN',
  mixed_any_other_mixed_or_multiple_ethnic_background: 'MIXED_ANY_OTHER_MIXED_OR_MULTIPLE_ETHNIC_BACKGROUND',
  asian_or_asian_british_indian: 'ASIAN_OR_ASIAN_BRITISH_INDIAN',
  asian_or_asian_british_pakistani: 'ASIAN_OR_ASIAN_BRITISH_PAKISTANI',
  asian_or_asian_british_bangladeshi: 'ASIAN_OR_ASIAN_BRITISH_BANGLADESHI',
  asian_or_asian_british_chinese: 'ASIAN_OR_ASIAN_BRITISH_CHINESE',
  asian_or_asian_british_any_other_asian_background: 'ASIAN_OR_ASIAN_BRITISH_ANY_OTHER_ASIAN_BACKGROUND',
  black_or_black_british_caribbean: 'BLACK_OR_BLACK_BRITISH_CARIBBEAN',
  black_or_black_british_african: 'BLACK_OR_BLACK_BRITISH_AFRICAN',
  black_or_black_british_any_other_black_background: 'BLACK_OR_BLACK_BRITISH_ANY_OTHER_BLACK_BACKGROUND',
  arab: 'ARAB',
  any_other_ethnic_group: 'ANY_OTHER_ETHNIC_GROUP',

  // Involved parties
  one: 'ONE',
  two: 'TWO',
  three: 'THREE',
  four: 'FOUR',
  five: 'FIVE',
  six_to_ten: 'SIX_TO_10',
  eleven_to_fifteen: 'ELEVEN_TO_15',
  more_than_fifteen: 'MORE_THAN_15',

  // Domestic abuse type
  family_member: 'FAMILY_MEMBER',
  intimate_partner: 'INTIMATE_PARTNER',
  family_member_and_intimate_partner: 'FAMILY_MEMBER_AND_INTIMATE_PARTNER',

} as const
