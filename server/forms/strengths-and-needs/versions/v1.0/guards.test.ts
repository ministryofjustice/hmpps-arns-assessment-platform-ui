import { access, EffectRegistry, journey, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { ForgeTestHarness } from '@ministryofjustice/hmpps-forge/core/testing'
import { StrengthsAndNeedsContext, StrengthsAndNeedsSessionDetails } from '../../effects/types'
import { basePath, formRootPath } from './constants/formVersion'
import { routeGuards } from './guards'

const assessmentUuid = 'e8f1a0a4-0000-4000-8000-000000000001'
const otherUuid = 'e8f1a0a4-0000-4000-8000-000000000002'

const get = async (accessMode: string, mode: string, uuid: string) => {
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
        path: `${basePath}/:mode/:uuid`,
        onAccess: [access({ effects: [seed()] }), ...routeGuards()],
        steps: [step({ path: '/page', title: 'Page', blocks: [], reachability: { entryWhen: true } })],
      }),
      forgePackage: true,
    })
    .createClient()

  return client.get(`${basePath}/${mode}/${uuid}/page`, { params: { mode, uuid }, session: {} })
}

describe('routeGuards', () => {
  it.each([
    { accessMode: 'READ_WRITE', mode: 'edit', uuid: assessmentUuid },
    { accessMode: 'READ_WRITE', mode: 'view', uuid: assessmentUuid },
    { accessMode: 'READ_ONLY', mode: 'view', uuid: assessmentUuid },
    // a version UUID: resolveHistoricVersion checks it belongs to the assessment
    { accessMode: 'READ_ONLY', mode: 'view-historic', uuid: otherUuid },
  ])('allows $mode of $uuid with $accessMode access', async ({ accessMode, mode, uuid }) => {
    const result = await get(accessMode, mode, uuid)

    expect(result.type).toBe('render')
  })

  it.each([
    { description: 'edit with READ_ONLY access', accessMode: 'READ_ONLY', mode: 'edit', uuid: assessmentUuid },
    { description: 'edit of another assessment', accessMode: 'READ_WRITE', mode: 'edit', uuid: otherUuid },
    { description: 'view of another assessment', accessMode: 'READ_ONLY', mode: 'view', uuid: otherUuid },
  ])('sends $description to the entry step', async ({ accessMode, mode, uuid }) => {
    const result = await get(accessMode, mode, uuid)

    expect(result).toMatchObject({ type: 'redirect', url: `${formRootPath}/` })
  })
})
