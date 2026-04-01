import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { navigateToSentencePlan } from '../sentencePlanUtils'

const oneDay = 24 * 60 * 60 * 1000

test.describe('Plan Overview - Agreement Status Messages', () => {
  test('shows "Last updated" when plan is agreed and then modified', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withPlanAgreements([{ status: 'AGREED', dateOffset: -oneDay, createdBy: 'Jane Smith' }])
      .withGoals([
        {
          title: 'Find stable housing',
          areaOfNeed: 'accommodation',
          status: 'ACTIVE',
          targetDate: '2025-06-01',
          createdBy: 'Moses Hill',
          steps: [{ actor: 'probation_practitioner', description: 'Contact housing services' }],
        },
      ])
      .save()

    await navigateToSentencePlan(page, handoverLink)

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    await expect(planOverviewPage.planLastUpdatedMessage).toBeVisible()
    await expect(planOverviewPage.planLastUpdatedMessage).toContainText('Moses Hill')
    await expect(planOverviewPage.planLastUpdatedMessage).toContainText('View plan history')
    await expect(planOverviewPage.planAgreedMessage).not.toBeVisible()
  })

  test('shows "Last updated" when plan has "do not agree" status and then modified', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withPlanAgreements([{ status: 'DO_NOT_AGREE', dateOffset: -oneDay, createdBy: 'Jane Smith' }])
      .withGoals([
        {
          title: 'Get employment support',
          areaOfNeed: 'employment-and-education',
          status: 'ACTIVE',
          targetDate: '2025-06-01',
          createdBy: 'Moses Hill',
          steps: [{ actor: 'probation_practitioner', description: 'Register with job centre' }],
        },
      ])
      .save()

    await navigateToSentencePlan(page, handoverLink)

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    await expect(planOverviewPage.planLastUpdatedMessage).toBeVisible()
    await expect(planOverviewPage.planLastUpdatedMessage).toContainText('Moses Hill')
    await expect(planOverviewPage.planCreatedMessage).not.toBeVisible()
  })

  test('shows update agreement link for "could not answer" status even when modified after', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withPlanAgreements([
        {
          status: 'COULD_NOT_ANSWER',
          dateOffset: -oneDay,
          createdBy: 'Jane Smith',
          detailsCouldNotAnswer: 'Unable to contact',
        },
      ])
      .withGoals([
        {
          title: 'Find stable housing',
          areaOfNeed: 'accommodation',
          status: 'ACTIVE',
          targetDate: '2025-06-01',
          createdBy: 'Moses Hill',
          steps: [{ actor: 'probation_practitioner', description: 'Contact housing services' }],
        },
      ])
      .save()

    await navigateToSentencePlan(page, handoverLink)

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    await expect(planOverviewPage.updateAgreementLink).toBeVisible()
    await expect(planOverviewPage.planLastUpdatedMessage).not.toBeVisible()
  })

  test('shows no agreement message for draft plans', async ({ page, createSession, sentencePlanBuilder }) => {
    const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    await sentencePlanBuilder.extend(sentencePlanId).withGoals(currentGoals(1)).save()

    await navigateToSentencePlan(page, handoverLink)

    const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

    await expect(planOverviewPage.planAgreedMessage).not.toBeVisible()
    await expect(planOverviewPage.planCreatedMessage).not.toBeVisible()
    await expect(planOverviewPage.planLastUpdatedMessage).not.toBeVisible()
  })
})
