import { buildSelectionEventName } from '../../server/utils/dataTag'

const getSelectionEventName = (select, previousValue) => {
  const selectTag = select.getAttribute('data-ai-id')?.trim()
  const selectedOption = select.selectedOptions[0]

  return buildSelectionEventName(selectTag, previousValue, selectedOption?.value)
}

export const initSelectionTracking = telemetry => {
  if (!telemetry || !window.location.pathname.startsWith('/sentence-plan/')) return

  // Keep the initial value so the first change has a reliable "from" value.
  const previousValues = new WeakMap()
  document.querySelectorAll('select[data-ai-id]').forEach(select => previousValues.set(select, select.value))

  // The delegated listener also handles selects added after page load.
  document.addEventListener('change', event => {
    if (!(event.target instanceof HTMLSelectElement)) return

    const previousValue = previousValues.get(event.target)
    if (previousValue === event.target.value) return

    const eventName = getSelectionEventName(event.target, previousValue)
    if (eventName) telemetry.trackEvent({ name: eventName })

    previousValues.set(event.target, event.target.value)
  })
}
