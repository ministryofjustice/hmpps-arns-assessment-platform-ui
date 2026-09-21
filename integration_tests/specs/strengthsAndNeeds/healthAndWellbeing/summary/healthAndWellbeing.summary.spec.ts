import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/health-wellbeing/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/health-wellbeing/constants/question'
import { CommonOption } from '@server/forms/strengths-and-needs/versions/v1.0/constants/commonOption'
import { expect } from '@playwright/test'
import HealthAndWellbeingPage from 'pages/strengthsAndNeeds/healthAndWellbeingPage'
import { test, TargetService } from '../../../../support/fixtures'

test.describe('Summary', () => {
  test('shows summary page', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.health_wellbeing_physical_health_condition, value: CommonOption.no },
        { question: Question.health_wellbeing_mental_health_condition, value: CommonOption.no },
        { question: Question.health_wellbeing_head_injury_or_illness, value: CommonOption.no },
        { question: Question.health_wellbeing_neurodiverse_conditions, value: CommonOption.yes },
        { question: Question.health_wellbeing_neurodiverse_conditions_yes_details, value: 'details' },
        { question: Question.health_wellbeing_learning_difficulties, value: CommonOption.no },
        { question: Question.health_wellbeing_learning_difficulties_yes_significant_difficulties_details, value: '' },
        { question: Question.health_wellbeing_learning_difficulties_yes_some_difficulties_details, value: '' },
        { question: Question.health_wellbeing_coping_day_to_day_life, value: CommonOption.no },
        { question: Question.health_wellbeing_attitude_towards_self, value: Option.negative },
        { question: Question.health_wellbeing_self_harmed, value: CommonOption.no },
        { question: Question.health_wellbeing_attempted_suicide_or_suicidal_thoughts, value: CommonOption.no },
        { question: Question.health_wellbeing_outlook, value: Option.not_optimistic },
        { question: Question.health_wellbeing_positive_factors, value: [] },
        { question: Question.health_wellbeing_changes, value: CommonOption.not_present },
      ]).save()

    await HealthAndWellbeingPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'health-wellbeing-summary')

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
        { question: Question.health_wellbeing_physical_health_condition, value: CommonOption.no },
        { question: Question.health_wellbeing_mental_health_condition, value: CommonOption.no },
        { question: Question.health_wellbeing_head_injury_or_illness, value: CommonOption.no },
        { question: Question.health_wellbeing_neurodiverse_conditions, value: CommonOption.yes },
        { question: Question.health_wellbeing_neurodiverse_conditions_yes_details, value: '' },
        { question: Question.health_wellbeing_learning_difficulties, value: CommonOption.no },
        { question: Question.health_wellbeing_learning_difficulties_yes_significant_difficulties_details, value: '' },
        { question: Question.health_wellbeing_learning_difficulties_yes_some_difficulties_details, value: '' },
        { question: Question.health_wellbeing_coping_day_to_day_life, value: CommonOption.no },
        { question: Question.health_wellbeing_attitude_towards_self, value: Option.negative },
        { question: Question.health_wellbeing_self_harmed, value: CommonOption.no },
        { question: Question.health_wellbeing_attempted_suicide_or_suicidal_thoughts, value: CommonOption.no },
        { question: Question.health_wellbeing_outlook, value: Option.not_optimistic },
        { question: Question.health_wellbeing_positive_factors, value: [] },
        { question: Question.health_wellbeing_changes, value: CommonOption.not_present },
      ]).save()

    await HealthAndWellbeingPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'health-wellbeing-summary')

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
        { question: Question.health_wellbeing_physical_health_condition, value: CommonOption.no },
        { question: Question.health_wellbeing_mental_health_condition, value: CommonOption.no },
        { question: Question.health_wellbeing_head_injury_or_illness, value: CommonOption.no },
        { question: Question.health_wellbeing_neurodiverse_conditions, value: CommonOption.no },
        { question: Question.health_wellbeing_neurodiverse_conditions_yes_details, value: 'details' },
        { question: Question.health_wellbeing_learning_difficulties, value: CommonOption.no },
        { question: Question.health_wellbeing_learning_difficulties_yes_significant_difficulties_details, value: '' },
        { question: Question.health_wellbeing_learning_difficulties_yes_some_difficulties_details, value: '' },
        { question: Question.health_wellbeing_coping_day_to_day_life, value: CommonOption.no },
        { question: Question.health_wellbeing_attitude_towards_self, value: Option.negative },
        { question: Question.health_wellbeing_self_harmed, value: CommonOption.no },
        { question: Question.health_wellbeing_attempted_suicide_or_suicidal_thoughts, value: CommonOption.no },
        { question: Question.health_wellbeing_outlook, value: Option.not_optimistic },
        { question: Question.health_wellbeing_positive_factors, value: [] },
        { question: Question.health_wellbeing_changes, value: CommonOption.not_present },
        {
          question: Question.health_wellbeing_practitioner_analysis_strengths_or_protective_factors,
          value: CommonOption.no,
        },
        { question: Question.health_wellbeing_practitioner_analysis_risk_of_serious_harm_no_details, value: '' },
        { question: Question.health_wellbeing_practitioner_analysis_risk_of_serious_harm, value: CommonOption.no },
        { question: Question.health_wellbeing_practitioner_analysis_risk_of_serious_harm_no_details, value: '' },
      ]).save()

    await HealthAndWellbeingPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      'health-wellbeing-summary#practitioner-analysis',
    )
    const healthAndWellbeingPage = await HealthAndWellbeingPage.verifyOnPage(page, 'strengths or protective factors')

    await healthAndWellbeingPage.questions.health_wellbeing_practitioner_analysis_risk_of_reoffending.option(CommonOption.no)
      .click()
    await healthAndWellbeingPage.markComplete.click()
    await expect(healthAndWellbeingPage.complete).toBeVisible()
    expect(page.url()).toContain('health-wellbeing-analysis')
  })
})
