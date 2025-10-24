import { Request } from 'express'
import { dataAccess } from '../data'
import AuditService from './auditService'
import SessionService from './sessionService'
import ExampleService from './exampleService'

export const services = () => {
  const { applicationInfo, exampleApiClient } = dataAccess()

  return {
    applicationInfo,
    exampleService: new ExampleService(exampleApiClient),
  }
}

export const requestServices = (appServices: Services) => ({
  sessionService: (req: Request) => new SessionService(req),
  auditService: (req: Request) => {
    const sessionService = new SessionService(req)
    return new AuditService(appServices.applicationInfo, sessionService, req.id)
  },
})

export type RequestServices = {
  [K in keyof ReturnType<typeof requestServices>]: ReturnType<ReturnType<typeof requestServices>[K]>
}

export type Services = ReturnType<typeof services>
