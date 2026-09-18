import { expect } from '@playwright/test'
import HealthAndWellbeingPage from 'pages/strengthsAndNeeds/healthAndWellbeingPage'
import { test, TargetService } from '../../../support/fixtures'
import { buildPageTitle, sanPageTitles } from '../sanUtils'

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
            - link "Select if they have any diagnosed or documented mental health problems":
              - /url: "#health_wellbeing_mental_health_condition"
    `)
  })

  test('validation give details option', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId).withAnswers([
        { question: 'health_wellbeing_physical_health_condition', value: 'YES' },
        {
          question: 'health_wellbeing_physical_health_condition_yes_details',
          value: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled it to make a type
          specimen book. It has survived not only five centuries, but also the leap into
          electronic typesetting, remaining essentially unchanged. It was popularised in
          the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
          and more recently with desktop publishing software like Aldus PageMaker including
          versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and
          typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book. It has survived not only five centuries, but also the leap
          into electronic typesetting, remaining essentially unchanged. It was popularised in the
          1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more
          recently with desktop publishing software like Aldus PageMaker including versions of
          Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an
          unknown printer took a galley of type and scrambled it to make a type specimen book.
          It has survived not only five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with the release of
          Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing
          software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply
          dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type
          and scrambled it to make a type specimen book. It has survived not only five.`,
        },
      ]).save()

    await HealthAndWellbeingPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)

    await HealthAndWellbeingPage.verifyOnPage(page, 'any physical health conditions')

    expect(page.getByText('You have 231 characters too many').first()).toBeVisible()
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
        { question: 'health_wellbeing_physical_health_condition', value: 'YES' },
        { question: 'health_wellbeing_physical_health_condition_yes_details', value: '' },
        { question: 'health_wellbeing_mental_health_condition', value: 'YES_ONGOING_SEVERE' },
        { question: 'health_wellbeing_mental_health_condition_yes_ongoing_severe_details', value: '' },
      ]).save()

    await HealthAndWellbeingPage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'physical-mental-health')

    const healthAndWellbeingPage = await HealthAndWellbeingPage.verifyOnPage(
      page,
      'physical health conditions (optional)',
    )

    const { questions } = healthAndWellbeingPage

    await healthAndWellbeingPage.saveAndContinue.click()

    await expect(healthAndWellbeingPage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Select if they are currently having psychiatric treatment":
              - /url: "#health_wellbeing_psychiatric_treatment"
          - listitem:
            - link "Select if they have had a head injury or any illness affecting the brain":
              - /url: "#health_wellbeing_head_injury_or_illness"
          - listitem:
            - link "Select if they have any neurodiverse conditions":
              - /url: "#health_wellbeing_neurodiverse_conditions"
          - listitem:
            - link "Select if they are able to cope with day-to-day life":
              - /url: "#health_wellbeing_coping_day_to_day_life"
          - listitem:
            - link "Select their attitude towards themselves":
              - /url: "#health_wellbeing_attitude_towards_self"
          - listitem:
            - link "Select if they have ever self-harmed":
              - /url: "#health_wellbeing_self_harmed"
          - listitem:
            - link "Select if they have ever attempted suicide or had suicidal thoughts":
              - /url: "#health_wellbeing_attempted_suicide_or_suicidal_thoughts"
          - listitem:
            - link "Select how optimistic they are about their future":
              - /url: "#health_wellbeing_outlook"
          - listitem:
            - link "Select if they want to make changes to their health and wellbeing":
              - /url: "#health_wellbeing_changes"
    `)

    await questions.health_wellbeing_changes.errorLink.click()
    await expect(questions.health_wellbeing_changes.input).toBeFocused()
    await questions.health_wellbeing_psychiatric_treatment.errorLink.click()
    await expect(questions.health_wellbeing_psychiatric_treatment.input).toBeFocused()
    await questions.health_wellbeing_neurodiverse_conditions.errorLink.click()
    await expect(questions.health_wellbeing_neurodiverse_conditions.input).toBeFocused()
    await questions.health_wellbeing_head_injury_or_illness.errorLink.click()
    await expect(questions.health_wellbeing_head_injury_or_illness.input).toBeFocused()
    await questions.health_wellbeing_coping_day_to_day_life.errorLink.click()
    await expect(questions.health_wellbeing_coping_day_to_day_life.input).toBeFocused()
    await questions.health_wellbeing_attitude_towards_self.errorLink.click()
    await expect(questions.health_wellbeing_attitude_towards_self.input).toBeFocused()
    await questions.health_wellbeing_attempted_suicide_or_suicidal_thoughts.errorLink.click()
    await expect(questions.health_wellbeing_attempted_suicide_or_suicidal_thoughts.input).toBeFocused()
    await questions.health_wellbeing_self_harmed.errorLink.click()
    await expect(questions.health_wellbeing_self_harmed.input).toBeFocused()
    await questions.health_wellbeing_outlook.errorLink.click()
    await expect(questions.health_wellbeing_outlook.input).toBeFocused()
  })
})
