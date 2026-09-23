import { expect } from '@playwright/test'
import { VersionsTable } from '@server/interfaces/coordinator-api/previousVersions'
import { test, TargetService } from '../../../support/fixtures'
import { navigateToStrengthsAndNeeds, checkAccessibility, formatOrdinalDate } from '../sanUtils'
import PreviousVersionsPage from '../../../pages/strengthsAndNeeds/previousVersionsPage'
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

    await navigateToStrengthsAndNeeds(page, handoverLink)
    await page.getByRole('link', { name: /View previous versions/i }).click()
    const previousVersionsPage = await PreviousVersionsPage.verifyOnPage(page, 'Previous versions')

    // Verify message is shown when previous versions exist
    await expect(previousVersionsPage.mainContent).toContainText(
      "Check versions of Test's current assessment. The links will open in a new tab.",
    )

    // Verify both previous versions tables are shown
    await expect(previousVersionsPage.table).toHaveCount(2)
    const countersignedTable = previousVersionsPage.table.first()
    const allVersionsTable = previousVersionsPage.table.last()

    // Verify table captions
    await expect(previousVersionsPage.tableCaption.first()).toContainText('Countersigned versions')
    await expect(previousVersionsPage.tableCaption.last()).toContainText('All versions')

    // Table headers
    for (const table of [countersignedTable, allVersionsTable]) {
      expect(table.getByRole('columnheader')).toHaveCount(4)
      expect(table.getByRole('columnheader', { name: 'Date' })).toBeVisible()
      expect(table.getByRole('columnheader', { name: 'Assessment' })).toBeVisible()
      expect(table.getByRole('columnheader', { name: 'Plan' })).toBeVisible()
      expect(table.getByRole('columnheader', { name: 'Status' })).toBeVisible()
    }

    // Countersigned table: today's entry trimmed, only yesterday remains
    const countersignedRows = countersignedTable.locator('tbody').getByRole('row')
    await expect(countersignedRows).toHaveCount(2)

    const expectedCountersignedDate = formatOrdinalDate(today)

    await expect(countersignedRows.first().getByRole('cell', { name: expectedCountersignedDate }).first()).toBeVisible()
    await expect(countersignedRows.first().getByRole('cell', { name: 'Assessment and plan updated' })).toBeVisible()
    await expect(countersignedRows.first().getByRole('cell', { name: 'Countersigned' })).toBeVisible()

    const viewLinks = countersignedRows.first().getByRole('link', { name: 'View' })
    await expect(viewLinks).toHaveCount(2)
    await expect(viewLinks.first()).toHaveAttribute('target', '_blank')
    await expect(viewLinks.last()).toHaveAttribute('target', '_blank')

    // All Versions table: today's entry trimmed, only yesterday remains
    const allVersionsRows = allVersionsTable.locator('tbody').getByRole('row')
    await expect(allVersionsRows).toHaveCount(2)

    await expect(allVersionsRows.first().getByRole('cell', { name: expectedCountersignedDate }).first()).toBeVisible()
    await expect(allVersionsRows.first().getByRole('cell', { name: 'Assessment and plan updated' })).toBeVisible()

    await checkAccessibility(page, { include: '#main-content' })

  })
})
