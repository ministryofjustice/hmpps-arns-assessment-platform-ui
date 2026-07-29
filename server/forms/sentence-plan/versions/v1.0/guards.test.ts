import { access, EffectRegistry, journey, not, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { ForgeTestHarness } from '@ministryofjustice/hmpps-forge/core/testing'
import { GOTENBERG_RENDER_HEADER, GOTENBERG_RENDER_HEADER_VALUE } from '../../../../data/gotenbergClient'
import { isPdfRenderRequest } from './guards'

describe('guards', () => {
  describe('isPdfRenderRequest', () => {
    const auditView = jest.fn()
    const auditExport = jest.fn()

    /*
     * Copies how the print preview step pairs the guard with its negation, so the test shows
     * that exactly one audit event fires — never none, never both.
     */
    const createClient = () => {
      const registry = new EffectRegistry()
      const effects = {
        auditView: registry.register('AuditView', () => auditView),
        auditExport: registry.register('AuditExport', () => auditExport),
      }

      const testJourney = journey({
        code: 'test',
        title: 'Test',
        path: '/test',
        steps: [
          step({
            path: '/page',
            title: 'Page',
            blocks: [],
            reachability: { entryWhen: true },
            onAccess: [
              access({ when: not(isPdfRenderRequest), effects: [effects.auditView()] }),
              access({ when: isPdfRenderRequest, effects: [effects.auditExport({ exportedAsPdf: true })] }),
            ],
          }),
        ],
      })

      return new ForgeTestHarness().registerPackage({ journey: testJourney, functions: registry }).createClient()
    }

    beforeEach(() => {
      jest.resetAllMocks()
    })

    it('should audit a view when the request has no render header', async () => {
      const client = createClient()

      await client.get('/test/page', { session: {} })

      expect(auditView).toHaveBeenCalled()
      expect(auditExport).not.toHaveBeenCalled()
    })

    it('should audit an export when the request carries the render header', async () => {
      const client = createClient()

      await client.get('/test/page', {
        headers: { [GOTENBERG_RENDER_HEADER]: GOTENBERG_RENDER_HEADER_VALUE },
        session: {},
      })

      expect(auditExport).toHaveBeenCalledWith(expect.anything(), { exportedAsPdf: true })
      expect(auditView).not.toHaveBeenCalled()
    })

    it('should audit a view when the render header holds an unexpected value', async () => {
      const client = createClient()

      await client.get('/test/page', {
        headers: { [GOTENBERG_RENDER_HEADER]: 'unexpected' },
        session: {},
      })

      expect(auditView).toHaveBeenCalled()
      expect(auditExport).not.toHaveBeenCalled()
    })
  })
})
