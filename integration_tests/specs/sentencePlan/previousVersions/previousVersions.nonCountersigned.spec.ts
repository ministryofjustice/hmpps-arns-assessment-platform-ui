import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import { handlePrivacyScreenIfPresent } from '../sentencePlanUtils'
import PreviousVersionsPage from '../../../pages/sentencePlan/previousVersionsPage'
import sanApi from '../../../mockApis/sanApi'

test.describe('Previous Versions - Multiple non-countersigned previous versions', () => {
  test('it lists multiple previous versions of the plan', async ({ page, createSession, sentencePlanBuilder }) => {
    const { sentencePlanId, sanAssessmentId, handoverLink } = await createSession({
      targetService: TargetService.SENTENCE_PLAN,
    })

    const today = new Date()
    const yesterday = new Date()
    const threeDaysAgo = new Date()

    yesterday.setDate(today.getDate() - 1)
    threeDaysAgo.setDate(today.getDate() - 3)

    await sanApi.stubGetAssessmentVersions(sanAssessmentId, [
      {
        uuid: `${crypto.randomUUID()}`,
        createdAt: `${today.toISOString()}`,
        updatedAt: `${today.toISOString()}`,
        tag: 'LOCKED',
        versionNumber: 2,
      },
      {
        uuid: `${crypto.randomUUID()}`,
        createdAt: `${yesterday.toISOString()}`,
        updatedAt: `${yesterday.toISOString()}`,
        tag: 'UNSIGNED',
        versionNumber: 1,
      },
      {
        uuid: `${crypto.randomUUID()}`,
        createdAt: `${threeDaysAgo.toISOString()}`,
        updatedAt: `${threeDaysAgo.toISOString()}`,
        tag: 'UNSIGNED',
        versionNumber: 0,
      },
    ])

    await sentencePlanBuilder
      .extend(sentencePlanId)
      .withGoal({
        title: 'Active goal',
        areaOfNeed: 'accommodation',
        status: 'ACTIVE',
        steps: [{ actor: 'probation_practitioner', description: 'Test step' }],
      })
      .withGoal({
        title: 'Another active goal',
        areaOfNeed: 'accommodation',
        status: 'ACTIVE',
        steps: [{ actor: 'probation_practitioner', description: 'Test step' }],
      })
      .withGoal({
        title: 'Achieved goal',
        areaOfNeed: 'alcohol-use',
        status: 'ACHIEVED',
        achievedBy: 'Achievement Practitioner',
      })
      .withEventsBackdated(threeDaysAgo, today)
      .save()

    await page.goto(handoverLink)
    await handlePrivacyScreenIfPresent(page)

    await page.getByRole('link', { name: /View previous versions/i }).click()
    const previousVersionsPage = await PreviousVersionsPage.verifyOnPage(page)

    // Verify message is shown when previous versions exist
    await expect(previousVersionsPage.mainContent).toContainText(
      "Check versions of Test's current assessment and plan. The links will open in a new tab.",
    )

    // Verify previous versions table is shown
    await expect(previousVersionsPage.table).toHaveCount(1)

    // Verify table content
    await expect(previousVersionsPage.tableCaption).toHaveCount(0)

    // Table headers
    const dateColumnIndex = 0
    const assessmentColumnIndex = 1
    const planColumnIndex = 2
    const statusColumnIndex = 3

    const headers = previousVersionsPage.table.locator('thead th')
    await expect(headers).toHaveCount(4)

    await expect(headers.nth(dateColumnIndex)).toContainText('Date and what was updated')
    await expect(headers.nth(assessmentColumnIndex)).toContainText('Assessment')
    await expect(headers.nth(planColumnIndex)).toContainText('Sentence plan')
    await expect(headers.nth(statusColumnIndex)).toContainText('Status')

    // Row count
    const expectedRowCaptions = ['Assessment and plan updated', 'Plan updated', 'Assessment and plan updated']
    const rows = previousVersionsPage.table.locator('tbody tr')
    await expect(rows).toHaveCount(expectedRowCaptions.length)

    // Iterate rows
    for (let index = 0; index < expectedRowCaptions.length; index++) {
      const row = rows.nth(index)
      const columns = row.locator('td')

      // eslint-disable-next-line no-await-in-loop
      await expect(columns).toHaveCount(4)

      const expectedDate = new Date()
      expectedDate.setDate(today.getDate() - index - 1)
      const expectedFormattedDate = expectedDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })

      // eslint-disable-next-line no-await-in-loop
      await expect(columns.nth(dateColumnIndex)).toContainText(expectedFormattedDate)
      // eslint-disable-next-line no-await-in-loop
      await expect(columns.nth(dateColumnIndex)).toContainText(expectedRowCaptions[index])
      // eslint-disable-next-line no-await-in-loop
      await expect(columns.nth(statusColumnIndex)).toBeEmpty()

      for (const linkIndex of [assessmentColumnIndex, planColumnIndex]) {
        const link = columns.nth(linkIndex).locator('a', { hasText: 'View' })
        // eslint-disable-next-line no-await-in-loop
        await expect(link).toHaveAttribute('target', '_blank')
      }
    }
  })
})
