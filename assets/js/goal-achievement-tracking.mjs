import {
  buildGoalAchievementNoteTelemetryEvent,
  createGoalAchievementRadioTelemetryTracker,
} from '../../server/utils/goalAchievementTelemetry'
import { appInsights } from './appInsights.mjs'

const RADIO_NAME = 'has_achieved_goal'

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
    const isGoalAchievementRadio = selectedRadio?.matches?.(`input[name="${RADIO_NAME}"]`)
    const isValidSelection = ['yes', 'no'].includes(selectedRadio?.value)
    if (!isGoalAchievementRadio || !isValidSelection) return

    appInsights.trackEvent(buildRadioEvent(selectedRadio.value))
  })

  form.addEventListener('submit', () => {
    if (!appInsights || !yesRadio?.checked) return

    const note = form.querySelector('textarea[name="how_helped"]')
    const noteAdded = note?.value.trim().length > 0

    appInsights.trackEvent(buildGoalAchievementNoteTelemetryEvent(noteAdded))
  })
}
