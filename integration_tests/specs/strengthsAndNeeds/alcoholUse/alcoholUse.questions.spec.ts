import { expect } from '@playwright/test'
import AlcoholUsePage from 'pages/strengthsAndNeeds/alcoholUsePage'
import { test, TargetService } from '../../../support/fixtures'
import { alcohol, buildPageTitle, navigateToStrengthsAndNeeds, sanFormPath, sanPageTitles, v1Path } from '../sanUtils'

test.describe('Questions', () => {
  test('shows the alcohol use question', async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })
    await strengthsAndNeedsBuilder.fresh().save()

    await AlcoholUsePage.navigateToAlcoholUse(page, handoverLink, baseURL, sanAssessmentId)

    const alcoholUsePage = await AlcoholUsePage.verifyOnPage(page, 'Has Test ever drunk alcohol?')

    await expect(page).toHaveTitle(buildPageTitle(sanPageTitles.alcoholUse))

    await expect(alcoholUsePage.mainForm).toMatchAriaSnapshot(`
      - group /Has Test ever drunk alcohol?/:
        - text: /Has Test ever drunk alcohol?/
        - radio "Yes, including the last 3 months"
        - text: Yes, including the last 3 months
        - radio "Yes, but not in the last 3 months"
        - text: Yes, but not in the last 3 months
        - radio "No"
        - text: "No"
      - button "Save and continue"
    `)
  })

  test('shows the questions when they have drunk alcohol in the last 3 months', async ({
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
      .withAnswers([{ question: 'alcohol_use', value: 'YES_WITHIN_LAST_THREE_MONTHS' }])
      .save()

    await AlcoholUsePage.navigateToAlcoholUse(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-details')

    // Recency questions, only shown on this branch
    await expect(
      page.getByRole('group', { name: 'How often has Test drunk alcohol in the last 3 months?' }),
    ).toBeVisible()
    await expect(
      page.getByRole('group', { name: 'How many units of alcohol does Test have on a typical day of drinking?' }),
    ).toBeVisible()
    await expect(page.getByRole('group', { name: /within a single day of drinking/ })).toBeVisible()

    // Base usage questions, shared with the "not in the last 3 months" branch
    await expect(
      page.getByRole('group', {
        name: 'Has Test shown evidence of binge drinking or excessive alcohol use in the last 6 months?',
      }),
    ).toBeVisible()
    await expect(page.getByRole('group', { name: 'Does Test have any past issues with alcohol?' })).toBeVisible()
    await expect(page.getByRole('group', { name: 'Why does Test drink alcohol?' })).toBeVisible()
    await expect(page.getByRole('group', { name: "What's the impact of Test drinking alcohol?" })).toBeVisible()
    await expect(
      page.getByRole('group', {
        name: 'Has anything helped Test to stop or reduce drinking alcohol in the past?',
      }),
    ).toBeVisible()
    await expect(
      page.getByRole('group', { name: 'Does Test want to make changes to their alcohol use?' }),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Save and continue' })).toBeVisible()

    // Fields render with id = their code, so the summary "Change" links can link to them.
    await expect(page.locator('#alcohol_frequency')).toBeAttached()
  })

  test('hides the last-3-months questions when they have not drunk alcohol recently', async ({
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
      .withAnswers([{ question: 'alcohol_use', value: 'YES_NOT_IN_LAST_THREE_MONTHS' }])
      .save()

    await AlcoholUsePage.navigateToAlcoholUse(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-details')

    // Base usage questions are still shown
    await expect(
      page.getByRole('group', {
        name: 'Has Test shown evidence of binge drinking or excessive alcohol use in the last 6 months?',
      }),
    ).toBeVisible()
    await expect(
      page.getByRole('group', { name: 'Does Test want to make changes to their alcohol use?' }),
    ).toBeVisible()

    // Recency questions must not appear on this branch
    await expect(
      page.getByRole('group', { name: 'How often has Test drunk alcohol in the last 3 months?' }),
    ).toHaveCount(0)
    await expect(
      page.getByRole('group', { name: 'How many units of alcohol does Test have on a typical day of drinking?' }),
    ).toHaveCount(0)
  })

  test('shows a minimal summary and no usage questions when they have never drunk alcohol', async ({
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
      .withAnswers([{ question: 'alcohol_use', value: 'NO' }])
      .save()

    // "No" skips the usage questions and routes straight to the summary.
    await AlcoholUsePage.navigateToAlcoholUse(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-summary')

    // Summary list keys/values are not exposed as ARIA roles, so match on text.
    // The alcohol use answer is shown...
    await expect(page.getByText('Has Test ever drunk alcohol?')).toBeVisible()

    // ...but the usage questions are omitted, because they only apply when they have drunk alcohol.
    await expect(
      page.getByText('Has Test shown evidence of binge drinking or excessive alcohol use in the last 6 months?'),
    ).toHaveCount(0)
    await expect(page.getByText('Why does Test drink alcohol?')).toHaveCount(0)
    await expect(page.getByText('How often has Test drunk alcohol in the last 3 months?')).toHaveCount(0)
  })

  test('summary Change link deep-links to the specific question, not the top of the page', async ({
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
      .withAnswers([{ question: 'alcohol_use', value: 'NO' }])
      .save()

    await AlcoholUsePage.navigateToAlcoholUse(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-summary')

    // The "Change" link anchors to the question, not the top of the target page.
    const changeAlcoholUse = page.locator('a[href$="#alcohol_use"]')
    await expect(changeAlcoholUse).toBeVisible()
    await changeAlcoholUse.click()

    // brings the question into view and focuses the first
    // option while the title stays visible.
    await expect(page).toHaveURL(/#alcohol_use$/)
    await expect(page.getByLabel('Yes, including the last 3 months')).toBeFocused()
    await expect(page.getByRole('group', { name: 'Has Test ever drunk alcohol?' })).toBeVisible()
  })

  test('links into the practitioner-analysis tab (activates the hidden tab)', async ({
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
      .withAnswers([{ question: 'alcohol_use', value: 'NO' }])
      .save()

    // Practitioner questions live in a tab that is hidden by default. A "Change" link that
    // targets one of those questions must activate that tab first
    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.goto(
      `${baseURL}${sanFormPath}${v1Path}/edit/${sanAssessmentId}${alcohol}/alcohol-use-summary#alcohol_use_practitioner_analysis_strengths_or_protective_factors`,
    )

    await expect(page.locator('#practitioner-analysis')).toBeVisible()
    await expect(page.getByRole('group', { name: /strengths or protective factors related to/ })).toBeVisible()
  })

  test('go to practitioner analysis button works on the analysis page after the section is marked complete', async ({
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
      .withAnswers([
        { question: 'alcohol_use', value: 'NO' },
        { question: 'alcohol_use_practitioner_analysis_strengths_or_protective_factors', value: 'NO' },
        { question: 'alcohol_use_practitioner_analysis_risk_of_serious_harm', value: 'NO' },
        { question: 'alcohol_use_practitioner_analysis_risk_of_reoffending', value: 'NO' },
      ])
      .save()

    // Reach the analysis page via the real flow: summary -> practitioner tab -> Mark as complete.
    await AlcoholUsePage.navigateToAlcoholUse(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-summary')
    await page.getByRole('button', { name: 'Go to practitioner analysis' }).click()
    await page.getByRole('button', { name: 'Mark as complete' }).click()

    // Lands focused on the read only practitioner analysis tab, not the editable form.
    await expect(page).toHaveURL(/\/alcohol-use-analysis#practitioner-analysis$/)
    await expect(page.locator('#practitioner-analysis')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Mark as complete' })).toBeHidden()

    // The Summary tabs button returns to that same read only view on the same page.
    await page.getByRole('tab', { name: 'Summary' }).click()
    await page.getByRole('button', { name: 'Go to practitioner analysis' }).click()
    await expect(page.locator('#practitioner-analysis')).toBeVisible()
    await expect(page).toHaveURL(/\/alcohol-use-analysis#practitioner-analysis$/)
  })

  test('reveals the details field when a past issue with alcohol is selected', async ({
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
      .withAnswers([
        { question: 'alcohol_use', value: 'YES_NOT_IN_LAST_THREE_MONTHS' },
        { question: 'alcohol_past_issues', value: 'YES' },
      ])
      .save()

    await AlcoholUsePage.navigateToAlcoholUse(page, handoverLink, baseURL, sanAssessmentId, 'alcohol-use-details')

    await expect(page.getByRole('textbox', { name: 'Give details' }).first()).toBeVisible()
  })
})
