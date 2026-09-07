import { Router, type NextFunction, type Request, type Response } from 'express'
import { BadRequest, InternalServerError } from 'http-errors'
import type { DeliusApi } from '@ministryofjustice/hmpps-aap-sdk/dependencies/delius/DeliusApi.type'
import type { HandoverApi } from '@ministryofjustice/hmpps-aap-sdk/dependencies/handover/HandoverApi.type'
import accessTargetRegistry, { type AccessTarget } from '../access/AccessTargetRegistry'

class AccessController {
  constructor(
    private readonly deliusApi: DeliusApi,
    private readonly handoverApi: HandoverApi,
  ) {}

  async accessFromOasys(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const accessTarget = this.getAccessTarget(req.params.service)

      this.clearAccessSession(req)
      await this.prepareHandoverSession(req)
      req.session.targetService = req.params.service
      res.redirect(accessTarget.entryPath)
    } catch (error) {
      next(error)
    }
  }

  async accessFromCrn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const accessTarget = this.getAccessTarget(req.params.service)

      this.clearAccessSession(req)
      await this.prepareCrnSession(req)
      req.session.targetService = req.params.service
      res.redirect(accessTarget.entryPath)
    } catch (error) {
      next(error)
    }
  }

  private getAccessTarget(service: string): AccessTarget {
    const accessTarget = accessTargetRegistry.get(service)

    if (!accessTarget) {
      throw new BadRequest(`Unknown target service: ${service}`)
    }

    return accessTarget
  }

  private getAuthenticatedUser(req: Request): Express.RequestState['user'] {
    const user = req.state?.user

    if (!user) {
      throw new InternalServerError('User is required - ensure user is authenticated')
    }

    return user
  }

  private clearAccessSession(req: Request): void {
    delete req.session.handoverContext
    delete req.session.caseDetails
    delete req.session.practitionerDetails
    delete req.session.accessDetails
  }

  private async prepareCrnSession(req: Request): Promise<void> {
    const user = this.getAuthenticatedUser(req)

    req.session.caseDetails = await this.deliusApi.getCaseDetails(req.params.crn)
    req.session.practitionerDetails = {
      identifier: user.id,
      displayName: user.name,
      authSource: 'HMPPS_AUTH',
    }
    req.session.accessDetails = {
      accessType: 'HMPPS_AUTH',
      planAccessMode: 'READ_WRITE',
    }
  }

  private async prepareHandoverSession(req: Request): Promise<void> {
    const user = this.getAuthenticatedUser(req)
    const handoverContext = await this.handoverApi.getCurrentContext(user.token)
    const { principal, subject } = handoverContext

    req.session.handoverContext = handoverContext
    req.session.caseDetails = {
      name: {
        forename: subject.givenName,
        middleName: '',
        surname: subject.familyName,
      },
      crn: subject.crn,
      pnc: subject.pnc,
      dateOfBirth: subject.dateOfBirth,
      nomisId: subject.nomisId,
      location: subject.location,
      sexuallyMotivatedOffenceHistory: subject.sexuallyMotivatedOffenceHistory,
      tier: '',
      region: '',
      sentences: [],
    }
    req.session.practitionerDetails = {
      identifier: principal.identifier,
      displayName: principal.displayName,
      authSource: 'OASYS',
    }
    req.session.accessDetails = {
      accessType: 'OASYS',
      planAccessMode: principal.planAccessMode,
      oasysRedirectUrl: principal.returnUrl,
    }
  }
}

export default function accessRoutes(deliusApi: DeliusApi, handoverApi: HandoverApi): Router {
  const router = Router()
  const accessController = new AccessController(deliusApi, handoverApi)

  router.get('/:service/oasys', (req, res, next) => accessController.accessFromOasys(req, res, next))
  router.get('/:service/crn/:crn', (req, res, next) => accessController.accessFromCrn(req, res, next))

  return router
}
