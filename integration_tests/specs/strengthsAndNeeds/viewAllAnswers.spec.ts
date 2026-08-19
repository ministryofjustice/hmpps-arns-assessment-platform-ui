import { expect, Page } from '@playwright/test'
import { Section, SectionComplete } from '@server/forms/strengths-and-needs/versions/v1.0/constants/section'
import { test, TargetService } from '../../support/fixtures'
import { checkAccessibility, navigateToStrengthsAndNeeds } from './sanUtils'

type Answer = { question: string; value: string | string[] }

const details = (label: string) => `${label} — free text answer.`

const accommodation: Answer[] = [
  { question: 'current_accommodation', value: 'TEMPORARY' },
  { question: 'type_of_temporary_accommodation', value: 'CAS3' },
  { question: 'cas3_end_date', value: '2027-01-15' },
  { question: 'living_with', value: ['FAMILY', 'PARTNER', 'OTHER'] },
  { question: 'living_with_partner_details', value: details('living with partner') },
  { question: 'living_with_other_details', value: details('living with other') },
  { question: 'past_accommodation_details', value: details('past accommodation') },
  { question: 'suitable_housing_location', value: 'NO' },
  { question: 'suitable_housing_location_concerns', value: ['AREA_SAFETY', 'OTHER'] },
  { question: 'suitable_housing_location_concerns_details', value: details('location concerns other') },
  { question: 'suitable_housing', value: 'YES_WITH_CONCERNS' },
  { question: 'suitable_housing_concerns', value: ['FACILITIES', 'OVERCROWDING', 'OTHER'] },
  { question: 'suitable_housing_concerns_details', value: details('housing concerns other') },
  { question: 'suitable_housing_planned', value: 'YES' },
  { question: 'future_accommodation_type', value: ['AWAITING_PLACEMENT', 'OTHER'] },
  { question: 'future_accommodation_type_awaiting_placement_details', value: details('awaiting placement') },
  { question: 'future_accommodation_type_other_details', value: details('future accommodation other') },
  { question: 'accommodation_changes', value: 'WANTS_TO_MAKE_CHANGES_NEEDS_HELP' },
  { question: 'wants_to_make_changes_needs_help_accommodation_details', value: details('needs help to change') },
  { question: 'accommodation_strengths_protective_factors', value: 'YES' },
  { question: 'accommodation_strengths_protective_factors_details', value: details('accommodation strengths') },
  { question: 'accommodation_linked_to_serious_harm', value: 'NO' },
  { question: 'accommodation_no_serious_harm_details', value: details('no serious harm') },
  { question: 'accommodation_linked_to_reoffending', value: 'YES' },
  { question: 'accommodation_risk_of_reoffending_details', value: details('reoffending risk') },
]

const employment: Answer[] = [
  { question: 'current_employment_status', value: 'EMPLOYED' },
  { question: 'type_of_employment', value: 'FULL_TIME' },
  { question: 'employment_sector', value: 'Construction' },
  { question: 'employment_history', value: 'PERIODS_OF_INSTABILITY' },
  { question: 'changes_often_employment_history_employment_details', value: details('unstable spells') },
  { question: 'day_to_day_commitments', value: ['CARING', 'CHILDREN', 'OTHER'] },
  { question: 'day_to_day_caring_responsibilities_details', value: details('caring') },
  { question: 'day_to_day_child_responsibilities_details', value: details('children') },
  { question: 'day_to_day_other_commitments_details', value: details('other commitments') },
  { question: 'academic_qualification', value: 'LEVEL_3' },
  { question: 'professional_qualification', value: 'YES' },
  { question: 'professional_qualification_details', value: details('CSCS card') },
  { question: 'job_skills', value: 'SOME_SKILLS' },
  { question: 'some_job_skills_details', value: details('some skills') },
  // Multi-select whose options reveal *optioned* follow-ups.
  { question: 'difficulties_reading_writing_numeracy', value: ['YES_READING', 'YES_NUMERACY'] },
  { question: 'reading_difficulty_level', value: 'SIGNIFICANT_DIFFICULTIES' },
  { question: 'numeracy_difficulty_level', value: 'SOME_DIFFICULTIES' },
  { question: 'employment_experience', value: 'MOSTLY_POSITIVE' },
  { question: 'mostly_positive_employment_experience_details', value: details('mostly positive at work') },
  { question: 'education_experience', value: 'NEGATIVE' },
  { question: 'negative_education_experience_details', value: details('negative at school') },
  { question: 'employment_and_education_changes', value: 'HAS_MADE_CHANGES' },
  { question: 'has_made_positive_changes_details', value: details('has made changes') },
  { question: 'employment_education_strengths_protective_factors', value: 'YES' },
  { question: 'employment_education_strengths_protective_factors_details', value: details('employment strengths') },
  { question: 'employment_education_linked_to_serious_harm', value: 'NO' },
  { question: 'employment_education_no_serious_harm_details', value: details('no serious harm') },
  { question: 'employment_education_linked_to_reoffending', value: 'NO' },
  { question: 'employment_education_no_risk_of_reoffending_details', value: details('no reoffending link') },
]

const finance: Answer[] = [
  { question: 'finance_income', value: ['EMPLOYMENT', 'FAMILY_OR_FRIENDS', 'OTHER'] },
  // An optioned reveal inside a multi-select option.
  { question: 'finance_income_family_or_friends_details', value: 'YES' },
  { question: 'finance_income_other_details', value: details('other income') },
  { question: 'finance_bank_account', value: 'NO' },
  { question: 'finance_money_management', value: 'FAIRLY_BAD' },
  { question: 'finance_money_management_fairly_bad_details', value: details('fairly bad with money') },
  { question: 'finance_gambling', value: 'YES_THEIR_GAMBLING' },
  { question: 'finance_gambling_yes_their_gambling_details', value: details('their gambling') },
  // Two levels of reveal: radio -> checkbox -> details.
  { question: 'finance_debt', value: 'YES_THEIR_DEBT' },
  { question: 'yes_type_of_debt', value: ['DEBT_TO_OTHERS', 'FORMAL_DEBT'] },
  { question: 'yes_type_of_debt_debt_to_others_details', value: details('debt to others') },
  { question: 'yes_type_of_debt_formal_debt_details', value: details('formal debt') },
  { question: 'finance_changes', value: 'THINKING_ABOUT_MAKING_CHANGES' },
  { question: 'finance_changes_thinking_about_making_changes_details', value: details('thinking about it') },
  // Analysis left deliberately partial.
  { question: 'finance_strengths_protective_factors', value: 'NO' },
  { question: 'finance_no_strengths_protective_factors_details', value: details('no finance strengths') },
]

const drugUse: Answer[] = [
  { question: 'drug_use', value: 'YES' },
  { question: 'select_misused_drugs', value: ['CANNABIS', 'COCAINE', 'HEROIN', 'OTHER'] },
  { question: 'drug_last_used_cannabis', value: 'LAST_SIX' },
  { question: 'drug_last_used_cocaine', value: 'LAST_SIX' },
  // Used more than 6 months ago, so it is never asked when it was injected.
  { question: 'drug_last_used_heroin', value: 'MORE_THAN_SIX' },
  { question: 'other_drug_name', value: 'Ketamine' },
  { question: 'drug_last_used_other', value: 'LAST_SIX' },
  // Asked once per drug on a later step, so they read under the drug itself.
  { question: 'how_often_used_last_six_months_cannabis', value: 'DAILY' },
  { question: 'how_often_used_last_six_months_cannabis_details', value: details('cannabis frequency') },
  { question: 'how_often_used_last_six_months_cocaine', value: 'OCCASIONALLY' },
  { question: 'how_often_used_last_six_months_other', value: 'WEEKLY' },
  { question: 'drug_use_more_than_six_months_details', value: details('used more than six months ago') },
  // Cocaine is injectable but not injected; heroin was, before the last 6 months.
  { question: 'drugs_injected', value: ['HEROIN', 'OTHER'] },
  { question: 'drugs_injected_other', value: ['LAST_SIX'] },
  { question: 'receiving_treatment', value: 'YES' },
  { question: 'receiving_treatment_yes_details', value: details('in treatment') },
  { question: 'drugs_reasons_for_use', value: ['ESCAPISM_OR_AVOIDANCE', 'PEER_PRESSURE', 'OTHER'] },
  { question: 'drugs_reasons_for_use_details', value: details('reasons for use') },
  { question: 'drugs_affected_their_life', value: ['FINANCES', 'HEALTH', 'RELATIONSHIPS'] },
  { question: 'drugs_affected_their_life_details', value: details('effect on life') },
  { question: 'drugs_anything_helped_stop_or_reduce_use', value: details('what has helped') },
  { question: 'drugs_what_could_help_not_use_drugs_in_future', value: details('what could help') },
  { question: 'drug_use_changes', value: 'IS_MAKING_CHANGES' },
  { question: 'actively_making_changes_drugs_details', value: details('actively changing') },
  { question: 'drugs_practitioner_analysis_motivated_to_stop', value: 'PARTIAL_MOTIVATION' },
  { question: 'drug_use_practitioner_analysis_strengths_or_protective_factors', value: 'YES' },
  {
    question: 'drug_use_practitioner_analysis_strengths_or_protective_factors_yes_details',
    value: details('drug strengths'),
  },
  { question: 'drug_use_practitioner_analysis_risk_of_serious_harm', value: 'YES' },
  { question: 'drug_use_practitioner_analysis_risk_of_serious_harm_yes_details', value: details('drug serious harm') },
  { question: 'drug_use_practitioner_analysis_risk_of_reoffending', value: 'YES' },
  { question: 'drug_use_practitioner_analysis_risk_of_reoffending_yes_details', value: details('drug reoffending') },
]

const alcohol: Answer[] = [
  { question: 'alcohol_use', value: 'YES_WITHIN_LAST_THREE_MONTHS' },
  { question: 'alcohol_frequency', value: 'MORE_THAN_4_TIMES_A_WEEK' },
  { question: 'alcohol_units', value: 'UNITS_7_TO_9' },
  { question: 'alcohol_binge_drinking', value: 'YES' },
  { question: 'alcohol_binge_drinking_frequency', value: 'WEEKLY' },
  { question: 'alcohol_evidence_of_excess_drinking', value: 'YES_WITH_EVIDENCE' },
  { question: 'alcohol_past_issues', value: 'YES' },
  { question: 'alcohol_past_issues_yes_details', value: details('past alcohol issues') },
  { question: 'alcohol_reasons_for_use', value: ['SOCIAL', 'MANAGING_EMOTIONAL_ISSUES', 'OTHER'] },
  { question: 'alcohol_reasons_for_use_other_details', value: details('other reason to drink') },
  { question: 'alcohol_impact_of_use', value: ['FINANCES', 'RELATIONSHIPS', 'OTHER'] },
  { question: 'alcohol_impact_of_use_other_details', value: details('other impact') },
  { question: 'alcohol_stopped_or_reduced', value: 'YES' },
  { question: 'alcohol_stopped_or_reduced_yes_details', value: details('has cut down before') },
  { question: 'alcohol_use_changes', value: 'DOES_NOT_WANT_TO_MAKE_CHANGES' },
  { question: 'alcohol_use_changes_does_not_want_to_make_changes_details', value: details('does not want to change') },
  { question: 'alcohol_use_practitioner_analysis_strengths_or_protective_factors', value: 'NO' },
  {
    question: 'alcohol_use_practitioner_analysis_strengths_or_protective_factors_no_details',
    value: details('no alcohol strengths'),
  },
  { question: 'alcohol_use_practitioner_analysis_risk_of_serious_harm', value: 'YES' },
  {
    question: 'alcohol_use_practitioner_analysis_risk_of_serious_harm_yes_details',
    value: details('alcohol serious harm'),
  },
  { question: 'alcohol_use_practitioner_analysis_risk_of_reoffending', value: 'YES' },
  {
    question: 'alcohol_use_practitioner_analysis_risk_of_reoffending_yes_details',
    value: details('alcohol reoffending'),
  },
]

// Deliberately stops before the practitioner analysis, so that heading and its
// list should be absent for this section.
const health: Answer[] = [
  { question: 'health_conditions', value: 'YES' },
  { question: 'has_health_conditions_details', value: details('health conditions') },
  { question: 'mental_health_problems', value: 'YES_ONGOING_SEVERE' },
  { question: 'severe_mental_health_problems_details', value: details('severe mental health') },
  { question: 'prescribed_physical_health_medications_treatments', value: details('physical medication') },
  { question: 'prescribed_mental_health_medications_treatments', value: details('mental health medication') },
  { question: 'psychiatric_treatment', value: 'PENDING_TREATMENT' },
  { question: 'head_injuries', value: 'YES' },
  { question: 'neurodiverse_conditions', value: 'YES' },
  { question: 'neurodiverse_conditions_details', value: details('neurodiverse') },
  { question: 'impact_on_learning_abilities', value: 'YES_LEARNING_SLIGHTLY_IMPACTED' },
  { question: 'learning_abilities_impacted_slightly_details', value: details('slight learning impact') },
  { question: 'cope_with_day_to_day_life', value: 'HAS_DIFFICULTIES_COPING' },
  { question: 'attitude_towards_self', value: 'WOULD_LIKE_TO_CHANGE_ASPECTS' },
  { question: 'self_harm', value: 'YES' },
  { question: 'self_harm_details', value: details('self harm') },
  { question: 'suicidal_tendencies', value: 'NO' },
  { question: 'feeling_about_future_health_wellbeing', value: 'UNSURE_OUTLOOK' },
  {
    question: 'helped_during_periods_good_health_wellbeing',
    value: ['MEDICATION_OR_TREATMENT', 'RELATIONSHIPS', 'OTHER'],
  },
  { question: 'helped_during_periods_good_health_wellbeing_details', value: details('what helped') },
  { question: 'changes_to_health_wellbeing', value: 'NOT_PRESENT' },
]

const personal: Answer[] = [
  { question: 'personal_relationships_community_children_details', value: 'YES_CHILDREN_NOT_LIVING_WITH_POP' },
  {
    question: 'personal_relationships_community_children_details_yes_children_not_living_with_pop_details',
    value: details('children not living with them'),
  },
  {
    question: 'personal_relationships_community_important_people',
    value: ['PARTNER_INTIMATE_RELATIONSHIP', 'FAMILY', 'OTHER'],
  },
  {
    question: 'personal_relationships_community_important_people_partner_intimate_relationship_details',
    value: details('partner'),
  },
  { question: 'personal_relationships_community_important_people_family_details', value: details('family') },
  { question: 'personal_relationships_community_important_people_other_details', value: details('other people') },
  { question: 'personal_relationships_community_current_relationship', value: 'CONCERNS_HAPPY_RELATIONSHIP' },
  {
    question: 'personal_relationships_community_current_relationship_concerns_happy_relationship_details',
    value: details('happy but concerns'),
  },
  { question: 'personal_relationships_community_intimate_relationship', value: 'UNSTABLE_RELATIONSHIPS' },
  {
    question: 'personal_relationships_community_intimate_relationship_unstable_relationships_details',
    value: details('unstable relationships'),
  },
  { question: 'personal_relationships_community_challenges_intimate_relationship', value: details('challenges') },
  { question: 'personal_relationships_community_parental_responsibilities', value: 'SOMETIMES' },
  {
    question: 'personal_relationships_community_parental_responsibilities_sometimes_details',
    value: details('sometimes parental'),
  },
  { question: 'personal_relationships_community_family_relationship', value: 'MIXED_RELATIONSHIP' },
  {
    question: 'personal_relationships_community_family_relationship_mixed_relationship_details',
    value: details('mixed family'),
  },
  { question: 'personal_relationships_community_childhood', value: 'NEGATIVE_CHILDHOOD' },
  { question: 'personal_relationships_community_childhood_negative_childhood_details', value: details('childhood') },
  { question: 'personal_relationships_community_childhood_behaviour', value: 'YES' },
  {
    question: 'personal_relationships_community_childhood_behaviour_yes_details',
    value: details('childhood behaviour'),
  },
  { question: 'personal_relationships_community_belonging', value: details('belonging') },
  { question: 'personal_relationships_community_changes', value: 'DOES_NOT_WANT_TO_ANSWER' },
  {
    question: 'personal_relationships_community_changes_does_not_want_to_answer_details',
    value: details('declined to answer'),
  },
  { question: 'personal_relationships_community_practitioner_analysis_strengths_or_protective_factors', value: 'YES' },
  {
    question: 'personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_yes_details',
    value: details('relationship strengths'),
  },
  { question: 'personal_relationships_community_practitioner_analysis_risk_of_serious_harm', value: 'NO' },
  {
    question: 'personal_relationships_community_practitioner_analysis_risk_of_serious_harm_no_details',
    value: details('no relationship serious harm'),
  },
  { question: 'personal_relationships_community_practitioner_analysis_risk_of_reoffending', value: 'NO' },
  {
    question: 'personal_relationships_community_practitioner_analysis_risk_of_reoffending_no_details',
    value: details('no relationship reoffending'),
  },
]

const thinking: Answer[] = [
  { question: 'thinking_behaviours_attitudes_consequences', value: 'SOMETIMES' },
  { question: 'thinking_behaviours_attitudes_stable_behaviour', value: 'NO' },
  { question: 'thinking_behaviours_attitudes_offending_activities', value: 'YES_OFFENDING_ACTIVITIES' },
  { question: 'thinking_behaviours_attitudes_peer_pressure', value: 'SOME' },
  { question: 'thinking_behaviours_attitudes_peer_pressure_some_details', value: details('some peer pressure') },
  { question: 'thinking_behaviours_attitudes_problem_solving', value: 'LIMITED_PROBLEM_SOLVING' },
  { question: 'thinking_behaviours_attitudes_peoples_views', value: 'SOMETIMES' },
  { question: 'thinking_behaviours_attitudes_manipulative_predatory_behaviour', value: 'SOME' },
  { question: 'thinking_behaviours_attitudes_temper_management', value: 'NO' },
  { question: 'thinking_behaviours_attitudes_violence_controlling_behaviour', value: 'SOMETIMES' },
  { question: 'thinking_behaviours_attitudes_impulsive_behaviour', value: 'YES' },
  { question: 'thinking_behaviours_attitudes_positive_attitude', value: 'NEGATIVE_ATTITUDE_AND_CONCERNS' },
  { question: 'thinking_behaviours_attitudes_hostile_orientation', value: 'SOME' },
  { question: 'thinking_behaviours_attitudes_supervision', value: 'UNSURE_SUPERVISION' },
  { question: 'thinking_behaviours_attitudes_criminal_behaviour', value: 'SOMETIMES' },
  { question: 'thinking_behaviours_attitudes_changes', value: 'NOT_APPLICABLE' },
  { question: 'thinking_behaviours_attitudes_risk_sexual_harm', value: 'YES' },
  { question: 'thinking_behaviours_attitudes_sexual_preoccupation', value: 'SOMETIMES' },
  {
    question: 'thinking_behaviours_attitudes_offence_related_sexual_interest',
    value: 'SOME_OFFENCE_RELATED_SEXUAL_INTEREST',
  },
  { question: 'thinking_behaviours_attitudes_emotional_intimacy', value: 'UNKNOWN' },
  { question: 'thinking_behaviours_attitudes_strengths_protective_factors', value: 'YES' },
  {
    question: 'thinking_behaviours_attitudes_strengths_protective_factors_details',
    value: details('thinking strengths'),
  },
  { question: 'thinking_behaviours_attitudes_linked_to_serious_harm', value: 'YES' },
  { question: 'thinking_behaviours_attitudes_serious_harm_details', value: details('thinking serious harm') },
  { question: 'thinking_behaviours_attitudes_linked_to_reoffending', value: 'YES' },
  { question: 'thinking_behaviours_attitudes_risk_of_reoffending_details', value: details('thinking reoffending') },
]

const statuses: Record<string, string> = {
  [Section.accommodation.statusKey]: SectionComplete.yes,
  [Section.employment_and_education.statusKey]: SectionComplete.yes,
  [Section.finance.statusKey]: SectionComplete.no,
  [Section.drug_use.statusKey]: SectionComplete.yes,
  [Section.alcohol_use.statusKey]: SectionComplete.yes,
  [Section.health_and_wellbeing.statusKey]: SectionComplete.no,
  [Section.personal_relationships_and_community.statusKey]: SectionComplete.yes,
  [Section.thinking_behaviours_and_attitudes.statusKey]: SectionComplete.yes,
  [Section.offence_analysis.statusKey]: SectionComplete.no,
}

const viewAllAnswersPath = '/strengths-and-needs/v1.0/view-all-answers'

const pageText = (page: Page) => page.locator('#main-content').innerText()

test.describe('View all answers', () => {
  test('shows every section, and within each every answer given', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    assessmentBuilder,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })

    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
        ...accommodation,
        ...employment,
        ...finance,
        ...drugUse,
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
    await page.goto(viewAllAnswersPath)

    const text = await pageText(page)

    // Every section, and a status against each.
    expect(text).toContain('Accommodation\nComplete')
    expect(text).toContain('Finances\nIncomplete')
    expect(text).toContain('Offence analysis\nIncomplete')

    // A date reads as a date, not as it is stored.
    expect(text).toContain('15 January 2027')
    expect(text).not.toContain('2027-01-15')

    // Each selected option is followed by what it revealed
    expect(text).toContain(['Awaiting placement', 'awaiting placement — free text answer.', 'Other'].join('\n\n'))
    expect(text).toContain(['Debt to others', 'debt to others — free text answer.', 'Formal debt'].join('\n\n'))

    /*
     * Each drug carries how often it is used and any details given about that,
     * as name/answer pairs so that the two are associated for a screen reader
     * rather than only sitting next to each other on screen. Compared with the
     * whitespace collapsed, since how they are laid out is not the point.
     */
    const reads = text.replace(/\s+/g, ' ')

    expect(reads).toContain(
      'Cannabis Last used Used in the last 6 months How often Daily Details cannabis frequency — free text answer.',
    )
    expect(reads).toContain('Cocaine Last used Used in the last 6 months How often Occasionally')
    expect(reads).toContain('Heroin Last used Used more than 6 months ago')

    // A section stopped before its practitioner analysis shows none.
    const healthSection = text.slice(text.indexOf('Health and wellbeing'), text.indexOf('Personal relationships'))
    expect(healthSection).not.toContain('Practitioner analysis')

    await checkAccessibility(page, { include: '#main-content' })
  })

  test('shows only what has been answered', async ({ page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({ targetService: TargetService.STRENGTHS_AND_NEEDS })

    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(viewAllAnswersPath)

    // Nothing answered: the sections, their statuses, and nothing else.
    expect(await pageText(page)).toContain('Accommodation\nIncomplete\nEmployment and education')

    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([
        { question: 'current_accommodation', value: 'NO_ACCOMMODATION' },
        { question: 'type_of_no_accommodation', value: 'ROUGH_SLEEPING' },
        { question: 'no_accommodation_reason', value: ['DRUG_PROBLEMS', 'FINANCIAL_DIFFICULTIES', 'OTHER'] },
        { question: 'no_accommodation_reason_other_details', value: details('other reason for no accommodation') },
        { question: 'living_with', value: ['ALONE'] },
        { question: 'drug_use', value: 'NO' },
      ])
      .save()

    await page.goto(viewAllAnswersPath)
    const text = await pageText(page)

    expect(text).toContain('No accommodation')
    expect(text).toContain('Drug related problems')
    expect(text).toContain(['Other', 'other reason for no accommodation — free text answer.'].join('\n\n'))
    // Unanswered questions stay off the page, and unstarted sections show no rows.
    expect(text).not.toContain('Is the location of Test')
    expect(text).toContain('Alcohol use\nIncomplete\nHealth and wellbeing')
  })
})
