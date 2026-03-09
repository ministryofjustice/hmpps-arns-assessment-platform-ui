import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { currentGoalsWithCompletedSteps } from '../../../builders/sentencePlanFactories'
import { buildPageTitle, handlePrivacyScreenIfPresent, sentencePlanPageTitles } from '../sentencePlanUtils'
import HistoricPlanPage from '../../../pages/sentencePlan/historicPlanPage'

test.describe('Previous Versions - Handover Redirect', () => {
  test('should redirect to historic plan view when handover provides a planVersion', async ({
    page,
    coordinatorBuilder,
    sentencePlanBuilder,
    handoverBuilder,
  }) => {
    const coordinator = coordinatorBuilder.create()
    const association = await coordinator.save()

    await sentencePlanBuilder
      .extend(association.sentencePlanId)
      .withGoals(currentGoalsWithCompletedSteps(2))
      .withAgreementStatus('AGREED')
      .save()

    await coordinator.lock(association)
    const signed = await coordinator.sign(association)

    const session = await handoverBuilder
      .forAssociation(association)
      .withPlanVersion(signed.sentencePlanVersion)
      .save()

    const handoverUrl = new URL(session.handoverLink)
    handoverUrl.searchParams.set('clientId', 'sentence-plan')

    await page.goto(handoverUrl.toString())
    await handlePrivacyScreenIfPresent(page)

    await expect(page).toHaveURL(/\/plan\/view-historic\//)
    await expect(page).toHaveURL(/type=current/)
    await expect(page).toHaveTitle(buildPageTitle(sentencePlanPageTitles.historicPlan))

    const historicPlanPage = await HistoricPlanPage.verifyOnPage(page)
    await expect(historicPlanPage.alertHeading).toContainText('This version is from')
  })

  test('should navigate to plan overview when handover does not provide a planVersion', async ({
    page,
    createSession,
  }) => {
    const { handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })

    await page.goto(handoverLink)
    await handlePrivacyScreenIfPresent(page)

    await expect(page).toHaveURL(/\/plan\/overview/)
    await expect(page).toHaveTitle(buildPageTitle(sentencePlanPageTitles.planOverview))
  })
})
