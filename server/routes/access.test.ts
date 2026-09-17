import express, { type Express } from 'express'
import request from 'supertest'
import type { DeliusApi } from '@ministryofjustice/hmpps-aap-sdk/dependencies/delius/DeliusApi.type'
import type { CaseDetails } from '@ministryofjustice/hmpps-aap-sdk/dependencies/delius/DeliusCaseDetails.type'
import type { HandoverApi } from '@ministryofjustice/hmpps-aap-sdk/dependencies/handover/HandoverApi.type'
import type { HandoverContext } from '@ministryofjustice/hmpps-aap-sdk/dependencies/handover/HandoverResponse.type'
import accessRoutes from './access'

describe('accessRoutes', () => {
  const getCaseDetails = jest.fn<ReturnType<DeliusApi['getCaseDetails']>, Parameters<DeliusApi['getCaseDetails']>>()
  const getCurrentContext = jest.fn<
    ReturnType<HandoverApi['getCurrentContext']>,
    Parameters<HandoverApi['getCurrentContext']>
  >()
  const createHandoverLink = jest.fn<
    ReturnType<HandoverApi['createHandoverLink']>,
    Parameters<HandoverApi['createHandoverLink']>
  >()
  const deliusApi: DeliusApi = { getCaseDetails }
  const handoverApi: HandoverApi = { createHandoverLink, getCurrentContext }
  const user: Express.RequestState['user'] = {
    id: 'USER1',
    name: 'Jane Smith',
    displayName: 'Jane Smith',
    authSource: 'HMPPS_AUTH',
    token: 'user-token',
    userRoles: [],
  }
  const caseDetails: CaseDetails = {
    name: {
      forename: 'Sam',
      middleName: '',
      surname: 'Taylor',
    },
    crn: 'X000001',
    tier: 'A3',
    dateOfBirth: '1980-01-01',
    nomisId: 'A0001AA',
    region: 'North West',
    location: 'COMMUNITY',
    sexuallyMotivatedOffenceHistory: 'NO',
    sentences: [],
  }
  const handoverContext: HandoverContext = {
    handoverSessionId: 'handover-session-id',
    principal: {
      identifier: 'OASYS1',
      displayName: 'Alex Smith',
      accessMode: 'READ_WRITE',
      planAccessMode: 'READ_ONLY',
      returnUrl: 'https://oasys.example/return',
    },
    subject: {
      crn: 'X000002',
      pnc: 'PNC123',
      nomisId: 'A0002AA',
      givenName: 'Robin',
      familyName: 'Jones',
      dateOfBirth: '1990-02-03',
      location: 'PRISON',
      sexuallyMotivatedOffenceHistory: 'YES',
    },
  }
  let session: Record<string, unknown>

  const createApp = ({ includeUser = true }: { includeUser?: boolean } = {}): Express => {
    const app = express()

    app.use((req, _res, next) => {
      Object.defineProperty(req, 'session', { value: session })
      req.state = includeUser ? { user } : {}
      next()
    })
    app.use('/access', accessRoutes(deliusApi, handoverApi))
    app.use(
      (
        error: { status?: number; message: string },
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
      ) => res.status(error.status ?? 500).send(error.message),
    )

    return app
  }

  beforeEach(() => {
    session = {
      accessDetails: { stale: true },
      caseDetails: { stale: true },
      handoverContext: { stale: true },
      practitionerDetails: { stale: true },
    }
    jest.resetAllMocks()
  })

  it.each(['sentence-plan', 'strengths-and-needs'])(
    'should prepare an OASys session when entering %s',
    async service => {
      // Arrange
      getCurrentContext.mockResolvedValue(handoverContext)

      // Act
      await request(createApp()).get(`/access/${service}/oasys`).expect(302).expect('Location', `/${service}`)

      // Assert
      expect(getCurrentContext).toHaveBeenCalledWith('user-token')
      expect(session).toEqual({
        accessDetails: {
          accessType: 'OASYS',
          accessMode: 'READ_WRITE',
          planAccessMode: 'READ_ONLY',
          oasysRedirectUrl: 'https://oasys.example/return',
        },
        caseDetails: {
          name: {
            forename: 'Robin',
            middleName: '',
            surname: 'Jones',
          },
          crn: 'X000002',
          pnc: 'PNC123',
          gender: 'NOT_KNOWN',
          dateOfBirth: '1990-02-03',
          nomisId: 'A0002AA',
          location: 'PRISON',
          sexuallyMotivatedOffenceHistory: 'YES',
          tier: '',
          region: '',
          sentences: [],
        },
        handoverContext,
        practitionerDetails: {
          identifier: 'OASYS1',
          displayName: 'Alex Smith',
          authSource: 'OASYS',
        },
        targetService: service,
      })
    },
  )

  it.each(['sentence-plan', 'strengths-and-needs'])('should prepare a CRN session when entering %s', async service => {
    // Arrange
    getCaseDetails.mockResolvedValue(caseDetails)

    // Act
    await request(createApp())
      .get(`/access/${service}/crn/X000001`)
      .expect(302)
      .expect('Location', `/${service}`)

    // Assert
    expect(getCaseDetails).toHaveBeenCalledWith('X000001')
    expect(session).toEqual({
      accessDetails: {
        accessType: 'HMPPS_AUTH',
        accessMode: 'READ_WRITE',
        planAccessMode: 'READ_WRITE',
      },
      caseDetails,
      practitionerDetails: {
        identifier: 'USER1',
        displayName: 'Jane Smith',
        authSource: 'HMPPS_AUTH',
      },
      targetService: service,
    })
  })

  it.each([
    ['0', 'NOT_KNOWN'],
    ['1', 'MALE'],
    ['2', 'FEMALE'],
    ['9', 'NOT_SPECIFIED'],
    ['unexpected', 'NOT_KNOWN'],
  ])('should preserve assessment permissions and gender when handover supplies %s', async (gender, expectedGender) => {
    // Arrange
    getCurrentContext.mockResolvedValue({
      ...handoverContext,
      principal: { ...handoverContext.principal, accessMode: 'READ_ONLY', planAccessMode: 'READ_WRITE' },
      subject: { ...handoverContext.subject, gender },
    })

    // Act
    await request(createApp()).get('/access/strengths-and-needs/oasys').expect(302)

    // Assert
    expect(session.accessDetails).toMatchObject({ accessMode: 'READ_ONLY', planAccessMode: 'READ_WRITE' })
    expect(session.caseDetails).toMatchObject({ gender: expectedGender })
  })

  it('should reject an unknown target service before loading access data', async () => {
    // Arrange
    const app = createApp()

    // Act
    await request(app).get('/access/unknown/oasys').expect(400).expect('Unknown target service: unknown')

    // Assert
    expect(getCurrentContext).not.toHaveBeenCalled()
    expect(session).toEqual({
      accessDetails: { stale: true },
      caseDetails: { stale: true },
      handoverContext: { stale: true },
      practitionerDetails: { stale: true },
    })
  })

  it('should pass Handover API failures to the error handler', async () => {
    // Arrange
    getCurrentContext.mockRejectedValue(new Error('Handover API failed'))

    // Act
    await request(createApp()).get('/access/sentence-plan/oasys').expect(500).expect('Handover API failed')

    // Assert
    expect(getCurrentContext).toHaveBeenCalledWith('user-token')
  })

  it('should reject CRN access when authenticated user details are unavailable', async () => {
    // Arrange
    const app = createApp({ includeUser: false })

    // Act
    await request(app)
      .get('/access/sentence-plan/crn/X000001')
      .expect(500)
      .expect('User is required - ensure user is authenticated')

    // Assert
    expect(getCaseDetails).not.toHaveBeenCalled()
  })
})
