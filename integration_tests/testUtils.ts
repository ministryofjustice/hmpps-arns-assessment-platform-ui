import { expect, Locator, Page } from '@playwright/test'
import { mkdir, rmdir } from 'node:fs/promises'

const loginLockDirectory = '/tmp/hmpps-auth-login.lock'
const loginLockTimeoutMs = 30_000
const loginLockPollIntervalMs = 50

const wait = (milliseconds: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, milliseconds)
  })

const acquireLoginLock = async (deadline = Date.now() + loginLockTimeoutMs): Promise<() => Promise<void>> => {
  try {
    // Every Playwright worker uses the same HMPPS Auth test account. The lock prevents
    // parallel sign-ins racing while HMPPS Auth updates the account's retry record.
    await mkdir(loginLockDirectory)
    return async () => {
      await rmdir(loginLockDirectory)
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error
    }
  }

  if (Date.now() >= deadline) {
    throw new Error(`Timed out waiting for the HMPPS Auth login lock after ${loginLockTimeoutMs}ms`)
  }

  await wait(loginLockPollIntervalMs)
  return acquireLoginLock(deadline)
}

const authSignIn = async (page: Page) => {
  await page.locator('#username').fill('AUTH_TEST')
  await page.locator('#password').fill('password123456')
  await page.locator('#submit').click()
}

export const login = async (page: Page) => {
  const releaseLoginLock = await acquireLoginLock()

  try {
    await page.goto('/')
    await page.locator('h1', { hasText: 'Sign in' }).waitFor()
    await authSignIn(page)
  } finally {
    await releaseLoginLock()
  }
}

export const checkHeaderVisibility = async (page: Page, headerLevel: number, headerText: string) => {
  await expect(page.getByRole('heading', { level: headerLevel, name: headerText })).toBeVisible()
}

export const checkLinkOpensInANewTab = async (link: Locator) => {
  await expect(link).toBeVisible()
  await expect(link).toHaveAttribute('target', '_blank')
  await expect(link).toHaveClass(/govuk-link--no-visited-state/)
}
