import { expect, test } from '@playwright/test'
import aapApi from '../mockApis/aapApi'
import hmppsAuth from '../mockApis/hmppsAuth'
import tokenVerification from '../mockApis/tokenVerification'

import { resetStubs } from '../testUtils'

test.describe('Health', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test.describe('All healthy', () => {
    test.beforeEach(async () => {
      await Promise.all([hmppsAuth.stubPing(), aapApi.stubPing(), tokenVerification.stubPing()])
    })

    test('Health check is accessible and status is UP', async ({ page }) => {
      const response = await page.request.get('/health')
      const payload = await response.json()
      expect(payload.status).toBe('UP')
    })

    test('Ping is accessible and status is UP', async ({ page }) => {
      const response = await page.request.get('/ping')
      const payload = await response.json()
      expect(payload.status).toBe('UP')
    })

    test('Info is accessible', async ({ page }) => {
      const response = await page.request.get('/info')
      const payload = await response.json()
      expect(payload.build.name).toBe('hmpps-arns-assessment-platform-ui')
    })
  })

  test.describe('Some unhealthy', () => {
    test.beforeEach(async () => {
      await Promise.all([hmppsAuth.stubPing(), aapApi.stubPing(500), tokenVerification.stubPing(500)])
    })

    test('Health check status is down', async ({ page }) => {
      const response = await page.request.get('/health')
      const payload = await response.json()
      expect(payload.components.hmppsAuth.status).toBe('UP')
      if (process.env.ENVIRONMENT !== 'e2e-ui') {
        expect(payload.status).toBe('DOWN')
        expect(payload.components.tokenVerification.status).toBe('DOWN')
        expect(payload.components.tokenVerification.details.status).toBe(500)
        expect(payload.components.tokenVerification.details.attempts).toBe(3)
      } else {
        expect(payload.status).toBe('UP')
      }
    })
  })
})
