const path = require('node:path')
const { mkdirSync, mkdtempSync, rmSync, writeFileSync } = require('node:fs')
const { tmpdir } = require('node:os')
const { getBuildConfig } = require('./build.config')

describe('getBuildConfig', () => {
  let packageDirectory

  beforeEach(() => {
    packageDirectory = mkdtempSync(path.join(tmpdir(), 'aap-package-resources-'))
  })

  afterEach(() => {
    rmSync(packageDirectory, { recursive: true, force: true })
  })

  describe('package resources', () => {
    it('should resolve declared resources relative to their package', () => {
      // Arrange
      const staticFile = path.join(packageDirectory, 'assets/images/example.svg')

      mkdirSync(path.dirname(staticFile), { recursive: true })
      writeFileSync(staticFile, '<svg></svg>')
      const aapPackages = [
        {
          directory: packageDirectory,
          packageDirectory,
          name: 'sentence-plan',
          resources: {
            templates: ['**/*.njk'],
            assets: {
              entryPoints: ['assets/form.js', 'assets/form.scss'],
              staticFiles: ['assets/images/**/*'],
            },
          },
        },
      ]

      // Act
      const result = getBuildConfig(aapPackages)

      // Assert
      expect(result.app.copy).toContainEqual({
        from: path.join(packageDirectory, '**/*.njk'),
        to: path.join(process.cwd(), 'dist/server/forms/sentence-plan'),
        watch: false,
      })
      expect(result.formAssets.entryPoints).toEqual([
        {
          in: path.join(packageDirectory, 'assets/form.js'),
          out: path.join('sentence-plan', 'assets/form'),
        },
        {
          in: path.join(packageDirectory, 'assets/form.scss'),
          out: path.join('sentence-plan', 'assets/form'),
        },
      ])
      expect(result.formAssets.loadPaths).toContain(path.join(packageDirectory, 'node_modules'))
      expect(result.assets.copy).toContainEqual({
        from: staticFile,
        to: path.join(process.cwd(), 'dist/assets/forms/sentence-plan/assets/images/example.svg'),
        watch: false,
      })
    })
  })
})
