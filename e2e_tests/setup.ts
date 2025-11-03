import { test } from '@playwright/test'
import tokenVerification from './mockApis/tokenVerification'

test.beforeAll(async () => {
  await Promise.all([tokenVerification.stubPing(), tokenVerification.stubVerifyToken(true)])
})
