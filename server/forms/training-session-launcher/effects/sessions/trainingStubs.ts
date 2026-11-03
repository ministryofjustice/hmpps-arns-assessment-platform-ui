import type WiremockAdminClient from '../../../../data/wiremockAdminClient'
import logger from '../../../../../logger'
import { TrainingScenarioFlag } from '../../constants'
import type { ScenarioValues } from '../../scenarios'
import { isStubbedCrn } from '../../scenarios/stubbedCrns'
import ArnsNeedsStubBuilder from './ArnsNeedsStubBuilder'
import { deterministicUuid } from './wiremockStubMapping'

type StubbingClient = Pick<WiremockAdminClient, 'canStub' | 'importStubs' | 'removeStubs'>

// A letter and six digits. The CRN is free text and goes into the stub's URL, so anything else could stub other paths
const CRN_PATTERN = /^[A-Z]\d{6}$/

/**
 * Whether the launcher may touch stubs for this CRN: it must look like a CRN, and must not be one of the magic CRNs,
 * which everyone in dev and test shares and expects their canned data from.
 */
function canStubCrn(crn: string | undefined): crn is string {
  if (!crn || !CRN_PATTERN.test(crn)) {
    logger.warn({ crn }, 'Not stubbing: the CRN is not a letter followed by six digits')

    return false
  }

  if (isStubbedCrn(crn)) {
    logger.info({ crn }, 'Not stubbing a magic CRN, so it keeps its canned Wiremock responses')

    return false
  }

  return true
}

/**
 * Remove the stubs the launcher registered for a CRN, so people opening that CRN outside the launcher (from OASys or
 * nDelius in dev and test) get the real API again. A stub id that does not exist is ignored.
 */
export async function removeTrainingStubs(client: StubbingClient, crn: string): Promise<void> {
  if (!canStubCrn(crn) || !client.canStub('arnsApi')) {
    return
  }

  await client.removeStubs(ArnsNeedsStubBuilder.urlPaths(crn).map(urlPath => deterministicUuid(urlPath)))
}

/**
 * Make the UI's ARNS needs calls return the launcher's criminogenic needs for this session's CRN.
 *
 * When the session does not want mocked needs, any stubs an earlier launch of the same CRN left are removed instead,
 * so the real ARNS API answers. Nothing is stubbed for an invalid or magic CRN, or when ARNS is not behind Wiremock.
 */
export async function registerTrainingStubs(
  client: StubbingClient,
  values: ScenarioValues,
  flags: TrainingScenarioFlag[],
): Promise<void> {
  if (!canStubCrn(values.crn) || !client.canStub('arnsApi')) {
    return
  }

  // Sentence Plan only reads ARNS needs for SAN_BETA assessments (canAccessSanInfo), so stubs for any other session would never be used.
  const wantsMockedNeeds = values.useMockedCriminogenicNeeds === 'YES' && flags.includes('SAN_PRIVATE_BETA')
  const stubs = wantsMockedNeeds ? ArnsNeedsStubBuilder.build(values.crn, values) : []

  if (stubs.length === 0) {
    await removeTrainingStubs(client, values.crn)

    return
  }

  await client.importStubs(stubs)
}
