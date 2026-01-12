import { Page } from '@playwright/test'

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
