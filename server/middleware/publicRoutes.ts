import type { Request } from 'express'

const PUBLIC_ROUTE_PREFIXES = ['/forms/form-engine-developer-guide']

export function isPubliclyAccessibleRoute(req: Request): boolean {
  if (!req) {
    return false
  }

  const url = req.originalUrl ?? req.url ?? ''
  return PUBLIC_ROUTE_PREFIXES.some(prefix => url.startsWith(prefix))
}
