import { Request, Response, NextFunction } from 'express'
import { RequestServices } from '../services'

export default function setupRequestServices(serviceFactories: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    req.services = {} as RequestServices
    Object.entries(serviceFactories).forEach(([name, factory]: [string, any]) => {
      req.services[name as keyof RequestServices] = factory(req)
    })
    return next()
  }
}
