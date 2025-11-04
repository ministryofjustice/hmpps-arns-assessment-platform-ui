import { expect, test } from '@playwright/test'
import '../setup'

test.describe('Health (E2E)', () => {
  test('Ping endpoint is accessible and returns UP', async ({ page }) => {
    const response = await page.request.get('/ping')
    const payload = await response.json()
    expect(payload.status).toBe('UP')
  })

  test('Info endpoint is accessible', async ({ page }) => {
    const response = await page.request.get('/info')
    const payload = await response.json()
    expect(payload.build.name).toBe('hmpps-arns-assessment-platform-ui')
  })
})
