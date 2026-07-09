import { appInsights } from './appInsights.mjs'

const RADIO_NAME = 'area_of_need'

function getSelectedLabel(radio) {
  const label = document.querySelector(`label[for="${radio.id}"]`)
  return label?.textContent?.trim() || radio.value
}

function detectJourney() {
  const createBtn = document.querySelector('[data-ai-id="select-area-of-need-continue-button"]')
  if (createBtn) return { button: createBtn, journey: 'Create Goal' }

  const changeBtn = document.querySelector('[data-ai-id="change-area-of-need-continue-button"]')
  if (changeBtn) return { button: changeBtn, journey: 'Change Goal' }

  return null
}

export function initAreaOfNeedTracking() {
  if (!appInsights) return

  const radios = document.querySelectorAll(`input[name="${RADIO_NAME}"]`)
  if (!radios.length) return

  const context = detectJourney()
  if (!context) return

  const { button, journey } = context
  const selections = []

  // Record the pre-selected value (e.g. when returning via ?area= query param)
  const preSelected = document.querySelector(`input[name="${RADIO_NAME}"]:checked`)
  if (preSelected) {
    selections.push(getSelectedLabel(preSelected))
  }

  // Track each radio change
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      selections.push(getSelectedLabel(radio))
    })
  })

  // On Continue, fire a single event with the full selection chain
  button.closest('form')?.addEventListener('submit', () => {
    if (selections.length === 0) return

    const selectedValue = selections[selections.length - 1]
    const previousValue = selections.length > 1 ? selections[selections.length - 2] : ''
    const wasChanged = selections.length > 1

    appInsights.trackEvent({
      name: 'primary-area-of-need-radio',
      properties: {
        'Selected Value': selectedValue,
        'Previous Value': previousValue,
        'Selection Chain': selections.join(' -> '),
        'Selection Count': String(selections.length),
        'Was Changed': String(wasChanged),
        Journey: journey,
      },
    })

    appInsights.flush()
  })
}
