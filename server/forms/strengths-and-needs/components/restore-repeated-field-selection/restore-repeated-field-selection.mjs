/**
 * Restores the checked state of "same-code field variants" — one logical
 * radio question rendered as several copies, each nested under a different
 * parent option's conditional reveal (see forge-core's same-code field
 * variants). All copies share one `name`, so per the HTML radio-button spec
 * the browser keeps only the LAST checked copy in DOM order checked at parse
 * time and unchecks the rest — even though each was independently rendered
 * `checked` by the server. Whichever parent option happens to be selected on
 * load may not be the one whose copy "won", so the visible copy can appear
 * unanswered.
 *
 * Fix: the `checked` HTML attribute (as opposed to the live `.checked`
 * property) survives that dedup untouched, so it still tells us which copy
 * the server intended as checked. Find the checked copy that sits inside the
 * currently visible reveal and check it — the browser then unchecks the
 * others in the group for us, same as if the user had clicked it.
 *
 * Generic by design: works for any field repeated this way, not just one
 * question, and for any depth of nested conditional reveals.
 */
const isWithinHiddenReveal = element => {
  let node = element.parentElement

  while (node) {
    if (node.classList && [...node.classList].some(className => className.endsWith('__conditional--hidden'))) {
      return true
    }
    node = node.parentElement
  }

  return false
}

const restoreRepeatedRadioSelections = () => {
  const groups = new Map()

  document.querySelectorAll('input[type="radio"][name]').forEach(radio => {
    const group = groups.get(radio.name) ?? []
    group.push(radio)
    groups.set(radio.name, group)
  })

  groups.forEach(group => {
    const serverChecked = group.filter(radio => radio.hasAttribute('checked'))

    // Only one server-checked copy is the normal case; more than one means
    // this is a repeated field variant that needs reconciling.
    if (serverChecked.length <= 1) return

    const visibleChecked = serverChecked.find(radio => !isWithinHiddenReveal(radio))
    if (visibleChecked) {
      visibleChecked.checked = true
    }
  })
}

window.addEventListener('DOMContentLoaded', restoreRepeatedRadioSelections)
