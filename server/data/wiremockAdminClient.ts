import { RestClient, type ApiConfig } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'

// jsonBody is optional so error stubs (404, 500) can be registered with no body
export interface WiremockStubMapping<TBody extends object = object> {
  id: string
  priority: number
  request: {
    method: 'GET'
    urlPath: string
  }
  response: {
    status: number
    headers?: Record<string, string>
    jsonBody?: TBody
  }
  metadata?: Record<string, string>
}

export type StubbedApisConfig = typeof config.stubbedApis
type StubbedApi = keyof StubbedApisConfig
type StubbedApiUrls = Record<StubbedApi, Pick<ApiConfig, 'url'>>

export default class WiremockAdminClient extends RestClient {
  private readonly stubbedApis: StubbedApisConfig

  private readonly apiUrls: StubbedApiUrls

  constructor(
    wiremockAdminConfig: ApiConfig = config.apis.wiremockAdmin,
    stubbedApis: StubbedApisConfig = config.stubbedApis,
    apiUrls: StubbedApiUrls = config.apis,
  ) {
    super('Wiremock admin', wiremockAdminConfig, logger)

    this.stubbedApis = stubbedApis
    this.apiUrls = apiUrls
  }

  canStub(api: StubbedApi): boolean {
    const { enabled, stubPrefix } = this.stubbedApis[api]

    if (!enabled) {
      return false
    }

    const apiPath = new URL(this.apiUrls[api].url).pathname.replace(/\/$/, '')

    return apiPath === stubPrefix
  }

  /**
   * Deletes the stubs with these ids. A stub that is already gone (404) is fine, and other failures are only
   * logged, as a stub left behind is harmless and launching again replaces it.
   */
  async removeStubs(ids: string[]): Promise<void> {
    const results = await Promise.allSettled(ids.map(id => this.delete({ path: `/mappings/${id}` })))
    const failedIds = ids.filter((_id, index) => {
      const result = results[index]

      return result.status === 'rejected' && (result.reason as { responseStatus?: number })?.responseStatus !== 404
    })

    if (failedIds.length > 0) {
      logger.warn({ ids: failedIds }, 'Failed to remove Wiremock stubs, they stay until Wiremock restarts')
    }
  }

  /**
   * Creates the stubs, or replaces any with the same id, so launching the same session again
   * updates its stubs instead of adding duplicates. deleteAllNotInImport is explicitly false
   * because true would wipe every other stub, including the magic CRNs.
   */
  async importStubs(mappings: WiremockStubMapping[]): Promise<void> {
    try {
      await this.post({
        path: '/mappings/import',
        data: {
          mappings,
          importOptions: { duplicatePolicy: 'OVERWRITE', deleteAllNotInImport: false },
        },
      })
    } catch (error) {
      logger.warn(
        { err: error, urlPaths: mappings.map(({ request }) => request.urlPath) },
        'Failed to import Wiremock stubs, requests will fall through to the canned or real API response',
      )
    }
  }
}
