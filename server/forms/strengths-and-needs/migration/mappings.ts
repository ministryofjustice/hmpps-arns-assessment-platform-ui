export const v1toV2Mappings: Record<string, string | undefined> = {
  // Accommodation (renamed)
  current_accommodation: 'community_current_accommodation',
  suitable_housing_location_concerns_other_details: 'community_suitable_housing_location_concerns_other_details',
  suitable_housing_location_concerns: 'community_suitable_housing_location_concerns',
  suitable_housing_location: 'community_suitable_housing_location',
  suitable_housing_concerns_other_details: 'community_suitable_housing_concerns_other_details',
  suitable_housing_concerns: 'community_suitable_housing_concerns',
  unsuitable_housing_concerns_other_details: 'community_unsuitable_housing_concerns_other_details',
  unsuitable_housing_concerns: 'community_unsuitable_housing_concerns',
  suitable_housing: 'community_suitable_housing',
  no_accommodation_reason_other_details: 'community_no_accommodation_reason_other_details',
  no_accommodation_reason: 'community_no_accommodation_reason',

  // Employment & Education (renamed)
  employment_status: 'community_employment_status',
  employment_other_responsibilities: 'community_employment_other_responsibilities',
  employment_history: 'community_employment_history',
  employment_history_stable_details: 'community_employment_history_stable_details',
  employment_history_periods_of_instability_details: 'community_employment_history_periods_of_instability_details',
  employment_history_unstable_details: 'community_employment_history_unstable_details',
  employment_other_responsibilities_carer_details: 'community_employment_other_responsibilities_carer_details',
  employment_other_responsibilities_volunteer_details: 'community_employment_other_responsibilities_volunteer_details',
  employment_other_responsibilities_other_details: 'community_employment_other_responsibilities_other_details',
  employment_other_responsibilities_child_details: 'community_employment_other_responsibilities_child_details',

  // Not in v2 (excluded)
  short_term_accommodation_end_date: undefined,
  type_of_temporary_accommodation: undefined,
  approved_premises_end_date: undefined,
  cas2_end_date: undefined,
  cas3_end_date: undefined,
  immigration_accommodation_end_date: undefined,
  type_of_settled_accommodation: undefined,
  type_of_no_accommodation: undefined,
  living_with_partner_details: undefined,
  living_with_other_details: undefined,
  living_with: undefined,
  future_accommodation_type_awaiting_assessment_details: undefined,
  future_accommodation_type_awaiting_placement_details: undefined,
  future_accommodation_type_other_details: undefined,
  future_accommodation_type: undefined,
  suitable_housing_planned: undefined,
  past_accommodation_details: undefined,
  alcohol_use: undefined,
  alcohol_frequency: undefined,
  alcohol_units: undefined,
  alcohol_binge_drinking: undefined,
  alcohol_binge_drinking_frequency: undefined,
  alcohol_reasons_for_use: undefined,
  alcohol_reasons_for_use_other_details: undefined,
  alcohol_impact_of_use: undefined,
  alcohol_impact_of_use_other_details: undefined,
  employment_type: undefined,
  has_been_employed: undefined,
  employment_area: undefined,
  employment_history_unknown_details: undefined,
  education_experience: undefined,
  education_experience_negative_details: undefined,
  education_experience_mostly_negative_details: undefined,
  education_experience_positive_and_negative_details: undefined,
  education_experience_mostly_positive_details: undefined,
  education_experience_positive_details: undefined,
  employment_experience: undefined,
  employment_experience_negative_details: undefined,
  employment_experience_mostly_negative_details: undefined,
  employment_experience_positive_and_negative_details: undefined,
  employment_experience_mostly_positive_details: undefined,
  employment_experience_positive_details: undefined,
  education_professional_or_vocational_qualifications: undefined,
  education_professional_or_vocational_qualifications_yes_details: undefined,
  education_highest_level_completed: undefined,
  health_wellbeing_prescribed_medication_physical_conditions: undefined,
  health_wellbeing_prescribed_medication_mental_conditions: undefined,
  health_wellbeing_head_injury_or_illness: undefined,
  health_wellbeing_neurodiverse_conditions_yes_details: undefined,
  health_wellbeing_neurodiverse_conditions: undefined,
  health_wellbeing_outlook: undefined,
  health_wellbeing_positive_factors_other_details: undefined,
  health_wellbeing_positive_factors: undefined,
  offence_analysis_perpetrator_of_domestic_abuse: undefined,
  offence_analysis_perpetrator_of_domestic_abuse_type: undefined,
  offence_analysis_perpetrator_of_domestic_abuse_type_family_member_details: undefined,
  offence_analysis_perpetrator_of_domestic_abuse_type_intimate_partner_details: undefined,
  offence_analysis_perpetrator_of_domestic_abuse_type_family_member_and_intimate_partner_details: undefined,
  offence_analysis_victim_of_domestic_abuse: undefined,
  offence_analysis_victim_of_domestic_abuse_type: undefined,
  offence_analysis_victim_of_domestic_abuse_type_family_member_details: undefined,
  offence_analysis_victim_of_domestic_abuse_type_intimate_partner_details: undefined,
  offence_analysis_victim_of_domestic_abuse_type_family_member_and_intimate_partner_details: undefined,
  personal_relationships_community_important_people: undefined,
  personal_relationships_community_important_people_partner_intimate_relationship_details: undefined,
  personal_relationships_community_important_people_child_parental_responsibilities_details: undefined,
  personal_relationships_community_important_people_other_children_details: undefined,
  personal_relationships_community_important_people_family_details: undefined,
  personal_relationships_community_important_people_friends_details: undefined,
  personal_relationships_community_important_people_other_details: undefined,
  personal_relationships_community_challenges_intimate_relationship: undefined,
  thinking_behaviours_attitudes_positive_attitude: undefined,
}

export function previousToNextVersionTransform(answers: Record<string, unknown>): Record<string, unknown> {
  const mappedAnswers: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(answers)) {
    if (Object.hasOwn(v1toV2Mappings, key)) {
      const mappedKey = v1toV2Mappings[key]
      if (mappedKey) {
        mappedAnswers[mappedKey] = value
      }
    } else {
      mappedAnswers[key] = value
    }
  }
  return mappedAnswers
}

export function compareVersions(maxUpliftVersion: string, formVersion: string): boolean {
  // Separate versions into its parts:
  // e.g. v1.2.4 -> [1,2,4] and v1.2.5 -> [1,2,5]
  // Compare arrays with each other and see which one is newer
  const maxUpliftVersionParts = maxUpliftVersion.replace(/^v/i, '').split('.').map(Number)
  const formVersionParts = formVersion.replace(/^v/i, '').split('.').map(Number)
  const maxLength = Math.max(maxUpliftVersionParts.length, formVersionParts.length)

  for (let i = 0; i < maxLength; i++) {
    const maxUpliftVersionPart = maxUpliftVersionParts[i] ?? 0
    const formVersionPart = formVersionParts[i] ?? 0
    if (maxUpliftVersionPart > formVersionPart) return false
    if (maxUpliftVersionPart < formVersionPart) return true
  }

  return true // Versions are equal so don't migrate
}
