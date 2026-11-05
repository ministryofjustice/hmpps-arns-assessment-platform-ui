import { createTestEffectContext } from '@ministryofjustice/hmpps-forge/core/testing'
import { commitPendingCommands, queueCommand } from './pendingCommands'
import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { strengthsAndNeedsV1Journey } from '../../versions/v1.0'
import { formConfigsByVersion } from '../../constants/formConfigRegistry'
import { formVersion } from '../../versions/v1.0/constants/formVersion'

const assessmentUuid = 'e8f1a0a4-0000-4000-8000-000000000001'
const user = { id: 'test.user', name: 'Test User', authSource: 'HMPPS_AUTH' as const, token: 'test-token' }

const properties = (key: string) => ({
  type: 'UpdateAssessmentPropertiesCommand' as const,
  assessmentUuid,
  user,
  added: { [key]: { type: 'Single' as const, value: 'YES' } },
  removed: [] as string[],
})

describe('commitPendingCommands', () => {
  const setup = () => {
    const deps = {
      api: { executeCommands: jest.fn().mockResolvedValue([]) },
      auditService: { send: jest.fn() },
    } as unknown as StrengthsAndNeedsEffectsDeps
    const context = createTestEffectContext({
      data: { assessmentUuid, assessment: { formVersion } },
      state: { user, requestId: 'request-id' },
    }) as unknown as StrengthsAndNeedsContext

    return { deps, context }
  }

  it('sends every queued command in one batch, with the OASys hook on the last command only', async () => {
    const { deps, context } = setup()
    queueCommand(context, { command: properties('a'), mapToOasys: true })
    queueCommand(context, { command: properties('b'), mapToOasys: true })

    await commitPendingCommands(deps)(context)

    expect(deps.api.executeCommands).toHaveBeenCalledTimes(1)
    expect(deps.api.executeCommands).toHaveBeenCalledWith(properties('a'), {
      ...properties('b'),
      hooks: [{ type: 'UpdateOasysDataMapping', formConfig: formConfigsByVersion[formVersion] }],
    })
    expect(context.getData('pendingCommands')).toEqual([])
  })

  it('sends queued audit events only after the batch is saved', async () => {
    const { deps, context } = setup()
    const order: string[] = []
    ;(deps.api.executeCommands as jest.Mock).mockImplementation(async () => order.push('save'))
    ;(deps.auditService.send as jest.Mock).mockImplementation(async () => order.push('audit'))
    queueCommand(context, {
      command: properties('a'),
      audit: { action: 'EDIT_ANSWERS', details: { changedFields: ['a'] } },
    })

    await commitPendingCommands(deps)(context)

    expect(order).toEqual(['save', 'audit'])
    expect(deps.auditService.send).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'EDIT_ANSWERS', details: expect.objectContaining({ changedFields: ['a'] }) }),
    )
  })

  it('does not send audit events when the save fails', async () => {
    const { deps, context } = setup()
    ;(deps.api.executeCommands as jest.Mock).mockRejectedValue(new Error('boom'))
    queueCommand(context, { command: properties('a'), audit: { action: 'EDIT_ANSWERS', details: {} } })

    await expect(commitPendingCommands(deps)(context)).rejects.toThrow('boom')
    expect(deps.auditService.send).not.toHaveBeenCalled()
  })

  it('makes no API call when nothing is queued', async () => {
    const { deps, context } = setup()

    await commitPendingCommands(deps)(context)

    expect(deps.api.executeCommands).not.toHaveBeenCalled()
  })
})

/**
 * A queued command that never reaches commitPendingCommands is silently lost,
 * so every effects list in the journey is checked here.
 */
describe('SAN effects lists', () => {
  const queuing = [
    'saveCurrentStepAnswers',
    'saveCurrentAccommodationStepAnswers',
    'clearUnselectedDrugAnswers',
    'setSectionProgress',
    'setUserSubmitted',
  ]
  const callsApiDirectly = [
    'addItemToCollection',
    'updateItemFromCollection',
    'removeItemFromCollection',
    'emptyCollection',
    'setRiskOfSexualHarm',
  ]

  type EffectNode = { type?: string; name?: string }
  type Branch = { effects?: EffectNode[] }

  const effectNames = (branch?: Branch) =>
    (branch?.effects ?? []).filter(effect => effect?.type === 'FunctionType.Effect').map(effect => effect.name)

  /** Commands still queued at the end of the list, given what was already queued going in */
  const check = (names: string[], where: string, queuedOnEntry = false): boolean => {
    let queued = queuedOnEntry
    names.forEach(name => {
      if (queuing.includes(name)) {
        queued = true
      } else if (name === 'commitPendingCommands') {
        queued = false
      } else if (queued && callsApiDirectly.includes(name)) {
        throw new Error(`${where}: ${name} runs before queued commands are committed`)
      }
    })
    return queued
  }

  const lists: string[] = []

  const walk = (node: unknown, path: string) => {
    if (Array.isArray(node)) {
      node.forEach((child, i) => walk(child, `${path}[${i}]`))
      return
    }
    if (!node || typeof node !== 'object') {
      return
    }

    const obj = node as Record<string, unknown> & {
      onAlways?: Branch
      onValid?: Branch
      onInvalid?: Branch
      validate?: boolean
    }

    if (obj.onAlways || obj.onValid || obj.onInvalid) {
      const leftOver = check(effectNames(obj.onAlways), `${path}.onAlways`)
      // onAlways may leave commands for the validation branches only if one of them always runs
      if (leftOver && !(obj.validate && obj.onValid && obj.onInvalid)) {
        throw new Error(`${path}.onAlways: queued commands are never committed`)
      }
      ;(['onValid', 'onInvalid'] as const).forEach(name => {
        if (obj[name] && check(effectNames(obj[name]), `${path}.${name}`, leftOver)) {
          throw new Error(`${path}.${name}: queued commands are never committed`)
        }
      })
      lists.push(path)

      // The branches' effects are checked above, keep walking the rest (e.g. `next`)
      Object.entries(obj).forEach(([key, child]) => {
        if (['onAlways', 'onValid', 'onInvalid'].includes(key) && child && typeof child === 'object') {
          const { effects, ...rest } = child as Branch
          walk(rest, `${path}.${key}`)
        } else {
          walk(child, `${path}.${key}`)
        }
      })
      return
    }

    if (Array.isArray(obj.effects)) {
      if (check(effectNames(obj as Branch), path)) {
        throw new Error(`${path}: queued commands are never committed`)
      }
      lists.push(path)
    }

    Object.entries(obj).forEach(([key, child]) => walk(child, `${path}.${key}`))
  }

  it('commit every queued command', () => {
    walk(strengthsAndNeedsV1Journey, 'strengthsAndNeedsV1Journey')

    expect(lists.length).toBeGreaterThan(50)
  })
})
