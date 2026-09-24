import { Option } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/alcohol-use/constants/option'
import { Question } from '@server/forms/strengths-and-needs/versions/v1.0/journeys/alcohol-use/constants/question'
import { expect } from '@playwright/test'
import AlcoholUsePage from 'pages/strengthsAndNeeds/alcoholUsePage'
import { test, TargetService } from '../../../../support/fixtures'

test.describe('Validation', () => {
  test('validation on the alcohol use question', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await AlcoholUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId)
    const alcoholUsePage = await AlcoholUsePage.verifyOnPage(page, 'Has Test ever drunk alcohol?')
    const { questions } = alcoholUsePage

    await alcoholUsePage.saveAndContinue.click()
    await expect(alcoholUsePage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Select if they have ever drunk alcohol":
              - /url: "#alcohol_use"
    `)
    await questions.alcohol_use.errorLink.click()
    await expect(questions.alcohol_use.input).toBeFocused()
  })

  test('validation when they have drunk alcohol in the last 3 months', async ({
    page,
    createSession,
    strengthsAndNeedsBuilder,
    baseURL,
  }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder
      .extend(sanAssessmentId)
      .withAnswers([{ question: Question.alcohol_use, value: Option.yes_within_last_three_months }])
      .save()

    await AlcoholUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-details')

    const alcoholUsePage = await AlcoholUsePage.verifyOnPage(page, 'drunk alcohol in the last 3 months')

    const { questions } = alcoholUsePage

    await alcoholUsePage.saveAndContinue.click()
    await expect(alcoholUsePage.alert).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - /children: equal
          - listitem:
            - link "Select how often they drunk alcohol in the last 3 months":
              - /url: "#alcohol_frequency"
          - listitem:
            - link "Select how many units of alcohol they have on a typical day of drinking":
              - /url: "#alcohol_units"
          - listitem:
            - link "Select if they had 8 or more units within a single day of drinking in the last 3 months":
              - /url: "#alcohol_binge_drinking"
          - listitem:
            - link "Select if there's evidence of binge drinking or excessive alcohol use in the last 6 months":
              - /url: "#alcohol_evidence_of_excess_drinking"
          - listitem:
            - link "Select if they have any past issues with alcohol":
              - /url: "#alcohol_past_issues"
          - listitem:
            - link "Select why they drink alcohol":
              - /url: "#alcohol_reasons_for_use"
          - listitem:
            - link "Select the impact of them drinking alcohol, or select 'No impact'":
              - /url: "#alcohol_impact_of_use"
          - listitem:
            - link "Select if anything has helped them to stop or reduce drinking alcohol in the past":
              - /url: "#alcohol_stopped_or_reduced"
          - listitem:
            - link "Select if they want to make changes to their alcohol use":
              - /url: "#alcohol_use_changes"
      `)

    await questions.alcohol_frequency.errorLink.click()
    await expect(questions.alcohol_frequency.input).toBeFocused()
    await questions.alcohol_units.errorLink.click()
    await expect(questions.alcohol_units.input).toBeFocused()
    await questions.alcohol_binge_drinking.errorLink.click()
    await expect(questions.alcohol_binge_drinking.input).toBeFocused()
    await questions.alcohol_evidence_of_excess_drinking.errorLink.click()
    await expect(questions.alcohol_evidence_of_excess_drinking.input).toBeFocused()
    await questions.alcohol_past_issues.errorLink.click()
    await expect(questions.alcohol_past_issues.input).toBeFocused()
    await questions.alcohol_reasons_for_use.errorLink.click()
    await expect(questions.alcohol_reasons_for_use.input).toBeFocused()
    await questions.alcohol_impact_of_use.errorLink.click()
    await expect(questions.alcohol_impact_of_use.input).toBeFocused()
    await questions.alcohol_stopped_or_reduced.errorLink.click()
    await expect(questions.alcohol_stopped_or_reduced.input).toBeFocused()
    await questions.alcohol_use_changes.errorLink.click()
    await expect(questions.alcohol_use_changes.input).toBeFocused()
  })

  // The binge threshold is gender-based: 8 units for men, 6 for others.
  // It appears in both the question and the error.
  test.describe('Gender based binge drinking threshold', () => {
    test('male subject sees an 8-unit threshold in the question and validation error', async ({
      page,
      createSession,
      strengthsAndNeedsBuilder,
      baseURL,
    }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
        subject: { gender: '1' },
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId)
        .withAnswers([{ question: Question.alcohol_use, value: Option.yes_within_last_three_months }])
        .save()

      await AlcoholUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-details')

      await expect(
        page.getByRole('group', {
          name: 'Has Test had 8 or more units within a single day of drinking in the last 3 months?',
        }),
      ).toBeVisible()

      await page.getByRole('button', { name: 'Save and continue' }).click()
      await expect(
        page.getByRole('link', {
          name: 'Select if they had 8 or more units within a single day of drinking in the last 3 months',
        }),
      ).toBeVisible()
    })

    test('female subject sees a 6-unit threshold in the question and validation error', async ({
      page,
      createSession,
      strengthsAndNeedsBuilder,
      baseURL,
    }) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
        subject: { gender: '2' },
      })
      await strengthsAndNeedsBuilder
        .extend(sanAssessmentId)
        .withAnswers([{ question: Question.alcohol_use, value: Option.yes_within_last_three_months }])
        .save()

      await AlcoholUsePage.navigateTo(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-details')

      await expect(
        page.getByRole('group', {
          name: 'Has Test had 6 or more units within a single day of drinking in the last 3 months?',
        }),
      ).toBeVisible()

      await page.getByRole('button', { name: 'Save and continue' }).click()
      await expect(
        page.getByRole('link', {
          name: 'Select if they had 6 or more units within a single day of drinking in the last 3 months',
        }),
      ).toBeVisible()
    })
  })
})
