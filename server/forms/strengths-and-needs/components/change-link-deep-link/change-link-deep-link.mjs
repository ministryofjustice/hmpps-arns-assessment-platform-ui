/**
 * Mimics the behaviour of the error summary component when a "Change" link is clicked.
 * Brings the question into view, if the question is inside a tab (i.e. practitioner analysis),
 * activate that tab first, then scroll its title into view and focus the first input.
 */
window.addEventListener('load', function scrollToAnchoredQuestion() {
  const id = decodeURIComponent((window.location.hash || '').slice(1))
  if (!id) return

  const target = document.getElementById(id)
  if (!target) return

  // If the question lives in a tab panel that isn't active, activate that tab first.
  const panel = target.closest('.govuk-tabs__panel')
  if (panel) {
    const tab = document.querySelector(`.govuk-tabs__tab[href="#${panel.id}"]`)
    if (tab) tab.click()
  }

  // Bring the question title into view and focus the first field, keeping the title visible.
  const formGroup = target.closest('.govuk-form-group')
  const title = (formGroup && formGroup.querySelector('legend, label')) || target
  title.scrollIntoView()

  const input = (formGroup || target).querySelector('input, textarea, select')
  if (input) input.focus({ preventScroll: true })
})
