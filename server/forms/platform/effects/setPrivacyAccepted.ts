import { PlatformContext } from './types'

export const setPrivacyAccepted = () => (context: PlatformContext) => {
  const session = context.getSession()

  session.privacyAccepted = true
}
