import { AgentConfig, type ApiConfig } from '@ministryofjustice/hmpps-rest-client'
import WiremockAdminClient, { StubbedApisConfig, WiremockStubMapping } from './wiremockAdminClient'

jest.mock('../config', () => ({
  apis: {
    wiremockAdmin: { url: 'http://wiremock:8080/__admin', timeout: { response: 5000, deadline: 5000 } },
    arnsApi: { url: 'http://wiremock:8080/arns-api', timeout: { response: 5000, deadline: 5000 } },
  },
  stubbedApis: { arnsApi: { enabled: false, stubPrefix: '/arns-api' } },
}))

jest.mock('../../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}))

const mockLogger = jest.requireMock('../../logger') as { warn: jest.Mock }

const adminConfig: ApiConfig = {
  url: 'http://wiremock:8080/__admin',
  timeout: { response: 5000, deadline: 5000 },
  agent: new AgentConfig(5000),
}

const stubbedApis = (enabled: boolean): StubbedApisConfig => ({ arnsApi: { enabled, stubPrefix: '/arns-api' } })
const createWiremockClient = (enabled: boolean, arnsApiUrl: string) =>
  new WiremockAdminClient(adminConfig, stubbedApis(enabled), { arnsApi: { url: arnsApiUrl } })

describe('WiremockAdminClient', () => {
  describe('canStub()', () => {
    it.each(['http://hmpps-arns-assessment-platform-ui-wiremock/arns-api', 'http://wiremock:8080/arns-api/'])(
      'should be true when stubbing is enabled and ARNS API is served by wiremock at %s',
      url => {
        const client = createWiremockClient(true, url)

        const result = client.canStub('arnsApi')

        expect(result).toBe(true)
      },
    )

    it('should be false when stubbing is disabled even if ARNS API is served by wiremock', () => {
      const client = createWiremockClient(false, 'http://wiremock:8080/arns-api')

      const result = client.canStub('arnsApi')

      expect(result).toBe(false)
    })

    it.each([
      'https://assess-risks-and-needs-dev.hmpps.service.justice.gov.uk',
      'http://localhost:9091',
      'http://wiremock:8080/delius',
    ])('should be false when stubbing is enabled but ARNS API is not behind Wiremock at %s', url => {
      const client = createWiremockClient(true, url)

      const result = client.canStub('arnsApi')

      expect(result).toBe(false)
    })
  })

  describe('importStubs()', () => {
    it('should post the stubs to the admin import endpoint without deleting other stubs', async () => {
      const client = createWiremockClient(true, 'http://wiremock:8080/arns-api')
      const post = jest.spyOn(client as unknown as { post: jest.Mock }, 'post').mockResolvedValue(undefined)
      const mapping: WiremockStubMapping = {
        id: '11111111-1111-4111-8111-111111111111',
        priority: 1,
        request: { method: 'GET', urlPath: '/arns-api/needs/X123456' },
        response: {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          jsonBody: { assessmentVersion: 'SAN', needs: [] },
        },
      }

      await client.importStubs([mapping])

      expect(post).toHaveBeenCalledWith({
        path: '/mappings/import',
        data: {
          mappings: [mapping],
          importOptions: { duplicatePolicy: 'OVERWRITE', deleteAllNotInImport: false },
        },
      })
    })

    it('should post an error stub with no body', async () => {
      const client = createWiremockClient(true, 'http://wiremock:8080/arns-api')
      const post = jest.spyOn(client as unknown as { post: jest.Mock }, 'post').mockResolvedValue(undefined)
      const mapping: WiremockStubMapping = {
        id: '22222222-2222-4222-8222-222222222222',
        priority: 1,
        request: { method: 'GET', urlPath: '/arns-api/needs/X123456' },
        response: { status: 500 },
      }

      await client.importStubs([mapping])

      expect(post).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ mappings: [mapping] }) }),
      )
    })
  })
  describe('removeStubs()', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should delete each stub by id', async () => {
      const client = createWiremockClient(true, 'http://wiremock:8080/arns-api')
      const del = jest.spyOn(client as unknown as { delete: jest.Mock }, 'delete').mockResolvedValue(undefined)

      await client.removeStubs(['id-1', 'id-2'])

      expect(del).toHaveBeenCalledWith({ path: '/mappings/id-1' })
      expect(del).toHaveBeenCalledWith({ path: '/mappings/id-2' })
      expect(mockLogger.warn).not.toHaveBeenCalled()
    })

    it('should treat a stub that is already gone as removed', async () => {
      const client = createWiremockClient(true, 'http://wiremock:8080/arns-api')
      jest.spyOn(client as unknown as { delete: jest.Mock }, 'delete').mockRejectedValue({ responseStatus: 404 })

      await client.removeStubs(['id-1'])

      expect(mockLogger.warn).not.toHaveBeenCalled()
    })

    it('should log and carry on when a stub cannot be removed', async () => {
      const client = createWiremockClient(true, 'http://wiremock:8080/arns-api')
      jest
        .spyOn(client as unknown as { delete: jest.Mock }, 'delete')
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce({ responseStatus: 500 })

      await client.removeStubs(['id-1', 'id-2'])

      expect(mockLogger.warn).toHaveBeenCalledWith({ ids: ['id-2'] }, expect.any(String))
    })
  })
})
