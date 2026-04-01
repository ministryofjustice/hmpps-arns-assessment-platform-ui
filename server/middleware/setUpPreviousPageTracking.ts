import { Router } from 'express'

const maxPageHistoryEntries = 10
const excludedPathPrefixes = [
  '/assets',
  '/health',
  '/info',
  '/ping',
  '/sign-in',
  '/sign-out',
  '/autherror',
  '/account-details',
  '/session',
]

/**
 * Tracks page visits in the session using stack semantics.
 *
 * When the user visits a URL that's already in the history, everything above it
 * is trimmed (back-navigation). Otherwise, the URL is pushed onto the top
 * (forward navigation). This prevents loops where two pages' back buttons point
 * to each other.
 *
 * Exposes `previousPageUrl` in `req.state` and `res.locals` for use in templates.
 */
export default function setUpPreviousPageTracking(): Router {
  const router = Router()

  router.use((req, res, next) => {
    const currentUrl = req.originalUrl
    const pageHistory = req.session.pageHistory ?? []

    // Stack semantics: if the URL is already in the history, the user is going
    // "back" — the previous page is the entry before it. Otherwise they're
    // going forward — the previous page is the top of the current stack.
    const existingIdx = pageHistory.indexOf(currentUrl)
    const previousPageUrl =
      existingIdx !== -1
        ? pageHistory[existingIdx - 1] // back-navigation: entry before the revisited page
        : pageHistory.at(-1) // forward navigation: current top of stack

    req.state = {
      ...req.state,
      previousPageUrl,
    }
    res.locals.previousPageUrl = previousPageUrl

    res.end = new Proxy(res.end, {
      apply(target, thisArg, args) {
        if (req.method === 'GET' && res.statusCode >= 200 && res.statusCode < 300) {
          const normalizedPath = req.path.toLowerCase()
          const isExcluded = excludedPathPrefixes.some(
            prefix => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`),
          )

          const contentType = res.getHeader('content-type')
          const isHtml =
            (typeof contentType === 'string' && contentType.includes('text/html')) ||
            (Array.isArray(contentType) && contentType.some(value => value.includes('text/html')))

          if (!isExcluded && isHtml) {
            const idx = pageHistory.indexOf(currentUrl)

            if (idx !== -1) {
              // Back-navigation: trim everything after this page
              req.session.pageHistory = pageHistory.slice(0, idx + 1)
            } else if (pageHistory.at(-1) !== currentUrl) {
              // Forward navigation: push onto the stack
              req.session.pageHistory = [...pageHistory, currentUrl].slice(-maxPageHistoryEntries)
            }
          }
        }

        return Reflect.apply(target, thisArg, args)
      },
    })

    next()
  })

  return router
}
