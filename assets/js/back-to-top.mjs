/**
 * Show "Back to top" links only when the page content exceeds the viewport
 * height, so the link appears only when it is useful as an alternative to
 * scrolling.
 *
 * Progressive enhancement: the link is visible by default in the markup, so
 * without JS it still works. This module hides it when the page is not
 * scrollable, and re-evaluates on resize and when content height changes.
 *
 * Opt in by adding the `js-back-to-top` class to the link's wrapper element.
 */
export function initBackToTop() {
  const links = document.querySelectorAll('.js-back-to-top')

  if (links.length === 0) {
    return
  }

  const update = () => {
    const isScrollable = document.documentElement.scrollHeight > window.innerHeight

    links.forEach(link => {
      link.hidden = !isScrollable
    })
  }

  update()

  // Scroll to the top and move focus there too, so keyboard/screen-reader users
  // continue from the top (href="#" only scrolls, it doesn't move focus).
  links.forEach(link => {
    const anchor = link.querySelector('a')

    anchor?.addEventListener('click', event => {
      event.preventDefault()
      window.scrollTo({ top: 0 })
      moveFocusToTop()
    })
  })

  window.addEventListener('resize', update)

  // Content height can change after load (fonts, images, expanding sections),
  // so re-check whenever the body resizes.
  if ('ResizeObserver' in window) {
    new ResizeObserver(update).observe(document.body)
  }
}

/**
 * Move the keyboard to the top so the next Tab continues from there, not the
 * clicked link. Focuses the main content area (or heading/body as a fallback).
 * preventScroll keeps the page at the top; the temporary tabindex is removed
 * afterwards so it isn't left as a stray Tab stop.
 */
function moveFocusToTop() {
  const target = document.getElementById('main-content') ?? document.querySelector('h1') ?? document.body

  target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
  target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true })
}
