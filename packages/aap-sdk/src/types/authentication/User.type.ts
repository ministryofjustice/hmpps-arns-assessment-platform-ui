import { AuthSource } from './HmppsUser.type'

/**
 * User type for API requests.
 * Represents a user in the Assessment Platform system.
 */
export interface User {
  id: string
  name: string
  authSource: AuthSource
  token?: string
}
