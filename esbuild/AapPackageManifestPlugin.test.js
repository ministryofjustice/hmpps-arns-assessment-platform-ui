const path = require('node:path')
const { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } = require('node:fs')
const { tmpdir } = require('node:os')
const { AAP_PACKAGE_MANIFEST_MODULE, AapPackageManifestPlugin } = require('./AapPackageManifestPlugin')

describe('AapPackageManifestPlugin', () => {
  let formsDirectory
  let nodeModulesDirectory

  beforeEach(() => {
    formsDirectory = mkdtempSync(path.join(tmpdir(), 'aap-package-manifests-'))
    nodeModulesDirectory = mkdtempSync(path.join(tmpdir(), 'aap-package-node-modules-'))
  })

  afterEach(() => {
    rmSync(formsDirectory, { recursive: true, force: true })
    rmSync(nodeModulesDirectory, { recursive: true, force: true })
  })

  describe('create()', () => {
    it('should expose the virtual AAP package manifest module', () => {
      // Arrange
      const plugin = new AapPackageManifestPlugin(formsDirectory, nodeModulesDirectory).create()
      const build = createBuildStub()

      // Act
      plugin.setup(build.api)
      const result = build.resolve({ path: AAP_PACKAGE_MANIFEST_MODULE })

      // Assert
      expect(result).toEqual({ path: AAP_PACKAGE_MANIFEST_MODULE, namespace: 'aap-package-manifests' })
    })

    it('should generate deterministic imports for every AAP package', () => {
      // Arrange
      createPackage(formsDirectory, 'sentence-plan')
      createPackage(formsDirectory, 'access')
      const plugin = new AapPackageManifestPlugin(formsDirectory, nodeModulesDirectory).create()
      const build = createBuildStub()

      // Act
      plugin.setup(build.api)
      const result = build.load()

      // Assert
      expect(result.contents).toBe(
        [
          `import aapPackageManifest0 from ${JSON.stringify(path.join(formsDirectory, 'access/manifest.ts'))}`,
          `import aapPackageManifest1 from ${JSON.stringify(path.join(formsDirectory, 'sentence-plan/manifest.ts'))}`,
          'export const aapPackageManifests = [aapPackageManifest0, aapPackageManifest1]',
        ].join('\n'),
      )
      expect(result.watchDirs).toEqual([formsDirectory])
      expect(result.watchFiles).toEqual([
        path.join(formsDirectory, 'access/manifest.ts'),
        path.join(formsDirectory, 'sentence-plan/manifest.ts'),
      ])
    })

    it('should discover an AAP package mounted through a symbolic link', () => {
      // Arrange
      const externalDirectory = mkdtempSync(path.join(tmpdir(), 'external-aap-package-'))
      createPackage(externalDirectory, 'journey')
      symlinkSync(path.join(externalDirectory, 'journey'), path.join(formsDirectory, 'sentence-plan'))
      const plugin = new AapPackageManifestPlugin(formsDirectory, nodeModulesDirectory).create()
      const build = createBuildStub()

      // Act
      plugin.setup(build.api)
      const result = build.load()

      // Assert
      expect(result.watchFiles).toEqual([path.join(formsDirectory, 'sentence-plan/manifest.ts')])
      rmSync(externalDirectory, { recursive: true, force: true })
    })

    it('should return an empty manifest list when no AAP packages are mounted', () => {
      // Arrange
      const plugin = new AapPackageManifestPlugin(formsDirectory, nodeModulesDirectory).create()
      const build = createBuildStub()

      // Act
      plugin.setup(build.api)
      const result = build.load()

      // Assert
      expect(result.contents).toBe('export const aapPackageManifests = []')
    })

    it('should reject an AAP package directory without a manifest', () => {
      // Arrange
      mkdirSync(path.join(formsDirectory, 'incomplete-package'))
      const plugin = new AapPackageManifestPlugin(formsDirectory, nodeModulesDirectory).create()
      const build = createBuildStub()
      plugin.setup(build.api)

      // Act
      const act = () => build.load()

      // Assert
      expect(act).toThrow(
        `AAP package directory must contain manifest.ts: ${path.join(formsDirectory, 'incomplete-package')}`,
      )
    })

    it('should discover an npm-linked AAP package from its package metadata', () => {
      // Arrange
      const externalDirectory = mkdtempSync(path.join(tmpdir(), 'external-aap-npm-package-'))
      const manifestPath = path.join(realpathSync(externalDirectory), 'journey/manifest.ts')
      const scopeDirectory = path.join(nodeModulesDirectory, '@ministryofjustice')

      mkdirSync(path.dirname(manifestPath), { recursive: true })
      mkdirSync(scopeDirectory)
      writeFileSync(manifestPath, 'export default {}')
      writeFileSync(
        path.join(externalDirectory, 'package.json'),
        JSON.stringify({ name: '@ministryofjustice/test-journey', aap: { manifest: 'journey/manifest.ts' } }),
      )
      symlinkSync(externalDirectory, path.join(scopeDirectory, 'test-journey'))
      const plugin = new AapPackageManifestPlugin(formsDirectory, nodeModulesDirectory).create()
      const build = createBuildStub()

      // Act
      plugin.setup(build.api)
      const result = build.load()

      // Assert
      expect(result.contents).toContain(`import aapPackageManifest0 from ${JSON.stringify(manifestPath)}`)
      expect(result.watchFiles).toEqual([manifestPath])
      rmSync(externalDirectory, { recursive: true, force: true })
    })
  })

  describe('loadResources()', () => {
    it('should compile manifests in memory and read their declared resources', async () => {
      // Arrange
      const packageDirectory = createPackage(formsDirectory, 'sentence-plan')
      writeFileSync(
        path.join(packageDirectory, 'manifest.ts'),
        [
          "const resources = { templates: ['**/*.njk'], assets: { entryPoints: ['assets/form.scss'] } }",
          "export default { getJourneyCode: () => 'sentence-plan', getResources: () => resources }",
        ].join('\n'),
      )
      const plugin = new AapPackageManifestPlugin(formsDirectory, nodeModulesDirectory)

      // Act
      const result = await plugin.loadResources()

      // Assert
      expect(result).toEqual([
        {
          directory: packageDirectory,
          packageDirectory: process.cwd(),
          name: 'sentence-plan',
          resources: {
            templates: ['**/*.njk'],
            assets: { entryPoints: ['assets/form.scss'] },
          },
        },
      ])
    })
  })
})

function createPackage(parentDirectory, name) {
  const packageDirectory = path.join(parentDirectory, name)

  mkdirSync(packageDirectory)
  writeFileSync(path.join(packageDirectory, 'manifest.ts'), 'export default {}')

  return packageDirectory
}

function createBuildStub() {
  let resolveCallback
  let loadCallback

  return {
    api: {
      onResolve: (_options, callback) => {
        resolveCallback = callback
      },
      onLoad: (_options, callback) => {
        loadCallback = callback
      },
    },
    resolve: args => resolveCallback(args),
    load: () => loadCallback(),
  }
}
