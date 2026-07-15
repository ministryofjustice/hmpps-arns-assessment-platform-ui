import { appInsights } from './appInsights.mjs'

const ACTOR_SELECT_PREFIX = 'step_actor_'

// 'person_on_probation' renders as the subject's forename, so it must never reach
// telemetry - resolve it to a stable label.
function resolveActorLabel(select) {
  const option = select.options[select.selectedIndex]
  if (option?.value === 'person_on_probation') return 'Person on probation'

  return option?.text || ''
}

function getGoalId() {
  const match = window.location.pathname.match(/\/goal\/([^/]+)/)
  return match ? match[1] : ''
}

function trackActorChange(select, previousLabel) {
  if (!appInsights) return

  const selectedLabel = resolveActorLabel(select)
  if (selectedLabel === previousLabel) return

  appInsights.trackEvent({
    name: 'who-will-do-the-step-dropdown',
    properties: {
      'Selected Value': selectedLabel,
      'Previous Value': previousLabel,
      Page: 'Add or Change Steps',
      'Goal ID': getGoalId(),
    },
  })
}

export function initStepActorTracking() {
  const container = document.querySelector('.step-rows')
  if (!container) return

  const previousValues = new WeakMap()

  // Store initial values for existing selects
  container.querySelectorAll(`select[name^="${ACTOR_SELECT_PREFIX}"]`).forEach(select => {
    previousValues.set(select, resolveActorLabel(select))
  })

  // Use event delegation to handle dynamically added rows
  container.addEventListener('change', event => {
    const select = event.target
    if (!select.matches(`select[name^="${ACTOR_SELECT_PREFIX}"]`)) return

    const previousLabel = previousValues.get(select) || ''
    trackActorChange(select, previousLabel)
    previousValues.set(select, resolveActorLabel(select))
  })

  // Observe new rows being added and store their initial values
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const selects = node.querySelectorAll?.(`select[name^="${ACTOR_SELECT_PREFIX}"]`) || []
          selects.forEach(select => {
            previousValues.set(select, resolveActorLabel(select))
          })
        }
      }
    }
  })

  observer.observe(container, { childList: true, subtree: true })
}
