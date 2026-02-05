import { AuthSource } from './hmppsUser'

export interface PractitionerDetails {
  identifier: string
  displayName: string
  authSource: AuthSource
}
