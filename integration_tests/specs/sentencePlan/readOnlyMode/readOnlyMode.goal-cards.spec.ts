import { expect } from '@playwright/test'
import { test } from '../../../support/fixtures'
import PlanOverviewPage from '../../../pages/sentencePlan/planOverviewPage'
import { currentGoals } from '../../../builders/sentencePlanFactories'
import {} from '../sentencePlanUtils'

test.describe('READ_ONLY Access Mode', () => {
  test.describe('Draft Goal Card Actions', () => {
    test('hides Update goal, Add or update steps, and Delete links', async ({ page, openSentencePlan }) => {
      await openSentencePlan({
        session: { planAccessMode: 'READ_ONLY' },
        plan: builder => builder.withGoals(currentGoals(1)),
      })

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      const hasUpdateGoalLink = await planOverviewPage.goalCardHasUpdateGoalLink(0)
      const hasAddUpdateStepsLink = await planOverviewPage.goalCardHasAddUpdateStepsLink(0)
      const hasDeleteLink = await planOverviewPage.goalCardHasDeleteLink(0)

      expect(hasUpdateGoalLink).toBe(false)
      expect(hasAddUpdateStepsLink).toBe(false)
      expect(hasDeleteLink).toBe(false)
    })

    test('hides move buttons on goal cards', async ({ page, openSentencePlan }) => {
      await openSentencePlan({
        session: { planAccessMode: 'READ_ONLY' },
        plan: builder => builder.withGoals(currentGoals(2)),
      })

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      // Even with 2 goals, move buttons should be hidden in READ_ONLY mode
      const firstHasMoveDown = await planOverviewPage.goalCardHasMoveDownButton(0)
      const secondHasMoveUp = await planOverviewPage.goalCardHasMoveUpButton(1)

      expect(firstHasMoveDown).toBe(false)
      expect(secondHasMoveUp).toBe(false)
    })

    test('hides Add steps link when a goal has no steps', async ({ page, openSentencePlan }) => {
      await openSentencePlan({
        session: { planAccessMode: 'READ_ONLY' },
        plan: builder =>
          builder.withGoals([
            { title: 'Goal with no steps', status: 'ACTIVE', areaOfNeed: 'accommodation', steps: [] },
          ]),
      })

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)
      const goalCard = await planOverviewPage.getGoalCardByIndex(0)

      await expect(goalCard.getByRole('link', { name: /^Add steps$/i })).toHaveCount(0)
    })

    test('still displays goal content (title, area of need, steps)', async ({ page, openSentencePlan }) => {
      await openSentencePlan({
        session: { planAccessMode: 'READ_ONLY' },
        plan: builder =>
          builder.withGoals([
            {
              title: 'Find stable housing',
              status: 'ACTIVE',
              areaOfNeed: 'accommodation',
              targetDate: '2025-06-01',
              steps: [{ actor: 'probation_practitioner', description: 'Contact housing services' }],
            },
          ]),
      })

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      const goalTitle = await planOverviewPage.getGoalCardTitle(0)
      expect(goalTitle).toContain('Find stable housing')

      const areaOfNeed = await planOverviewPage.getGoalCardAreaOfNeed(0)
      await expect(areaOfNeed).toContainText(/accommodation/i)

      const goalCard = await planOverviewPage.getGoalCardByIndex(0)
      await expect(goalCard).toContainText('Contact housing services')
    })
  })

  test.describe('Agreed Plan Goal Card Actions', () => {
    test('hides Update link on agreed goal cards', async ({ page, openSentencePlan }) => {
      await openSentencePlan({
        session: { planAccessMode: 'READ_ONLY' },
        plan: builder =>
          builder
            .withGoals([
              {
                title: 'Agreed Goal',
                status: 'ACTIVE',
                areaOfNeed: 'accommodation',
                targetDate: '2025-06-01',
                steps: [{ actor: 'probation_practitioner', description: 'A step' }],
              },
            ])
            .withAgreementStatus('AGREED'),
      })

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      const hasUpdateLink = await planOverviewPage.goalCardHasUpdateLink(0)
      expect(hasUpdateLink).toBe(false)
    })

    test('hides move buttons on agreed goal cards', async ({ page, openSentencePlan }) => {
      await openSentencePlan({
        session: { planAccessMode: 'READ_ONLY' },
        plan: builder =>
          builder
            .withGoals([
              {
                title: 'Agreed Goal 1',
                status: 'ACTIVE',
                areaOfNeed: 'accommodation',
                targetDate: '2025-06-01',
                steps: [{ actor: 'probation_practitioner', description: 'Step 1' }],
              },
              {
                title: 'Agreed Goal 2',
                status: 'ACTIVE',
                areaOfNeed: 'accommodation',
                targetDate: '2025-06-01',
                steps: [{ actor: 'probation_practitioner', description: 'Step 2' }],
              },
            ])
            .withAgreementStatus('AGREED'),
      })

      const planOverviewPage = await PlanOverviewPage.verifyOnPage(page)

      const firstHasMoveDown = await planOverviewPage.goalCardHasMoveDownButton(0)
      const secondHasMoveUp = await planOverviewPage.goalCardHasMoveUpButton(1)

      expect(firstHasMoveDown).toBe(false)
      expect(secondHasMoveUp).toBe(false)
    })
  })
})
