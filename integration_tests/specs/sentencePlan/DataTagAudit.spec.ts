import type { Page } from '@playwright/test'
import { currentGoalsWithCompletedSteps, futureGoals, removedGoals } from '../../builders/sentencePlanFactories'
import type { GoalConfig } from '../../builders/types'
import PreviousVersionsPage from '../../pages/sentencePlan/previousVersionsPage'
import PrivacyScreenPage from '../../pages/sentencePlan/privacyScreenPage'
import { expect } from '../../support/dataTagAudit'
import { TargetService, test } from '../../support/fixtures'
import { login } from '../../testUtils'
import { navigateToSentencePlan, sentencePlanV1UrlBuilders, sentencePlanV1URLs } from './sentencePlanUtils'

interface AuditRoute {
  name: string
  url: string | URL
  expectedPath: RegExp
}

const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i
const DATA_TAG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const createAchievedGoal = (): GoalConfig => ({
  title: 'Achieved Goal',
  areaOfNeed: 'accommodation',
  status: 'ACHIEVED',
  targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  steps: [{ actor: 'probation_practitioner', description: 'Completed step', status: 'COMPLETED' }],
  notes: [{ type: 'ACHIEVED', note: 'Goal was achieved' }],
})

test.describe('DataTagAudit', () => {
  test('every tracked control on each Sentence Plan page has a meaningful data-ai-id', async ({
    page,
    createSession,
    sentencePlanBuilder,
  }) => {
    test.setTimeout(5 * 60 * 1000)

    // These fixture values prove tags do not include case-specific data.
    const caseDataFragments = new Set(['buster', 'sanford', 'current-goal-1', 'removed-goal-1'])

    const auditPage = async (name: string, pageToAudit: Page = page): Promise<void> => {
      await pageToAudit.waitForLoadState('load')
      await expect(pageToAudit, `${name}: ${pageToAudit.url()}`).toHaveDataTags()

      const dataTags = await pageToAudit.locator('[data-ai-id]').evaluateAll(elements =>
        elements
          .map(element => element.getAttribute('data-ai-id')?.trim())
          .filter((dataTag): dataTag is string => Boolean(dataTag)),
      )

      const tagsContainingCaseData = dataTags.filter(dataTag => {
        const normalisedTag = dataTag.toLowerCase()
        return UUID_PATTERN.test(normalisedTag) ||
          Array.from(caseDataFragments).some(fragment => normalisedTag.includes(fragment))
      })
      const incorrectlyFormattedTags = dataTags.filter(dataTag => !DATA_TAG_PATTERN.test(dataTag))

      expect(tagsContainingCaseData, `data-ai-id values on ${name} must not contain case data`).toEqual([])
      expect(incorrectlyFormattedTags, `data-ai-id values on ${name} must use lowercase kebab-case`).toEqual([])
    }

    const visitAndAudit = async ({ name, url, expectedPath }: AuditRoute): Promise<void> => {
      await page.goto(url.toString())
      await expect(page).toHaveURL(expectedPath)
      await auditPage(name)
    }

    const visitAndAuditRoutes = async (routes: readonly AuditRoute[]): Promise<void> => {
      for (const route of routes) {
        // The same browser page must visit each route in order.
        // eslint-disable-next-line no-await-in-loop
        await visitAndAudit(route)
      }
    }

    // Start with no goals so the empty-plan controls are covered too.
    const draftSession = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    caseDataFragments.add(draftSession.crn.toLowerCase())

    await page.goto(draftSession.handoverLink)
    await expect(page).toHaveURL(/\/sentence-plan\/privacy/)
    await expect(page.locator('input[name="confirm_privacy"][value="confirmed"]')).toHaveAttribute(
      'data-ai-id',
      'confirm-privacy-confirmed-checkbox',
    )
    await auditPage('Privacy')

    const privacyPage = await PrivacyScreenPage.verifyOnPage(page)
    await privacyPage.confirmAndContinue()
    await expect(page).toHaveURL(/\/plan\/overview\?type=current/)
    await auditPage('Plan overview — empty')

    const draftPlan = await sentencePlanBuilder
      .extend(draftSession.sentencePlanId)
      .withGoals([...currentGoalsWithCompletedSteps(1), ...futureGoals(1)])
      .save()
    const draftGoalUuid = draftPlan.goals[0].uuid

    await page.reload()
    await auditPage('Plan overview — current goals (draft)')

    await visitAndAudit({
      name: 'Plan overview — future goals',
      url: `${sentencePlanV1URLs.PLAN_OVERVIEW}?type=future`,
      expectedPath: /type=future/,
    })
    await visitAndAudit({ name: 'About', url: sentencePlanV1URLs.ABOUT_PERSON, expectedPath: /\/about-person/ })
    const accordionButton = page.locator('.about-page-accordion .govuk-accordion__section-button').first()
    await expect(accordionButton).toHaveAttribute('data-ai-id', /^san-info-.+-1-expand-button$/)
    await accordionButton.click()
    await expect(accordionButton).toHaveAttribute('aria-expanded', 'true')
    await accordionButton.click()
    await expect(accordionButton).toHaveAttribute('data-ai-id', /^san-info-.+-1-collapse-button$/)

    const showAllButton = page.locator('.about-page-accordion .govuk-accordion__show-all').first()
    await expect(showAllButton).toHaveAttribute('data-ai-id', /^san-info-.+-expand-all-button$/)
    await showAllButton.click()
    await expect(showAllButton).toHaveAttribute('aria-expanded', 'true')
    await showAllButton.click()
    await expect(showAllButton).toHaveAttribute('data-ai-id', /^san-info-.+-collapse-all-button$/)

    await visitAndAudit({
      name: 'Create goal',
      url: sentencePlanV1UrlBuilders.goalCreate('accommodation'),
      expectedPath: /\/goal\/new\/add-goal\/accommodation/,
    })
    await expect(page.locator('input[name="is_related_to_other_areas"][value="yes"]')).toHaveAttribute(
      'data-ai-id',
      'is-related-to-other-areas-yes-radio',
    )

    // Open controls that do not exist in the initial server-rendered page.
    await page.locator('label[for="is_related_to_other_areas"]').click()
    await expect(page.locator('input[name="related_areas_of_need"][value="finances"]')).toHaveAttribute(
      'data-ai-id',
      'related-areas-of-need-finances-checkbox',
    )
    await page.locator('input[name="can_start_now"][value="yes"]').click()
    await page.locator('input[name="target_date_option"][value="set_another_date"]').click()
    await page.locator('.moj-js-datepicker-toggle').click()
    await expect(page.locator('.moj-datepicker__dialog--open')).toBeVisible()
    await auditPage('Create goal — date picker open')
    await page.locator('.moj-js-datepicker-cancel').click()
    await page.locator('input[name="target_date_option"][value="date_in_3_months"]').click()

    // Validation links only exist after an invalid submission.
    await page.getByRole('button', { name: /add steps/i }).click()
    await expect(page.locator('[data-module="govuk-error-summary"]')).toBeVisible()
    await auditPage('Create goal — validation errors')

    await visitAndAudit({
      name: 'Add or change steps',
      url: sentencePlanV1UrlBuilders.goalAddSteps(draftGoalUuid),
      expectedPath: /\/add-steps/,
    })
    const stepActorSelects = page.locator('select[name^="step_actor_"]')
    const initialStepCount = await stepActorSelects.count()
    await page.getByRole('button', { name: 'Add another step' }).click()
    await expect(stepActorSelects).toHaveCount(initialStepCount + 1)
    await auditPage('Add or change steps — dynamically added row')

    await visitAndAuditRoutes([
      {
        name: 'Change goal',
        url: sentencePlanV1UrlBuilders.goalChange(draftGoalUuid),
        expectedPath: /\/change-goal/,
      },
      {
        name: 'Confirm delete goal',
        url: sentencePlanV1UrlBuilders.goalConfirmDelete(draftGoalUuid),
        expectedPath: /\/confirm-delete-goal/,
      },
    ])

    await visitAndAudit({
      name: 'Confirm if achieved',
      url: sentencePlanV1UrlBuilders.goalConfirmIfAchieved(draftGoalUuid),
      expectedPath: /\/confirm-if-achieved/,
    })
    await page.locator('input[name="has_achieved_goal"][value="yes"]').click()
    const achievementNote = page.locator('textarea[name="how_helped"]')
    const achievementButton = page.getByRole('button', { name: 'Save and continue' })
    await achievementNote.fill('A note that must never enter the data tag')
    await achievementButton.dispatchEvent('mousedown')
    await expect(achievementButton).toHaveAttribute(
      'data-ai-id',
      'confirm-if-achieved-save-and-continue-note-added-button',
    )
    await achievementNote.fill('')
    await achievementButton.dispatchEvent('mousedown')
    await expect(achievementButton).toHaveAttribute(
      'data-ai-id',
      'confirm-if-achieved-save-and-continue-note-not-added-button',
    )

    await visitAndAuditRoutes([
      { name: 'Agree plan', url: sentencePlanV1URLs.PLAN_AGREE, expectedPath: /\/plan\/agree-plan/ },
      {
        name: 'Unsaved information deleted',
        url: '/sentence-plan/unsaved-information-deleted',
        expectedPath: /\/sentence-plan\/unsaved-information-deleted/,
      },
    ])

    // An agreed plan exposes status, history, removal and re-add controls.
    const agreedSession = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    caseDataFragments.add(agreedSession.crn.toLowerCase())
    const agreedPlan = await sentencePlanBuilder
      .extend(agreedSession.sentencePlanId)
      .withGoals([...currentGoalsWithCompletedSteps(1), ...futureGoals(1), createAchievedGoal(), ...removedGoals(1)])
      .withAgreementStatus('AGREED')
      .withEventsBackdated(new Date(2026, 0, 1, 9), new Date(2026, 0, 1, 17))
      .save()
    const [activeGoal, , inactiveAchievedGoal, inactiveRemovedGoal] = agreedPlan.goals

    await navigateToSentencePlan(page, agreedSession.handoverLink)
    await auditPage('Plan overview — current goals (agreed)')
    await visitAndAuditRoutes([
      {
        name: 'Plan overview — achieved goals',
        url: `${sentencePlanV1URLs.PLAN_OVERVIEW}?type=achieved`,
        expectedPath: /type=achieved/,
      },
      {
        name: 'Plan overview — removed goals',
        url: `${sentencePlanV1URLs.PLAN_OVERVIEW}?type=removed`,
        expectedPath: /type=removed/,
      },
      {
        name: 'Update goal and steps',
        url: sentencePlanV1UrlBuilders.goalUpdateSteps(activeGoal.uuid),
        expectedPath: /\/update-goal-steps/,
      },
      {
        name: 'Confirm achieved goal',
        url: sentencePlanV1UrlBuilders.goalConfirmAchieved(activeGoal.uuid),
        expectedPath: /\/confirm-achieved-goal/,
      },
      {
        name: 'Confirm remove goal',
        url: sentencePlanV1UrlBuilders.goalConfirmRemoved(activeGoal.uuid),
        expectedPath: /\/confirm-remove-goal/,
      },
      {
        name: 'View achieved goal',
        url: sentencePlanV1UrlBuilders.goalViewInactive(inactiveAchievedGoal.uuid),
        expectedPath: /\/view-inactive-goal/,
      },
      {
        name: 'View removed goal',
        url: sentencePlanV1UrlBuilders.goalViewInactive(inactiveRemovedGoal.uuid),
        expectedPath: /\/view-inactive-goal/,
      },
      {
        name: 'Confirm re-add goal',
        url: sentencePlanV1UrlBuilders.goalConfirmReAdd(inactiveRemovedGoal.uuid),
        expectedPath: /\/confirm-readd-goal/,
      },
      { name: 'Plan history', url: sentencePlanV1URLs.PLAN_HISTORY, expectedPath: /\/plan\/plan-history/ },
      {
        name: 'Previous versions',
        url: sentencePlanV1URLs.PREVIOUS_VERSIONS,
        expectedPath: /\/plan\/previous-versions/,
      },
    ])

    // Historic plans open in a separate browser tab.
    const previousVersionsPage = await PreviousVersionsPage.verifyOnPage(page)
    const [historicPage] = await Promise.all([
      page.waitForEvent('popup'),
      previousVersionsPage.clickViewVersionOnDate('1 January 2026'),
    ])
    await expect(historicPage).toHaveURL(/\/plan\/view-historic\//)
    await auditPage('Historic plan', historicPage)
    await historicPage.close()

    const updateAgreementSession = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    caseDataFragments.add(updateAgreementSession.crn.toLowerCase())
    await sentencePlanBuilder
      .extend(updateAgreementSession.sentencePlanId)
      .withGoals(currentGoalsWithCompletedSteps(1))
      .withPlanAgreements([
        {
          status: 'COULD_NOT_ANSWER',
          detailsCouldNotAnswer: 'Person was not available to discuss the plan',
        },
      ])
      .save()
    await navigateToSentencePlan(page, updateAgreementSession.handoverLink)
    await visitAndAudit({
      name: 'Update agreement',
      url: sentencePlanV1URLs.PLAN_UPDATE_AGREE,
      expectedPath: /\/plan\/update-agree-plan/,
    })

    const mergedSession = await createSession({ targetService: TargetService.SENTENCE_PLAN })
    caseDataFragments.add(mergedSession.crn.toLowerCase())
    await sentencePlanBuilder.extend(mergedSession.sentencePlanId).withProperty('MERGED', 'true').save()
    await page.context().clearCookies()
    await login(page)
    await visitAndAudit({
      name: 'Merged plan warning',
      url: `${sentencePlanV1URLs.CRN_ENTRY_POINT}/${mergedSession.crn}`,
      expectedPath: /\/sentence-plan\/merged-plan-warning/,
    })
  })
})
