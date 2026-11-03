import { expect, Page } from '@playwright/test'
import { Section, SectionComplete } from '@server/forms/strengths-and-needs/versions/v2.0/constants/section'
import { Question as AlcoholQuestion } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/alcohol-use/constants/question'
import { Question as AccommodationQuestion } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/question'
import { Question as HealthQuestion } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/health-wellbeing/constants/question'
import { Question as PersonalRelationshipsQuestion } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/personal-relationships-and-community/constants/question'
import { Question as ThinkingBehavioursQuestion } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/thinking-behaviours-and-attitudes/constants/question'
import { Question as EmploymentQuestion } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/question'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option as AccommodationOption } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/accommodation/constants/option'
import { Option as AlcoholOption } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/alcohol-use/constants/option'
import { Option as HealthOption } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/health-wellbeing/constants/option'
import { Option as PersonalRelationshipsOption } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/personal-relationships-and-community/constants/option'
import { Option as ThinkingBehavioursOption } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/thinking-behaviours-and-attitudes/constants/option'
import { Option as EmploymentOption } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/employment-and-education/constants/option'
import { details } from 'testUtils'
import {
  buildEditUrl,
  checkAccessibility,
  navigateToStrengthsAndNeeds,
  sanPageTitles,
  viewAllAnswers,
} from './sanUtils'
import { test, TargetService } from '../../support/fixtures'

type Answer = { question: string; value: string | string[] }

const accommodation: Answer[] = [
  { question: AccommodationQuestion.community_current_accommodation, value: CommonOption.yes },
  { question: AccommodationQuestion.community_current_accommodation_settled, value: CommonOption.yes },
  { question: AccommodationQuestion.community_suitable_housing_location, value: CommonOption.no },
  {
    question: AccommodationQuestion.community_suitable_housing_location_concerns,
    value: [AccommodationOption.criminal_associates, AccommodationOption.victimisation, CommonOption.other],
  },
  {
    question: AccommodationQuestion.community_suitable_housing_location_concerns_other_details,
    value: details('location concerns other'),
  },
  { question: AccommodationQuestion.community_suitable_housing, value: CommonOption.no },
  {
    question: AccommodationQuestion.community_suitable_housing_concerns,
    value: [AccommodationOption.facilities, AccommodationOption.overcrowding, CommonOption.other],
  },
  {
    question: AccommodationQuestion.community_suitable_housing_concerns_other_details,
    value: details('housing concerns other'),
  },
  { question: AccommodationQuestion.accommodation_changes, value: CommonOption.making_changes },
  {
    question: AccommodationQuestion.accommodation_changes_making_changes_details,
    value: details('actively making changings'),
  },

  {
    question: AccommodationQuestion.accommodation_practitioner_analysis_strengths_or_protective_factors,
    value: CommonOption.yes,
  },
  {
    question: AccommodationQuestion.accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details,
    value: details('accommodation strengths'),
  },
  { question: AccommodationQuestion.accommodation_practitioner_analysis_risk_of_serious_harm, value: CommonOption.no },
  {
    question: AccommodationQuestion.accommodation_practitioner_analysis_risk_of_serious_harm_no_details,
    value: details('no serious harm'),
  },
  { question: AccommodationQuestion.accommodation_practitioner_analysis_risk_of_reoffending, value: CommonOption.yes },
  {
    question: AccommodationQuestion.accommodation_practitioner_analysis_risk_of_reoffending_yes_details,
    value: details('reoffending risk'),
  },

  {
    question: AccommodationQuestion.accommodation_practitioner_analysis_strengths_or_protective_factors,
    value: CommonOption.yes,
  },
  {
    question: AccommodationQuestion.accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details,
    value: details('accommodation strengths'),
  },
  { question: AccommodationQuestion.accommodation_practitioner_analysis_risk_of_serious_harm, value: CommonOption.no },
  {
    question: AccommodationQuestion.accommodation_practitioner_analysis_risk_of_serious_harm_no_details,
    value: details('no serious harm'),
  },
  { question: AccommodationQuestion.accommodation_practitioner_analysis_risk_of_reoffending, value: CommonOption.yes },
  {
    question: AccommodationQuestion.accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details,
    value: details('reoffending risk'),
  },
]

const employment: Answer[] = [
  { question: EmploymentQuestion.community_employment_status, value: EmploymentOption.employed_or_self_employed },
  { question: EmploymentQuestion.employment_history, value: EmploymentOption.stable },
  { question: EmploymentQuestion.employment_history_stable_details, value: details('Stable employment details') },
  {
    question: EmploymentQuestion.community_employment_other_responsibilities,
    value: [EmploymentOption.carer, EmploymentOption.child, CommonOption.other],
  },
  {
    question: EmploymentQuestion.employment_other_responsibilities_carer_details,
    value: details('Carer responsibilities details'),
  },
  {
    question: EmploymentQuestion.employment_other_responsibilities_child_details,
    value: details('Child responsibilities details'),
  },
  {
    question: EmploymentQuestion.employment_other_responsibilities_other_details,
    value: details('Other responsibilities details'),
  },
  { question: EmploymentQuestion.education_academic_professional_vocational_qualifications, value: CommonOption.yes },
  { question: EmploymentQuestion.education_transferable_skills, value: CommonOption.yes },
  {
    question: EmploymentQuestion.education_transferable_skills_yes_details,
    value: details('Transferable skills details'),
  },
  {
    question: EmploymentQuestion.education_difficulties,
    value: EmploymentOption.reading,
  },
  {
    question: EmploymentQuestion.education_difficulties_reading_severity,
    value: EmploymentOption.significant_difficulties,
  },
  {
    question: EmploymentQuestion.employment_education_changes,
    value: CommonOption.made_changes,
  },
  {
    question: EmploymentQuestion.employment_education_changes_made_changes_details,
    value: details('Made changes details'),
  },
  {
    question: EmploymentQuestion.employment_education_practitioner_analysis_strengths_or_protective_factors,
    value: CommonOption.no,
  },
  {
    question: EmploymentQuestion.employment_education_practitioner_analysis_strengths_or_protective_factors_no_details,
    value: details('no education strengths'),
  },
  {
    question: EmploymentQuestion.employment_education_practitioner_analysis_risk_of_serious_harm,
    value: CommonOption.yes,
  },
  {
    question: EmploymentQuestion.employment_education_practitioner_analysis_risk_of_serious_harm_yes_details,
    value: details('employment serious harm'),
  },
  {
    question: EmploymentQuestion.employment_education_practitioner_analysis_risk_of_reoffending,
    value: CommonOption.yes,
  },
  {
    question: EmploymentQuestion.employment_education_practitioner_analysis_risk_of_reoffending_yes_details,
    value: details('education reoffending'),
  },
]

// TODO Uncomment it during ACT-752 Finance framework
// const finance: Answer[] = [
//   { question: 'finance_income', value: ['EMPLOYMENT', 'FAMILY_OR_FRIENDS', 'OTHER'] },
//   // An optioned reveal inside a multi-select option.
//   { question: 'finance_income_family_or_friends_details', value: 'YES' },
//   { question: 'finance_income_other_details', value: details('other income') },
//   { question: 'finance_bank_account', value: 'NO' },
//   { question: 'finance_money_management', value: 'FAIRLY_BAD' },
//   { question: 'finance_money_management_fairly_bad_details', value: details('fairly bad with money') },
//   { question: 'finance_gambling', value: 'YES_THEIR_GAMBLING' },
//   { question: 'finance_gambling_yes_their_gambling_details', value: details('their gambling') },
//   // Two levels of reveal: radio -> checkbox -> details.
//   { question: 'finance_debt', value: 'YES_THEIR_DEBT' },
//   { question: 'yes_type_of_debt', value: ['DEBT_TO_OTHERS', 'FORMAL_DEBT'] },
//   { question: 'yes_type_of_debt_debt_to_others_details', value: details('debt to others') },
//   { question: 'yes_type_of_debt_formal_debt_details', value: details('formal debt') },
//   { question: 'finance_changes', value: 'THINKING_ABOUT_MAKING_CHANGES' },
//   { question: 'finance_changes_thinking_about_making_changes_details', value: details('thinking about it') },
//   // Analysis left deliberately partial.
//   { question: 'finance_strengths_protective_factors', value: 'NO' },
//   { question: 'finance_no_strengths_protective_factors_details', value: details('no finance strengths') },
// ]

// TODO Uncomment it during ACT-753 Drug framework
// const drugUse: Answer[] = [
//   { question: 'drug_use', value: 'YES' },
//   { question: 'select_misused_drugs', value: ['CANNABIS', 'COCAINE', 'HEROIN', 'OTHER'] },
//   { question: 'drug_last_used_cannabis', value: 'LAST_SIX' },
//   { question: 'drug_last_used_cocaine', value: 'LAST_SIX' },
//   // Used more than 6 months ago, so it is never asked when it was injected.
//   { question: 'drug_last_used_heroin', value: 'MORE_THAN_SIX' },
//   { question: 'other_drug_name', value: 'Ketamine' },
//   { question: 'drug_last_used_other', value: 'LAST_SIX' },
//   // Asked once per drug on a later step, so they read under the drug itself.
//   { question: 'how_often_used_last_six_months_cannabis', value: 'DAILY' },
//   { question: 'how_often_used_last_six_months_cannabis_details', value: details('cannabis frequency') },
//   { question: 'how_often_used_last_six_months_cocaine', value: 'OCCASIONALLY' },
//   { question: 'how_often_used_last_six_months_other', value: 'WEEKLY' },
//   { question: 'not_used_in_last_six_months_details', value: details('used more than six months ago') },
//   // Cocaine is injectable but not injected; heroin was, before the last 6 months.
//   { question: 'drugs_injected', value: ['HEROIN', 'OTHER'] },
//   { question: 'drugs_injected_other', value: ['LAST_SIX'] },
//   { question: 'drugs_is_receiving_treatment', value: 'YES' },
//   { question: 'drugs_is_receiving_treatment_yes_details', value: details('in treatment') },
//   { question: 'drugs_reasons_for_use', value: ['ESCAPISM_OR_AVOIDANCE', 'PEER_PRESSURE', 'OTHER'] },
//   { question: 'drugs_reasons_for_use_details', value: details('reasons for use') },
//   { question: 'drugs_affected_their_life', value: ['FINANCES', 'HEALTH', 'RELATIONSHIPS'] },
//   { question: 'drugs_affected_their_life_details', value: details('effect on life') },
//   { question: 'drugs_anything_helped_stop_or_reduce_use', value: details('what has helped') },
//   { question: 'drugs_what_could_help_not_use_drugs_in_future', value: details('what could help') },
//   { question: 'drug_use_changes', value: 'MAKING_CHANGES' },
//   { question: 'drug_use_changes_making_changes_details', value: details('making changes') },
//   { question: 'drugs_practitioner_analysis_motivated_to_stop', value: 'PARTIAL_MOTIVATION' },
//   { question: 'drug_use_practitioner_analysis_strengths_or_protective_factors', value: 'YES' },
//   {
//     question: 'drug_use_practitioner_analysis_strengths_or_protective_factors_yes_details',
//     value: details('drug strengths'),
//   },
//   { question: 'drug_use_practitioner_analysis_risk_of_serious_harm', value: 'YES' },
//   { question: 'drug_use_practitioner_analysis_risk_of_serious_harm_yes_details', value: details('drug serious harm') },
//   { question: 'drug_use_practitioner_analysis_risk_of_reoffending', value: 'YES' },
//   { question: 'drug_use_practitioner_analysis_risk_of_reoffending_yes_details', value: details('drug reoffending') },
// ]

const alcohol: Answer[] = [
  { question: AlcoholQuestion.alcohol_current_issues, value: AlcoholOption.significant },
  { question: AlcoholQuestion.alcohol_evidence_of_excess_drinking, value: AlcoholOption.yes_with_evidence },
  { question: AlcoholQuestion.alcohol_past_issues, value: CommonOption.yes },
  { question: AlcoholQuestion.alcohol_past_issues_yes_details, value: details('past alcohol issues') },
  { question: AlcoholQuestion.alcohol_stopped_or_reduced_past, value: CommonOption.yes },
  { question: AlcoholQuestion.alcohol_stopped_or_reduced_past_yes_details, value: details('has cut down before') },
  { question: AlcoholQuestion.alcohol_stopped_or_reduced, value: CommonOption.yes },
  { question: AlcoholQuestion.alcohol_stopped_or_reduced_yes_details, value: details('has cut down before') },
  { question: AlcoholQuestion.alcohol_use_changes, value: CommonOption.does_not_want_to_make_changes },
  {
    question: AlcoholQuestion.alcohol_use_changes_does_not_want_to_make_changes_details,
    value: details('does not want to change'),
  },
  {
    question: AlcoholQuestion.alcohol_use_practitioner_analysis_strengths_or_protective_factors,
    value: CommonOption.no,
  },
  {
    question: AlcoholQuestion.alcohol_use_practitioner_analysis_strengths_or_protective_factors_no_details,
    value: details('no alcohol strengths'),
  },
  { question: AlcoholQuestion.alcohol_use_practitioner_analysis_risk_of_serious_harm, value: CommonOption.yes },
  {
    question: AlcoholQuestion.alcohol_use_practitioner_analysis_risk_of_serious_harm_yes_details,
    value: details('alcohol serious harm'),
  },
  { question: AlcoholQuestion.alcohol_use_practitioner_analysis_risk_of_reoffending, value: CommonOption.yes },
  {
    question: AlcoholQuestion.alcohol_use_practitioner_analysis_risk_of_reoffending_yes_details,
    value: details('alcohol reoffending'),
  },
]

// Deliberately stops before the practitioner analysis, so that heading and its
// list should be absent for this section.
const health: Answer[] = [
  { question: HealthQuestion.health_wellbeing_physical_health_condition, value: CommonOption.yes },
  { question: HealthQuestion.health_wellbeing_physical_health_condition_yes_details, value: 'health conditions' },
  { question: HealthQuestion.health_wellbeing_any_mental_health_conditions, value: CommonOption.yes },
  { question: HealthQuestion.health_wellbeing_mental_health_condition, value: HealthOption.yes_ongoing_severe },
  {
    question: HealthQuestion.health_wellbeing_mental_health_condition_yes_ongoing_severe_details,
    value: 'severe mental health',
  },
  { question: HealthQuestion.health_wellbeing_psychiatric_treatment, value: HealthOption.pending_treatment },
  { question: HealthQuestion.health_wellbeing_learning_difficulties, value: HealthOption.yes_some_difficulties },
  {
    question: HealthQuestion.health_wellbeing_learning_difficulties_yes_some_difficulties_details,
    value: 'slight learning impact',
  },
  { question: HealthQuestion.health_wellbeing_coping_day_to_day_life, value: HealthOption.yes_some_difficulties },
  { question: HealthQuestion.health_wellbeing_gambling, value: HealthOption.yes_their_gambling },
  { question: HealthQuestion.health_wellbeing_gambling_yes_their_gambling_details, value: 'their gambling' },
  { question: HealthQuestion.health_wellbeing_attitude_towards_self, value: HealthOption.some_negative_aspects },
  { question: HealthQuestion.health_wellbeing_self_harmed, value: CommonOption.yes },
  { question: HealthQuestion.health_wellbeing_self_harmed_yes_details, value: 'self harm' },
  { question: HealthQuestion.health_wellbeing_attempted_suicide_or_suicidal_thoughts, value: CommonOption.yes },
  {
    question: HealthQuestion.health_wellbeing_attempted_suicide_or_suicidal_thoughts_yes_details,
    value: 'suicidal thoughts',
  },
  { question: HealthQuestion.health_wellbeing_changes, value: CommonOption.made_changes },
  { question: HealthQuestion.health_wellbeing_changes_made_changes_details, value: 'made changes' },
]

const personal: Answer[] = [
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_children_details,
    value: PersonalRelationshipsOption.yes_children_not_living_with_pop,
  },
  {
    question:
      PersonalRelationshipsQuestion.personal_relationships_community_children_details_yes_children_not_living_with_pop_details,
    value: details('children not living with them'),
  },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_any_parenting_responsibilities,
    value: CommonOption.yes,
  },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_parental_responsibilities,
    value: PersonalRelationshipsOption.sometimes,
  },
  {
    question:
      PersonalRelationshipsQuestion.personal_relationships_community_parental_responsibilities_sometimes_details,
    value: details('sometimes parental'),
  },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_family_relationship,
    value: PersonalRelationshipsOption.mixed_relationship,
  },
  {
    question:
      PersonalRelationshipsQuestion.personal_relationships_community_family_relationship_mixed_relationship_details,
    value: details('mixed family'),
  },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_childhood,
    value: PersonalRelationshipsOption.negative_childhood,
  },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_childhood_negative_childhood_details,
    value: details('childhood'),
  },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_childhood_behaviour,
    value: CommonOption.yes,
  },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_childhood_behaviour_yes_details,
    value: details('childhood behaviour'),
  },
  { question: PersonalRelationshipsQuestion.personal_relationships_community_belonging, value: details('belonging') },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_current_relationship,
    value: PersonalRelationshipsOption.concerns_happy_relationship,
  },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_in_relationship,
    value: PersonalRelationshipsOption.in_relationship_living_together,
  },
  {
    question:
      PersonalRelationshipsQuestion.personal_relationships_community_current_relationship_concerns_happy_relationship_details,
    value: details('happy but concerns'),
  },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_intimate_relationship,
    value: PersonalRelationshipsOption.unstable_relationships,
  },
  {
    question:
      PersonalRelationshipsQuestion.personal_relationships_community_intimate_relationship_unstable_relationships_details,
    value: details('unstable relationships'),
  },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_domestic_abuse_perpetrator,
    value: CommonOption.yes,
  },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_domestic_abuse_against,
    value: PersonalRelationshipsOption.intimate_partner,
  },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_domestic_abuse_against_partner_details,
    value: details('against intimate partner'),
  },

  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_coercive_behaviour,
    value: CommonOption.yes,
  },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_coercive_behaviour_yes_details,
    value: details('coercive behaviour'),
  },
  { question: PersonalRelationshipsQuestion.personal_relationships_community_strangulation, value: CommonOption.yes },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_strangulation_yes_details,
    value: details('strangulation evidence'),
  },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_domestic_abuse_victim,
    value: CommonOption.yes,
  },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_domestic_abuse_victim_by,
    value: PersonalRelationshipsOption.intimate_partner,
  },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_domestic_abuse_victim_by_intimate_partner,
    value: details('by intimate partner'),
  },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_changes,
    value: CommonOption.does_not_want_to_answer,
  },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_changes_does_not_want_to_answer_details,
    value: details('declined to answer'),
  },
  {
    question:
      PersonalRelationshipsQuestion.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors,
    value: CommonOption.yes,
  },
  {
    question:
      PersonalRelationshipsQuestion.personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_yes_details,
    value: details('relationship strengths'),
  },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_practitioner_analysis_risk_of_serious_harm,
    value: CommonOption.no,
  },
  {
    question:
      PersonalRelationshipsQuestion.personal_relationships_community_practitioner_analysis_risk_of_serious_harm_no_details,
    value: details('no relationship serious harm'),
  },
  {
    question: PersonalRelationshipsQuestion.personal_relationships_community_practitioner_analysis_risk_of_reoffending,
    value: CommonOption.no,
  },
  {
    question:
      PersonalRelationshipsQuestion.personal_relationships_community_practitioner_analysis_risk_of_reoffending_no_details,
    value: details('no relationship reoffending'),
  },
]

const thinking: Answer[] = [
  {
    question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_consequences,
    value: ThinkingBehavioursOption.sometimes,
  },
  { question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_stable_behaviour, value: CommonOption.no },
  {
    question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_offending_activities,
    value: ThinkingBehavioursOption.yes_offending_activities,
  },
  {
    question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_peer_pressure,
    value: ThinkingBehavioursOption.some,
  },
  {
    question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_peer_pressure_some_details,
    value: details('some peer pressure'),
  },
  {
    question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_problem_solving,
    value: ThinkingBehavioursOption.limited_problem_solving,
  },
  {
    question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_peoples_views,
    value: ThinkingBehavioursOption.sometimes,
  },
  {
    question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_manipulative_predatory_behaviour,
    value: 'SOME',
  },
  { question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_temper_management, value: CommonOption.no },
  {
    question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_violence_controlling_behaviour,
    value: ThinkingBehavioursOption.sometimes,
  },
  { question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_impulsive_behaviour, value: CommonOption.yes },
  {
    question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_hostile_orientation,
    value: ThinkingBehavioursOption.some,
  },
  {
    question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_supervision,
    value: ThinkingBehavioursOption.unsure_supervision,
  },
  {
    question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_criminal_behaviour,
    value: ThinkingBehavioursOption.sometimes,
  },
  { question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_changes, value: CommonOption.not_applicable },
  { question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_risk_sexual_harm, value: CommonOption.yes },
  {
    question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_sexual_preoccupation,
    value: ThinkingBehavioursOption.sometimes,
  },
  {
    question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_offence_related_sexual_interest,
    value: ThinkingBehavioursOption.some_offence_related_sexual_interest,
  },
  {
    question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_emotional_intimacy,
    value: CommonOption.unknown,
  },
  {
    question:
      ThinkingBehavioursQuestion.thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors,
    value: CommonOption.yes,
  },
  {
    question:
      ThinkingBehavioursQuestion.thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors_yes_details,
    value: details('thinking strengths'),
  },
  {
    question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm,
    value: CommonOption.yes,
  },
  {
    question:
      ThinkingBehavioursQuestion.thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm_yes_details,
    value: details('thinking serious harm'),
  },
  {
    question: ThinkingBehavioursQuestion.thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending,
    value: CommonOption.yes,
  },
  {
    question:
      ThinkingBehavioursQuestion.thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending_yes_details,
    value: details('thinking reoffending'),
  },
]

const statuses: Record<string, string> = {
  [Section.accommodation.statusKey]: SectionComplete.yes,
  [Section.employment_and_education.statusKey]: SectionComplete.yes,
  // [Section.finance.statusKey]: SectionComplete.no,
  // [Section.drug_use.statusKey]: SectionComplete.yes,
  [Section.alcohol_use.statusKey]: SectionComplete.yes,
  [Section.health_and_wellbeing.statusKey]: SectionComplete.no,
  [Section.personal_relationships_and_community.statusKey]: SectionComplete.yes,
  [Section.thinking_behaviours_and_attitudes.statusKey]: SectionComplete.yes,
  // [Section.offence_analysis.statusKey]: SectionComplete.no,
}

const pageText = (page: Page) => page.locator('#main-content').innerText()

test.describe('View all answers', () => {
  test('shows every section, and within each every answer given', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    assessmentBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })

    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
        // TODO Uncomment for each section work
        ...accommodation,
        ...employment,
        // ...finance,
        // ...drugUse,
        ...alcohol,
        ...health,
        ...personal,
        ...thinking,
      ])
      .save()

    const withStatuses = assessmentBuilder.extend(sanAssessmentId)
    Object.entries(statuses).forEach(([key, value]) => withStatuses.withProperty(key, value))
    await withStatuses.save()

    await navigateToStrengthsAndNeeds(page, handoverLink, '/strengths-and-needs/')
    await page.goto(buildEditUrl(baseURL, sanAssessmentId, viewAllAnswers))

    // Every section, and a status against each.
    // TODO Uncomment for each section work
    await expect(page.getByText(`${sanPageTitles.accommodation}\nComplete`, { exact: true })).toBeVisible()
    await expect(page.getByText(`${sanPageTitles.healthAndWellbeing}\nComplete`, { exact: true })).toBeVisible()
    // expect(page.getByText('Finances\nIncomplete', { exact: true })).toBeVisible()
    // expect(page.getByText('Offence analysis\nIncomplete', { exact: true })).toBeVisible()
    await expect(page.getByText(`${sanPageTitles.alcoholUse}\nComplete`, { exact: true })).toBeVisible()
    await expect(page.getByText(`${sanPageTitles.employmentAndEducation}\nComplete`, { exact: true })).toBeVisible()
    await expect(page.getByText(`${sanPageTitles.personal}\nComplete`, { exact: true })).toBeVisible()

    // Each selected option is followed by what it revealed

    // TODO Uncomment it during ACT-752 Finance framework
    // expect(page.getByText('Debt to others', { exact: true })).toBeVisible()
    // expect(page.getByText('debt to others — free text')).toBeVisible()
    // expect(page.getByText('Formal debt', { exact: true })).toBeVisible()

    /*
     * Each drug carries how often it is used and any details given about that,
     * as name/answer pairs so that the two are associated for a screen reader
     * rather than only sitting next to each other on screen. Compared with the
     * whitespace collapsed, since how they are laid out is not the point.
     */

    // TODO Uncomment it during ACT-753 Drug framework
    // expect(page.getByText('Cannabis', { exact: true })).toBeVisible()
    // expect(page.getByText('Last used').first()).toBeVisible()
    // expect(page.getByText('Used in the last 6 months').first()).toBeVisible()
    // expect(page.getByText('How often').first()).toBeVisible()
    // expect(page.getByText('Daily').first()).toBeVisible()
    // expect(page.getByText('cannabis frequency — free')).toBeVisible()
    // expect(page.getByText('Cocaine')).toBeVisible()
    // expect(page.getByText('Last used').nth(1)).toBeVisible()
    // expect(page.getByText('Used in the last 6 months').nth(1)).toBeVisible()
    // expect(page.getByText('How often').nth(1)).toBeVisible()
    // expect(page.getByText('Occasionally').first()).toBeVisible()
    // expect(page.getByText('Heroin').first()).toBeVisible()
    // expect(page.getByText('Last used').nth(2)).toBeVisible()
    // expect(page.getByText('Used more than 6 months ago')).toBeVisible()
    // A section stopped before its practitioner analysis shows none.
    const textHealthAndWellbeing = page.locator('div:has-text("Health and wellbeing") ~ dl').first()
    await expect(textHealthAndWellbeing).not.toContainText('Practitioner analysis')
  })

  test('shows only what has been answered', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })

    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(buildEditUrl(baseURL, sanAssessmentId, viewAllAnswers))

    // Nothing answered: the sections, their statuses, and nothing else.
    expect(await pageText(page)).toContain(
      "Back\nTest's strengths and needs\nAccommodation\nIncomplete\nAlcohol use\nIncomplete",
    )

    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
        {
          question: AccommodationQuestion.community_current_accommodation,
          value: CommonOption.no,
        },
        {
          question: AccommodationQuestion.community_no_accommodation_reason,
          value: [AccommodationOption.drug_problems, CommonOption.other],
        },
        {
          question: AccommodationQuestion.community_no_accommodation_reason_other_details,
          value: details('other reason for no'),
        },
        { question: AlcoholQuestion.alcohol_current_issues, value: 'SIGNIFICANT' },
        { question: AlcoholQuestion.alcohol_evidence_of_excess_drinking, value: 'YES_WITH_EVIDENCE' },
        { question: AlcoholQuestion.alcohol_past_issues, value: 'YES' },
        { question: AlcoholQuestion.alcohol_past_issues_yes_details, value: details('past alcohol issues') },
        { question: AlcoholQuestion.alcohol_stopped_or_reduced_past, value: 'YES' },
        {
          question: AlcoholQuestion.alcohol_stopped_or_reduced_past_yes_details,
          value: details('has cut down before'),
        },
        { question: AlcoholQuestion.alcohol_stopped_or_reduced, value: 'YES' },
        { question: AlcoholQuestion.alcohol_stopped_or_reduced_yes_details, value: details('has cut down before') },
        { question: AlcoholQuestion.alcohol_use_changes, value: 'DOES_NOT_WANT_TO_MAKE_CHANGES' },
        {
          question: AlcoholQuestion.alcohol_use_changes_does_not_want_to_make_changes_details,
          value: details('does not want to change'),
        },
        { question: AlcoholQuestion.alcohol_use_practitioner_analysis_strengths_or_protective_factors, value: 'NO' },
      ])
      .save()

    await page.goto(buildEditUrl(baseURL, sanAssessmentId, viewAllAnswers))

    await expect(page.getByRole('heading', { name: 'Accommodation' })).toBeVisible()
    await expect(
      page.getByText('Does Test currently have somewhere to live?\nNo', { exact: true }).first(),
    ).toBeVisible()
    await expect(page.getByText('Drug related problems', { exact: true })).toBeVisible()
    await expect(page.getByText('Other', { exact: true })).toBeVisible()
    await expect(page.getByText('other reason for no')).toBeVisible()
    await expect(page.getByText('Alcohol use\nIncomplete\n')).toBeVisible()
    await expect(page.getByText("Is the location of Test's accommodation suitable?")).not.toBeVisible()
    await expect(page.getByText('Alcohol use\nIncomplete\n')).toBeVisible()
    await expect(page.getByText('Health and wellbeing\nIncomplete\nPersonal relationships and community')).toBeVisible()
    await expect(page.getByText('Health and wellbeing\nIncomplete\nPersonal relationships and community')).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test('should be accessible', async ({ baseURL, createSession, page }) => {
    const { handoverLink, sanAssessmentId } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(buildEditUrl(baseURL, sanAssessmentId, viewAllAnswers))
    await checkAccessibility(page, {
      // https://github.com/alphagov/govuk-design-system-backlog/issues/59#issuecomment-2854891330
      disableRules: ['aria-allowed-attr'],
    })
  })

  test('print should be accessible', async ({ baseURL, createSession, page, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await strengthsAndNeedsBuilder.fresh().save()

    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(buildEditUrl(baseURL, sanAssessmentId, viewAllAnswers))

    // Unfortunately this is not reflected in the Playwright UI
    await page.emulateMedia({ media: 'print' })

    await checkAccessibility(page, {
      // https://github.com/alphagov/govuk-design-system-backlog/issues/59#issuecomment-2854891330
      disableRules: ['aria-allowed-attr'],
    })
  })
})

test.describe('View all answers print view', () => {
  test('shows the print cover page and header only when printing', async ({
    baseURL,
    page,
    createSession,
    strengthsAndNeedsBuilder,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })
    await strengthsAndNeedsBuilder.fresh().save()

    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(buildEditUrl(baseURL, sanAssessmentId, viewAllAnswers))

    const coverPage = page.locator('.pdf-cover-page')
    const printHeader = page.locator('.pdf-header')

    // The additional report content must not affect the normal in-browser assessment view.
    await expect(coverPage).toBeHidden()
    await expect(printHeader).toBeHidden()

    // Unfortunately this is not reflected in the Playwright UI
    await page.emulateMedia({ media: 'print' })

    // Printing produces a report cover containing the practitioner attribution and
    // classification header, while retaining the assessment content after the cover.
    const today = new Date()
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
    await expect(coverPage).toBeVisible()
    await expect(coverPage).toMatchAriaSnapshot(`
      - img
      - paragraph: His Majesty's Prison & Probation Service
      - paragraph: Strengths and needs
      - paragraph: "Prepared by:"
      - paragraph:
        - strong: Test User ${formattedDate}
    `)

    // Navigation controls are deliberately excluded from the printed report.
    await expect(page.locator('.govuk-back-link')).toBeHidden()

    const firstSection = page.locator('.pdf-avoid-break').first()
    await expect(firstSection).toHaveCSS('break-inside', 'avoid')
    await expect(firstSection).toHaveCSS('page-break-inside', 'avoid')
  })
})
