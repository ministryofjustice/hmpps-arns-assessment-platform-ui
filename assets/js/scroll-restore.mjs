const STORAGE_KEY = 'scroll-restore'
const MAX_AGE_MS = 5000

/*
 * Scroll and focus restoration for form submissions and link navigations.
 * Only activates on pages with `data-scroll-restore` attribute on <body> or <html>.
 *
 * Add `data-scroll-restore-focus` to any button or link that triggers a page reload.
 * The value is a CSS selector matching the repeating containers on the page (for example, "tbody", ".card").
 * On reload, the container at the calculated index is focused and scrolled into view.
 *
 * Attributes:
 *   data-scroll-restore-focus  (required) - CSS selector for focusable containers
 *   data-scroll-restore-offset (optional) - index shift from the current container position
 *                                           defaults to 0 (stay in place)
 *                                           use -1 to follow an item moving up, 1 for moving down
 *
 * Containers matching the selector must have `tabindex="-1"` to be programmatically focusable.
 * If the calculated index exceeds the list length (for example, last item removed), the new last item is focused.
 */

export function initScrollRestore() {
  const isEnabled =
    document.body.hasAttribute('data-scroll-restore') || document.documentElement.hasAttribute('data-scroll-restore')

  if (!isEnabled) {
    return
  }

  const currentUrl = window.location.pathname
  let shouldPreserveScrollPosition = false

  // Restore scroll and focus from previous page
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)

    if (saved) {
      sessionStorage.removeItem(STORAGE_KEY)

      const { url, scrollY, focusSelector, focusIndex, timestamp } = JSON.parse(saved)
      const isRecent = Date.now() - timestamp < MAX_AGE_MS
      const isSameUrl = url === currentUrl

      if (isSameUrl && isRecent) {
        if (focusSelector && focusIndex !== undefined) {
          const candidates = document.querySelectorAll(focusSelector)
          // Clamp to valid range so out-of-bounds offsets snap to the nearest item
          const clampedIndex = Math.max(0, Math.min(focusIndex, candidates.length - 1))
          const target = candidates[clampedIndex]

          if (target) {
            // Focus first without scrolling, then centre in viewport to avoid double-scroll
            target.focus({ preventScroll: true })
            target.scrollIntoView({ block: 'center', behavior: 'instant' })
          }
        } else {
          window.scrollTo(0, scrollY)
        }
      }
    }
  } catch (error) {
    console.warn('[scroll-restore] Failed to restore scroll position:', error)
  }

  // Save scroll and focus data on form submissions
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', event => {
      // Forms without focus attributes still preserve scroll position (plain Y restore)
      if (!event.submitter?.hasAttribute('data-scroll-restore-focus')) {
        shouldPreserveScrollPosition = true
        saveScrollPosition(currentUrl)

        return
      }

      const focusData = getFocusData(event.submitter)

      shouldPreserveScrollPosition = true
      saveScrollPosition(currentUrl, focusData)
    })
  })

  // Save scroll and focus data on link clicks
  document.querySelectorAll('a[data-scroll-restore-focus]').forEach(link => {
    link.addEventListener('click', () => {
      const focusData = getFocusData(link)

      shouldPreserveScrollPosition = true
      saveScrollPosition(currentUrl, focusData)
    })
  })

  // Clear data when navigating away (unless scroll position was saved for restoration)
  window.addEventListener('pagehide', () => {
    if (!shouldPreserveScrollPosition) {
      try {
        sessionStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        console.warn('[scroll-restore] Failed to clear session storage:', error)
      }
    }
  })
}

// Determine the focus selector and destination index from a button or link
function getFocusData(element) {
  const focusSelector = element.getAttribute('data-scroll-restore-focus')
  const offset = Number(element.getAttribute('data-scroll-restore-offset') || 0)

  if (!focusSelector) {
    return undefined
  }

  // Walk up from the clicked element to find which container it belongs to
  const candidates = document.querySelectorAll(focusSelector)
  const container = element.closest(focusSelector)
  const currentIndex = Array.from(candidates).indexOf(container)

  if (currentIndex === -1) {
    return undefined
  }

  return { focusSelector, focusIndex: currentIndex + offset }
}

function saveScrollPosition(url, focusData) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        url,
        scrollY: window.scrollY,
        ...focusData,
        timestamp: Date.now(),
      }),
    )
  } catch (error) {
    console.warn('[scroll-restore] Failed to save scroll position:', error)
  }
}
