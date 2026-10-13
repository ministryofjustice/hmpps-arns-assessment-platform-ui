import { AuthSource } from './HmppsUser.type'

export interface PractitionerDetails {
  identifier: string
  displayName: string
  authSource: AuthSource
}
