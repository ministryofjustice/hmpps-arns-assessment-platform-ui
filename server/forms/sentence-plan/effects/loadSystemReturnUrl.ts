import { SentencePlanContext } from './types'

/**
 * Load the system return URL from the session principal
 *
 * When a user authenticates via the ARNS Handover service (OASys),
 * the return URL is stored in the session principal. This effect
 * extracts it and sets it in the data context for use in templates.
 *
 * The return URL allows users to navigate back to OASys after
 * completing their work in the Sentence Plan.
 */
export const loadSystemReturnUrl = () => (context: SentencePlanContext) => {
  const session = context.getSession()
  const returnUrl = session.principal?.returnUrl

  if (returnUrl) {
    context.setData('systemReturnUrl', returnUrl)
  }
}
