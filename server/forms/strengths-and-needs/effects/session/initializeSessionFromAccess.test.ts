import { createTestEffectContext } from '@ministryofjustice/hmpps-forge/core/testing'
import { initializeSessionFromAccess } from './initializeSessionFromAccess'
import { StrengthsAndNeedsContext } from '../types'

const assessmentId = 'e8f1a0a4-0000-4000-8000-000000000001'
const createdAtMillis = 1792581431748

const contextFor = (session: Record<string, unknown>) => {
  const context = createTestEffectContext({ session }) as unknown as StrengthsAndNeedsContext
  return { context, session: context.getSession() }
}

const oasysSession = (accessMode: string, assessmentVersion?: number) => ({
  accessDetails: { accessType: 'OASYS', accessMode, planAccessMode: accessMode },
  caseDetails: { crn: 'X123456' },
  handoverContext: { assessmentContext: { assessmentId, assessmentVersion } },
})

describe('initializeSessionFromAccess', () => {
  it.each(['READ_WRITE', 'READ_ONLY'])('keeps %s access when no version is requested', accessMode => {
    const { context, session } = contextFor(oasysSession(accessMode))

    initializeSessionFromAccess()(context)

    expect(session.san.sessionDetails.accessMode).toBe(accessMode)
    expect(session.san.sessionDetails.assessmentVersion).toBeUndefined()
  })

  it.each(['READ_WRITE', 'READ_ONLY'])('makes %s access read-only when a version is requested', accessMode => {
    const { context, session } = contextFor(oasysSession(accessMode, createdAtMillis))

    initializeSessionFromAccess()(context)

    expect(session.san.sessionDetails.accessMode).toBe('READ_ONLY')
    expect(session.san.sessionDetails.assessmentVersion).toBe(createdAtMillis)
  })

  it('does not carry a version over from an earlier access', () => {
    const { context, session } = contextFor({
      accessDetails: { accessType: 'HMPPS_AUTH', accessMode: 'READ_WRITE', planAccessMode: 'READ_WRITE' },
      caseDetails: { crn: 'X123456' },
      san: { sessionDetails: { accessMode: 'READ_ONLY', assessmentVersion: createdAtMillis } },
    })

    initializeSessionFromAccess()(context)

    expect(session.san.sessionDetails.accessMode).toBe('READ_WRITE')
    expect(session.san.sessionDetails.assessmentVersion).toBeUndefined()
  })
})
