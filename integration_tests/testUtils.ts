import { Page } from '@playwright/test'
import tokenVerification from './mockApis/tokenVerification'
import hmppsAuth, { type UserToken } from './mockApis/hmppsAuth'
import handover, { type UserToken as HandoverUserToken } from './mockApis/handover'

export { resetStubs } from './mockApis/wiremock'

const DEFAULT_ROLES = ['ROLE_SOME_REQUIRED_ROLE']

export const attemptHmppsAuthLogin = async (page: Page) => {
  await page.goto('/')
  page.locator('h1', { hasText: 'Sign in' })

  if (process.env.ENVIRONMENT === 'e2e-ui') {
    await authSignIn(page)
  } else {
    const url = await hmppsAuth.getSignInUrl()
    await page.goto(url)
  }
}

export const attemptHandoverLogin = async (page: Page) => {
  await page.goto('/sign-in/handover')
  page.locator('h1', { hasText: 'Sign in' })

  const url = await handover.getSignInUrl()
  await page.goto(url)
}

export const login = async (
  page: Page,
  { name, roles = DEFAULT_ROLES, active = true, authSource = 'nomis' }: UserToken & { active?: boolean } = {},
) => {
  await Promise.all([
    hmppsAuth.favicon(),
    hmppsAuth.stubSignInPage(),
    hmppsAuth.stubSignOutPage(),
    hmppsAuth.token({ name, roles, authSource }),
    tokenVerification.stubVerifyToken(active),
  ])
  await attemptHmppsAuthLogin(page)
}

export const loginHandover = async (page: Page, { name, roles = DEFAULT_ROLES }: HandoverUserToken = {}) => {
  await Promise.all([handover.favicon(), handover.stubSignInPage(), handover.token({ name, roles })])
  await attemptHandoverLogin(page)
}

const authSignIn = async (page: Page) => {
  // Fill in inputs
  await page.locator('#username').fill('AUTH_TEST')
  await page.locator('#password').fill('password123456')

  // Click the submit button
  await page.locator('#submit').click()
}
