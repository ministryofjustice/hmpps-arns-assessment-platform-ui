import { AsyncLocalStorage } from 'node:async_hooks'

interface RequestContext {
  getServiceName: () => string | undefined
}

export const requestContext = new AsyncLocalStorage<RequestContext>()
