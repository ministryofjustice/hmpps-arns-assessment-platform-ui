import { access, EffectRegistry, journey, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { ForgeTestHarness } from '@ministryofjustice/hmpps-forge/core/testing'
import { StrengthsAndNeedsContext, StrengthsAndNeedsSessionDetails } from '../../effects/types'
import { basePath, formRootPath } from './constants/formVersion'
import { routeGuards } from './guards'

const assessmentUuid = 'e8f1a0a4-0000-4000-8000-000000000001'
const versionUuid = 'e8f1a0a4-0000-4000-8000-000000000002'
const otherUuid = 'e8f1a0a4-0000-4000-8000-000000000003'

interface Request {
  accessMode: string
  mode: string
  assessment: string
  version: string
}

const get = async ({ accessMode, mode, assessment, version }: Request) => {
  const testEffects = new EffectRegistry()
  const seed = testEffects.register('Seed', () => async (context: StrengthsAndNeedsContext) => {
    context.setData('assessmentUuid', assessmentUuid)
    context.setData('sessionDetails', { accessMode } as unknown as StrengthsAndNeedsSessionDetails)
  })

  const client = new ForgeTestHarness()
    .registerGlobalFunctions([testEffects], {})
    .registerPackage({
      journey: journey({
        code: 'strengths-and-needs-v1',
        title: 'Strengths and needs',
        path: `${basePath}/:mode/:assessmentUuid/:versionUuid`,
        onAccess: [access({ effects: [seed()] }), ...routeGuards()],
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
      description: "view of another assessment's version",
      request: { accessMode: 'READ_ONLY', mode: 'view', assessment: otherUuid, version: versionUuid },
    },
  ])('sends $description to the entry step', async ({ request }) => {
    const result = await get(request)

    expect(result).toMatchObject({ type: 'redirect', url: `${formRootPath}/` })
  })
})
