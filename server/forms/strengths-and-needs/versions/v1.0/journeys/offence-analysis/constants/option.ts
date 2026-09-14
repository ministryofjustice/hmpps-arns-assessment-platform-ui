export const Option = {
  // Offence elements
  arson: 'ARSON',
  domestic_abuse: 'DOMESTIC_ABUSE',
  excessive_or_sadistic_violence: 'EXCESSIVE_OR_SADISTIC_VIOLENCE',
  hatred_of_identifiable_groups: 'HATRED_OF_IDENTIFIABLE_GROUPS',
  physical_damage_to_property: 'PHYSICAL_DAMAGE_TO_PROPERTY',
  sexual_element: 'SEXUAL_ELEMENT',
  victim_targeted: 'VICTIM_TARGETED',
  violence_or_coercion: 'VIOLENCE_OR_COERCION',
  weapon: 'WEAPON',

  // Motivations
  addictions_or_perceived_needs: 'ADDICTIONS_OR_PERCEIVED_NEEDS',
  pressurised_by_others: 'PRESSURISED_BY_OTHERS',
  emotional_state: 'EMOTIONAL_STATE',
  financial_motivation: 'FINANCIAL_MOTIVATION',
  seeking_or_exerting_power: 'SEEKING_OR_EXERTING_POWER',
  sexual_motivation: 'SEXUAL_MOTIVATION',
  thrill_seeking: 'THRILL_SEEKING',

  // Offence commited against
  one_or_more_person: 'ONE_OR_MORE_PERSON',

  // Victim demographics
  stranger: 'STRANGER',
  criminal_justice_staff: 'CRIMINAL_JUSTICE_STAFF',
  pop_parent_or_step_parent: 'POP_PARENT_OR_STEP_PARENT',
  pop_partner: 'POP_PARTNER',
  pop_ex_partner: 'POP_EX_PARTNER',
  pop_child_or_step_child: 'POP_CHILD_OR_STEP_CHILD',
  other_family_member: 'OTHER_FAMILY_MEMBER',

  // Victim age
  age_0_to_4_years: 'AGE_0_TO_4_YEARS',
  age_5_to_11_years: 'AGE_5_TO_11_YEARS',
  age_12_to_15_years: 'AGE_12_TO_15_YEARS',
  age_16_to_17_years: 'AGE_16_TO_17_YEARS',
  age_18_to_20_years: 'AGE_18_TO_20_YEARS',
  age_21_to_25_years: 'AGE_21_TO_25_YEARS',
  age_26_to_49_years: 'AGE_26_TO_49_YEARS',
  age_50_to_64_years: 'AGE_50_TO_64_YEARS',
  age_65_and_over: 'AGE_65_AND_OVER',

  // Victim sex
  male: 'MALE',
  female: 'FEMALE',
  intersex: 'INTERSEX',

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
