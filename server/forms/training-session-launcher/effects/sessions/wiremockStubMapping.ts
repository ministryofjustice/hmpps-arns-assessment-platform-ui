import crypto from 'node:crypto'
import { WiremockStubMapping } from '../../../../data/wiremockAdminClient'

/**
 * A UUID that is always the same for the same input. Stub ids use it so that launching the same CRN
 * again replaces its stubs instead of piling up new ones.
 */
export function deterministicUuid(input: string): string {
  const hash = crypto.createHash('sha256').update(input).digest('hex')

  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-8${hash.slice(17, 20)}-${hash.slice(20, 32)}`
}

/**
 * Build a GET stub at priority 1, so it wins over the magic CRN mappings (10) and the proxies (100).
 * Leave jsonBody out for error responses.
 *
 * The metadata marks it as the launcher's, so leftovers can be found with Wiremock's
 * POST /__admin/mappings/find-by-metadata and removed with /__admin/mappings/remove-by-metadata.
 */
export function createWiremockStub<TBody extends object>(
  urlPath: string,
  status: number,
  jsonBody?: TBody,
): WiremockStubMapping<TBody> {
  return {
    id: deterministicUuid(urlPath),
    priority: 1,
    request: { method: 'GET', urlPath },
    metadata: { source: 'training-launcher', createdAt: new Date().toISOString() },
    response: jsonBody ? { status, headers: { 'Content-Type': 'application/json' }, jsonBody } : { status },
  }
}
