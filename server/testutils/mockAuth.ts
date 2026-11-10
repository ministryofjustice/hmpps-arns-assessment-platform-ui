import { AuthConfig, AuthenticationClient, InMemoryTokenStore, TokenStore } from '@ministryofjustice/hmpps-auth-clients'
import * as restClient from '@ministryofjustice/hmpps-rest-client'
import { User } from '../interfaces/user'

export const DEFAULT_AUTH_CONFIG: AuthConfig = {
  systemClientId: 'client_id',
  systemClientSecret: 'client_secret',
  agent: new restClient.AgentConfig(10000),
  timeout: { deadline: 1000, response: 1000 },
  url: 'http://localhost:9090/auth',
}

export const MOCK_USER: User = {
  id: 'FOO_USER',
  name: 'Foo User',
  authSource: 'HMPPS_AUTH',
  token: 'user-1',
}

interface SetupAuthOptions {
  authConfig?: AuthConfig
  accessToken?: string
  expiresIn?: number
}

/**
 * Creates and configures a mock HMPPS Auth client.
 */
export function createMockAuthClient(options: SetupAuthOptions = {}): AuthenticationClient {
  const config = options.authConfig ?? DEFAULT_AUTH_CONFIG
  const token = options.accessToken ?? 'token-1'

  const tokenStore: TokenStore = new InMemoryTokenStore() as jest.Mocked<InMemoryTokenStore>

  jest.spyOn(tokenStore, 'getToken').mockResolvedValue(token)

  return new AuthenticationClient(config, console, tokenStore)
}
