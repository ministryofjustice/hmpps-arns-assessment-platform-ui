import { Page } from '@playwright/test'

export const login = async (page: Page) => {
  await page.goto('/')

  await page.locator('h1', { hasText: 'Sign in' }).waitFor()
  await page.locator('#username').fill('AUTH_ADM')
  await page.locator('#password').fill('password123456')
  await page.locator('#submit').click()

  // Wait for redirect back to app
  await page.waitForURL('**/', { timeout: 10000 })
}
