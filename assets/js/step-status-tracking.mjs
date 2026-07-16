import { appInsights } from './appInsights.mjs'

const STATUS_SELECT_PREFIX = 'step_status_'

function getSelectedText(select) {
  return select.options[select.selectedIndex]?.text || ''
}

function getGoalId() {
  const match = window.location.pathname.match(/\/goal\/([^/]+)/)
  return match ? match[1] : ''
}

function trackStatusChange(select, previousText, pageName) {
  if (!appInsights) return

  const selectedText = getSelectedText(select)
  if (selectedText === previousText) return

  appInsights.trackEvent({
    name: 'step-status-dropdown',
    properties: {
      'Selected Value': selectedText,
      'Previous Value': previousText,
      Page: pageName,
      'Goal ID': getGoalId(),
    },
  })
}

export function initStepStatusTracking() {
  const addStepsContainer = document.querySelector('.step-rows')
  const updateStepsContainer = document.querySelector('.goal-summary-card__steps')
  const container = addStepsContainer || updateStepsContainer
  if (!container) return

  const pageName = addStepsContainer ? 'Add or Change Steps' : 'Update goal and steps'

  const previousValues = new WeakMap()

  // Store initial values for existing selects
  container.querySelectorAll(`select[name^="${STATUS_SELECT_PREFIX}"]`).forEach(select => {
    previousValues.set(select, getSelectedText(select))
  })

  // Use event delegation to handle dynamically added rows
  container.addEventListener('change', event => {
    const select = event.target
    if (!select.matches(`select[name^="${STATUS_SELECT_PREFIX}"]`)) return

    const previousText = previousValues.get(select) || ''
    trackStatusChange(select, previousText, pageName)
    previousValues.set(select, getSelectedText(select))
  })

  // Observe new rows being added and store their initial values
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const selects = node.querySelectorAll?.(`select[name^="${STATUS_SELECT_PREFIX}"]`) || []
          selects.forEach(select => {
            previousValues.set(select, getSelectedText(select))
          })
        }
      }
    }
  })

  observer.observe(container, { childList: true, subtree: true })
}
