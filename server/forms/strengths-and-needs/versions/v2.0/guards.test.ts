import {
  access,
  PredicateExpr,
  EffectRegistry,
  journey,
  redirect,
  step,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { ForgeTestHarness } from '@ministryofjustice/hmpps-forge/core/testing'
import { StrengthsAndNeedsContext, StrengthsAndNeedsSessionDetails } from '../../effects/types'
import { basePath, formRootPath } from './constants/formVersion'
import { isEditMode, isReadOnlyMode, routeGuards, showPreviousVersionsLink, showReturnToOasys } from './guards'

const assessmentUuid = 'e8f1a0a4-0000-4000-8000-000000000001'
const versionUuid = 'e8f1a0a4-0000-4000-8000-000000000002'
const otherUuid = 'e8f1a0a4-0000-4000-8000-000000000003'

interface Request {
  accessMode: string
  mode: string
  assessment: string
  version: string
}

const get = async ({ accessMode, mode, assessment, version }: Request, onAccess = routeGuards()) => {
  const testEffects = new EffectRegistry()
  const seed = testEffects.register('Seed', () => async (context: StrengthsAndNeedsContext) => {
    context.setData('assessmentUuid', assessmentUuid)
    context.setData('sessionDetails', { accessMode, accessType: 'OASYS' } as unknown as StrengthsAndNeedsSessionDetails)
  })

  const client = new ForgeTestHarness()
    .registerGlobalFunctions([testEffects], {})
    .registerPackage({
      journey: journey({
        code: 'strengths-and-needs-v1',
        title: 'Strengths and needs',
        path: `${basePath}/:mode/:assessmentUuid/:versionUuid`,
        onAccess: [access({ effects: [seed()] }), ...onAccess],
        steps: [step({ path: '/page', title: 'Page', blocks: [], reachability: { entryWhen: true } })],
      }),
      forgePackage: true,
    })
    .createClient()

  return client.get(`${basePath}/${mode}/${assessment}/${version}/page`, {
    params: { mode, assessmentUuid: assessment, versionUuid: version },
    session: {},
  })
}

describe('routeGuards', () => {
  it.each([
    { accessMode: 'READ_WRITE', mode: 'edit', assessment: assessmentUuid, version: 'current' },
    { accessMode: 'READ_WRITE', mode: 'view', assessment: assessmentUuid, version: 'current' },
    { accessMode: 'READ_ONLY', mode: 'view', assessment: assessmentUuid, version: 'current' },
    { accessMode: 'READ_WRITE', mode: 'view', assessment: assessmentUuid, version: versionUuid },
    { accessMode: 'READ_ONLY', mode: 'view', assessment: assessmentUuid, version: versionUuid },
    { accessMode: 'READ_WRITE', mode: 'view-historic', assessment: assessmentUuid, version: versionUuid },
    { accessMode: 'READ_ONLY', mode: 'view-historic', assessment: assessmentUuid, version: versionUuid },
  ])('allows $mode/$version with $accessMode access', async request => {
    const result = await get(request)

    expect(result.type).toBe('render')
  })

  it.each([
    {
      description: 'edit with READ_ONLY access',
      request: { accessMode: 'READ_ONLY', mode: 'edit', assessment: assessmentUuid, version: 'current' },
    },
    {
      description: 'edit of a previous version',
      request: { accessMode: 'READ_WRITE', mode: 'edit', assessment: assessmentUuid, version: versionUuid },
    },
    {
      description: 'edit of another assessment',
      request: { accessMode: 'READ_WRITE', mode: 'edit', assessment: otherUuid, version: 'current' },
    },
    {
      description: 'view of another assessment',
      request: { accessMode: 'READ_ONLY', mode: 'view', assessment: otherUuid, version: 'current' },
    },
    {
      description: "view-historic of another assessment's version",
      request: { accessMode: 'READ_ONLY', mode: 'view-historic', assessment: otherUuid, version: versionUuid },
    },
    {
      description: "view of another assessment's version",
      request: { accessMode: 'READ_ONLY', mode: 'view', assessment: otherUuid, version: versionUuid },
    },
  ])('sends $description to the entry step', async ({ request }) => {
    const result = await get(request)

    expect(result).toMatchObject({ type: 'redirect', url: `${formRootPath}/` })
  })
})

describe('mode predicates', () => {
  // Redirects when the predicate holds, so the result says whether it did
  const holds = async (predicate: PredicateExpr, request: Request) => {
    const result = await get(request, [access({ when: predicate, next: [redirect({ goto: '/holds' })] })])

    return result.type === 'redirect'
  }

  it.each([
    { mode: 'edit', version: 'current', editable: true, returnButton: true, previousVersions: true },
    { mode: 'view', version: 'current', editable: false, returnButton: true, previousVersions: true },
    // what OASys asked for
    { mode: 'view', version: versionUuid, editable: false, returnButton: true, previousVersions: false },
    // opened from the previous versions page, in a new window
    { mode: 'view-historic', version: versionUuid, editable: false, returnButton: false, previousVersions: false },
  ])(
    '$mode/$version: editable $editable, Return to OASys $returnButton, previous versions $previousVersions',
    async ({ mode, version, editable, returnButton, previousVersions }) => {
      const request = { accessMode: 'READ_WRITE', mode, assessment: assessmentUuid, version }

      expect(await holds(isEditMode, request)).toBe(editable)
      expect(await holds(isReadOnlyMode, request)).toBe(!editable)
      expect(await holds(showReturnToOasys, request)).toBe(returnButton)
      expect(await holds(showPreviousVersionsLink, request)).toBe(previousVersions)
    },
  )
})
