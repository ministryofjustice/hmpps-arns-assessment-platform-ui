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

/**
 * Generate a random CRN in the format: letter + 6 digits (e.g., X123456)
 */
export const randomCrn = (): string => {
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
  const digits = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0')
  return `${letter}${digits}`
}
