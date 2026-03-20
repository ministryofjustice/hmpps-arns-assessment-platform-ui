import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { handlePrivacyScreenIfPresent, sentencePlanV1URLs } from '../sentencePlanUtils'
import PreviousVersionsPage from '../../../pages/sentencePlan/previousVersionsPage'
import coordinatorApi from '../../../mockApis/coordinatorApi'
import { login } from '../../../testUtils'

const stubVersionsResponse = async (sentencePlanId: string) =>
  coordinatorApi.stubGetEntityVersions(sentencePlanId, {
    allVersions: {
      '2026-01-10': {
        description: 'Plan updated',
        assessmentVersion: null,
        planVersion: {
          uuid: sentencePlanId,
          version: 1768048800000,
          createdAt: '2026-01-10T10:00:00Z',
          updatedAt: '2026-01-10T10:00:00Z',
          status: 'UNSIGNED',
          planAgreementStatus: 'AGREED',
          entityType: 'AAP_PLAN',
        },
      },
    },
    countersignedVersions: {},
  })

const assertSentencePlanOnlyView = async (previousVersionsPage: PreviousVersionsPage, expectedName: string) => {
  await expect(previousVersionsPage.mainContent).toContainText(
    `Check versions of ${expectedName}'s current plan. The links will open in a new tab.`,
  )
  await expect(previousVersionsPage.mainContent).not.toContainText('current assessment and plan')

  await expect(previousVersionsPage.table).toHaveCount(1)

  const headers = previousVersionsPage.table.locator('thead th')
  await expect(headers).toHaveCount(3)
  await expect(headers.nth(0)).toContainText('Date and what was updated')
  await expect(headers.nth(1)).toContainText('Sentence plan')
  await expect(headers.nth(2)).toContainText('Status')
  await expect(previousVersionsPage.table).not.toContainText('Assessment')

  const rows = previousVersionsPage.table.locator('tbody tr')
  await expect(rows).toHaveCount(1)
  await expect(rows.first()).toContainText('Plan updated')
  await expect(rows.first()).not.toContainText('Assessment and plan updated')
  await expect(rows.first().locator('td')).toHaveCount(3)
  await expect(rows.first().locator('a', { hasText: 'View' })).toHaveAttribute('target', '_blank')
}

test.describe('Previous Versions - Sentence plan only', () => {
  test('shows sentence plan only columns and copy for national rollout users', async ({ page, createSession }) => {
    const { sentencePlanId, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
      assessmentType: 'SP',
    })

    await stubVersionsResponse(sentencePlanId)

    await page.goto(handoverLink)
    await handlePrivacyScreenIfPresent(page)

    await page.getByRole('link', { name: /View previous versions/i }).click()
    const previousVersionsPage = await PreviousVersionsPage.verifyOnPage(page)
    await assertSentencePlanOnlyView(previousVersionsPage, 'Test')
  })

  test('shows sentence plan only columns and copy for non-OASYS users', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    const { sentencePlanId, crn } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })

    await sentencePlanBuilder.extend(sentencePlanId).save()
    await stubVersionsResponse(sentencePlanId)

    await login(page)
    await page.goto(`${sentencePlanV1URLs.CRN_ENTRY_POINT}/${crn}`)
    await handlePrivacyScreenIfPresent(page)

    await page.getByRole('link', { name: /View previous versions/i }).click()
    const previousVersionsPage = await PreviousVersionsPage.verifyOnPage(page)
    await assertSentencePlanOnlyView(previousVersionsPage, 'Buster')
  })
})
