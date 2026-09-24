import { Forge } from '@ministryofjustice/hmpps-forge/core'
import { createForgePackage, journey, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import type { Audit } from './dependencies/audit/Audit.type'
import { AapPackageManifest } from './AapPackageManifest'
import type { JourneyServices } from './JourneyServices.type'

interface TestDeps {
  audit: Audit
}

describe('AapPackageManifest', () => {
  let forge: jest.Mocked<Forge>
  let audit: Audit
  let services: JourneyServices

  const forgePackage = createForgePackage<TestDeps>({
    journey: journey({
      code: 'test-journey',
      title: 'Test journey',
      path: '/test-journey',
      steps: [step({ path: '/start', title: 'Start', blocks: [] })],
    }),
  })

  beforeEach(() => {
    forge = { registerPackage: jest.fn() } as unknown as jest.Mocked<Forge>
    forge.registerPackage.mockReturnValue(forge)
    audit = { send: jest.fn() }
    services = {
      arnsApi: {
        getCriminogenicNeeds: jest.fn(),
        getCriminogenicNeedsDetails: jest.fn(),
      },
      assessmentPlatformApi: {
        executeCommand: jest.fn(),
        executeCommands: jest.fn(),
        executeQuery: jest.fn(),
        getDataDeletionData: jest.fn(),
        postDataDeletionRequest: jest.fn(),
      },
      assessmentPlatformApiFactory: { create: jest.fn() },
      audit,
      coordinatorApi: {
        createOasysAssociation: jest.fn(),
        getEntityAssessment: jest.fn(),
        getVersionsByEntityId: jest.fn(),
        mergeOasysAssociation: jest.fn(),
      },
      deliusApi: { getCaseDetails: jest.fn() },
      domainEvents: { publish: jest.fn() },
      featureFlags: { evaluateBooleanFlags: jest.fn() },
      handoverApi: {
        createHandoverLink: jest.fn(),
        getCurrentContext: jest.fn(),
      },
      logger: {
        debug: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
      },
      mpopComponents: {
        getSupervisionPackageFrontendContext: jest.fn(),
        getTierDetails: jest.fn(),
      },
      preferences: {
        get: jest.fn(),
        update: jest.fn(),
      },
    }
  })

  describe('getJourneyCode()', () => {
    it('should return the root journey code', () => {
      // Arrange
      const manifest = AapPackageManifest.create({
        forge: { package: forgePackage, dependencies: () => ({ audit }) },
      })

      // Act
      const result = manifest.getJourneyCode()

      // Assert
      expect(result).toBe('test-journey')
    })
  })

  describe('getResources()', () => {
    it('should return the package resources without evaluating its dependencies', () => {
      // Arrange
      const dependencies = jest.fn(() => ({ audit }))
      const resources = {
        templates: ['**/*.njk'],
        assets: {
          entryPoints: ['assets/form.js', 'assets/form.scss'],
          staticFiles: ['assets/images/**/*'],
        },
      }
      const manifest = AapPackageManifest.create({
        resources,
        forge: { package: forgePackage, dependencies },
      })

      // Act
      const result = manifest.getResources()

      // Assert
      expect(result).toBe(resources)
      expect(dependencies).not.toHaveBeenCalled()
    })
  })

  describe('registerWith()', () => {
    it('should register the package with the dependencies created from the services', () => {
      // Arrange
      const manifest = AapPackageManifest.create({
        forge: {
          package: forgePackage,
          dependencies: journeyServices => ({ audit: journeyServices.audit }),
        },
      })

      // Act
      manifest.registerWith(forge, services)

      // Assert
      expect(forge.registerPackage).toHaveBeenCalledWith(forgePackage, { audit })
    })

    it('should return the forge so registrations chain', () => {
      // Arrange
      const manifest = AapPackageManifest.create({
        forge: {
          package: forgePackage,
          dependencies: journeyServices => ({ audit: journeyServices.audit }),
        },
      })

      // Act
      const result = manifest.registerWith(forge, services)

      // Assert
      expect(result).toBe(forge)
    })
  })

  describe('getAuthBypassPaths()', () => {
    it('should return an empty list when the definition declares none', () => {
      // Arrange
      const manifest = AapPackageManifest.create({
        forge: { package: forgePackage, dependencies: () => ({ audit }) },
      })

      // Act
      const paths = manifest.getAuthBypassPaths()

      // Assert
      expect(paths).toEqual([])
    })

    it('should return the declared paths when the definition declares them', () => {
      // Arrange
      const manifest = AapPackageManifest.create({
        forge: { package: forgePackage, dependencies: () => ({ audit }) },
        authentication: { bypassPaths: ['/test-journey/public'] },
      })

      // Act
      const paths = manifest.getAuthBypassPaths()

      // Assert
      expect(paths).toEqual(['/test-journey/public'])
    })
  })
})
