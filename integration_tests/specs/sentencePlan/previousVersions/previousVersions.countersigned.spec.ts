import { expect } from '@playwright/test'
import { VersionsTable } from '@server/interfaces/coordinator-api/previousVersions'
import { test, TargetService } from '../../../support/fixtures'
import { handlePrivacyScreenIfPresent } from '../sentencePlanUtils'
import PreviousVersionsPage from '../../../pages/sentencePlan/previousVersionsPage'
import coordinatorApi from '../../../mockApis/coordinatorApi'

test.describe('Previous Versions - Multiple previous versions, including Countersigned', () => {
  test('it lists countersigned versions in a separate table', async ({ page, createSession }) => {
    const { sentencePlanId, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })

    const today = new Date()
    const yesterday = new Date()

    yesterday.setDate(today.getDate() - 1)

    const countersignedVersions: VersionsTable = {
      [`${today.toISOString().split('T')[0]}`]: {
        description: 'Assessment and plan updated',
        assessmentVersion: {
          uuid: crypto.randomUUID(),
          version: 2,
          createdAt: today.toISOString(),
          updatedAt: today.toISOString(),
          status: 'COUNTERSIGNED',
          planAgreementStatus: '',
          entityType: 'ASSESSMENT',
        },
        planVersion: {
          uuid: crypto.randomUUID(),
          version: today.getTime(),
          createdAt: today.toISOString(),
          updatedAt: today.toISOString(),
          status: 'COUNTERSIGNED',
          planAgreementStatus: '',
          entityType: 'AAP_PLAN',
        },
      },
    }

    await coordinatorApi.stubGetEntityVersions(sentencePlanId, {
      allVersions: {
        [`${yesterday.toISOString().split('T')[0]}`]: {
          description: 'Plan updated',
          assessmentVersion: null,
          planVersion: {
            uuid: crypto.randomUUID(),
            version: yesterday.getTime(),
            createdAt: yesterday.toISOString(),
            updatedAt: yesterday.toISOString(),
            status: 'UNSIGNED',
            planAgreementStatus: 'AGREED',
            entityType: 'AAP_PLAN',
          },
        },
        ...countersignedVersions,
      },
      countersignedVersions,
    })

    await page.goto(handoverLink)
    await handlePrivacyScreenIfPresent(page)

    await page.getByRole('link', { name: /View previous versions/i }).click()
    const previousVersionsPage = await PreviousVersionsPage.verifyOnPage(page)

    // Verify message is shown when previous versions exist
    await expect(previousVersionsPage.mainContent).toContainText(
      "Check versions of Test's current assessment and plan. The links will open in a new tab.",
    )

    // Verify both previous versions tables are shown
    await expect(previousVersionsPage.table).toHaveCount(2)
    const countersignedTable = previousVersionsPage.table.first()
    const allVersionsTable = previousVersionsPage.table.last()

    // Verify table captions
    await expect(previousVersionsPage.tableCaption).toHaveCount(2)
    await expect(previousVersionsPage.tableCaption.first()).toContainText('Countersigned versions')
    await expect(previousVersionsPage.tableCaption.last()).toContainText('All versions')

    // Table headers
    const dateColumnIndex = 0
    const assessmentColumnIndex = 1
    const planColumnIndex = 2
    const statusColumnIndex = 3

    for (const table of [countersignedTable, allVersionsTable]) {
      const headers = table.locator('thead th')
      // eslint-disable-next-line no-await-in-loop
      await expect(headers).toHaveCount(4)

      // eslint-disable-next-line no-await-in-loop
      await expect(headers.nth(dateColumnIndex)).toContainText('Date and what was updated')
      // eslint-disable-next-line no-await-in-loop
      await expect(headers.nth(assessmentColumnIndex)).toContainText('Assessment')
      // eslint-disable-next-line no-await-in-loop
      await expect(headers.nth(planColumnIndex)).toContainText('Sentence plan')
      // eslint-disable-next-line no-await-in-loop
      await expect(headers.nth(statusColumnIndex)).toContainText('Status')
    }

    // Verify Countersigned table content
    const countersignedRows = countersignedTable.locator('tbody tr')
    await expect(countersignedRows).toHaveCount(1)
    const countersignedColumns = countersignedRows.first().locator('td')

    await expect(countersignedColumns).toHaveCount(4)

    const expectedCountersignedDate = today.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    await expect(countersignedColumns.nth(dateColumnIndex)).toContainText(expectedCountersignedDate)
    await expect(countersignedColumns.nth(dateColumnIndex)).toContainText('Assessment and plan updated')
    await expect(countersignedColumns.nth(statusColumnIndex)).toContainText('Countersigned')

    for (const linkIndex of [assessmentColumnIndex, planColumnIndex]) {
      const link = countersignedColumns.nth(linkIndex).locator('a', { hasText: 'View' })
      // eslint-disable-next-line no-await-in-loop
      await expect(link).toHaveAttribute('target', '_blank')
    }

    // Verify All Versions table content
    const allVersionsRows = allVersionsTable.locator('tbody tr')
    await expect(allVersionsRows).toHaveCount(1)
    const allVersionsColumns = allVersionsRows.first().locator('td')

    await expect(allVersionsColumns).toHaveCount(4)

    const expectedAgreedDate = yesterday.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    await expect(allVersionsColumns.nth(dateColumnIndex)).toContainText(expectedAgreedDate)
    await expect(allVersionsColumns.nth(dateColumnIndex)).toContainText('Plan updated')
    await expect(allVersionsColumns.nth(statusColumnIndex)).toContainText('Plan agreed')

    const assessmentLink = allVersionsColumns.nth(assessmentColumnIndex).locator('a', { hasText: 'View' })
    await expect(assessmentLink).toHaveCount(0)

    const planLink = allVersionsColumns.nth(planColumnIndex).locator('a', { hasText: 'View' })
    await expect(planLink).toHaveAttribute('target', '_blank')
  })
})
