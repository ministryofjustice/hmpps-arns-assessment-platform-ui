import {
  buildGoalAchievementNoteTelemetryEvent,
  createGoalAchievementRadioTelemetryTracker,
} from '../../server/utils/goalAchievementTelemetry'
import { appInsights } from './appInsights.mjs'

const RADIO_NAME = 'has_achieved_goal'

function getNoValue(form) {
  const noRadio = form.querySelector(`input[name="${RADIO_NAME}"][value="no"]`)
  return noRadio?.labels?.[0]?.textContent?.trim()
}

export function initGoalAchievementTracking() {
  const radioGroup = document.querySelector(`input[name="${RADIO_NAME}"]`)
  const form = radioGroup?.closest('form')
  if (!form) return

  const yesRadio = form.querySelector(`input[name="${RADIO_NAME}"][value="yes"]`)
  const selectedRadio = form.querySelector(`input[name="${RADIO_NAME}"]:checked`)
  const initialSelection = ['yes', 'no'].includes(selectedRadio?.value) ? selectedRadio.value : undefined
  const buildRadioEvent = createGoalAchievementRadioTelemetryTracker(initialSelection)

  form.addEventListener('change', event => {
    if (!appInsights) return

    const selectedRadio = event.target
    const noValue = getNoValue(form)
    if (
      !selectedRadio?.matches?.(`input[name="${RADIO_NAME}"]`) ||
      !noValue ||
      !['yes', 'no'].includes(selectedRadio.value)
    ) {
      return
    }

    appInsights.trackEvent(buildRadioEvent(selectedRadio.value, noValue))
  })

  form.addEventListener('submit', () => {
    if (!appInsights || !yesRadio?.checked) return

    const note = form.querySelector('textarea[name="how_helped"]')
    const noteAdded = note?.value.trim().length > 0

    appInsights.trackEvent(buildGoalAchievementNoteTelemetryEvent(noteAdded))
  })
}
