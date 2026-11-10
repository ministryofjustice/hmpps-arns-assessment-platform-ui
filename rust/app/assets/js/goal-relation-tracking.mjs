import { appInsights } from './appInsights.mjs'

const RADIO_NAME = 'is_related_to_other_areas'

function getSelectedLabel(radio) {
  const label = document.querySelector(`label[for="${radio.id}"]`)

  return label?.textContent?.trim() || radio.value
}

export function initGoalRelationTracking() {
  if (!appInsights) return

  const isAddGoalPage = document.querySelector('[data-ai-id="create-goal-add-steps-button"]')
  if (!isAddGoalPage) return

  const radios = document.querySelectorAll(`input[name="${RADIO_NAME}"]`)
  if (!radios.length) return

  const initialSelection = document.querySelector(`input[name="${RADIO_NAME}"]:checked`)
  let previousValue = initialSelection ? getSelectedLabel(initialSelection) : null

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      const selectedValue = getSelectedLabel(radio)

      appInsights.trackEvent({
        name: 'is-relation-to-other-area-of-need-radio',
        properties: {
          SelectedValue: selectedValue,
          PreviousValue: previousValue,
        },
      })
      appInsights.flush()

      previousValue = selectedValue
    })
  })
}
