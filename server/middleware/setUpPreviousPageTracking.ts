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

export default function setUpPreviousPageTracking(): Router {
  const router = Router()

  router.use((req, res, next) => {
    const currentUrl = req.originalUrl
    const pageHistory = req.session.pageHistory ?? []
    const previousPageUrl = pageHistory.findLast(url => url !== currentUrl)

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

          if (!isExcluded && isHtml && pageHistory.at(-1) !== currentUrl) {
            req.session.pageHistory = [...pageHistory, currentUrl].slice(-maxPageHistoryEntries)
          }
        }

        return Reflect.apply(target, thisArg, args)
      },
    })

    next()
  })

  return router
}
