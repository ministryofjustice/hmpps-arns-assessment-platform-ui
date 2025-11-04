import { test } from '@playwright/test'
import { stubFor } from './mockApis/wiremock'
import tokenVerification from './mockApis/tokenVerification'

const stubExampleTime = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/example-api/example/time',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/text;charset=UTF-8' },
      body: '2025-01-01T12:00:00Z',
    },
  })

test.beforeAll(async () => {
  await Promise.all([tokenVerification.stubPing(), tokenVerification.stubVerifyToken(true), stubExampleTime()])
})
