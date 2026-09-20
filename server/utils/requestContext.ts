import { AsyncLocalStorage } from 'node:async_hooks'

interface RequestContext {
  getServiceName: () => string | undefined
  getRequestUrl: () => string
}

export const requestContext = new AsyncLocalStorage<RequestContext>()
