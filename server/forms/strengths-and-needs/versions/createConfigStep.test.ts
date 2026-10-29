import { createForgePackage, JourneyDefinition, journey, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { ForgeTestHarness } from '@ministryofjustice/hmpps-forge/core/testing'
import { createConfigStep } from './createConfigStep'
import { strengthsAndNeedsV1Journey } from './v1.0'
import { formVersion } from './v1.0/constants/formVersion'
import { formConfigsByVersion } from '../constants/formConfigRegistry'
import { FormConfig } from '../constants/formConfig'
import { sanTransformers } from '../transformers'
import { sendFormAuditEvent } from '../../shared/audit/sendFormAuditEvent'
import AuditService from '../../../services/auditService'

const v1Config = formConfigsByVersion[formVersion]
const configuredStep = strengthsAndNeedsV1Journey.steps.find(candidate => candidate.path === '/config')
const ordinaryStep = step({
  path: '/ordinary',
  title: 'Ordinary step',
  reachability: { entryWhen: true },
})

// Isolate static-data inheritance from API loading, access hooks and page templates.
const createClient = (diagnosticStep = configuredStep) =>
  new ForgeTestHarness()
    .registerGlobalFunctions(sanTransformers)
    .registerPackage(
      createForgePackage({
        journey: journey({
          ...strengthsAndNeedsV1Journey,
          path: '/config-test',
          title: 'Config test',
          view: {},
          onAccess: [],
          children: [],
          steps: [ordinaryStep, diagnosticStep],
        }),
      }),
    )
    .createClient()

const get = async (client: ReturnType<typeof createClient>, path: string) => {
  const result = await client.get(`/config-test/${path}`, { session: {}, headers: { 'accept-language': 'en-gb' } })
  if (result.type !== 'render') throw new Error(`Expected render, received ${result.type}`)
  return result
}

describe('diagnostic configuration scope', () => {
  it('keeps formConfig off every journey and every non-diagnostic step', () => {
    const check = (definition: JourneyDefinition) => {
      expect(definition.data ?? {}).not.toHaveProperty('formConfig')
      definition.steps?.forEach(candidate => {
        if (candidate.path === '/config') {
          expect(candidate.data).toEqual({ formConfig: v1Config })
        } else {
          expect(candidate.data ?? {}).not.toHaveProperty('formConfig')
        }
      })
      definition.children?.forEach(check)
    }

    check(strengthsAndNeedsV1Journey)
    expect(strengthsAndNeedsV1Journey.data).toEqual({ formVersion })
    expect(configuredStep).toBeDefined()
  })

  it('excludes formConfig from ordinary request data while preserving audit formVersion', async () => {
    const result = await get(createClient(), 'ordinary')

    expect(result.context.data).not.toHaveProperty('formConfig')
    expect(result.context.data.formVersion).toBe(formVersion)

    const auditService = new AuditService('test')
    const send = jest.spyOn(auditService, 'send').mockResolvedValue(undefined)
    await sendFormAuditEvent(
      auditService,
      {
        getData: key => result.context.data[key],
        getState: () => undefined,
        getSession: () => ({}),
      },
      'strengths-and-needs',
      'TEST',
    )
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ details: expect.objectContaining({ formVersion }) }))
  })

  it('renders the complete current-version configuration only on /config', async () => {
    const client = createClient()
    const result = await get(client, 'config')

    expect(result.context.data.formConfig).toEqual(v1Config)
    expect(result.context.data.formVersion).toBe(formVersion)
    expect(result.context.blocks[0].properties.content).toBe(JSON.stringify(v1Config, null, 2))
    expect((await get(client, 'ordinary')).context.data).not.toHaveProperty('formConfig')
  })

  it('uses the configuration supplied by each version rather than a global latest version', async () => {
    const otherConfig: FormConfig = { version: 'test-version', fields: {} }
    const result = await get(createClient(createConfigStep(otherConfig)), 'config')

    expect(result.context.data.formConfig).toEqual(otherConfig)
    expect(result.context.blocks[0].properties.content).toBe(JSON.stringify(otherConfig, null, 2))
  })

  it('isolates nested diagnostic data between requests and from the mapping registry', async () => {
    const client = createClient()
    const first = await get(client, 'config')
    const firstConfig = first.context.data.formConfig as FormConfig
    expect(firstConfig).not.toBe(v1Config)
    expect(firstConfig.fields).not.toBe(v1Config.fields)
    firstConfig.fields['request-only'] = { code: 'request-only' }

    const second = await get(client, 'config')
    expect(second.context.data.formConfig).toEqual(v1Config)
    expect(second.context.data.formConfig).not.toBe(firstConfig)
    expect(v1Config.fields).not.toHaveProperty('request-only')
  })
})
