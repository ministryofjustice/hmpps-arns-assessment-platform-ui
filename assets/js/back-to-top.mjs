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

  window.addEventListener('resize', update)

  // Content height can change after load (fonts, images, expanding sections),
  // so re-check whenever the body resizes.
  if ('ResizeObserver' in window) {
    new ResizeObserver(update).observe(document.body)
  }
}
