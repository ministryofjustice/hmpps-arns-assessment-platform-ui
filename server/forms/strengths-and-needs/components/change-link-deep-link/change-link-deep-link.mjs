/**
 * Change links anchor to a question with `#<code>-question` (the id on
 * its form group) which the browser scrolls to.
 * However, it can't open the practitioner analysis tab when the question
 * is inside it, and focus the question's first input. This script does both.
 */

const showQuestion = question => {
  question.scrollIntoView()

  question.querySelector('input, textarea, select')?.focus({ preventScroll: true })
}

const showAnchoredQuestion = () => {
  const questionId = window.location.hash.slice(1)
  const question = document.getElementById(questionId)
  if (!question || !question.classList.contains('govuk-form-group')) {
    return
  }

  const hiddenPanel = question.closest('.govuk-tabs__panel--hidden')
  if (!hiddenPanel) {
    showQuestion(question)
    return
  }

  // Point the URL at the panel so GOV.UK Tabs opens it
  window.addEventListener(
    'hashchange',
    () =>
      setTimeout(() => {
        window.history.replaceState(null, '', `#${questionId}`)
        showQuestion(question)
      }),
    { once: true },
  )
  window.location.replace(`#${hiddenPanel.id}`)
}

window.addEventListener('load', showAnchoredQuestion)
window.addEventListener('hashchange', showAnchoredQuestion)
