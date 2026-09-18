import { expect } from '@playwright/test'
import HealthAndWellbeingPage from 'pages/strengthsAndNeeds/healthAndWellbeingPage'
import { test, TargetService } from '../../../support/fixtures'

test.describe('Summary', () => {
  test('shows summary page', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: 'health_wellbeing_physical_health_condition', value: 'NO' },
        { question: 'health_wellbeing_mental_health_condition', value: 'NO' },
        { question: 'health_wellbeing_head_injury_or_illness', value: 'NO' },
        { question: 'health_wellbeing_neurodiverse_conditions', value: 'YES' },
        { question: 'health_wellbeing_neurodiverse_conditions_yes_details', value: 'details' },
        { question: 'health_wellbeing_learning_difficulties', value: 'NO' },
        { question: 'health_wellbeing_learning_difficulties_yes_significant_difficulties_details', value: '' },
        { question: 'health_wellbeing_learning_difficulties_yes_some_difficulties_details', value: '' },
        { question: 'health_wellbeing_coping_day_to_day_life', value: 'NO' },
        { question: 'health_wellbeing_attitude_towards_self', value: 'NEGATIVE' },
        { question: 'health_wellbeing_self_harmed', value: 'NO' },
        { question: 'health_wellbeing_attempted_suicide_or_suicidal_thoughts', value: 'NO' },
        { question: 'health_wellbeing_outlook', value: 'NOT_OPTIMISTIC' },
        { question: 'health_wellbeing_positive_factors', value: [] },
        { question: 'health_wellbeing_changes', value: 'NOT_PRESENT' },
      ]).save()

    await HealthAndWellbeingPage.navigateToHealthAndWellbeing(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'health-wellbeing-summary',
    )

    const healthAndWellbeingPage = await HealthAndWellbeingPage.verifyOnPage(page, 'Summary')

    await expect(healthAndWellbeingPage.summary).toMatchAriaSnapshot(`
      - tabpanel "Summary":
        - term: Does Test have any physical health conditions?
        - definition:
          - paragraph: "No"
        - definition:
          - link "Change Does Test have any physical health conditions?":
            - /url: health-wellbeing#health_wellbeing_physical_health_condition-question
        - term: Does Test have any diagnosed or documented mental health problems?
        - definition:
          - paragraph: "No"
        - definition:
          - link "Change Does Test have any diagnosed or documented mental health problems?":
            - /url: health-wellbeing#health_wellbeing_mental_health_condition-question
        - term: Has Test had a head injury or any illness affecting the brain?
        - definition:
          - paragraph: "No"
        - definition:
          - link "Change Has Test had a head injury or any illness affecting the brain?":
            - /url: physical-mental-health#health_wellbeing_head_injury_or_illness-question
        - term: Does Test have any neurodiverse conditions?
        - definition:
          - paragraph: "Yes"
          - paragraph: "details"
        - definition:
          - link "Change Does Test have any neurodiverse conditions?":
            - /url: physical-mental-health#health_wellbeing_neurodiverse_conditions-question
        - term: Does Test have any conditions or disabilities that impact their ability to learn? (optional)
        - definition:
          - paragraph: No, they do not have any conditions or disabilities that impact their ability to learn
        - definition:
          - link "Change Does Test have any conditions or disabilities that impact their ability to learn? (optional)":
            - /url: physical-mental-health#health_wellbeing_learning_difficulties-question
        - term: Is Test able to cope with day-to-day life?
        - definition:
          - paragraph: Not able to cope
        - definition:
          - link "Change Is Test able to cope with day-to-day life?":
            - /url: physical-mental-health#health_wellbeing_coping_day_to_day_life-question
        - term: What is Test's attitude towards themselves?
        - definition:
          - paragraph: Negative self-image and unhappy
        - definition:
          - link "Change What is Test's attitude towards themselves?":
            - /url: physical-mental-health#health_wellbeing_attitude_towards_self-question
        - term: Has Test ever self-harmed?
        - definition:
          - paragraph: "No"
        - definition:
          - link "Change Has Test ever self-harmed?":
            - /url: physical-mental-health#health_wellbeing_self_harmed-question
        - term: Has Test ever attempted suicide or had suicidal thoughts?
        - definition:
          - paragraph: "No"
        - definition:
          - link "Change Has Test ever attempted suicide or had suicidal thoughts?":
            - /url: physical-mental-health#health_wellbeing_attempted_suicide_or_suicidal_thoughts-question
        - term: How does Test feel about their future?
        - definition:
          - paragraph: Not optimistic and thinks their future will not get better or may get worse
        - definition:
          - link "Change How does Test feel about their future?":
            - /url: physical-mental-health#health_wellbeing_outlook-question
        - term: Does Test want to make changes to their health and wellbeing?
        - definition:
          - paragraph: Test is not present
        - definition:
          - link "Change Does Test want to make changes to their health and wellbeing?":
            - /url: physical-mental-health#health_wellbeing_changes-question
        - button "Go to practitioner analysis"
    `)
  })

  test('practitioner analysis', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
      subject: { gender: '1' },
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: 'health_wellbeing_physical_health_condition', value: 'NO' },
        { question: 'health_wellbeing_mental_health_condition', value: 'NO' },
        { question: 'health_wellbeing_head_injury_or_illness', value: 'NO' },
        { question: 'health_wellbeing_neurodiverse_conditions', value: 'YES' },
        { question: 'health_wellbeing_neurodiverse_conditions_yes_details', value: '' },
        { question: 'health_wellbeing_learning_difficulties', value: 'NO' },
        { question: 'health_wellbeing_learning_difficulties_yes_significant_difficulties_details', value: '' },
        { question: 'health_wellbeing_learning_difficulties_yes_some_difficulties_details', value: '' },
        { question: 'health_wellbeing_coping_day_to_day_life', value: 'NOT' },
        { question: 'health_wellbeing_attitude_towards_self', value: 'NEGATIVE_UNHAPPY' },
        { question: 'health_wellbeing_self_harmed', value: 'NO' },
        { question: 'health_wellbeing_attempted_suicide_or_suicidal_thoughts', value: 'NO' },
        { question: 'health_wellbeing_outlook', value: 'NOT_OPTIMISTIC' },
        { question: 'health_wellbeing_positive_factors', value: [] },
        { question: 'health_wellbeing_changes', value: 'NOT_PRESENT' },
      ]).save()

    await HealthAndWellbeingPage.navigateToHealthAndWellbeing(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'health-wellbeing-summary',
    )

    const healthAndWellbeingPage = await HealthAndWellbeingPage.verifyOnPage(page, 'Summary')

    await healthAndWellbeingPage.goToPractitionerAnalysis.click()
    await expect(page.getByText('Are there any strengths or protective factors')).toBeVisible()
  })

  test('mark complete', async ({ baseURL, page, createSession, strengthsAndNeedsBuilder }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: 'health_wellbeing_physical_health_condition', value: 'NO' },
        { question: 'health_wellbeing_mental_health_condition', value: 'NO' },
        { question: 'health_wellbeing_head_injury_or_illness', value: 'NO' },
        { question: 'health_wellbeing_neurodiverse_conditions', value: 'NO' },
        { question: 'health_wellbeing_neurodiverse_conditions_yes_details', value: 'details' },
        { question: 'health_wellbeing_learning_difficulties', value: 'NO_LEARNING_ABILITIES_IMPACT' },
        { question: 'health_wellbeing_learning_difficulties_yes_significant_difficulties_details', value: '' },
        { question: 'health_wellbeing_learning_difficulties_yes_some_difficulties_details', value: '' },
        { question: 'health_wellbeing_coping_day_to_day_life', value: 'NOT' },
        { question: 'health_wellbeing_attitude_towards_self', value: 'NEGATIVE_UNHAPPY' },
        { question: 'health_wellbeing_self_harmed', value: 'NO' },
        { question: 'health_wellbeing_attempted_suicide_or_suicidal_thoughts', value: 'NO' },
        { question: 'health_wellbeing_outlook', value: 'NOT_OPTIMISTIC' },
        { question: 'health_wellbeing_positive_factors', value: [] },
        { question: 'health_wellbeing_changes', value: 'NOT_PRESENT' },
        { question: 'health_wellbeing_practitioner_analysis_strengths_or_protective_factors', value: 'NO' },
        { question: 'health_wellbeing_practitioner_analysis_risk_of_serious_harm_no_details', value: '' },
        { question: 'health_wellbeing_practitioner_analysis_risk_of_serious_harm', value: 'NO' },
        { question: 'health_wellbeing_practitioner_analysis_risk_of_serious_harm_no_details', value: '' },
      ]).save()

    await HealthAndWellbeingPage.navigateToHealthAndWellbeing(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'health-wellbeing-summary#practitioner-analysis',
    )
    const healthAndWellbeingPage = await HealthAndWellbeingPage.verifyOnPage(page, 'strengths or protective factors')

    await healthAndWellbeingPage.linkedToRiskOfReoffending.click()
    await healthAndWellbeingPage.markComplete.click()
    await expect(healthAndWellbeingPage.complete).toBeVisible()
    expect(page.url()).toContain('health-wellbeing-analysis')
  })
})
