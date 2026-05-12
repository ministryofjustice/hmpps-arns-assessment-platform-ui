import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanHistoryPage from '../../../pages/sentencePlan/planHistoryPage'
import { handlePrivacyScreenIfPresent } from '../sentencePlanUtils'

test.describe('Plan History - Agreement event expanded content', () => {
  async function navigateToPlanHistory(page, handoverLink) {
    await page.goto(handoverLink)
    await handlePrivacyScreenIfPresent(page)
    await page.getByRole('link', { name: /View plan history/i }).click()
    return PlanHistoryPage.verifyOnPage(page)
  }

  function getSectionContent(page, headingPattern: RegExp) {
    return page
      .locator('.govuk-accordion__section', {
        has: page.locator('.govuk-accordion__section-button', { hasText: headingPattern }),
      })
      .locator('.govuk-accordion__section-content')
  }

  async function expandSection(page, headingPattern: RegExp) {
    await page
      .locator('.govuk-accordion__section-button', { hasText: headingPattern })
      .click()
  }

  test.describe('AGREED - notes present ', () => {
    test('should display notes in expanded content when plan is agreed with notes', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      // Arrange
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoal({ title: 'Test goal', areaOfNeed: 'accommodation', status: 'ACTIVE' })
        .withPlanAgreements([
          {
            status: 'AGREED',
            createdBy: 'Test Practitioner',
            notes: 'Person reviewed and agreed to all goals',
            dateOffset: 0,
          },
        ])
        .save()

      // Act
      await navigateToPlanHistory(page, handoverLink)
      await expandSection(page, /Plan agreed/)

      // Assert
      const content = getSectionContent(page, /Plan agreed/)
      await expect(content).toContainText('Person reviewed and agreed to all goals')
    })
  })

  test.describe('AGREED - no notes', () => {
    test('should display "No additional notes" in expanded content when plan is agreed without notes', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      // Arrange
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoal({ title: 'Test goal', areaOfNeed: 'accommodation', status: 'ACTIVE' })
        .withPlanAgreements([
          {
            status: 'AGREED',
            createdBy: 'Test Practitioner',
            dateOffset: 0,
          },
        ])
        .save()

      // Act
      await navigateToPlanHistory(page, handoverLink)
      await expandSection(page, /Plan agreed/)

      // Assert
      const content = getSectionContent(page, /Plan agreed/)
      await expect(content).toContainText('No additional notes')
    })
  })

  test.describe('UPDATED_AGREED - notes present', () => {
    test('should display notes in expanded content when agreement is updated to agreed with notes', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      // Arrange
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoal({ title: 'Test goal', areaOfNeed: 'accommodation', status: 'ACTIVE' })
        .withPlanAgreements([
          { status: 'COULD_NOT_ANSWER', createdBy: 'Test Practitioner', dateOffset: -86400000 },
          {
            status: 'UPDATED_AGREED',
            createdBy: 'Test Practitioner',
            notes: 'Person now agrees after follow-up discussion',
            dateOffset: 0,
          },
        ])
        .save()

      // Act
      await navigateToPlanHistory(page, handoverLink)
      await expandSection(page, /Agreement updated/)

      // Assert
      const content = getSectionContent(page, /Agreement updated/)
      await expect(content).toContainText('Person now agrees after follow-up discussion')
    })
  })

  test.describe('UPDATED_AGREED - no notes', () => {
    test('should display "No additional notes" when agreement is updated to agreed without notes', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      // Arrange
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoal({ title: 'Test goal', areaOfNeed: 'accommodation', status: 'ACTIVE' })
        .withPlanAgreements([
          { status: 'COULD_NOT_ANSWER', createdBy: 'Test Practitioner', dateOffset: -86400000 },
          { status: 'UPDATED_AGREED', createdBy: 'Test Practitioner', dateOffset: 0 },
        ])
        .save()

      // Act
      await navigateToPlanHistory(page, handoverLink)
      await expandSection(page, /Agreement updated/)

      // Assert
      const content = getSectionContent(page, /Agreement updated/)
      await expect(content).toContainText('No additional notes')
    })
  })

  test.describe('DO_NOT_AGREE - "No additional notes" not shown', () => {
    test('should not display "No additional notes" for DO_NOT_AGREE events — only applies to AGREED/UPDATED_AGREED', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      // Arrange
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoal({ title: 'Test goal', areaOfNeed: 'accommodation', status: 'ACTIVE' })
        .withPlanAgreements([{ status: 'DO_NOT_AGREE', createdBy: 'Test Practitioner', dateOffset: 0 }])
        .save()

      // Act
      await navigateToPlanHistory(page, handoverLink)
      await expandSection(page, /Plan created/)

      // Assert
      const content = getSectionContent(page, /Plan created/)
      await expect(content).not.toContainText('No additional notes')
    })
  })
})
