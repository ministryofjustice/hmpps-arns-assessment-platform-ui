import { expect, type Page } from '@playwright/test'
import { currentGoals, futureGoals, mixedGoals } from '../../builders/sentencePlanFactories'
import PlanOverviewPage from '../../pages/sentencePlan/planOverviewPage'
import PrintPreviewPage from '../../pages/sentencePlan/printPreviewPage'
import { test, TargetService } from '../../support/fixtures'
import { buildPageTitle, navigateToSentencePlan, sentencePlanPageTitles } from './sentencePlanUtils'

const oneDay = 24 * 60 * 60 * 1000

const openPrintPreview = async (page: Page, handoverLink: string): Promise<PrintPreviewPage> => {
  await navigateToSentencePlan(page, handoverLink)
  const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

  const [newPage] = await Promise.all([page.waitForEvent('popup'), planOverviewPage.printAllGoalsButton.click()])

  await expect(newPage).toHaveURL(/\/plan\/print-preview$/)
  await expect(newPage).toHaveTitle(buildPageTitle(sentencePlanPageTitles.printPreview))
  return PrintPreviewPage.verifyOnPage(newPage)
}

test.describe('Print preview', () => {
  test('opens in a new tab and displays all goals', async ({ page, createSession, sentencePlanBuilder }) => {
    const { sentencePlanId, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder.extend(sentencePlanId).withGoals(mixedGoals()).save()

    const printPreviewPage = await openPrintPreview(page, handoverLink)

    await expect(page).toHaveURL(/\/plan\/overview(?:\?type=current)?$/)
    await expect(printPreviewPage.goalCards).toHaveCount(3)
    expect(await printPreviewPage.getGoalTitles()).toEqual([
      'Find stable housing',
      'Get employment support',
      'Improve finances',
    ])
  })

  test('does not provide navigation back into the plan', async ({ page, createSession, sentencePlanBuilder }) => {
    const { sentencePlanId, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

    const printPreviewPage = await openPrintPreview(page, handoverLink)

    await expect(printPreviewPage.serviceHeaderName).toBeVisible()
    await expect(printPreviewPage.serviceHeaderLink).toHaveCount(0)
    await expect(printPreviewPage.primaryNavigation).toHaveCount(0)
    await expect(printPreviewPage.previousVersionsLink).toHaveCount(0)
    await expect(printPreviewPage.feedbackPhaseBanner).toHaveCount(0)
    await expect(printPreviewPage.backToTopLink).toHaveCount(0)
  })

  test('shows only the print-preview actions', async ({ page, createSession, sentencePlanBuilder }) => {
    const { sentencePlanId, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

    const printPreviewPage = await openPrintPreview(page, handoverLink)

    await expect(printPreviewPage.exportAsPdfButton).toBeVisible()
    await expect(printPreviewPage.exportAsPdfButton).toHaveAttribute(
      'href',
      '/sentence-plan/v1.0/plan/print-preview/pdf',
    )
    await expect(printPreviewPage.printButton).toBeVisible()
    await expect(printPreviewPage.printAllGoalsButton).toHaveCount(0)
  })

  test('shows the DRAFT watermark on screen and when printing a plan that has not been agreed', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    const { sentencePlanId, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

    const printPreviewPage = await openPrintPreview(page, handoverLink)

    await expect(printPreviewPage.draftWatermark).toBeVisible()
    await expect(printPreviewPage.draftWatermark).toHaveText('DRAFT')

    await printPreviewPage.page.emulateMedia({ media: 'print' })

    await expect(printPreviewPage.draftWatermark).toBeVisible()
    await expect(printPreviewPage.draftWatermark).toHaveText('DRAFT')
  })

  test('shows the DRAFT watermark on screen and when printing a plan marked as could not answer', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    const { sentencePlanId, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withPlanAgreements([{ status: 'COULD_NOT_ANSWER', dateOffset: -oneDay, createdBy: 'Jane Smith' }])
      .withGoals(currentGoals(1))
      .save()

    const printPreviewPage = await openPrintPreview(page, handoverLink)

    await expect(printPreviewPage.draftWatermark).toBeVisible()
    await expect(printPreviewPage.draftWatermark).toHaveText('DRAFT')

    await printPreviewPage.page.emulateMedia({ media: 'print' })

    await expect(printPreviewPage.draftWatermark).toBeVisible()
    await expect(printPreviewPage.draftWatermark).toHaveText('DRAFT')
  })

  test('does not show the DRAFT watermark on screen or when printing an agreed plan', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    const { sentencePlanId, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withPlanAgreements([{ status: 'AGREED', dateOffset: -oneDay, createdBy: 'Jane Smith' }])
      .withGoals(currentGoals(1))
      .save()

    const printPreviewPage = await openPrintPreview(page, handoverLink)

    await expect(printPreviewPage.draftWatermark).toHaveCount(0)

    await printPreviewPage.page.emulateMedia({ media: 'print' })

    await expect(printPreviewPage.draftWatermark).toHaveCount(0)
  })

  test.describe('Print all goals button', () => {
    test('is hidden when a draft plan has no goals', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
      })
      await sentencePlanBuilder.extend(sentencePlanId).save()

      await navigateToSentencePlan(page, handoverLink)
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await expect(planOverviewPage.printAllGoalsButton).toHaveCount(0)
    })

    test('is shown when a draft plan only has future goals', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
      })
      await sentencePlanBuilder.extend(sentencePlanId).withGoals(futureGoals(1)).save()

      await navigateToSentencePlan(page, handoverLink)
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await expect(planOverviewPage.printAllGoalsButton).toBeVisible()
    })

    test('is shown when a draft plan only has achieved goals', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
      })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([{ title: 'Achieved goal', areaOfNeed: 'accommodation', status: 'ACHIEVED' }])
        .save()

      await navigateToSentencePlan(page, handoverLink)
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await expect(planOverviewPage.printAllGoalsButton).toBeVisible()
    })

    test('is shown when an agreed plan has no goals', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({
        targetService: TargetService.SENTENCE_PLAN,
      })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withPlanAgreements([{ status: 'AGREED', dateOffset: -oneDay, createdBy: 'Jane Smith' }])
        .save()

      await navigateToSentencePlan(page, handoverLink)
      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      await expect(planOverviewPage.printAllGoalsButton).toBeVisible()
    })
  })
})
