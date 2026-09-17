import { expect, Page } from '@playwright/test'
import { test as base, TargetService } from '../../support/fixtures'
import { navigateToStrengthsAndNeeds, sanFormPath, v1Path } from './sanUtils'

export type Answer = { question: string; value: string | string[] }

export type ChangeLink = { step: string; question: string }
export const changeLink = (step: string, question: string): ChangeLink => ({ step, question })

export type Scenario = { answers: Answer[]; summaryChangeLinks: ChangeLink[] }

const hrefOf = ({ step, question }: ChangeLink) => `${step}#${question}-question`

/**
 * `openSection(section, answers)` seeds the answers and opens the assessment,
 */
export const test = base.extend<{ openSection: (sectionPath: string, answers: Answer[]) => Promise<string> }>({
  openSection: async ({ page, createSession, strengthsAndNeedsBuilder, baseURL }, use) => {
    await use(async (sectionPath, answers) => {
      const { handoverLink, sanAssessmentId } = await createSession({
        targetService: TargetService.STRENGTHS_AND_NEEDS,
      })
      await strengthsAndNeedsBuilder.extend(sanAssessmentId).withAnswers(answers).save()
      await navigateToStrengthsAndNeeds(page, handoverLink, sanFormPath)

      return `${baseURL}${sanFormPath}${v1Path}/edit/${sanAssessmentId}${sectionPath}`
    })
  },
})

export const summaryTab = 'Summary'

export const practitionerAnalysisTab = 'Practitioner analysis'

const showTab = async (page: Page, tab: string) => {
  await page.getByRole('tab', { name: tab }).click()
}

/**
 * Asserts the page, in the given tab, shows exactly these
 * change links in the specified order.
 */
export const expectChangeLinksListed = async (page: Page, url: string, changeLinks: ChangeLink[], tab: string) => {
  await page.goto(url)
  await showTab(page, tab)

  const shown = page.getByRole('link', { name: /^Change\b/ })
  await expect(shown).toHaveCount(changeLinks.length)
  expect(await shown.evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(
    changeLinks.map(hrefOf),
  )
}

/**
 * Following each change link, says what it changes as visually
 * hidden text and lands on its question when clicked. Also asserts
 * the question is scrolled into view and its first input focused.
 */
export const expectEachChangeLinkToLandOnItsQuestion = async (
  page: Page,
  url: string,
  changeLinks: ChangeLink[],
  tab: string,
) => {
  for (const link of changeLinks) {
    // eslint-disable-next-line no-await-in-loop
    await test.step(`Change → ${hrefOf(link)}`, async () => {
      await page.goto(url)
      await showTab(page, tab)
      const change = page.locator(`main a[href="${hrefOf(link)}"]`).first()
      await expect(change, 'says what it changes, as visually hidden text').toHaveAccessibleName(/^Change\s+\S/)
      await change.click()

      await expect(page).toHaveURL(new RegExp(`/${link.step}#${link.question}-question$`))
      const question = page.locator(`#${link.question}-question`)
      await expect(question.locator('input, textarea, select').first()).toBeFocused()
      const { top, viewportHeight } = await question.evaluate(element => ({
        top: element.getBoundingClientRect().top,
        viewportHeight: window.innerHeight,
      }))

      expect(top, 'question top on screen').toBeGreaterThanOrEqual(-1)
      expect(top, 'question top on screen').toBeLessThan(viewportHeight)
    })
  }
}
