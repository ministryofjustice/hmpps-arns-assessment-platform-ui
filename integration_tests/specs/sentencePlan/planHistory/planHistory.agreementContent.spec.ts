import { expect } from '@playwright/test'
import { test, TargetService } from '../../../support/fixtures'
import PlanHistoryPage from '../../../pages/sentencePlan/planHistoryPage'
import { handlePrivacyScreenIfPresent, navigateToSentencePlan } from '../sentencePlanUtils'

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

  test.describe('UPDATED_AGREED - no notes', () => {
    test('should display "No additional notes" when agreement is updated to agreed (as there is no text field to add these)', async ({
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

  test.describe('DO_NOT_AGREE - notes present ', () => {
    test('should display details and notes in expanded content when plan is not agreed with notes', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoal({ title: 'Test goal', areaOfNeed: 'accommodation', status: 'ACTIVE' })
        .withPlanAgreements([
          {
            status: 'DO_NOT_AGREE',
            createdBy: 'Test Practitioner',
            detailsNo: 'Not agreed to plan',
            notes: 'Person reviewed and disagreed with goals',
            dateOffset: 0,
          },
        ])
        .save()

      await navigateToPlanHistory(page, handoverLink)
      await expandSection(page, /Plan created/)

      const content = getSectionContent(page, /Plan created/)
      await expect(content).toContainText('Not agreed to plan')
      await expect(content).toContainText('Person reviewed and disagreed with goals')
    })
  })

  test.describe('DO_NOT_AGREE - "No additional notes" not shown', () => {
    test('should display "No additional notes" in expanded content when plan is not agreed and no notes added ', async ({
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
      await expect(content).toContainText('No additional notes.')
    })
  })

  test.describe('UPDATED_DO_NOT_AGREE - mandatory details displayed, update agreement link removed', () => {
    test('should display details information when agreement is updated to not agreed (as there is no text field to add these), remove update agreement link', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoal({ title: 'Test goal', areaOfNeed: 'accommodation', status: 'ACTIVE' })
        .withPlanAgreements([
          { status: 'COULD_NOT_ANSWER', createdBy: 'Test Practitioner', dateOffset: -86400000 },
          {
            status: 'UPDATED_DO_NOT_AGREE',
            detailsNo: `Person doesn't agree`,
            createdBy: 'Test Practitioner',
            dateOffset: 0,
          },
        ])
        .save()

      await navigateToPlanHistory(page, handoverLink)
      await expandSection(page, /Agreement updated/)

      const content = getSectionContent(page, /Agreement updated/)
      await expect(content).toContainText(`Person doesn't agree`)

      await expandSection(page, /Plan created/)
      const agreementCreatedContent = getSectionContent(page, /Plan created/)
      await expect(agreementCreatedContent).not.toContainText(`Update Test's agreement`)
    })
  })

  test.describe('COULD_NOT_ANSWER - notes present ', () => {
    test('should display details and notes in expanded content when plan agreement status is COULD_NOT_ANSWER with notes', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoal({ title: 'Test goal', areaOfNeed: 'accommodation', status: 'ACTIVE' })
        .withPlanAgreements([
          {
            status: 'COULD_NOT_ANSWER',
            createdBy: 'Test Practitioner',
            detailsCouldNotAnswer: `Person wasn't present`,
            notes: `Person didn't attend appointment`,
            dateOffset: 0,
          },
        ])
        .save()

      await navigateToSentencePlan(page, handoverLink)
      await page.getByRole('link', { name: 'Plan history' }).click()
      await expandSection(page, /Plan created/)

      const content = getSectionContent(page, /Plan created/)
      await expect(content).toContainText(`Person wasn't present`)
      await expect(content).toContainText(`Person didn't attend appointment`)
    })
  })

  test.describe('COULD_NOT_ANSWER - "No additional notes" not shown', () => {
    test('should display "No additional notes" in expanded content when plan is not agreed and no notes added ', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoal({ title: 'Test goal', areaOfNeed: 'accommodation', status: 'ACTIVE' })
        .withPlanAgreements([
          {
            status: 'COULD_NOT_ANSWER',
            createdBy: 'Test Practitioner',
            detailsCouldNotAnswer: `Person wasn't present`,
            dateOffset: 0,
          },
        ])
        .save()

      await navigateToSentencePlan(page, handoverLink)
      await page.getByRole('link', { name: 'Plan history' }).click()
      await expandSection(page, /Plan created/)

      const content = getSectionContent(page, /Plan created/)
      await expect(content).toContainText('No additional notes.')
    })
  })
})
