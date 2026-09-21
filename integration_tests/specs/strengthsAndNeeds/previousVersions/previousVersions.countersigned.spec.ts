import { expect } from '@playwright/test'
import { VersionsTable } from '@server/interfaces/coordinator-api/previousVersions'
import { test, TargetService } from '../../../support/fixtures'
import { handlePrivacyScreenIfPresent } from '../../sentencePlan/sentencePlanUtils'
import { formatOrdinalDate } from '../sanUtils'
import PreviousVersionsPage from '../../../pages/sentencePlan/previousVersionsPage'
import coordinatorApi from '../../../mockApis/coordinatorApi'

test.describe('Previous Versions - Countersigned', () => {
  test('should show countersigned versions from previous days in a separate table', async ({ page, createSession }) => {
    const { handoverLink, sanAssessmentId } = await createSession({
      targetService: TargetService.STRENGTHS_AND_NEEDS,
    })

    const today = new Date()
    const yesterday = new Date()

    yesterday.setDate(today.getDate() - 1)

    const countersignedVersions: VersionsTable = {
      [`${today.toISOString().split('T')[0]}`]: {
        description: 'Assessment and plan updated',
        assessmentVersion: {
          uuid: crypto.randomUUID(),
          version: 3,
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
      [`${yesterday.toISOString().split('T')[0]}`]: {
        description: 'Assessment and plan updated',
        assessmentVersion: {
          uuid: crypto.randomUUID(),
          version: 2,
          createdAt: yesterday.toISOString(),
          updatedAt: yesterday.toISOString(),
          status: 'COUNTERSIGNED',
          planAgreementStatus: '',
          entityType: 'ASSESSMENT',
        },
        planVersion: {
          uuid: crypto.randomUUID(),
          version: yesterday.getTime(),
          createdAt: yesterday.toISOString(),
          updatedAt: yesterday.toISOString(),
          status: 'COUNTERSIGNED',
          planAgreementStatus: '',
          entityType: 'AAP_PLAN',
        },
      },
    }

    await coordinatorApi.stubGetEntityVersions(sanAssessmentId, {
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

    expect(true).toBe(true)

    await page.goto(handoverLink)
    await handlePrivacyScreenIfPresent(page)

    await page.getByRole('link', { name: /View previous versions/i }).click()
    const previousVersionsPage = await PreviousVersionsPage.verifyOnPage(page)

    // Verify message is shown when previous versions exist
    await expect(previousVersionsPage.mainContent).toContainText(
      "Check versions of Test's current assessment. The links will open in a new tab.",
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
      await expect(headers.nth(dateColumnIndex)).toContainText('Date')
      // eslint-disable-next-line no-await-in-loop
      await expect(headers.nth(assessmentColumnIndex)).toContainText('Assessment')
      // eslint-disable-next-line no-await-in-loop
      await expect(headers.nth(planColumnIndex)).toContainText('Plan')
      // eslint-disable-next-line no-await-in-loop
      await expect(headers.nth(statusColumnIndex)).toContainText('Status')
    }

    // Countersigned table: today's entry trimmed, only yesterday remains
    const countersignedRows = countersignedTable.locator('tbody tr')
    await expect(countersignedRows).toHaveCount(2)
    const countersignedColumns = countersignedRows.first().locator('td')

    await expect(countersignedColumns).toHaveCount(4)

    const expectedCountersignedDate = formatOrdinalDate(today)

    await expect(countersignedColumns.nth(dateColumnIndex)).toContainText(expectedCountersignedDate)
    await expect(countersignedColumns.nth(dateColumnIndex)).toContainText('Assessment and plan updated')
    await expect(countersignedColumns.nth(statusColumnIndex)).toContainText('Countersigned')

    for (const linkIndex of [assessmentColumnIndex, planColumnIndex]) {
      const link = countersignedColumns.nth(linkIndex).locator('a', { hasText: 'View' })
      // eslint-disable-next-line no-await-in-loop
      await expect(link).toHaveAttribute('target', '_blank')
    }

    // All Versions table: today's entry trimmed, only yesterday remains
    const allVersionsRows = allVersionsTable.locator('tbody tr')
    await expect(allVersionsRows).toHaveCount(2)

    const allVersionsColumns = allVersionsRows.first().locator('td')
    await expect(allVersionsColumns.nth(dateColumnIndex)).toContainText(expectedCountersignedDate)
    await expect(allVersionsColumns.nth(dateColumnIndex)).toContainText('Assessment and plan updated')

  })
})
