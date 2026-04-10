import { expect, Locator, Page } from '@playwright/test'

const authSignIn = async (page: Page) => {
  await page.locator('#username').fill('AUTH_TEST')
  await page.locator('#password').fill('password123456')
  await page.locator('#submit').click()
}

export const login = async (page: Page) => {
  await page.goto('/')
  await page.locator('h1', { hasText: 'Sign in' }).waitFor()
  await authSignIn(page)
}

export const checkHeaderVisibility = async (page: Page, headerLevel: number, headerText: string) => {
  await expect(page.getByRole('heading', { level: headerLevel, name: headerText })).toBeVisible()
}

export const checkLinkOpensInANewTab = async (link: Locator) => {
  await expect(link).toBeVisible()
  await expect(link).toHaveAttribute('target', '_blank')
  await expect(link).toHaveClass(/govuk-link--no-visited-state/)
}
