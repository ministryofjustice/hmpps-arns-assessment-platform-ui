import jwt from 'jsonwebtoken'
import type { SuperAgentRequest } from 'superagent'
import { stubFor, getMatchingRequests } from './wiremock'

export interface UserToken {
  name?: string
  roles?: string[]
}

const baseUrl = process.env.BASE_URL || 'http://localhost:3000'

function createToken(userToken: UserToken) {
  const payload = {
    name: userToken.name || 'Handover User1',
    user_name: 'Handover User1',
    user_id: 'HANDOVER_USER1',
    scope: ['openid', 'profile'],
    auth_source: 'handover',
    authorities: userToken.roles || [],
    jti: 'handover-token-id',
    client_id: 'arns-assessment-platform',
  }

  return jwt.sign(payload, 'secret', { expiresIn: '1h' })
}

export default {
  getSignInUrl: (): Promise<string> =>
    getMatchingRequests({
      method: 'GET',
      urlPath: '/oauth2/authorize',
    }).then(data => {
      const { requests } = data.body
      const stateValue = requests[requests.length - 1].queryParams.state.values[0]
      return `/sign-in/handover/callback?code=handover-code&state=${stateValue}`
    }),

  favicon: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/favicon.ico',
      },
      response: {
        status: 200,
      },
    }),

  stubPing: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/health/ping',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
      },
    }),

  stubSignInPage: () =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern:
          '/oauth2/authorize\\?response_type=code&redirect_uri=.+?&scope=.+?&state=.+?&client_id=arns-assessment-platform.*',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          Location: `${baseUrl}/sign-in/handover/callback?code=handover-code&state=stateyyyy`,
        },
        body: '<html lang="en"><body>Handover Sign in page<h1>Sign in</h1></body></html>',
      },
    }),

  token: (userToken: UserToken) =>
    stubFor({
      request: {
        method: 'POST',
        urlPattern: '/oauth2/token',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          Location: `${baseUrl}/sign-in/handover/callback?code=handover-code&state=stateyyyy`,
        },
        jsonBody: {
          access_token: createToken(userToken),
          token_type: 'bearer',
          user_name: 'Handover User1',
          expires_in: 3599,
          scope: 'openid profile',
        },
      },
    }),
}
