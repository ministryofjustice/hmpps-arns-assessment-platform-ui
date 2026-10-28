import { createTestEffectContext } from '@ministryofjustice/hmpps-forge/core/testing'
import { clearAccessSession } from './clearAccessSession'
import { AccessContext } from '../types'

describe('clearAccessSession', () => {
  it('clears access details and SAN state cached for the previous access', () => {
    const context = createTestEffectContext({
      session: {
        handoverContext: { handoverSessionId: 'handover-1' },
        caseDetails: { crn: 'X123456' },
        practitionerDetails: { identifier: 'practitioner' },
        accessDetails: { accessType: 'OASYS', accessMode: 'READ_ONLY' },
        assessmentUuid: 'e8f1a0a4-0000-4000-8000-000000000001',
        mode: 'view-historic',
        uuid: 'e8f1a0a4-0000-4000-8000-000000000002',
        previousVersions: [{ uuid: 'previous' }],
        countersignedVersions: [{ uuid: 'countersigned' }],
        unaggregatedVersions: [{ uuid: 'unaggregated' }],
        targetService: 'strengths-and-needs',
        privacyAccepted: true,
      },
    }) as unknown as AccessContext

    clearAccessSession()(context)

    expect(context.getSession()).toEqual({ targetService: 'strengths-and-needs', privacyAccepted: true })
  })
})
