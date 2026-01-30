import { expect } from '@playwright/test'
import { test, TargetService } from '../../support/fixtures'
import UpdateGoalAndStepsPage from '../../pages/sentencePlan/updateGoalAndStepsPage'
import { currentGoals } from '../../builders/sentencePlanFactories'
import {
  getDatePlusDaysAsISO,
  navigateToSentencePlan,
  sentencePlanV1URLs,
} from './sentencePlanUtils'

const updateGoalAndStepsPath = '/update-goal-steps'

test.describe('Update goal - notes', () => {
  test.describe('progress notes', () => {
    test('displays progress notes section with textarea, label, and hint text', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      // check textarea is visible
      await expect(updatePage.progressNotesTextarea).toBeVisible()

      // check label with optional indicator
      const labelText = await updatePage.getProgressNotesLabelText()
      expect(labelText).toContain('Add notes about progress')
      expect(labelText).toContain('(optional)')

      // check hint text
      const hintText = await updatePage.getProgressNotesHintText()
      expect(hintText).toContain('how')
      expect(hintText).toContain('feels about their progress')
    })

    test('can enter progress notes', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      const testNotes = 'This person is making good progress towards their goal'
      await updatePage.enterProgressNotes(testNotes)

      const enteredNotes = await updatePage.getProgressNotesValue()
      expect(enteredNotes).toBe(testNotes)
    })
  })

  test.describe('view all notes', () => {
    test('displays view and expand all notes details component and see noo notes message when goal has no notes ', async ({
      page,
      createSession,
      sentencePlanBuilder,
    }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals(currentGoals(1))
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      await expect(updatePage.viewAllNotesDetails).toBeVisible()
      await expect(updatePage.viewAllNotesSummary).toContainText('View all notes')

      // initially collapsed
      expect(await updatePage.isViewAllNotesExpanded()).toBe(false)

      await updatePage.expandViewAllNotes()

      // should be expanded
      expect(await updatePage.isViewAllNotesExpanded()).toBe(true)

      // displays no notes message when goal has no notes
      await expect(updatePage.noNotesMessage).toBeVisible()
    })

    test('displays notes when goal has notes history', async ({ page, createSession, sentencePlanBuilder }) => {
      const { sentencePlanId, handoverLink } = await createSession({ targetService: TargetService.SENTENCE_PLAN })
      const plan = await sentencePlanBuilder
        .extend(sentencePlanId)
        .withGoals([
          {
            title: 'Goal With Notes',
            areaOfNeed: 'accommodation',
            status: 'ACTIVE',
            targetDate: getDatePlusDaysAsISO(90),
            steps: [{ actor: 'probation_practitioner', description: 'Step', status: 'NOT_STARTED' }],
            notes: [{ type: 'PROGRESS', note: 'Progress update: Making good headway on accommodation' }],
          },
        ])
        .withAgreementStatus('AGREED')
        .save()
      const goalUuid = plan.goals[0].uuid

      await navigateToSentencePlan(page, handoverLink)

      await page.goto(`${sentencePlanV1URLs.GOAL_MANAGEMENT_ROOT_PATH}/${goalUuid}${updateGoalAndStepsPath}`)

      const updatePage = await UpdateGoalAndStepsPage.verifyOnPage(page)

      await updatePage.expandViewAllNotes()

      const notesContent = await updatePage.getNotesContent()
      expect(notesContent).toContain('Making good headway on accommodation')
    })
  })
})
