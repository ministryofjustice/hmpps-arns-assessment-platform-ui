import { appInsights } from './appInsights.mjs'

export function initChangeAreaOfNeedTracking() {
  if (!appInsights) return

  const link = document.querySelector('[data-ai-id="create-goal-change-area-of-need-link"]')
  if (!link) return

  link.addEventListener('click', () => {
    appInsights.trackEvent({ name: 'change-area-of-need-link' })
    appInsights.flush()
  })
}
