/**
 * CRNs that Wiremock answers for in local, dev and test instead of the real Delius, ARNS, Tier
 * and Supervision Package APIs. Keep in step with the mapping files under
 * helm_deploy/hmpps-arns-assessment-platform-ui/wiremock/mappings and docker/wiremock/mappings.
 */
export interface StubbedCrn {
  crn: string
  description: string
}

export const stubbedCrns: StubbedCrn[] = [
  { crn: 'X444444', description: 'Tier B confirmed. Standard supervision phase, early engagement complete.' },
  { crn: 'X222222', description: 'Tier B confirmed. Standard supervision phase, no appointments booked.' },
  { crn: 'X333333', description: 'Tier B confirmed. In breach, on the OPD pathway.' },
  { crn: 'X666666', description: 'Tier and supervision package both unavailable (server error).' },
  { crn: 'X888888', description: 'Tier B confirmed. No supervision package.' },
  { crn: 'X555555', description: 'Tier C provisional. In-flight case, OASys review not started.' },
  { crn: 'X111111', description: 'Tier B confirmed. In-flight case, OASys review started but not finished.' },
]

export function isStubbedCrn(crn: string | undefined): boolean {
  return stubbedCrns.some(stubbedCrn => stubbedCrn.crn === crn)
}
