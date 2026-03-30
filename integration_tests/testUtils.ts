import { Page } from '@playwright/test'
import fs from 'fs'

const mpopAuthPath = '.auth/mpop.json'

const authSignIn = async (page: Page) => {
  await page.locator('#username').fill('AUTH_TEST')
  await page.locator('#password').fill('password123456')
  await page.locator('#submit').click()
  await page.context().storageState({ path: '.auth/mpop.json' })
}

export const login = async (page: Page) => {
  await page.goto('/')
  await page.locator('h1', { hasText: 'Sign in' }).waitFor()
  await authSignIn(page)
}

export const logout = async (page: Page) => {
  await page.goto('/sign-out')
  await page.locator('h1', { hasText: 'Sign in' }).waitFor()
}

export const mpopSessionCached = () => {
  return fs.existsSync(mpopAuthPath)
}

export const clearMpopSession = async () => {
  if (fs.existsSync(mpopAuthPath)) {
    fs.unlinkSync(mpopAuthPath)
  }
}
