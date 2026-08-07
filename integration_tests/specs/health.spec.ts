import { expect, test } from '@playwright/test'
import tokenVerification from '../mockApis/tokenVerification'
import { resetStubs } from '../mockApis/wiremock'

test.describe('Health', () => {
  test.describe('All healthy', () => {
    test('Health check is accessible and status is UP', async ({ page }) => {
      const response = await page.request.get('/health')
      const payload = await response.json()
      expect(payload.status).toBe('UP')
    })

    test('Health check excludes the feature-flagged supervision package APIs', async ({ page }) => {
      const response = await page.request.get('/health')
      const payload = await response.json()

      // These back one feature-flagged page that degrades without them, so their
      // outages must not make this service report itself down. See setUpHealthChecks.
      expect(Object.keys(payload.components)).not.toContain('tierApi')
      expect(Object.keys(payload.components)).not.toContain('supervisionPackageApi')
      expect(Object.keys(payload.components)).not.toContain('masApi')
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

  test.describe('Some unhealthy @serial', () => {
    test.beforeEach(async () => {
      await Promise.all([tokenVerification.stubPing(500)])
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

    test.afterEach(async () => {
      await resetStubs()
    })
  })
})
