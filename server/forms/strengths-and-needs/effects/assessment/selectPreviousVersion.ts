import { StrengthsAndNeedsContext } from '../types'

/**
 * Handle previous-versions form submission: store the selected version timestamp
 * to session so it persists across redirects and page navigations, then the journey
 * will load that version via loadAssessment.
 *
 * The version timestamp is passed via the submit button's value (name="select-version").
 */
export const selectPreviousVersion = () => (context: StrengthsAndNeedsContext) => {
  const session = context.getSession()
  const versionTimestampStr = context.getPostData('select-version') as string | undefined

  if (!versionTimestampStr) {
    throw new Error('select-version is required when selecting a previous version')
  }

  const versionTimestamp = Number(versionTimestampStr)
  if (!Number.isInteger(versionTimestamp) || versionTimestamp <= 0) {
    throw new Error(`Invalid version timestamp: ${versionTimestampStr}`)
  }

  session.versionOverride = versionTimestamp
}
