import { expect, Locator, Page } from '@playwright/test'
import type StrengthsAndNeedsPage from '../../pages/strengthsAndNeeds/strengthsAndNeedsPage'

type Limit = { code: string; limit: number; message?: string }

type Options = {
  save?: Locator
  plainInputs?: Limit[]
}

const messageOf = ({ limit, message }: Limit) => message ?? `Details must be ${limit} characters or less`

/** Every character count shown on the page, with the limit it advertises. */
const characterCountsOn = (page: Page): Promise<Limit[]> =>
  page.locator('[data-maxlength]:visible').evaluateAll(counts =>
    counts.map(count => ({
      code: count.querySelector('textarea, input')!.id,
      limit: Number((count as HTMLElement).dataset.maxlength),
    })),
  )

/* eslint-disable no-await-in-loop -- these are actions on one page, so they happen one at a time */
const fillToLength = async (page: Page, limits: Limit[], save: Locator, length: (limit: number) => number) => {
  for (const { code, limit } of limits) {
    await page.locator(`#${code}`).fill('a'.repeat(length(limit)))
  }

  await save.click()
}
/* eslint-enable no-await-in-loop */

/**
 * Checks every character limited field the page shows: a character over its limit is rejected with
 * the message in the error summary and on the field, and exactly the limit leaves no error behind.
 *
 * Character counts are found from the page. A plain text input carries no count, so it is named in
 * `plainInputs` with the limit and message it validates against.
 */
export const expectTheLimitsOnThePage = async (sectionPage: StrengthsAndNeedsPage, options: Options = {}) => {
  const { page } = sectionPage
  const save = options.save ?? sectionPage.saveAndContinue
  const limits = [...(await characterCountsOn(page)), ...(options.plainInputs ?? [])]
  expect(limits.length, 'the page shows some character limited fields').toBeGreaterThan(0)

  await fillToLength(page, limits, save, limit => limit + 1)
  // Using promises to avoid putting awaits in loop
  await Promise.all(
    limits.flatMap(limit => [
      expect.soft(sectionPage.question(limit.code).errorLink, limit.code).toHaveText(messageOf(limit)),
      expect.soft(sectionPage.question(limit.code).error, limit.code).toContainText(messageOf(limit)),
    ]),
  )

  await fillToLength(page, limits, save, limit => limit)
  await Promise.all(limits.map(({ code }) => expect.soft(sectionPage.question(code).error, code).toHaveCount(0)))
}
