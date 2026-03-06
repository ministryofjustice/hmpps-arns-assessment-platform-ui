import { AccessContext } from '../types'

export const setPrivacyAccepted = () => (context: AccessContext) => {
  const session = context.getSession()

  session.privacyAccepted = true
}
