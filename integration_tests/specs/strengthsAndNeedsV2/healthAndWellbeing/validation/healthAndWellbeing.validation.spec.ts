import { CommonOption } from '@server/forms/strengths-and-needs/versions/v2.0/constants/commonOption'
import { Question } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/health-wellbeing/constants/question'
import { expect } from '@playwright/test'
import HealthAndWellbeingPage from 'pages/strengthsAndNeedsV2/healthAndWellbeingPage'
import { Step } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/health-wellbeing/constants/step'
import { Option } from '@server/forms/strengths-and-needs/versions/v2.0/journeys/health-wellbeing/constants/option'
import { test, TargetService } from '../../../../support/fixtures'
import { buildPageTitle, sanPageTitles } from '../../sanUtils'

test.describe('Validation', () => {
  test('validation physical health and mental health', async ({
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

    await healthAndWellbeingPage.saveAndContinue.click()

    await expect(healthAndWellbeingPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Select if they have any physical health conditions":
              - /url: "#health_wellbeing_physical_health_condition"
          - listitem:
            - link "Select if they have any mental health conditions":
              - /url: "#health_wellbeing_any_mental_health_conditions"
    `)
  })

  test('validation physical mental health questions', async ({
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
        { question: Question.health_wellbeing_physical_health_condition, value: CommonOption.yes },
        { question: Question.health_wellbeing_physical_health_condition_yes_details, value: '' },
        { question: Question.health_wellbeing_any_mental_health_conditions, value: CommonOption.yes },
      ])
      .withUserSubmittedSteps([Step.health_wellbeing_status.code, Step.health_wellbeing_details.code])
      .save()

    await HealthAndWellbeingPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'health-wellbeing-details')

    const healthAndWellbeingPage = await HealthAndWellbeingPage.verifyOnPage(
      page,
      "How would you describe Test's mental health conditions?",
    )

    const { questions } = healthAndWellbeingPage

    await healthAndWellbeingPage.saveAndContinue.click()

    await expect(healthAndWellbeingPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Select how would you describe their mental health conditions":
              - /url: "#health_wellbeing_mental_health_condition"
          - listitem:
            - link "Select if they are currently having psychiatric treatment":
              - /url: "#health_wellbeing_psychiatric_treatment"
          - listitem:
            - link "Select if they are able to cope with day-to-day life":
              - /url: "#health_wellbeing_coping_day_to_day_life"
          - listitem:
            - link "Select if they are affected by gambling":
              - /url: "#health_wellbeing_gambling"
          - listitem:
            - link "Select their attitude towards themselves":
              - /url: "#health_wellbeing_attitude_towards_self"
          - listitem:
            - link "Select if they have ever self-harmed":
              - /url: "#health_wellbeing_self_harmed"
          - listitem:
            - link "Select if they have ever attempted suicide or had suicidal thoughts":
              - /url: "#health_wellbeing_attempted_suicide_or_suicidal_thoughts"
    `)

    await questions.health_wellbeing_mental_health_condition.errorLink.click()
    await expect(questions.health_wellbeing_mental_health_condition.input).toBeFocused()
    await questions.health_wellbeing_psychiatric_treatment.errorLink.click()
    await expect(questions.health_wellbeing_psychiatric_treatment.input).toBeFocused()
    await questions.health_wellbeing_coping_day_to_day_life.errorLink.click()
    await expect(questions.health_wellbeing_coping_day_to_day_life.input).toBeFocused()
    await questions.health_wellbeing_gambling.errorLink.click()
    await expect(questions.health_wellbeing_gambling.input).toBeFocused()
    await questions.health_wellbeing_attitude_towards_self.errorLink.click()
    await expect(questions.health_wellbeing_attitude_towards_self.input).toBeFocused()
    await questions.health_wellbeing_attempted_suicide_or_suicidal_thoughts.errorLink.click()
    await expect(questions.health_wellbeing_attempted_suicide_or_suicidal_thoughts.input).toBeFocused()
    await questions.health_wellbeing_self_harmed.errorLink.click()
    await expect(questions.health_wellbeing_self_harmed.input).toBeFocused()
  })

  test('validation want to make changes questions', async ({
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
        { question: Question.health_wellbeing_learning_difficulties, value: CommonOption.no },
        { question: Question.health_wellbeing_coping_day_to_day_life, value: CommonOption.no },
        { question: Question.health_wellbeing_gambling, value: CommonOption.no },
        { question: Question.health_wellbeing_attitude_towards_self, value: Option.negative },
        { question: Question.health_wellbeing_self_harmed, value: CommonOption.no },
        { question: Question.health_wellbeing_attempted_suicide_or_suicidal_thoughts, value: CommonOption.no },
      ])
      .withUserSubmittedSteps([
        Step.health_wellbeing_status.code,
        Step.health_wellbeing_details.code,
        Step.health_wellbeing_want_to_make_changes.code,
      ])
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

    const { questions } = healthAndWellbeingPage

    await healthAndWellbeingPage.saveAndContinue.click()

    await expect(healthAndWellbeingPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Select if they want to make changes to their health and wellbeing":
              - /url: "#health_wellbeing_changes"
    `)

    await questions.health_wellbeing_changes.errorLink.click()
    await expect(questions.health_wellbeing_changes.input).toBeFocused()
  })
})
