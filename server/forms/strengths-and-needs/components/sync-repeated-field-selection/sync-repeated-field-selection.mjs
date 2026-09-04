/**
 * Keeps "same-code field variants" in sync — one logical radio question
 * rendered as several copies, each nested under a different parent option's
 * conditional reveal (see forge-core's same-code field variants). All copies
 * share one `name`, so per the HTML radio-button spec only one of them can
 * ever be checked at a time in the browser: whenever any copy is checked,
 * the browser un-checks every other same-named radio for us, including
 * copies sitting in other (currently hidden) reveals.
 *
 * That single shared checked state can end up on a hidden copy in two
 * situations this file handles the same way:
 *
 * 1. On page load: if the server renders the stored answer as `checked` on
 *    several copies at once, the HTML radio-button spec has the browser keep
 *    only the LAST one in DOM order checked, which may not be the one whose
 *    parent reveal is actually open.
 * 2. After the user answers a copy, then picks a *different* parent option:
 *    the newly revealed copy has nothing checked (the checked state is still
 *    on the copy under the previously selected parent, now hidden).
 *
 * In both cases: find the checked copy, and if it isn't currently visible,
 * check the same-value radio in whichever copy is visible instead — the
 * browser then un-checks the old one for us, same as if the user had
 * clicked it directly.
 *
 * Generic by design: works for any field repeated this way, not just one
 * question, and for any depth of nested conditional reveals. A plain radio
 * question's own options (one name, several distinct values) are left alone
 * — only names where the same value repeats across multiple elements are
 * treated as a repeated field.
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

const groupBy = (items, keyOf) => {
  const groups = new Map()

  items.forEach(item => {
    const key = keyOf(item)
    const group = groups.get(key) ?? []
    group.push(item)
    groups.set(key, group)
  })

  return groups
}

const isRepeatedFieldGroup = radios =>
  [...groupBy(radios, radio => radio.value).values()].some(sameValueRadios => sameValueRadios.length > 1)

const syncRepeatedFieldSelections = () => {
  const radiosByName = groupBy(document.querySelectorAll('input[type="radio"][name]'), radio => radio.name)

  radiosByName.forEach(radios => {
    if (!isRepeatedFieldGroup(radios)) return

    const checked = radios.find(radio => radio.checked)
    if (!checked || !isWithinHiddenReveal(checked)) return // nothing checked, or already visible

    const visibleMatch = radios.find(radio => radio.value === checked.value && !isWithinHiddenReveal(radio))
    if (visibleMatch) {
      visibleMatch.checked = true
    }
  })
}

window.addEventListener('DOMContentLoaded', syncRepeatedFieldSelections)

// A radio's own value change fires 'change' too, but by then it's already
// the visible, checked copy, so the sync above is a no-op for it — this only
// does something once a *parent* option's click has revealed a different
// copy of the field (GOV.UK Frontend's radios module toggles the reveal
// synchronously on 'click', which fires before 'change').
document.addEventListener('change', event => {
  if (event.target instanceof HTMLInputElement && event.target.type === 'radio') {
    syncRepeatedFieldSelections()
  }
})
