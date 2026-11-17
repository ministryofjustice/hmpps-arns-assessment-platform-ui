/* global document, window */

// Autosave for SAN steps: posts the form with `action=autosave`

// Legacy SAN flagged autosaves with `?jsonResponse=true` instead.
const AUTOSAVE_ACTION = 'autosave'

const DEBOUNCE_MS = 5000

// For tests: "idle" | "pending" | "saving" | "saved" | "error".
const STATE_ATTRIBUTE = 'data-autosave-state'

const getForm = () => document.querySelector('form[data-autosave="true"]')

const endpointFor = form => form.getAttribute('action') || window.location.href

const buildBody = form => {
  const body = new URLSearchParams(new FormData(form))
  body.set('action', AUTOSAVE_ACTION)
  return body
}

export function initAutosave(form = getForm()) {
  if (!form || form.dataset.autosaveInitialised === 'true') return

  form.dataset.autosaveInitialised = 'true'

  let timeoutHandle = null
  let isDirty = false
  let queue = Promise.resolve()
  let stopped = false

  const setState = state => form.setAttribute(STATE_ATTRIBUTE, state)

  const send = ({ keepalive = false } = {}) => {
    isDirty = false
    setState('saving')

    return fetch(endpointFor(form), {
      method: 'POST',
      body: buildBody(form),
      keepalive,
    })
      .then(response => {
        if (!response.ok) throw new Error(`Autosave responded ${response.status}`)
        setState('saved')
      })
      .catch(() => {
        // Stay dirty so the next edit or leaving the page retries.
        isDirty = true
        setState('error')
      })
  }

  // One at a time, so an edit made while a save on the way doesnt interrupt
  const save = () => {
    queue = queue.then(() => (isDirty ? send() : undefined))
    return queue
  }

  const cancelPending = () => {
    clearTimeout(timeoutHandle)
    timeoutHandle = null
  }

  const scheduleSave = () => {
    if (stopped) return

    isDirty = true
    setState('pending')
    cancelPending()
    timeoutHandle = setTimeout(save, DEBOUNCE_MS)
  }

  // Legacy SAN used `keyup` and clicks, which missed pasting
  form.addEventListener('input', scheduleSave)
  form.addEventListener('change', scheduleSave)

  form.addEventListener('submit', () => {
    stopped = true
    cancelPending()
  })

  // Saving when navigating away, legacy SAN intercepted link clicks instead, which missed the back button tab closing.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'hidden' || stopped || !isDirty) return

    cancelPending()
    send({ keepalive: true })
  })

  setState('idle')
}

window.addEventListener('DOMContentLoaded', () => initAutosave())
