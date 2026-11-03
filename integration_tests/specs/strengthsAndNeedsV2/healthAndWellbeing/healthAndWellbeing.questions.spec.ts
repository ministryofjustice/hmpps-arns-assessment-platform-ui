import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/health-wellbeing/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/health-wellbeing/constants/question'
import { expect } from '@playwright/test'
import HealthAndWellbeingPage from 'pages/strengthsAndNeedsV2/healthAndWellbeingPage'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/health-wellbeing/constants/step'
import { test, TargetService } from '../../../support/fixtures'
import { buildPageTitle, sanPageTitles } from '../sanUtils'

test.describe('Questions', () => {
  test('shows physical health and mental health', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await HealthAndWellbeingPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    const healthAndWellbeingPage = await HealthAndWellbeingPage.verifyOnPage(page, 'any physical health conditions')

    await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.healthAndWellbeing))

    await expect(healthAndWellbeingPage.mainForm).toMatchAriaSnapshot(`
        - group "Does Test have any physical health conditions?":
          - text: Does Test have any physical health conditions?
          - radio "Yes"
          - text: "Yes"
          - radio "No"
          - text: "No"
          - radio "Unknown"
          - text: Unknown
        - group "Does Test have any mental health conditions?":
          - text: "Does Test have any mental health conditions?"
          - radio "Yes"
          - text: "Yes"
          - radio "No"
          - text: "No"
          - radio "Unknown"
          - text: "Unknown"
        - button "Save and continue"
    `)
  })

  test('shows physical mental health questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.health_wellbeing_physical_health_condition, value: CommonOption.yes },
        { question: Question.health_wellbeing_physical_health_condition_yes_details, value: '' },
        { question: Question.health_wellbeing_any_mental_health_conditions, value: CommonOption.yes },
      ])
      .withUserSubmittedSteps([Step.health_wellbeing_status.code, Step.health_wellbeing_details.code])
      .save()

    await HealthAndWellbeingPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      Step.health_wellbeing_details.path,
    )

    const healthAndWellbeingPage = await HealthAndWellbeingPage.verifyOnPage(
      page,
      "How would you describe Test's mental health conditions?",
    )

    await expect(healthAndWellbeingPage.mainForm).toMatchAriaSnapshot(`
      - group "How would you describe Test's mental health conditions?":
        - text: How would you describe Test's mental health conditions?
        - radio "Ongoing and diagnosed, with documented evidence of significant impact"
        - text: Ongoing and diagnosed, with documented evidence of significant impact
        - radio "Ongoing and diagnosed, without documented evidence of significant impact"
        - text: Ongoing and diagnosed, without documented evidence of significant impact
        - radio "In the past and diagnosed or documented"
        - text: In the past and diagnosed or documented
        - radio "Undiagnosed, self reported or waiting for a consultation"
        - text: Undiagnosed, self reported or waiting for a consultation
      - group "Is Test currently having psychiatric treatment?":
        - text: Is Test currently having psychiatric treatment?
        - radio "Yes"
        - text: "Yes"
        - radio "Pending treatment"
        - text: Pending treatment
        - radio "No"
        - text: "No"
        - radio "Unknown"
        - text: Unknown
      - group "Does Test have any conditions or disabilities that impact their ability to learn? (optional)":
        - text: Does Test have any conditions or disabilities that impact their ability to learn? (optional) This refers to both learning disabilities (reduced intellectual ability) and learning difficulties (such as dyslexia or ADHD).
        - radio "Yes, their ability to learn is significantly impacted"
        - text: Yes, their ability to learn is significantly impacted
        - radio "Yes, their ability to learn is slightly impacted"
        - text: Yes, their ability to learn is slightly impacted
        - radio "No, they do not have any conditions or disabilities that impact their ability to learn"
        - text: No, they do not have any conditions or disabilities that impact their ability to learn
      - group "Is Test able to cope with day-to-day life?":
        - text: Is Test able to cope with day-to-day life?
        - radio "Yes, able to cope well"
        - text: Yes, able to cope well
        - radio "Has some difficulties coping"
        - text: Has some difficulties coping
        - radio "Not able to cope"
        - text: Not able to cope
      - group "Is Test affected by gambling?":
        - text: Is Test affected by gambling? Select all that apply.
        - checkbox "Yes, their own gambling"
        - text: Yes, their own gambling
        - checkbox "Yes, someone else’s gambling"
        - text: Yes, someone else’s gambling or
        - checkbox "No"
        - text: "No"
        - checkbox "Unknown"
        - text: Unknown
      - group "What is Test's attitude towards themselves?":
        - text: What is Test's attitude towards themselves?
        - radio "Positive and reasonably happy"
        - text: Positive and reasonably happy
        - radio "There are some aspects they would like to change or do not like"
        - text: There are some aspects they would like to change or do not like
        - radio "Negative self-image and unhappy"
        - text: Negative self-image and unhappy This includes if they have an overly positive or unrealistic self-image which in reality is not true.
      - group "Has Test ever self-harmed?":
        - text: Has Test ever self-harmed? Consider what factors or circumstances are associated and if it’s recurring.
        - radio "Yes"
        - text: "Yes"
        - radio "No"
        - text: "No"
      - group "Has Test ever attempted suicide or had suicidal thoughts?":
        - text: Has Test ever attempted suicide or had suicidal thoughts? Consider what factors or circumstances are associated and if it’s recurring.
        - radio "Yes"
        - text: "Yes"
        - radio "No"
        - text: "No"
      - button "Save and continue"
    `)
  })

  test('shows no physical mental health questions', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.health_wellbeing_physical_health_condition, value: CommonOption.no },
        { question: Question.health_wellbeing_any_mental_health_conditions, value: CommonOption.no },
      ])
      .withUserSubmittedSteps([Step.health_wellbeing_status.code, Step.health_wellbeing_details.code])
      .save()

    await HealthAndWellbeingPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      Step.health_wellbeing_details.path,
    )

    const healthAndWellbeingPage = await HealthAndWellbeingPage.verifyOnPage(
      page,
      'Does Test have any conditions or disabilities that impact their ability to learn? (optional)',
    )

    await expect(healthAndWellbeingPage.mainForm).toMatchAriaSnapshot(`
      - group "Does Test have any conditions or disabilities that impact their ability to learn? (optional)"
      - group "Is Test able to cope with day-to-day life?"
      - group "Is Test affected by gambling?"
      - group "What is Test's attitude towards themselves?"
      - group "Has Test ever self-harmed?"
      - group "Has Test ever attempted suicide or had suicidal thoughts?"
      - button "Save and continue"
    `)
  })

  test('shows want to make changes questions', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: Question.health_wellbeing_physical_health_condition, value: CommonOption.yes },
        { question: Question.health_wellbeing_physical_health_condition_yes_details, value: 'Some details' },
        { question: Question.health_wellbeing_any_mental_health_conditions, value: CommonOption.yes },
        { question: Question.health_wellbeing_mental_health_condition, value: Option.yes_ongoing_severe },
        {
          question: Question.health_wellbeing_mental_health_condition_yes_ongoing_severe_details,
          value: 'Some details',
        },
        { question: Question.health_wellbeing_psychiatric_treatment, value: CommonOption.yes },
        { question: Question.health_wellbeing_learning_difficulties, value: Option.yes_significant_difficulties },
        {
          question: Question.health_wellbeing_learning_difficulties_yes_significant_difficulties_details,
          value: 'Some details',
        },
        { question: Question.health_wellbeing_coping_day_to_day_life, value: CommonOption.yes },
        { question: Question.health_wellbeing_gambling, value: Option.yes_their_gambling },
        { question: Question.health_wellbeing_gambling_yes_their_gambling_details, value: 'Some details' },
        { question: Question.health_wellbeing_attitude_towards_self, value: Option.positive },
        { question: Question.health_wellbeing_self_harmed, value: CommonOption.yes },
        { question: Question.health_wellbeing_self_harmed_yes_details, value: 'Some details' },
        { question: Question.health_wellbeing_attempted_suicide_or_suicidal_thoughts, value: CommonOption.yes },
        {
          question: Question.health_wellbeing_attempted_suicide_or_suicidal_thoughts_yes_details,
          value: 'Some details',
        },
      ])
      .withUserSubmittedSteps([Step.health_wellbeing_status.code, Step.health_wellbeing_details.code])
      .save()

    await HealthAndWellbeingPage.navigateTo(
      page,
      handoverLink,
      baseURL,
      sanAssessmentId,
      Step.health_wellbeing_want_to_make_changes.path,
    )

    const healthAndWellbeingPage = await HealthAndWellbeingPage.verifyOnPage(
      page,
      'Does Test want to make changes to their health and wellbeing?',
    )

    await expect(healthAndWellbeingPage.mainForm).toMatchAriaSnapshot(`
      - group "Does Test want to make changes to their health and wellbeing?":
        - text: Does Test want to make changes to their health and wellbeing? Test must answer this question.
        - radio "I have already made positive changes and want to maintain them"
        - text: I have already made positive changes and want to maintain them
        - radio "I am actively making changes"
        - text: I am actively making changes
        - radio "I want to make changes and know how to"
        - text: I want to make changes and know how to
        - radio "I want to make changes but need help"
        - text: I want to make changes but need help
        - radio "I am thinking about making changes"
        - text: I am thinking about making changes
        - radio "I do not want to make changes"
        - text: I do not want to make changes
        - radio "I do not want to answer"
        - text: I do not want to answer or
        - radio "Test is not present"
        - text: Test is not present
        - radio "Not applicable"
        - text: Not applicable
      - button "Save and continue"
    `)
  })
})
