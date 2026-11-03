import { registerTrainingStubs, removeTrainingStubs } from './trainingStubs'
import type { PartialScenarioValues, ScenarioValues } from '../../scenarios'
import type WiremockAdminClient from '../../../../data/wiremockAdminClient'
import { WiremockStubMapping } from '../../../../data/wiremockAdminClient'
import ArnsNeedsStubBuilder from './ArnsNeedsStubBuilder'
import { deterministicUuid } from './wiremockStubMapping'

jest.mock('../../../../../logger', () => ({ info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() }))
jest.mock('./ArnsNeedsStubBuilder')

const stub: WiremockStubMapping = {
  id: 'arns',
  priority: 1,
  request: { method: 'GET', urlPath: '/arns' },
  response: { status: 200 },
}

const needsStubIds = [deterministicUuid('/arns-api/needs/crn/X123456'), deterministicUuid('/arns-api/needs/X123456')]

const toValues = (values: PartialScenarioValues) => ({ crn: 'X123456', ...values }) as ScenarioValues

describe('trainingStubs', () => {
  let client: jest.Mocked<Pick<WiremockAdminClient, 'canStub' | 'importStubs' | 'removeStubs'>>

  beforeEach(() => {
    jest.clearAllMocks()
    client = { canStub: jest.fn().mockReturnValue(true), importStubs: jest.fn(), removeStubs: jest.fn() }
    jest.mocked(ArnsNeedsStubBuilder.build).mockReturnValue([stub])
    jest
      .mocked(ArnsNeedsStubBuilder.urlPaths)
      .mockImplementation(crn => [`/arns-api/needs/crn/${crn}`, `/arns-api/needs/${crn}`])
  })

  describe('registerTrainingStubs()', () => {
    it('should import the needs stubs built from the session values when mocked needs are on for Private Beta', async () => {
      const values = toValues({ useMockedCriminogenicNeeds: 'YES', accOtherWeightedScore: '4' })

      await registerTrainingStubs(client, values, ['SAN_PRIVATE_BETA'])

      expect(ArnsNeedsStubBuilder.build).toHaveBeenCalledWith('X123456', values)
      expect(client.importStubs).toHaveBeenCalledWith([stub])
      expect(client.removeStubs).not.toHaveBeenCalled()
    })

    it.each([
      {
        description: 'the mocks are off',
        values: { useMockedCriminogenicNeeds: 'NO' as const },
        flags: ['SAN_PRIVATE_BETA' as const],
      },
      { description: 'the session predates the mocks setting', values: {}, flags: ['SAN_PRIVATE_BETA' as const] },
      {
        description: 'the session is not Private Beta',
        values: { useMockedCriminogenicNeeds: 'YES' as const },
        flags: [],
      },
    ])(
      'should remove any earlier stubs for the CRN instead of stubbing when $description',
      async ({ values, flags }) => {
        const sessionValues = toValues({ ...values, accOtherWeightedScore: '4' })

        await registerTrainingStubs(client, sessionValues, flags)

        expect(client.importStubs).not.toHaveBeenCalled()
        expect(client.removeStubs).toHaveBeenCalledWith(needsStubIds)
      },
    )

    it('should remove any earlier stubs for the CRN when there are no needs to stub', async () => {
      jest.mocked(ArnsNeedsStubBuilder.build).mockReturnValue([])
      const values = toValues({ useMockedCriminogenicNeeds: 'YES' })

      await registerTrainingStubs(client, values, ['SAN_PRIVATE_BETA'])

      expect(client.importStubs).not.toHaveBeenCalled()
      expect(client.removeStubs).toHaveBeenCalledWith(needsStubIds)
    })

    it('should not call Wiremock when ARNS API is not behind Wiremock', async () => {
      client.canStub.mockReturnValue(false)
      const values = toValues({ useMockedCriminogenicNeeds: 'YES', accOtherWeightedScore: '4' })

      await registerTrainingStubs(client, values, ['SAN_PRIVATE_BETA'])

      expect(client.importStubs).not.toHaveBeenCalled()
      expect(client.removeStubs).not.toHaveBeenCalled()
    })

    it('should not touch the stubs for a magic CRN', async () => {
      const values = toValues({ crn: 'X444444', useMockedCriminogenicNeeds: 'YES', accOtherWeightedScore: '4' })

      await registerTrainingStubs(client, values, ['SAN_PRIVATE_BETA'])

      expect(ArnsNeedsStubBuilder.build).not.toHaveBeenCalled()
      expect(client.importStubs).not.toHaveBeenCalled()
      expect(client.removeStubs).not.toHaveBeenCalled()
    })

    it.each(['../health/ping', 'X1/foo', 'x123456', 'X12345', 'X1234567', ''])(
      'should not touch any stubs when the CRN is %p',
      async crn => {
        const values = toValues({ crn, useMockedCriminogenicNeeds: 'YES', accOtherWeightedScore: '4' })

        await registerTrainingStubs(client, values, ['SAN_PRIVATE_BETA'])

        expect(ArnsNeedsStubBuilder.build).not.toHaveBeenCalled()
        expect(client.importStubs).not.toHaveBeenCalled()
        expect(client.removeStubs).not.toHaveBeenCalled()
      },
    )
  })

  describe('removeTrainingStubs()', () => {
    it('should remove the needs stubs for the CRN', async () => {
      const crn = 'X123456'

      await removeTrainingStubs(client, crn)

      expect(ArnsNeedsStubBuilder.urlPaths).toHaveBeenCalledWith('X123456')
      expect(client.removeStubs).toHaveBeenCalledWith(needsStubIds)
    })

    it('should not call Wiremock when ARNS API is not behind Wiremock', async () => {
      client.canStub.mockReturnValue(false)

      await removeTrainingStubs(client, 'X123456')

      expect(client.removeStubs).not.toHaveBeenCalled()
    })

    it.each(['X444444', '../health/ping'])('should not remove anything for the CRN %p', async crn => {
      const unstubbableCrn = crn

      await removeTrainingStubs(client, unstubbableCrn)

      expect(client.removeStubs).not.toHaveBeenCalled()
    })
  })
})
