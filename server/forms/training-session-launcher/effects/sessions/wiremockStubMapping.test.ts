import { createWiremockStub, deterministicUuid } from './wiremockStubMapping'

describe('wiremockStubMapping', () => {
  describe('deterministicUuid()', () => {
    it('should give the same UUID for the same input and a different one for different input', () => {
      const input = '/arns-api/needs/X123456'

      const first = deterministicUuid(input)
      const second = deterministicUuid(input)
      const other = deterministicUuid('/arns-api/needs/X654321')

      expect(second).toBe(first)
      expect(other).not.toBe(first)
      expect(first).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-8[0-9a-f]{3}-[0-9a-f]{12}$/)
    })
  })

  describe('createWiremockStub()', () => {
    it('should build a priority 1 GET stub marked as the launcher’s', () => {
      const urlPath = '/arns-api/needs/X123456'

      const stub = createWiremockStub(urlPath, 200, { needs: [] })

      expect(stub).toEqual({
        id: deterministicUuid(urlPath),
        priority: 1,
        request: { method: 'GET', urlPath },
        metadata: { source: 'training-launcher', createdAt: expect.any(String) },
        response: { status: 200, headers: { 'Content-Type': 'application/json' }, jsonBody: { needs: [] } },
      })
    })

    it('should leave the body and headers out for an error stub', () => {
      const urlPath = '/arns-api/needs/X123456'

      const stub = createWiremockStub(urlPath, 500)

      expect(stub.response).toEqual({ status: 500 })
    })
  })
})
